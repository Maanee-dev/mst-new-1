
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, LogIn } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onClose();
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl p-12"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-10">
          <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em] mb-4 block">Partner Portal</span>
          <h2 className="text-3xl font-serif font-medium text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="sarah@example.com"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-sky-600 dark:hover:bg-sky-100 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Login to Dashboard <LogIn size={16} /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-sky-600 transition-colors">
            Forgot Password?
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
