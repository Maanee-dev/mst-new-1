
import React, { useEffect, useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { supabase, mapOffer } from '../lib/supabase';
import { OFFERS } from '../constants';
import { Link } from 'react-router-dom';
import { Offer } from '../types';
import SEO from '../components/SEO';
import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import { useBag } from '../context/BagContext';

/**
 * Offers Page: Displays curated Maldivian luxury deals and seasonal privileges.
 */
const Offers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNights, setSelectedNights] = useState<number | 'All'>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { addItem, isInBag } = useBag();
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const { data: offersData } = await supabase
          .from('offers')
          .select('*, resorts(slug)')
          .order('created_at', { ascending: false });

        if (offersData && offersData.length > 0) {
          const mapped = offersData.map(o => mapOffer(o));
          setOffers(mapped);
        } else {
          setOffers(OFFERS);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setOffers(OFFERS);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const categories = ['All', 'Honeymoon', 'Early Bird', 'Last Minute'];
  const nightOptions = ['All', 3, 5, 7, 10, 14];

  const filteredOffers = useMemo(() => {
    let list = offers;

    if (searchQuery.trim()) {
      const fuse = new Fuse(list, {
        keys: ['title', 'resortName', 'category', 'roomCategory'],
        threshold: 0.35,
      });
      list = fuse.search(searchQuery).map(r => r.item);
    }

    return list.filter(offer => {
      const matchesNights = selectedNights === 'All' || offer.nights === selectedNights;
      const matchesCategory = activeCategory === 'All' || offer.category === activeCategory;
      return matchesNights && matchesCategory;
    });
  }, [offers, searchQuery, selectedNights, activeCategory]);

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOffers.slice(start, start + itemsPerPage);
  }, [filteredOffers, currentPage]);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const StarRating = ({ count }: { count: number }) => (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg 
          key={i} 
          className={`w-4 h-4 ${i < count ? 'text-amber-400 fill-current' : 'text-slate-200 dark:text-slate-800 fill-current'}`} 
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
    </div>
  );

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen selection:bg-sky-100 selection:text-sky-900 pb-32 transition-colors duration-700">
       <SEO 
         title="Exclusive Maldives Holiday Offers & Packages | Luxury Deals" 
         description="Access our curated archives of the most exclusive holiday deals in the Maldives. From early bird discounts to luxury honeymoon packages, explore bespoke privileges at world-class resorts."
         keywords={[
           'Maldives resort offers', 'Maldives honeymoon packages', 'early bird Maldives deals', 
           'last minute Maldives holiday', 'luxury Maldives discounts', 'Maldives all inclusive offers', 
           'bespoke travel deals Maldives', 'overwater villa packages', 'Maldives vacation deals',
           'luxury travel offers', 'Maldives holiday packages 2026', 'best Maldives deals'
         ]}
         image="https://images.unsplash.com/photo-1510011564758-29df30730163?auto=format&fit=crop&q=80&w=1200"
         schema={{
           "@context": "https://schema.org",
           "@type": "ItemList",
           "name": "Luxury Maldives Offers",
           "itemListElement": offers.slice(0, 10).map((o, i) => ({
             "@type": "ListItem",
             "position": i + 1,
             "name": o.title,
             "description": o.discount
           }))
         }}
       />

       {/* Cinematic Hero Section */}
       <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://maldives-serenitytravels.com/images/Screenshot 2026-02-23 at 00.29.58.png" 
            className="w-full h-full object-cover" 
            alt="Maldives Cocktail"
          />
          <div className="absolute inset-0 bg-slate-950/40" />
        </div>
        <div className="relative z-10 text-center px-6 reveal active">
          <span className="text-[10px] font-black text-sky-400 uppercase tracking-[1em] mb-8 block">Exclusive Archives</span>
          <h1 className="text-6xl md:text-4xl lg:text-7xl xl:text-8xl font-serif font-bold text-white tracking-tighter leading-none">
             <br /> Offers.
          </h1>
          <div className="h-px w-24 bg-amber-400 mx-auto mt-12 mb-12"></div>
          <p className="text-white text-[10px] md:text-[13px] font-bold uppercase tracking-[0.5em] max-w-2xl mx-auto leading-loose opacity-90">
          </p>
        </div>
      </section>

       {/* Intelligence Filter Bar */}
       <section className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-24 mb-20 sticky top-24 z-50">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-[3rem] p-4 md:p-6 shadow-2xl flex flex-col lg:flex-row gap-6 items-center">
            
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <input 
                type="text" 
                placeholder="SEARCH RESORT OR OFFER..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-full px-8 py-4 text-[16px] md:text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-300 dark:text-white"
              />
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-4 px-4 border-l border-slate-100 dark:border-white/5 hidden lg:flex">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">How many days?</span>
              <div className="flex gap-2">
                {nightOptions.map(n => (
                  <button 
                    key={n}
                    onClick={() => { setSelectedNights(n as any); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${selectedNights === n ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    {n === 'All' ? 'Any' : `${n} Days`}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4 px-4 border-l border-slate-100 dark:border-white/5 hidden lg:flex">
               {categories.map(cat => (
                 <button 
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  className={`text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'text-sky-500 dark:text-sky-400' : 'text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          </div>
       </section>

       {/* Offers Grid */}
       <section className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="py-64 text-center">
               <div className="w-10 h-10 border-2 border-slate-100 dark:border-white/5 border-t-sky-500 rounded-full animate-spin mx-auto mb-8"></div>
               <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Accessing records...</p>
            </div>
          ) : paginatedOffers.length > 0 ? (
            <>
               {/* Offers Grid with Varied Widths */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                 {paginatedOffers.map((offer, idx) => {
                   // Varied width logic: 
                   // idx 0 is large (2 cols on lg)
                   // idx 4 is large (2 cols on lg)
                   const isLarge = idx === 0 || idx === 4;
                   
                   return (
                     <div 
                       key={offer.id} 
                       className={`group flex flex-col h-full reveal active ${isLarge ? 'lg:col-span-2' : ''}`}
                       style={{ transitionDelay: `${(idx % itemsPerPage) * 100}ms` }}
                     >
                       
                       {/* Image Container */}
                       <div className={`relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-1000 bg-slate-100 dark:bg-slate-900 ${isLarge ? 'aspect-[16/9]' : 'aspect-[3.5/4]'}`}>
                          <img 
                            src={offer.image} 
                            alt={offer.title} 
                            className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105" 
                          />
                          
                          {/* Floating Badge */}
                          <div className="absolute top-6 left-6">
                             <div className="bg-amber-400 text-slate-950 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                <span className="text-[10px] font-black uppercase tracking-widest">{offer.nights} NIGHTS</span>
                             </div>
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-6 right-6">
                             <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-1.5 rounded-full text-[8px] font-bold text-slate-900 dark:text-white uppercase tracking-widest shadow-sm transition-colors border dark:border-white/5">
                                {offer.category}
                             </div>
                          </div>
                       </div>

                       {/* Content Architecture */}
                       <div className={`px-2 flex flex-col h-full ${isLarge ? 'max-w-3xl' : ''}`}>
                          <StarRating count={offer.rating} />
                          
                          <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-4 leading-relaxed transition-colors">
                             {offer.resortName} • {offer.roomCategory}
                          </p>
                          
                          <h3 className={`${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'} font-serif font-bold text-slate-950 dark:text-white mb-6 leading-[1.2] group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors`}>
                             {offer.title}
                          </h3>
                          
                          <div className="mt-auto pt-6 flex flex-col gap-1">
                             <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-950 dark:text-white">US$ {offer.price.toLocaleString()}</span>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">/ {offer.priceSubtext}</span>
                             </div>
                             
                             <div className="flex items-center gap-6 mt-6">
                               <Link 
                                 to={`/offers/${offer.id}`} 
                                 className="inline-flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white group/btn transition-all"
                               >
                                  <span className="border-b border-transparent group-hover/btn:border-slate-900 dark:group-hover/btn:border-white pb-1 transition-all">Refine Discovery</span>
                                  <svg className="w-4 h-4 transform group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                               </Link>

                               <button 
                                 onClick={(e) => {
                                   e.preventDefault();
                                   if (!isInBag(offer.id)) {
                                     addItem({
                                       id: offer.id,
                                       type: 'offer',
                                       name: offer.title,
                                       image: offer.image,
                                       slug: offer.resortSlug,
                                       price: offer.price,
                                       details: offer.resortName
                                     });
                                   }
                                 }}
                                 className={`p-3 rounded-full transition-all duration-500 ${isInBag(offer.id) ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-sky-500 hover:text-white'}`}
                               >
                                 {isInBag(offer.id) ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                               </button>
                             </div>
                          </div>
                       </div>
                     </div>
                   );
                 })}
               </div>

              {/* Pagination Architecture */}
              {totalPages > 1 && (
                <div className="mt-32 flex justify-center items-center gap-4">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-950 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all disabled:opacity-20"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-12 h-12 rounded-full text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-950 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all disabled:opacity-20"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-64 text-center">
               <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6 tracking-tighter">No seasonal dispatches match your vision.</h3>
               <button 
                onClick={() => { setSearchQuery(''); setSelectedNights('All'); setActiveCategory('All'); setCurrentPage(1); }}
                className="text-sky-500 dark:text-sky-400 font-black uppercase tracking-widest text-[10px] border-b border-sky-100 dark:border-sky-900 pb-2"
               >
                 Reset Discovery Filters
               </button>
            </div>
          )}
       </section>

    </div>
  );
};

export default Offers;
