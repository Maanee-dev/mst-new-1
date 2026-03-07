
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../lib/supabase';
import { Accommodation, Offer, Experience, BlogPost } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  isAction?: boolean;
  action?: { label: string; path: string; isExternal?: boolean };
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasKey, setHasKey] = useState<boolean>(!!(process.env.NEXT_PUBLIC_GEMINI_API_KEY));
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to Serenity Maldives. I am Sara, your digital concierge. How may I assist your discovery today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [data, setData] = useState<{
    resorts: Accommodation[];
    offers: Offer[];
    experiences: Experience[];
    stories: BlogPost[];
  }>({
    resorts: [],
    offers: [],
    experiences: [],
    stories: []
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const WHATSAPP_NUMBER = "+9607770000"; // Replace with actual number
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello Serenity Maldives, I have an inquiry regarding...`;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (hasKey) return;
      const aiStudio = (window as any).aistudio;
      if (aiStudio) {
        try {
          const selected = await aiStudio.hasSelectedApiKey();
          if (selected) setHasKey(true);
        } catch (e) {
          console.error("Auth check failed:", e);
        }
      }
    };

    const fetchData = async () => {
      const [resortsRes, offersRes, experiencesRes, storiesRes] = await Promise.all([
        supabase.from('resorts').select('*'),
        supabase.from('offers').select('*'),
        supabase.from('experiences').select('*'),
        supabase.from('stories').select('*')
      ]);

      setData({
        resorts: resortsRes.data || [],
        offers: offersRes.data || [],
        experiences: experiencesRes.data || [],
        stories: storiesRes.data || []
      });
    };

    if (isOpen) {
      checkAuthStatus();
      fetchData();
    }
  }, [isOpen, hasKey]);

  const handleSelectKey = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
      try {
        await aiStudio.openSelectKey();
        setHasKey(true);
      } catch (e) {
        console.error("Key selection failed:", e);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      await handleSelectKey();
      return;
    }
    
    const userText = input.trim();
    const userMessage: Message = { role: 'user', text: userText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      // Prepare context from DB
      const context = `
        You are Sara, the poetic digital concierge for Serenity Maldives. 
        You have access to the following real-time data from our archives:
        
        RESORTS: ${data.resorts.map(r => `${r.name} in ${r.atoll} (${r.type})`).join(', ')}
        OFFERS: ${data.offers.map(o => `${o.title} at ${o.resortName}`).join(', ')}
        EXPERIENCES: ${data.experiences.map(e => e.title).join(', ')}
        
        Guidelines:
        - Be poetic, elegant, and helpful.
        - Keep responses concise (under 3 sentences).
        - If the user asks about a specific resort or offer, use the data provided.
        - If you don't have specific info, suggest contacting WhatsApp.
        - Always maintain the persona of a luxury Maldivian guide.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [
          { role: 'user', parts: [{ text: context }] },
          ...messages.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: userText }] }
        ],
        config: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
        }
      });

      const aiText = response.text || "The tides are shifting. Please try again.";
      
      // Use Fuse to find a relevant action button
      let action: Message['action'] = undefined;
      const resortFuse = new Fuse(data.resorts, { keys: ['name'], threshold: 0.4 });
      const resortMatch = resortFuse.search(userText);
      if (resortMatch.length > 0) {
        action = { label: `View ${resortMatch[0].item.name}`, path: `/resorts/${resortMatch[0].item.slug}` };
      } else if (userText.toLowerCase().includes('offer') || userText.toLowerCase().includes('deal')) {
        action = { label: "View Offers", path: "/offers" };
      } else if (userText.toLowerCase().includes('experience') || userText.toLowerCase().includes('activity')) {
        action = { label: "Explore Experiences", path: "/experiences" };
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: aiText,
        isAction: !!action,
        action: action
      }]);

    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "The signal to the atolls is faint. For immediate assistance, please connect with our reservations team via WhatsApp.",
        isAction: true,
        action: { label: "WhatsApp Support", path: WHATSAPP_LINK, isExternal: true }
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Sara Concierge" : "Open Sara Concierge"}
        className="fixed bottom-8 right-8 z-[100] bg-slate-900 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center justify-center border border-white/10"
      >
        <div className="relative">
            {isOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
                <div className="flex items-center gap-3">
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                        Ask Sara
                    </span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
            )}
        </div>
      </button>

      <div className={`fixed bottom-28 right-8 z-[100] w-[350px] md:w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-700 transform ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
        <div className="bg-slate-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-serif italic font-bold">S</div>
            <div>
              <h3 className="font-serif italic text-sm leading-none">Sara</h3>
              <p className="text-[7px] uppercase tracking-widest text-sky-400 font-bold">Digital Concierge</p>
            </div>
          </div>
          <button onClick={() => setMessages([{ role: 'model', text: "How may I assist your discovery today?" }])} className="text-[7px] font-black uppercase text-slate-500 hover:text-white transition-colors">Reset</button>
        </div>

        <div ref={scrollRef} className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[400px] no-scrollbar bg-[#FCFAF7]/50">
          {!hasKey && (!process.env.NEXT_PUBLIC_GEMINI_API_KEY && !process.env.API_KEY) ? (
            <div className="py-12 text-center space-y-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-widest">AI Concierge Locked</h4>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-relaxed px-8">Connect your secure key to unlock Sara's poetic intelligence.</p>
              </div>
              <button 
                onClick={handleSelectKey} 
                className="bg-sky-500 text-white px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-sky-400 transition-all"
              >
                Connect Sara
              </button>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium shadow-sm'}`}>
                {m.text}
              </div>
              {m.role === 'model' && m.isAction && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.action && (
                    m.action.isExternal ? (
                      <a 
                        href={m.action.path} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center gap-2"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                    ) : (
                      <Link 
                        to={m.action.path}
                        className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-900 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all"
                      >
                        {m.action.label}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 px-3 py-2 rounded-full flex gap-1 shadow-sm">
                <div className="w-1 h-1 bg-sky-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-sky-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1 h-1 bg-sky-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>

        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="relative flex items-center">
            <input
              type="text"
              disabled={!hasKey && !process.env.NEXT_PUBLIC_GEMINI_API_KEY && !process.env.API_KEY}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={hasKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY ? "How may I assist you?" : "Connect to begin..."}
              className="w-full bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-sky-500 focus:bg-white transition-all placeholder:text-slate-300 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              aria-label="Send message"
              disabled={isTyping || (!hasKey && !process.env.NEXT_PUBLIC_GEMINI_API_KEY && !process.env.API_KEY)}
              className="absolute right-2 p-3 bg-slate-900 text-white rounded-full hover:bg-sky-500 transition-all disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          <p className="text-[6px] text-center text-slate-300 uppercase tracking-widest mt-4">Serenity Concierge v3.0 (AI Powered)</p>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
