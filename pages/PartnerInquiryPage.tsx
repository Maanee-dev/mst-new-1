
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, Send, MapPin, Calendar, Users } from 'lucide-react';
import SEO from '../components/SEO';

const PartnerInquiryPage: React.FC = () => {
  const { partnerCode } = useParams<{ partnerCode: string }>();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resort: searchParams.get('resort') || '',
    dates: '',
    guests: '2',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call to save inquiry and link it to partnerCode
    console.log(`Saving inquiry for partner: ${partnerCode}`, formData);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] dark:bg-slate-950 flex flex-col items-center justify-center p-6 py-20">
      <SEO 
        title={`Inquiry - Maldives Serenity Travels`} 
        description="Make an inquiry for your dream Maldives vacation."
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5"
      >
        <div className="bg-sky-600 p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1506929199175-6374f608c05a?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Maldives" />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-200 mb-4 block">Personalized Inquiry</span>
            <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-4">Maldives Serenity Travels</h1>
            <p className="text-sky-100 text-sm opacity-80">Partner Referral: <span className="font-bold text-white">{partnerCode}</span></p>
          </div>
        </div>

        <div className="p-8 md:p-16">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-2xl font-serif font-medium text-slate-900 dark:text-white mb-4">Inquiry Received!</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                  Thank you for your interest. One of our luxury travel specialists will contact you shortly to plan your perfect getaway.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-sky-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                >
                  Send another inquiry
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Resort</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. Soneva Jani"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-14 pr-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
                        value={formData.resort}
                        onChange={e => setFormData({...formData, resort: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Travel Dates</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. Dec 2024"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-14 pr-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
                        value={formData.dates}
                        onChange={e => setFormData({...formData, dates: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Number of Guests</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-14 pr-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all appearance-none"
                      value={formData.guests}
                      onChange={e => setFormData({...formData, guests: e.target.value})}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5+">5+ Guests</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Requirements</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your dream vacation..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-sky-600 dark:hover:bg-sky-100 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Send Inquiry <Send size={16} /></>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">© 2026 Maldives Serenity Travels</p>
      </div>
    </div>
  );
};

export default PartnerInquiryPage;
