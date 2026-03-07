import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { OFFERS } from '../constants';
import { supabase, mapOffer } from '../lib/supabase';
import { Offer } from '../types';

const OfferToasts: React.FC = () => {
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [offerList, setOfferList] = useState<Offer[]>(OFFERS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFreshOffers = async () => {
      const { data } = await supabase.from('offers').select('*').limit(10);
      if (data && data.length > 0) {
        setOfferList(data.map(mapOffer));
      }
    };
    fetchFreshOffers();
  }, []);

  const showNextOffer = useCallback(() => {
    setIsVisible(false);
    
    setTimeout(() => {
      const nextIdx = (currentIndex + 1) % offerList.length;
      setCurrentIndex(nextIdx);
      setCurrentOffer(offerList[nextIdx]);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 12000);
    }, 1200);
  }, [currentIndex, offerList]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setCurrentOffer(offerList[0]);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 12000);
    }, 8000);

    const interval = setInterval(showNextOffer, 40000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [showNextOffer, offerList]);

  if (!currentOffer) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] w-full max-w-[98vw] md:max-w-fit px-2 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-full pl-1.5 pr-2 md:pr-6 py-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] flex items-center gap-1.5 md:gap-4 group flex-nowrap">
        
        {/* Compact Visual - Scaled for mobile */}
        <div className="relative w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 shadow-sm border border-white/20">
           <img src={currentOffer.image} alt="" className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-110" />
           <div className="absolute inset-0 bg-sky-500/10"></div>
        </div>

        {/* Content Pill - Strict truncation for mobile */}
        <div className="flex items-center gap-2 md:gap-8 overflow-hidden flex-nowrap">
           <div className="flex flex-col min-w-0">
              <div className="hidden md:flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                 <span className="text-amber-600 dark:text-amber-400 font-black text-[7px] uppercase tracking-[0.3em] whitespace-nowrap">Special Privilege</span>
              </div>
              <h4 className="text-[10px] md:text-[11px] font-serif font-bold text-slate-950 dark:text-white italic leading-tight truncate max-w-[70px] xs:max-w-[100px] sm:max-w-[150px] md:max-w-[200px]">
                {currentOffer.resortName}
              </h4>
           </div>

           <div className="hidden sm:flex h-6 w-px bg-slate-100 dark:bg-white/10"></div>

           <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="text-[9px] md:text-[11px] font-black text-slate-950 dark:text-sky-300 uppercase tracking-tighter leading-none">
                  ${currentOffer.price?.toLocaleString()}
                </span>
                <span className="hidden md:block text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  {currentOffer.discount}
                </span>
              </div>
              
              <Link 
                to={`/stays/${currentOffer.resortSlug}`} 
                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all shadow-sm whitespace-nowrap"
              >
                Discover
              </Link>
           </div>
        </div>

        {/* Close Button - Accessible touch target */}
        <button 
           onClick={() => setIsVisible(false)} 
           className="p-1.5 md:ml-2 text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors flex-shrink-0"
           aria-label="Close offer"
        >
           <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default OfferToasts;