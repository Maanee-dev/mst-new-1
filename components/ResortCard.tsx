import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Accommodation } from '../types';
import { Plus, Check } from 'lucide-react';
import { useBag } from '../context/BagContext';

interface ResortCardProps {
  resort: Accommodation;
  hasOffer?: boolean;
  customLink?: string;
}

const ResortCard: React.FC<ResortCardProps> = ({ resort, hasOffer, customLink }) => {
  const { t } = useTranslation();
  const { addItem, isInBag } = useBag();
  const inBag = isInBag(resort.id);

  const displayImage = resort.images && resort.images.length > 0 
    ? resort.images[0] 
    : 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200';

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inBag) return;
    addItem({
      id: resort.id,
      type: 'resort',
      name: resort.name,
      image: displayImage,
      slug: resort.slug,
      price: resort.priceRange,
      details: resort.atoll
    });
  };

  return (
    <Link to={customLink || `/stays/${resort.slug}`} className="group block mb-12 relative">
      <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-[2.5rem] mb-8 transition-all duration-1000 bg-slate-100 dark:bg-slate-900 group-hover:shadow-2xl group-hover:-translate-y-2">
        <img 
          src={displayImage} 
          alt={resort.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-110"
        />
        
        {/* Floating Metadata */}
        <div className="absolute top-8 left-8 flex flex-col gap-3">
          <span className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-[0.4em] shadow-sm border-[1px] border-slate-50 dark:border-white/5 w-fit">
            {resort.atoll}
          </span>
          {hasOffer && (
            <span className="bg-amber-400 dark:bg-amber-500 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-lg animate-pulse w-fit">
              {t('bespokeOffer')}
            </span>
          )}
        </div>

        {/* Add to Bag Button */}
        <button 
          onClick={handleAddToBag}
          className={`absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${inBag ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 hover:bg-sky-500 hover:text-white'}`}
        >
          {inBag ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
        </button>
        
        {/* Visual Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-all duration-1000"></div>
        
        {/* Quick View Link */}
        <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
           <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-950 dark:text-white shadow-2xl border border-transparent dark:border-white/10">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
           </div>
        </div>
      </div>
      
      <div className="px-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2 mb-4">
          <h3 className="text-2xl font-serif font-bold text-slate-950 dark:text-white group-hover:italic group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-all duration-500 leading-tight">
            {resort.name}
          </h3>
          <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest px-3 py-1 bg-amber-50 dark:bg-amber-950/30 rounded-full">
            {resort.priceRange || '$$$$'}
          </span>
        </div>
        
        <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mb-6 line-clamp-1">
          {(resort.features && resort.features.length > 0) ? resort.features.join(' • ') : t('defaultFeatures')}
        </p>
        
        <div className="h-px w-12 bg-slate-200 dark:bg-white/10 group-hover:w-full group-hover:bg-sky-500 transition-all duration-1000"></div>
      </div>
    </Link>
  );
};

export default ResortCard;