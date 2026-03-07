import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, ArrowRight } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-8 left-8 z-[9999] w-full max-w-[420px] p-2"
        >
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 flex-shrink-0">
                  <Cookie className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-serif font-bold text-slate-950 dark:text-white tracking-tight mb-2">Cookie Preferences</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                    We use cookies to enhance your Maldivian journey, personalizing your experience and analyzing our traffic.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-4 rounded-full text-[9px] uppercase tracking-[0.3em] hover:bg-sky-600 dark:hover:bg-sky-400 transition-all duration-500 shadow-lg"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-black py-4 rounded-full text-[9px] uppercase tracking-[0.3em] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-500"
                  >
                    Reject
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-4 pt-2">
                  <Link 
                    to="/privacy" 
                    className="text-[9px] font-black text-slate-400 hover:text-sky-600 uppercase tracking-[0.3em] transition-colors flex items-center gap-2 group"
                  >
                    Read Terms <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-6 right-6 text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
