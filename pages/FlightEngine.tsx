import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Calendar, MapPin, Search, Loader2, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

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
  const [adults] = useState(1);
  
  const [originSuggestions, setOriginSuggestions] = useState<Location[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<Location[]>([]);
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocations = async (keyword: string, type: 'origin' | 'dest') => {
    if (keyword.length < 2) return;
    try {
      const res = await fetch(`/api/flights/locations?keyword=${keyword}`);
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
        adults: adults.toString()
      });
      if (returnDate) params.append('returnDate', returnDate);

      const res = await fetch(`/api/flights/search?${params.toString()}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch flights');
      }
      
      if (!data.data || data.data.length === 0) {
        throw new Error('No flights found for this route and date.');
      }
      
      setFlights(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Origin */}
            <div className="relative">
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
            <div className="relative">
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

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Return (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
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
                          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-100 dark:border-white/10">
                            <Plane className="text-sky-500" size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrier</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white">{flight.validatingAirlineCodes[0]}</p>
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
                  <div className="w-full lg:w-auto lg:pl-12 lg:border-l border-slate-100 dark:border-white/5 flex flex-row lg:flex-col justify-between items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Price</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-serif font-bold text-slate-950 dark:text-white">{flight.price.total}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{flight.price.currency}</span>
                      </div>
                    </div>
                    <button className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-sky-500 hover:text-white transition-all duration-700 shadow-xl group-hover:scale-105">
                      Select Flight
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

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
