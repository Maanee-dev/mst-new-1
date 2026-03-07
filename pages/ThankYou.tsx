import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Mail, ArrowRight, Home } from 'lucide-react';
import SEO from '../components/SEO';

const ThankYou: React.FC = () => {
  const location = useLocation();
  const itemName = location.state?.resortName || 'your sanctuary';
  const type = location.state?.type || 'resort';
  const packageName = location.state?.packageName;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen flex items-center justify-center p-6 transition-colors duration-700">
      <SEO title="Thank You | Maldives Serenity Travels" description="Your inquiry has been received." />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 via-amber-400 to-sky-400"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-24 h-24 bg-sky-50 dark:bg-sky-900/30 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-12 shadow-inner"
        >
          <Check size={48} strokeWidth={3} />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-tight mb-8"
        >
          Inquiry Received.
        </motion.h1>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6 mb-16"
        >
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
            Thank you for your interest in <span className="text-slate-900 dark:text-white font-bold">{itemName}</span>. 
            {packageName && (
              <span className="block mt-2 text-sm font-black text-sky-500 uppercase tracking-widest">
                Package: {packageName}
              </span>
            )}
            Your request has been dispatched to our travel specialists.
          </p>
          
          <div className="flex items-center justify-center gap-4 py-6 px-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
            <Mail size={20} className="text-sky-500" />
            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em]">
              You will receive a mail within 24 hours
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            to={type === 'experience' ? '/experiences' : '/stays'} 
            className="group flex items-center gap-3 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:text-sky-500 transition-colors"
          >
            {type === 'experience' ? 'Explore More Journeys' : 'Explore More Sanctuaries'}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          
          <div className="hidden sm:block w-px h-4 bg-slate-200 dark:bg-white/10"></div>
          
          <Link 
            to="/" 
            className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Home size={16} />
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThankYou;
