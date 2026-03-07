import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Sparkles, ArrowRight } from 'lucide-react';

const OfferNewsletterPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('hasSeenOfferPopup');
      if (!hasSeenPopup) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenOfferPopup', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setIsSubscribed(true);
    
    // Auto close after 3 seconds on success
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-auto"
            onClick={handleClose}
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[90%] md:max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl pointer-events-auto flex flex-col md:flex-row max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Image Side */}
            <div className="md:w-1/2 relative aspect-video md:aspect-auto">
              <img 
                src="https://so-hotels.com/wp-content/uploads/sites/19/2025/01/so_maldives_room_overview_page_header_1.jpg" 
                alt="Maldives Paradise" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-amber-400 w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">Insider Access</span>
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight">Unlock Private Seasonal Rates.</h3>
              </div>
            </div>

            {/* Content Side */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
              >
                <X size={18} />
              </button>

              {!isSubscribed ? (
                <>
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em] mb-4">The Archives</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                      Join our inner circle to receive curated luxury dispatches, secret seasonal offers, and bespoke travel inspiration directly to your inbox.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        type="email" 
                        placeholder="YOUR EMAIL ADDRESS"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-300 dark:text-white"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-sky-500 hover:text-white transition-all shadow-xl disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Subscribe Now'}
                      {!loading && <ArrowRight size={14} />}
                    </button>
                  </form>
                  <p className="mt-6 text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    Privacy prioritized. Unsubscribe at any time.
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={32} />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">Welcome to the Inner Circle.</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                    Your first dispatch is on its way. Prepare for a more refined journey.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OfferNewsletterPopup;
