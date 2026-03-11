
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Check, X, Loader2 } from 'lucide-react';

const BookingIntegration: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [appliedCode, setAppliedCode] = useState('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setStatus('loading');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (code.toUpperCase() === 'SARAH-J-2024' || code.toUpperCase() === 'WELCOME50') {
      setStatus('success');
      setAppliedCode(code.toUpperCase());
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Tag size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Referral Code</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Have a partner code?</p>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              {status === 'success' ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-500" />
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Code Applied: {appliedCode}</p>
                      <p className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-widest">Partner will receive $50 reward</p>
                    </div>
                  </div>
                  <button onClick={() => setStatus('idle')} className="text-emerald-500 hover:text-emerald-600"><X size={14} /></button>
                </motion.div>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Enter code" 
                      value={code}
                      onChange={e => {
                        setCode(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      className={`w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest outline-none transition-all ${status === 'error' ? 'border-rose-500/50' : 'border-transparent focus:border-sky-500/50'}`}
                    />
                    {status === 'error' && (
                      <p className="absolute -bottom-5 left-0 text-[8px] font-bold text-rose-500 uppercase tracking-widest">Invalid or expired code</p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={status === 'loading' || !code}
                    className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 dark:hover:bg-sky-100 transition-all disabled:opacity-50"
                  >
                    {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingIntegration;
