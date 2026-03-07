
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { supabase, mapResort, mapOffer } from '../lib/supabase';
import { RESORTS, OFFERS } from '../constants';
import { AccommodationType, TransferType, Accommodation, Offer } from '../types';
import ResortCard from '../components/ResortCard';
import SEO from '../components/SEO';

const Stays: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [resorts, setResorts] = useState<Accommodation[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState(initialQuery);
  
  const [stayType, setStayType] = useState<AccommodationType>(AccommodationType.RESORT);
  const [selectedAtoll, setSelectedAtoll] = useState<string>('All');
  const [selectedTransfer, setSelectedTransfer] = useState<string>('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: resortsData, error: resortError } = await supabase.from('resorts').select('*').order('name', { ascending: true });
        const { data: offersData } = await supabase.from('offers').select('*');

        if (resortError) throw resortError;

        let finalResorts: Accommodation[] = [];
        if (resortsData && resortsData.length > 0) {
          finalResorts = resortsData.map(mapResort);
        }

        const dbSlugs = new Set(finalResorts.map(r => r.slug));
        const localFallbacks = RESORTS.filter(r => !dbSlugs.has(r.slug));
        setResorts([...finalResorts, ...localFallbacks]);
        
        if (offersData && offersData.length > 0) {
          setOffers(offersData.map(mapOffer));
        } else {
          setOffers(OFFERS);
        }

      } catch (err) {
        console.error("Fetch Error:", err);
        setResorts(RESORTS);
        setOffers(OFFERS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const atolls = useMemo(() => {
    const set = new Set(resorts.filter(r => r.type === stayType).map(r => r.atoll));
    return ['All', ...Array.from(set)].sort();
  }, [stayType, resorts]);

  const filteredStays = useMemo(() => {
    let list = resorts.filter(stay => stay.type === stayType);

    if (filterQuery.trim()) {
      const fuse = new Fuse(list, {
        keys: ['name', 'atoll', 'description'],
        threshold: 0.35,
      });
      list = fuse.search(filterQuery).map(r => r.item);
    }

    return list.filter(stay => {
      const matchesAtoll = selectedAtoll === 'All' || stay.atoll === selectedAtoll;
      const matchesTransfer = selectedTransfer === 'All' || (stay.transfers && stay.transfers.includes(selectedTransfer as TransferType));
      
      return matchesAtoll && matchesTransfer;
    });
  }, [stayType, filterQuery, selectedAtoll, selectedTransfer, resorts]);

  const totalPages = Math.ceil(filteredStays.length / itemsPerPage);
  
  const currentStays = useMemo(() => {
    const end = currentPage * itemsPerPage;
    return filteredStays.slice(0, end);
  }, [filteredStays, currentPage]);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [currentStays, loading]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden transition-colors duration-700">
      <SEO 
        title="Luxury Maldives Resorts & Overwater Villas Portfolio" 
        description="Discover our curated portfolio of the finest luxury resorts and overwater villas in the Maldives. From private island sanctuaries to local island guest houses and liveaboards."
        keywords={[
          'Maldives luxury resorts', 'overwater villas Maldives', 'best resorts in Maldives', 
          'Baa Atoll resorts', 'North Male Atoll luxury', 'seaplane transfers Maldives', 
          'Maldives guest houses', 'Maldives liveaboards', 'Maldives accommodation',
          'luxury island stays', 'Maldives resort portfolio', 'Southern atolls resorts'
        ]}
        image="https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200"
      />

      {/* Cinematic Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://maldives-serenitytravels.com/images/Screenshot 2026-02-23 at 00.23.29.png" 
            className="w-full h-full object-cover" 
            alt="Maldives Horizon"
          />
          <div className="absolute inset-0 bg-slate-950/40" />
        </div>
        <div className="relative z-10 text-center px-6 reveal active">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[1em] font-black mb-8 block text-sky-400">The Portfolio</span>
          <h1 className="text-5xl md:text-4xl lg:text-7xl xl:text-8xl font-serif font-bold text-white tracking-tighter leading-none">
            {stayType === AccommodationType.RESORT ? 'Iconic Stays.' : stayType === AccommodationType.GUEST_HOUSE ? 'Island Life.' : 'Atoll Voyagers.'}
          </h1>
          <div className="h-px w-24 bg-amber-400 mx-auto mt-12 mb-12"></div>
          <p className="text-white text-[10px] md:text-[13px] font-bold uppercase tracking-[0.5em] max-w-2xl mx-auto leading-loose opacity-90">
          </p>
        </div>
      </section>
      

      {/* Refined Search Architecture */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 -mt-24 relative z-20 mb-16 md:mb-32 reveal active">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 md:p-20 shadow-2xl border border-slate-100 dark:border-white/5 max-w-4xl mx-auto transition-colors duration-700">
          <div className="relative group">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 dark:text-slate-600 group-focus-within:text-sky-500 transition-colors block mb-6">
              Search Sanctuaries
            </span>
            <div className="relative border-b-[1px] border-slate-200 dark:border-white/10 group-focus-within:border-slate-950 dark:group-focus-within:border-white transition-all duration-500">
              <input 
                type="text"
                value={filterQuery}
                onChange={(e) => { setFilterQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Soneva Jani, Baa Atoll..."
                className="w-full bg-transparent pb-6 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-serif text-slate-950 dark:text-white outline-none placeholder:text-slate-100 dark:placeholder:text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-20 pb-48">
        <div className="flex flex-col gap-12 md:gap-24">
          
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-12 border-b-[1px] border-slate-100 dark:border-white/5 pb-12 md:pb-16 reveal active transition-colors">
            
            {/* Filter Tabs - Horizontal Swipe on Mobile */}
            <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
              <div className="flex gap-1 p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-full w-max mx-auto lg:mx-0 border border-slate-200/50 dark:border-white/5">
                {[
                  { id: AccommodationType.RESORT, label: 'Resorts' },
                  { id: AccommodationType.GUEST_HOUSE, label: 'Guest Houses' },
                  { id: AccommodationType.LIVEABOARD, label: 'Liveaboards' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => { setStayType(tab.id); setCurrentPage(1); }} 
                    className={`px-6 sm:px-10 py-3 sm:py-3.5 rounded-full text-[9px] sm:text-[11px] font-black transition-all duration-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap ${stayType === tab.id ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-950 dark:hover:text-white'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selectors - Grid on Mobile */}
            <div className="grid grid-cols-2 lg:flex lg:flex-row justify-center lg:justify-end gap-6 sm:gap-10 md:gap-16 items-start w-full lg:w-auto">
              <div className="flex flex-col gap-2 md:gap-3 border-r border-slate-100 dark:border-white/5 lg:border-none pr-4 lg:pr-0 transition-colors">
                <span className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Atoll Registry</span>
                <select 
                  value={selectedAtoll} 
                  onChange={(e) => { setSelectedAtoll(e.target.value); setCurrentPage(1); }} 
                  className="bg-transparent text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-950 dark:text-white outline-none cursor-pointer border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all pb-1 min-w-[100px] w-full"
                >
                  {atolls.map(a => <option key={a} value={a} className="bg-white dark:bg-slate-900">{a}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <span className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Arrival Method</span>
                <select 
                  value={selectedTransfer} 
                  onChange={(e) => { setSelectedTransfer(e.target.value); setCurrentPage(1); }} 
                  className="bg-transparent text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-950 dark:text-white outline-none cursor-pointer border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all pb-1 min-w-[120px] w-full"
                >
                  <option value="All" className="bg-white dark:bg-slate-900">All Transfers</option>
                  {Object.values(TransferType).map(t => <option key={t} value={t} className="bg-white dark:bg-slate-900">{t.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Stays Grid */}
          {loading ? (
            <div className="py-48 text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-[1px] border-slate-200 dark:border-white/10 border-t-sky-500 rounded-full animate-spin mb-8"></div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em]">Scanning Atolls...</p>
            </div>
          ) : currentStays.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-x-12 md:gap-y-20 lg:gap-x-16 lg:gap-y-32">
                {currentStays.map((stay) => (
                  <ResortCard key={stay.id} resort={stay} hasOffer={offers.some(o => o.resortId === stay.id)} />
                ))}
              </div>

              {/* Robust Load More Interface */}
              {currentPage < totalPages && (
                <div className="mt-24 md:mt-40 flex flex-col items-center gap-12 reveal active">
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em] transition-colors">
                      Revealed {currentStays.length} of {filteredStays.length} Sanctuaries
                    </span>
                    <div className="w-32 h-[1px] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                      <div 
                        className="h-full bg-sky-500 transition-all duration-1000" 
                        style={{ width: `${(currentStays.length / filteredStays.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleLoadMore}
                    className="group relative px-16 py-7 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-[10px] uppercase tracking-[0.6em] overflow-hidden transition-all hover:bg-sky-500 dark:hover:bg-sky-400 hover:text-white dark:hover:text-white hover:shadow-2xl active:scale-95"
                  >
                    <span className="relative z-10">Load More</span>
                    <div className="absolute inset-0 bg-white/10 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-32 md:py-48 text-center max-w-lg mx-auto px-4">
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-slate-900 dark:text-white">Sanctuary not found.</h3>
              <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] mb-10 leading-loose transition-colors">
                Your parameters didn't reveal a match in our registry. Adjust your coordinates or search terms.
              </p>
              <button 
                onClick={() => { setFilterQuery(''); setSelectedAtoll('All'); setSelectedTransfer('All'); setCurrentPage(1); }}
                className="text-[10px] font-black text-sky-500 dark:text-sky-400 uppercase tracking-[0.6em] border-b border-sky-100 dark:border-sky-900 pb-2 hover:border-sky-500 dark:hover:border-sky-400 transition-all"
              >
                Reset Discovery
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer CTA */}
      <section className="py-24 md:py-32 bg-white dark:bg-slate-950 border-t border-slate-50 dark:border-white/5 text-center transition-colors duration-700">
        <div className="max-w-4xl mx-auto px-6 reveal active">
           <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[1.5em] mb-10 md:mb-12 block">Need Bespoke Advice?</span>
           <h2 className="text-4xl md:text-7xl font-serif font-bold mb-10 md:mb-12 text-slate-950 dark:text-white tracking-tighter">Your Maldivian Perspective.</h2>
           <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] mb-16 md:mb-20 leading-loose max-w-md mx-auto transition-colors">
              Our travel specialists curate itineraries that <br className="hidden md:block"/> transcend the standard holiday.
           </p>
           {/* Fix: Link component now available after fixing imports */}
           <Link to="/plan" className="inline-block bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black px-12 py-6 md:px-16 md:py-7 rounded-full hover:bg-sky-500 dark:hover:bg-sky-400 hover:text-white transition-all duration-700 shadow-2xl uppercase tracking-[0.8em] text-[10px]">
              Initiate Discovery
           </Link>
        </div>
      </section>
    </div>
  );
};

export default Stays;
