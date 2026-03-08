import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Calendar, MapPin, Search, Loader2, AlertCircle, ExternalLink, Plus, Check, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useBag } from '../context/BagContext';

interface FlightOffer {
  id: string;
  itineraries: any[];
  price: {
    total: string;
    currency: string;
  };
  validatingAirlineCodes: string[];
}

interface Location {
  name: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
}

const FlightEngine: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('MLE'); // Default to Male, Maldives
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('round-trip');
  
  const [showCalendar, setShowCalendar] = useState<'departure' | 'return' | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { addItem, isInBag, setStartDate, setEndDate, setAdults: setGlobalAdults, setChildrenCount: setGlobalChildren } = useBag();
  const [originSuggestions, setOriginSuggestions] = useState<Location[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<Location[]>([]);
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [carriers, setCarriers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocations = async (keyword: string, type: 'origin' | 'dest') => {
    if (keyword.length < 2) return;
    try {
      const res = await fetch(`/api/flights/locations?keyword=${keyword}`);
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return;
      }
      const data = await res.json();
      if (type === 'origin') setOriginSuggestions(data);
      else setDestSuggestions(data);
    } catch (err) {
      console.error('Location search error:', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFlights([]);

    try {
      const params = new URLSearchParams({
        origin,
        destination,
        departureDate,
        adults: adults.toString(),
        children: children.toString()
      });
      if (tripType === 'round-trip' && returnDate) params.append('returnDate', returnDate);

      const res = await fetch(`/api/flights/search?${params.toString()}`);
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        throw new Error('The server returned an invalid response (HTML instead of JSON). This usually means the backend server is not running or the API route is not configured correctly on your host.');
      }

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch flights');
      }
      
      if (!data.data || data.data.length === 0) {
        throw new Error('No flights found for this route and date.');
      }
      
      setFlights(data.data);
      if (data.dictionaries?.carriers) {
        setCarriers(data.dictionaries.carriers);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight: FlightOffer) => {
    const outbound = flight.itineraries[0];
    const inbound = flight.itineraries[1];
    
    const originCode = outbound.segments[0].departure.iataCode;
    const destCode = outbound.segments[outbound.segments.length - 1].arrival.iataCode;
    const outDate = outbound.segments[0].departure.at.split('T')[0];
    
    // Construct Skyscanner URL for deep linking
    let url = `https://www.skyscanner.net/transport/flights/${originCode.toLowerCase()}/${destCode.toLowerCase()}/${outDate}`;
    
    if (inbound) {
      const inDate = inbound.segments[0].departure.at.split('T')[0];
      url += `/${inDate}`;
    }
    
    url += `/?adults=${adults}&cabinclass=economy&ref=serenity-travels`;
    
    window.open(url, '_blank');
  };

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const handleDateClick = (date: Date) => {
    const dStr = date.toISOString().split('T')[0];
    if (showCalendar === 'departure') {
      setDepartureDate(dStr);
      setStartDate(date);
      if (returnDate && dStr > returnDate) {
        setReturnDate('');
        setEndDate(undefined);
      }
    } else {
      setReturnDate(dStr);
      setEndDate(date);
    }
    setShowCalendar(null);
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-slate-950 transition-colors duration-700 pt-32 pb-20">
      <SEO 
        title="Bespoke Flight Engine | Serenity Travels" 
        description="Search live flight offers to the Maldives and beyond. Curated air travel for the discerning voyager."
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 reveal active">
          <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-8 block">Air Intelligence</span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-[0.85] mb-12">
            The Flight <br /> Engine.
          </h1>
          <p className="text-slate-400 dark:text-slate-600 text-[11px] font-black uppercase tracking-[0.5em] leading-[2] max-w-lg">
            A sophisticated gateway to global skies. Real-time distribution data for your next sanctuary arrival.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-white/5 mb-20 reveal active delay-300">
          <div className="flex gap-4 mb-8">
            <button 
              type="button"
              onClick={() => setTripType('round-trip')}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tripType === 'round-trip' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Round Trip
            </button>
            <button 
              type="button"
              onClick={() => {
                setTripType('one-way');
                setReturnDate('');
              }}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tripType === 'one-way' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              One Way
            </button>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {/* Origin */}
            <div className="relative lg:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">From</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
                <input
                  type="text"
                  placeholder="City or Airport (e.g. LHR)"
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value.toUpperCase());
                    searchLocations(e.target.value, 'origin');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  required
                />
              </div>
              {originSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  {originSuggestions.map((loc, idx) => (
                    <button
                      key={`${loc.iataCode}-${idx}`}
                      type="button"
                      onClick={() => {
                        setOrigin(loc.iataCode);
                        setOriginSuggestions([]);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{loc.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">{loc.address.cityName}, {loc.address.countryName}</p>
                      </div>
                      <span className="text-sky-500 font-mono font-bold">{loc.iataCode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination */}
            <div className="relative lg:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">To</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
                <input
                  type="text"
                  placeholder="Destination (e.g. MLE)"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value.toUpperCase());
                    searchLocations(e.target.value, 'dest');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  required
                />
              </div>
              {destSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  {destSuggestions.map((loc, idx) => (
                    <button
                      key={`${loc.iataCode}-${idx}`}
                      type="button"
                      onClick={() => {
                        setDestination(loc.iataCode);
                        setDestSuggestions([]);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{loc.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">{loc.address.cityName}, {loc.address.countryName}</p>
                      </div>
                      <span className="text-sky-500 font-mono font-bold">{loc.iataCode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Passengers */}
            <div className="relative lg:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Passengers</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
                <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 uppercase">A:</span>
                    <select 
                      value={adults}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setAdults(val);
                        setGlobalAdults(val);
                      }}
                      className="bg-transparent outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n} className="bg-slate-900">{n}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 uppercase">C:</span>
                    <select 
                      value={children}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setChildren(val);
                        setGlobalChildren(val);
                      }}
                      className="bg-transparent outline-none cursor-pointer"
                    >
                      {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="bg-slate-900">{n}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Departure</label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(showCalendar === 'departure' ? null : 'departure')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white text-left flex items-center justify-between group"
                >
                  <span className={departureDate ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
                    {departureDate || 'SELECT DATE'}
                  </span>
                  <Calendar className="text-sky-500 group-hover:scale-110 transition-transform" size={18} />
                </button>
                
                <AnimatePresence>
                  {showCalendar === 'departure' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-30 top-full left-0 mt-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-[2rem] p-6 shadow-2xl w-[320px]"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronLeft size={16} /></button>
                        <h4 className="text-[9px] font-black uppercase tracking-widest">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                        <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronRight size={16} /></button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['S','M','T','W','T','F','S'].map((d, i) => <div key={`dep-${d}-${i}`} className="text-center text-[8px] font-black text-slate-300">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays(currentMonth).map((day, i) => (
                          <button
                            key={i}
                            type="button"
                            disabled={!day || day < new Date(new Date().setHours(0,0,0,0))}
                            onClick={() => day && handleDateClick(day)}
                            className={`aspect-square flex items-center justify-center rounded-full text-[10px] font-bold transition-all ${!day ? 'invisible' : (day < new Date(new Date().setHours(0,0,0,0)) ? 'text-slate-200 dark:text-slate-800' : (departureDate === day.toISOString().split('T')[0] ? 'bg-sky-500 text-white' : 'hover:bg-sky-50 dark:hover:bg-sky-950/30 text-slate-600 dark:text-slate-400'))}`}
                          >
                            {day?.getDate()}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Return</label>
                <button
                  type="button"
                  disabled={tripType === 'one-way'}
                  onClick={() => setShowCalendar(showCalendar === 'return' ? null : 'return')}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-left flex items-center justify-between group transition-opacity ${tripType === 'one-way' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                >
                  <span className={returnDate ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
                    {returnDate || 'SELECT DATE'}
                  </span>
                  <Calendar className="text-sky-500 group-hover:scale-110 transition-transform" size={18} />
                </button>

                <AnimatePresence>
                  {showCalendar === 'return' && tripType === 'round-trip' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-30 top-full left-0 mt-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-[2rem] p-6 shadow-2xl w-[320px]"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronLeft size={16} /></button>
                        <h4 className="text-[9px] font-black uppercase tracking-widest">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                        <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronRight size={16} /></button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['S','M','T','W','T','F','S'].map((d, i) => <div key={`ret-${d}-${i}`} className="text-center text-[8px] font-black text-slate-300">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays(currentMonth).map((day, i) => (
                          <button
                            key={i}
                            type="button"
                            disabled={!day || day < (departureDate ? new Date(departureDate) : new Date())}
                            onClick={() => day && handleDateClick(day)}
                            className={`aspect-square flex items-center justify-center rounded-full text-[10px] font-bold transition-all ${!day ? 'invisible' : (day < (departureDate ? new Date(departureDate) : new Date()) ? 'text-slate-200 dark:text-slate-800' : (returnDate === day.toISOString().split('T')[0] ? 'bg-sky-500 text-white' : 'hover:bg-sky-50 dark:hover:bg-sky-950/30 text-slate-600 dark:text-slate-400'))}`}
                          >
                            {day?.getDate()}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end lg:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 text-white rounded-2xl py-4 px-8 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                {loading ? 'Searching...' : 'Search Flights'}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-8 rounded-[2rem] flex items-center gap-6 text-red-600 dark:text-red-400">
              <AlertCircle size={24} />
              <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <AnimatePresence>
            {flights.map((flight, idx) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all duration-700 group"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
                  {/* Itinerary */}
                  <div className="flex-grow space-y-12">
                    {flight.itineraries.map((itinerary: any, i: number) => (
                      <div key={i} className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="flex items-center gap-6 min-w-[120px]">
                          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-100 dark:border-white/10 overflow-hidden">
                            <img 
                              src={`https://pics.avs.io/200/200/${flight.validatingAirlineCodes[0]}.png`} 
                              alt={flight.validatingAirlineCodes[0]} 
                              className="w-8 h-8 object-contain"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement?.insertAdjacentHTML('beforeend', '<svg class="text-sky-500 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>');
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrier</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white">
                              {carriers[flight.validatingAirlineCodes[0]] || flight.validatingAirlineCodes[0]}
                            </p>
                            <p className="text-[9px] font-bold text-sky-500 uppercase tracking-widest">
                              {flight.validatingAirlineCodes[0]} {flight.itineraries[0].segments[0].number}
                            </p>
                          </div>
                        </div>

                        <div className="flex-grow flex items-center justify-between gap-8 w-full md:w-auto">
                          <div className="text-center md:text-left">
                            <p className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white">
                              {itinerary.segments[0].departure.at.split('T')[1].slice(0, 5)}
                            </p>
                            <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mt-2">{itinerary.segments[0].departure.iataCode}</p>
                          </div>

                          <div className="flex-grow flex flex-col items-center px-4">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{itinerary.duration.replace('PT', '').toLowerCase()}</p>
                            <div className="w-full h-px bg-slate-100 dark:bg-white/10 relative">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-3">
                                <Plane size={14} className="text-slate-300 dark:text-slate-700" />
                              </div>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">
                              {itinerary.segments.length > 1 ? `${itinerary.segments.length - 1} Stop` : 'Direct'}
                            </p>
                          </div>

                          <div className="text-center md:text-right">
                            <p className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white">
                              {itinerary.segments[itinerary.segments.length - 1].arrival.at.split('T')[1].slice(0, 5)}
                            </p>
                            <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mt-2">{itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price & Action */}
                    <div className="flex flex-row lg:flex-col justify-between items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Price</p>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-serif font-bold text-slate-950 dark:text-white">{flight.price.total}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{flight.price.currency}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 w-full sm:w-auto">
                        <button 
                          onClick={() => handleSelectFlight(flight)}
                          className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.4em] hover:bg-sky-500 hover:text-white transition-all duration-700 shadow-xl group-hover:scale-105 flex items-center justify-center gap-3"
                        >
                          Book Flight
                          <ExternalLink size={12} />
                        </button>
                        <button 
                          onClick={() => {
                            if (!isInBag(flight.id)) {
                              addItem({
                                id: flight.id,
                                type: 'flight',
                                name: `${carriers[flight.validatingAirlineCodes[0]] || flight.validatingAirlineCodes[0]} Flight`,
                                image: `https://pics.avs.io/200/200/${flight.validatingAirlineCodes[0]}.png`,
                                slug: flight.id,
                                price: `${flight.price.total} ${flight.price.currency}`,
                                details: `${flight.itineraries[0].segments[0].departure.iataCode} → ${flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode} (${departureDate}${returnDate ? ' to ' + returnDate : ''}) • ${adults}A ${children}C`,
                                startDate: departureDate,
                                endDate: returnDate || undefined
                              });
                            }
                          }}
                          className={`px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-700 shadow-lg flex items-center justify-center gap-3 ${isInBag(flight.id) ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-sky-500 hover:text-white'}`}
                        >
                          {isInBag(flight.id) ? (
                            <>
                              <Check size={12} /> Added
                            </>
                          ) : (
                            <>
                              <Plus size={12} /> Selection
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {flights.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] max-w-lg mx-auto leading-loose">
                Prices are indicative and subject to availability. Selecting a flight will redirect you to our secure booking partner for final verification and issuance.
              </p>
            </div>
          )}

          {!loading && flights.length === 0 && !error && (
            <div className="text-center py-32 reveal active">
              <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto mb-12 border border-slate-100 dark:border-white/5">
                <Plane className="text-slate-200 dark:text-slate-800" size={40} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6">Awaiting Flight Parameters.</h3>
              <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] max-w-xs mx-auto leading-loose">
                Enter your departure and destination to query the global skies for bespoke air travel offers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightEngine;
