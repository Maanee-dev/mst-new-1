import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, mapResort } from '../lib/supabase';
import { Accommodation, AccommodationType, TransferType } from '../types';
import ResortCard from '../components/ResortCard';
import SEO from '../components/SEO';
import { Search, Filter, X, ChevronRight } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import CalendarSelector from '../components/CalendarSelector';
import GuestSelector from '../components/GuestSelector';

const InquireNow: React.FC = () => {
  const navigate = useNavigate();
  const [resorts, setResorts] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAtoll, setSelectedAtoll] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedTransfer, setSelectedTransfer] = useState<string>('All');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Top bar inputs
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guestCount, setGuestCount] = useState({ adults: 2, children: 0 });

  const datesString = dateRange?.from 
    ? `${format(dateRange.from, 'MMM d')}${dateRange.to ? ` - ${format(dateRange.to, 'MMM d')}` : ''}`
    : '';
  
  const guestsString = `${guestCount.adults} Adults${guestCount.children > 0 ? `, ${guestCount.children} Children` : ''}`;

  useEffect(() => {
    const fetchResorts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('resorts')
          .select('*')
          .order('name', { ascending: true });
        
        if (data) {
          setResorts(data.map(mapResort));
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResorts();
  }, []);

  const atolls = useMemo(() => {
    const set = new Set(resorts.map(r => r.atoll));
    return ['All', ...Array.from(set)].sort();
  }, [resorts]);

  const filteredResorts = useMemo(() => {
    let list = resorts;

    if (searchQuery.trim()) {
      const fuse = new Fuse(list, {
        keys: ['name', 'atoll', 'description'],
        threshold: 0.35,
      });
      list = fuse.search(searchQuery).map(r => r.item);
    }

    return list.filter(r => {
      const matchesAtoll = selectedAtoll === 'All' || r.atoll === selectedAtoll;
      const matchesType = selectedType === 'All' || r.type === selectedType;
      const matchesTransfer = selectedTransfer === 'All' || (r.transfers && r.transfers.includes(selectedTransfer as TransferType));
      return matchesAtoll && matchesType && matchesTransfer;
    });
  }, [resorts, searchQuery, selectedAtoll, selectedType, selectedTransfer]);

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen transition-colors duration-700">
      <SEO 
        title="Inquire Now | Maldives Serenity Travels" 
        description="Search and discover your perfect Maldivian sanctuary. Filter by atoll, transfer type, and accommodation style to find your ideal escape."
      />

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://www.sunsiyam.com/media/ydkj55yq/dji_0948-r.jpg?mode=max&width=778&height=518" 
            className="w-full h-full object-cover opacity-50" 
            alt="Maldives Seascape"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-parchment dark:to-slate-950" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-sky-400 uppercase tracking-[1em] mb-6 block"
          >
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter leading-none"
          >
            Your Journey Starts Here.
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-px w-24 bg-amber-400 mx-auto mt-10"
          ></motion.div>
        </div>
      </section>

      {/* Booking Engine Bar */}
      <div className="max-w-[1440px] mx-auto px-6 -mt-16 md:-mt-24 relative z-30 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 md:p-6 shadow-2xl border border-slate-100 dark:border-white/5"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Resort Search */}
            <div className="flex-1 relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search Resort or Atoll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-16 pr-6 py-5 text-sm focus:ring-2 focus:ring-sky-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            {/* Date Selector */}
            <div className="lg:w-72 relative group">
              <CalendarSelector 
                range={dateRange}
                onChange={setDateRange}
              />
            </div>

            {/* Guest Selector */}
            <div className="lg:w-72 relative group">
              <GuestSelector 
                adults={guestCount.adults}
                children={guestCount.children}
                onChange={(adults, children) => setGuestCount({ adults, children })}
              />
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl py-5 px-6 font-bold text-[10px] uppercase tracking-widest"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 flex flex-col lg:flex-row gap-12 pb-32">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-32 space-y-12">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="space-y-10">
                <div>
                  <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Atoll Registry</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar pr-2">
                    {atolls.map(atoll => (
                      <button 
                        key={atoll}
                        onClick={() => setSelectedAtoll(atoll)}
                        className={`flex items-center justify-between w-full text-left text-[10px] font-bold uppercase tracking-widest transition-all group ${selectedAtoll === atoll ? 'text-sky-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        <span>{atoll}</span>
                        <ChevronRight size={12} className={`transition-transform ${selectedAtoll === atoll ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-50'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Stay Type</h3>
                  <div className="space-y-3">
                    {['All', ...Object.values(AccommodationType)].map(type => (
                      <button 
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex items-center justify-between w-full text-left text-[10px] font-bold uppercase tracking-widest transition-all group ${selectedType === type ? 'text-sky-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        <span>{(type || '').replace('_', ' ')}</span>
                        <ChevronRight size={12} className={`transition-transform ${selectedType === type ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-50'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Transfer Mode</h3>
                  <div className="space-y-3">
                    {['All', ...Object.values(TransferType)].map(transfer => (
                      <button 
                        key={transfer}
                        onClick={() => setSelectedTransfer(transfer)}
                        className={`flex items-center justify-between w-full text-left text-[10px] font-bold uppercase tracking-widest transition-all group ${selectedTransfer === transfer ? 'text-sky-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        <span>{(transfer || '').replace('_', ' ')}</span>
                        <ChevronRight size={12} className={`transition-transform ${selectedTransfer === transfer ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-50'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => { setSelectedAtoll('All'); setSelectedType('All'); setSelectedTransfer('All'); setSearchQuery(''); }}
                  className="w-full py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all"
                >
                  Reset Discovery
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-10 flex justify-between items-center">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em]">
              Showing {filteredResorts.length} Sanctuaries
            </h2>
          </div>

          {loading ? (
            <div className="py-32 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-2 border-slate-100 dark:border-white/5 border-t-sky-500 rounded-full animate-spin mb-8"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning the Atolls...</p>
            </div>
          ) : filteredResorts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {filteredResorts.map(resort => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={resort.id}
                  className="group relative"
                >
                  <ResortCard 
                    resort={resort} 
                    customLink={`/inquire/${resort.slug}?dates=${encodeURIComponent(datesString)}&guests=${encodeURIComponent(guestsString)}`}
                  />
                  <div className="absolute bottom-12 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <Link 
                      to={`/inquire/${resort.slug}?dates=${encodeURIComponent(datesString)}&guests=${encodeURIComponent(guestsString)}`}
                      className="w-full bg-sky-500 text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center shadow-2xl hover:bg-slate-900 transition-all"
                    >
                      Check Availability
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">No Records Found.</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-loose">
                Your inquiry did not reveal any matches in our digital sanctuary. Try adjusting your filters.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md lg:hidden"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] bg-white dark:bg-slate-900 p-10 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Atoll Registry</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {atolls.map(atoll => (
                      <button 
                        key={atoll}
                        onClick={() => { setSelectedAtoll(atoll); setShowMobileFilters(false); }}
                        className={`py-4 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest text-left transition-all ${selectedAtoll === atoll ? 'bg-sky-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
                      >
                        {atoll}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Stay Type</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['All', ...Object.values(AccommodationType)].map(type => (
                      <button 
                        key={type}
                        onClick={() => { setSelectedType(type); setShowMobileFilters(false); }}
                        className={`py-4 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest text-left transition-all ${selectedType === type ? 'bg-sky-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
                      >
                        {(type || '').replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Transfer Mode</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['All', ...Object.values(TransferType)].map(transfer => (
                      <button 
                        key={transfer}
                        onClick={() => { setSelectedTransfer(transfer); setShowMobileFilters(false); }}
                        className={`py-4 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest text-left transition-all ${selectedTransfer === transfer ? 'bg-sky-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
                      >
                        {(transfer || '').replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100 dark:border-white/5">
                <button 
                  onClick={() => { setSelectedAtoll('All'); setSelectedType('All'); setSelectedTransfer('All'); setSearchQuery(''); setShowMobileFilters(false); }}
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                >
                  Reset All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InquireNow;
