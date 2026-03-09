
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from '../lib/supabase';

const getAiStudio = () => (window as any).aistudio;

interface FAQResult {
  resort_id: string;
  resort_name: string;
  status: 'success' | 'failure';
  inserted: number;
  faqs: any[];
  error: string | null;
}

const AdminFAQ: React.FC = () => {
  const [resorts, setResorts] = useState<any[]>([]);
  const [serviceRoleKey, setServiceRoleKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(!!(process.env.API_KEY && process.env.API_KEY !== 'undefined'));
  const [results, setResults] = useState<FAQResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 100));
  };

  useEffect(() => {
    const checkKey = async () => {
      // Prioritize env
      if (process.env.API_KEY && process.env.API_KEY !== 'undefined') {
        setHasApiKey(true);
        return;
      }

      try {
        const aiStudio = getAiStudio();
        if (aiStudio) {
          const selected = await aiStudio.hasSelectedApiKey();
          if (selected) setHasApiKey(true);
        }
      } catch (e) {
        console.error("Key status check error:", e);
      }
    };
    checkKey();

    const fetchResorts = async () => {
      const { data } = await supabase.from('resorts').select('id, name, description, features').order('name');
      if (data) setResorts(data);
    };
    fetchResorts();
  }, [hasApiKey]);

  const handleSelectKey = async () => {
    const aiStudio = getAiStudio();
    if (aiStudio) {
      try {
        await aiStudio.openSelectKey();
        // RULE: Assume success immediately
        setHasApiKey(true);
        addLog("🔑 Key dialog triggered. State unlocked.");
      } catch (e: any) {
        addLog(`❌ Error opening key selector: ${e.message}`);
        setHasApiKey(true); 
      }
    } else if (process.env.API_KEY && process.env.API_KEY !== 'undefined') {
      setHasApiKey(true);
      addLog("✅ Key detected from environment.");
    } else {
      addLog("❌ Authentication context unavailable. Check environment variables.");
      setHasApiKey(true); // Fallback
    }
  };

  const generateFaqsWithGemini = async (resort: any) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined') {
      setHasApiKey(false);
      throw new Error("API Key is missing from the environment.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Generate 6-8 luxury-toned FAQs for the following Maldives resort:
      Name: ${resort.name}
      Description: ${resort.description}
      Features: ${Array.isArray(resort.features) ? resort.features.join(', ') : resort.features}
      
      Return ONLY a JSON array with: question, answer, category (Arrival, Dining, Experience, Wellness, or General), and is_ai_generated (true).
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                category: { type: Type.STRING },
                is_ai_generated: { type: Type.BOOLEAN }
              },
              required: ["question", "answer", "category", "is_ai_generated"]
            }
          }
        }
      });

      return JSON.parse(response.text || '[]').map((f: any) => ({ ...f, resort_id: resort.id }));
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        throw new Error("The API key was rejected. Verify your project settings.");
      }
      throw err;
    }
  };

  const saveToDatabase = async (faqs: any[], adminKey: string) => {
    const adminClient = createClient('https://zocncwchaakjtsvlscmd.supabase.co', adminKey);
    const { data, error } = await adminClient
      .from('resort_faqs')
      .upsert(faqs, { onConflict: 'resort_id,question' }) 
      .select();
    
    if (error) throw error;
    return data || [];
  };

  const runAutomation = async () => {
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
      addLog("❌ API_KEY not detected. Please verify your environment variables.");
      return;
    }

    if (!serviceRoleKey) {
      alert("Supabase Service Role Key required for synthesis write-access.");
      return;
    }

    setIsProcessing(true);
    setResults([]);
    setLogs([]);
    setProgress(0);
    addLog(`🚀 Synthesis started for ${resorts.length} properties...`);

    const tempResults: FAQResult[] = [];

    for (let i = 0; i < resorts.length; i++) {
      const resort = resorts[i];
      const result: FAQResult = { resort_id: resort.id, resort_name: resort.name, status: 'failure', inserted: 0, faqs: [], error: null };

      try {
        addLog(`🧠 Analyzing ${resort.name}...`);
        const generatedFaqs = await generateFaqsWithGemini(resort);
        
        addLog(`💾 Committing rows...`);
        const savedRows = await saveToDatabase(generatedFaqs, serviceRoleKey);
        
        result.faqs = savedRows;
        result.inserted = savedRows.length;
        result.status = 'success';
        addLog(`✅ ${resort.name} complete.`);
      } catch (err: any) {
        result.error = err.message;
        addLog(`❌ Error at ${resort.name}: ${err.message}`);
        if (err.message.includes("rejected") || err.message.includes("missing")) {
          setIsProcessing(false);
          setHasApiKey(false);
          return;
        }
      }

      tempResults.push(result);
      setResults([...tempResults]);
      setProgress(Math.round(((i + 1) / resorts.length) * 100));
      await new Promise(r => setTimeout(r, 600));
    }

    setIsProcessing(false);
    addLog(`🏁 Operation complete.`);
  };

  const downloadResults = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "faq_synthesis_report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 space-y-8">
            <span className="text-[10px] font-black text-sky-400 uppercase tracking-[1em] block">Admin Engine</span>
            <h1 className="text-4xl font-serif italic text-white mb-8">FAQ Hub.</h1>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl space-y-6">
              {!hasApiKey ? (
                <button onClick={handleSelectKey} className="w-full bg-sky-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-400 transition-all">Connect Credentials</button>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 rounded-2xl flex items-center justify-between gap-3 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Secure Link Active</span>
                  </div>
                  {(process.env.API_KEY === 'undefined' || !process.env.API_KEY) && (
                    <button onClick={handleSelectKey} className="text-[7px] font-black uppercase text-slate-500 hover:text-white transition-colors">Switch</button>
                  )}
                </div>
              )}
              <input type="password" value={serviceRoleKey} onChange={(e) => setServiceRoleKey(e.target.value)} placeholder="Supabase Service Role Key" className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-xs font-mono text-sky-300 focus:ring-1 focus:ring-sky-500 outline-none" />
              <button onClick={runAutomation} disabled={isProcessing || !serviceRoleKey || !hasApiKey} className={`w-full py-6 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all ${isProcessing || !serviceRoleKey || !hasApiKey ? 'bg-slate-800 text-slate-600' : 'bg-white text-slate-950 hover:bg-sky-400 hover:text-white'}`}>
                {isProcessing ? 'Synthesizing...' : 'Run Global Sync'}
              </button>
              {results.length > 0 && !isProcessing && (
                <button onClick={downloadResults} className="w-full py-3 border border-white/10 rounded-full font-bold text-[9px] text-slate-500 hover:text-white transition-all uppercase tracking-widest">Download Report</button>
              )}
            </div>
          </div>
          <div className="lg:w-2/3 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl"><span className="text-[9px] font-black uppercase text-slate-500">Progress</span><p className="text-2xl text-white font-serif italic mt-2">{progress}%</p></div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl"><span className="text-[9px] font-black uppercase text-slate-500">Success</span><p className="text-2xl text-emerald-400 font-serif italic mt-2">{results.filter(r => r.status === 'success').length}</p></div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl"><span className="text-[9px] font-black uppercase text-slate-500">Errors</span><p className="text-2xl text-red-500 font-serif italic mt-2">{results.filter(r => r.status === 'failure').length}</p></div>
            </div>
            <div className="bg-black border border-white/5 rounded-[2.5rem] h-72 overflow-y-auto p-8 font-mono text-[10px] space-y-2 no-scrollbar">
              {logs.length === 0 && <p className="text-slate-700 italic">Waiting for execution dispatch...</p>}
              {logs.map((log, i) => <p key={i} className={log.includes('✅') ? 'text-emerald-500' : log.includes('❌') ? 'text-red-500' : 'text-slate-500'}>{log}</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFAQ;
