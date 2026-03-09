
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plane, Hotel, Compass, Check, ArrowRight, Loader2, AlertCircle, Mail, Phone, User, Calendar, Users, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'motion/react';

interface FlightOffer {
  id: string;
  itineraries: any[];
  price: { total: string; currency: string };
  validatingAirlineCodes: string[];
}

interface HotelOffer {
  hotel: { hotelId: string; name: string; latitude: number; longitude: number };
  offers: any[];
}

interface Activity {
  id: string;
  name: string;
  shortDescription: string;
  price: { amount: string; currencyCode: string };
  pictures: string[];
}

const SmartPlanner: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search Criteria
  const [searchCriteria, setSearchCriteria] = useState({
    origin: '',
    originName: '',
    departureDate: '',
    returnDate: '',
    adults: '2'
  });
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

  // Selection States
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  
  const [hotels, setHotels] = useState<HotelOffer[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<HotelOffer | null>(null);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);

  const [contactDetails, setContactDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Search Locations
  useEffect(() => {
    if (searchCriteria.origin.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/flights/locations?keyword=${searchCriteria.origin}`);
        if (!res.ok) {
          console.error(`[Planner] Location fetch failed: ${res.status}`);
          return;
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('[Planner] Non-JSON location response:', text.substring(0, 100));
          return;
        }
        const data = await res.json();
        setLocationSuggestions(data);
      } catch (err) {
        console.error('[Planner] Location search error:', err);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchCriteria.origin]);

  const handleSearch = async () => {
    if (!searchCriteria.origin || !searchCriteria.departureDate) {
      setError('Please provide origin and departure date.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Helper for safe JSON fetching
      const safeFetchJson = async (url: string, errorMessage: string) => {
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          let details = '';
          try {
            const json = JSON.parse(text);
            details = json.details || json.error || '';
          } catch {
            details = text.substring(0, 100);
          }
          throw new Error(`${errorMessage}${details ? `: ${details}` : ''}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error(`[Planner] Expected JSON from ${url}, got:`, text.substring(0, 100));
          throw new Error(`${errorMessage}: Server returned an invalid format (HTML instead of JSON). This usually means the API route is not working correctly.`);
        }
        return await res.json();
      };

      // 1. Search Flights
      const flightData = await safeFetchJson(
        `/api/flights/search?origin=${searchCriteria.origin}&destination=MLE&departureDate=${searchCriteria.departureDate}&returnDate=${searchCriteria.returnDate}&adults=${searchCriteria.adults}`,
        'Failed to fetch flight offers'
      );
      if (flightData.error) throw new Error(flightData.details || flightData.error);
      setFlights(flightData.data || []);

      // 2. Search Hotels (MLE)
      const hotelData = await safeFetchJson(
        `/api/hotels/search?cityCode=MLE&checkInDate=${searchCriteria.departureDate}&checkOutDate=${searchCriteria.returnDate}&adults=${searchCriteria.adults}`,
        'Failed to fetch hotel offers'
      );
      setHotels(hotelData.data || []);

      // 3. Search Activities (MLE Coordinates: 4.1755, 73.5093)
      const activityData = await safeFetchJson(
        `/api/activities/search?latitude=4.1755&longitude=73.5093`,
        'Failed to fetch activities'
      );
      setActivities(activityData.data || []);

      setStep(2);
    } catch (err: any) {
      console.error('[Planner] Search error:', err);
      setError(err.message || 'Failed to fetch live data from Amadeus.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const itinerary = {
        flight: selectedFlight,
        hotel: selectedHotel,
        activities: selectedActivities,
        criteria: searchCriteria
      };
      
      const res = await fetch('/api/itinerary/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactDetails.email,
          name: contactDetails.name,
          itinerary
        })
      });
      
      if (!res.ok) throw new Error('Failed to confirm itinerary');
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        throw new Error(data.error || 'Failed to send itinerary');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedFlight) total += parseFloat(selectedFlight.price.total);
    if (selectedHotel) total += parseFloat(selectedHotel.offers[0].price.total);
    selectedActivities.forEach(a => total += parseFloat(a.price.amount));
    return total.toFixed(2);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-parchment dark:bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-emerald-500/20">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white mb-8">{t('smartPlan.successTitle')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-12 uppercase tracking-widest">
            {t('smartPlan.successDesc', { email: contactDetails.email })}
          </p>
          <Link to="/" className="inline-block px-12 py-5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-sky-500 transition-all">
            {t('smartPlan.returnHome')}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen pt-40 pb-32 px-6 transition-colors duration-700">
      <SEO 
        title="Smart Trip Planner | Maldives Serenity Travels" 
        description="Experience the future of travel planning. Live Amadeus integration for flights, hotels, and experiences in the Maldives."
      />

      <div className="max-w-6xl mx-auto">
        {/* Progress Header */}
        <div className="flex flex-col items-center mb-20">
          <span className="text-[10px] font-black text-sky-500 uppercase tracking-[1em] mb-8">{t('smartPlan.concierge')}</span>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <React.Fragment key={i}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${step === i ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 scale-125 shadow-2xl' : step > i ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  {step > i ? <Check className="w-4 h-4" /> : i}
                </div>
                {i < 6 && <div className={`w-8 h-px ${step > i ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/5'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-8 md:p-16 shadow-2xl border border-slate-100 dark:border-white/5 min-h-[600px] relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-6" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white animate-pulse">{t('smartPlan.syncing')}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: SEARCH */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="text-center mb-16">
                  <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6">{t('smartPlan.step1Title')}</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.4em]">{t('smartPlan.step1Subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="space-y-4 relative">
                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <MapPin className="w-4 h-4 text-sky-500" /> {t('smartPlan.originLabel')}
                    </label>
                    <input 
                      type="text"
                      placeholder={t('smartPlan.originPlaceholder')}
                      value={searchCriteria.originName}
                      onChange={(e) => setSearchCriteria(prev => ({ ...prev, originName: e.target.value, origin: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 transition-all dark:text-white"
                    />
                    {locationSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 border border-slate-100 dark:border-white/10 p-2">
                        {locationSuggestions.map((loc: any) => (
                          <button 
                            key={loc.iataCode}
                            onClick={() => {
                              setSearchCriteria(prev => ({ ...prev, origin: loc.iataCode, originName: `${loc.name} (${loc.iataCode})` }));
                              setLocationSuggestions([]);
                            }}
                            className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-between"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">{loc.name}</span>
                            <span className="text-[10px] font-black text-sky-500">{loc.iataCode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Users className="w-4 h-4 text-sky-500" /> {t('smartPlan.travelersLabel')}
                    </label>
                    <select 
                      value={searchCriteria.adults}
                      onChange={(e) => setSearchCriteria(prev => ({ ...prev, adults: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 transition-all dark:text-white appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {t('plan.purposes.adults', { defaultValue: 'Adults' })}</option>)}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar className="w-4 h-4 text-sky-500" /> {t('smartPlan.departureLabel')}
                    </label>
                    <input 
                      type="date"
                      value={searchCriteria.departureDate}
                      onChange={(e) => setSearchCriteria(prev => ({ ...prev, departureDate: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 transition-all dark:text-white"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar className="w-4 h-4 text-sky-500" /> {t('smartPlan.returnLabel')}
                    </label>
                    <input 
                      type="date"
                      value={searchCriteria.returnDate}
                      onChange={(e) => setSearchCriteria(prev => ({ ...prev, returnDate: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 transition-all dark:text-white"
                    />
                  </div>
                </div>

                {error && (
                  <div className="max-w-4xl mx-auto p-6 bg-rose-50 dark:bg-rose-950/20 rounded-3xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-4 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">{error}</p>
                  </div>
                )}

                <div className="pt-12 text-center">
                  <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-20 py-7 rounded-full text-[11px] font-black uppercase tracking-[0.8em] hover:bg-sky-500 transition-all shadow-2xl disabled:opacity-50"
                  >
                    {t('smartPlan.searchBtn')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: FLIGHTS */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <span className="text-sky-500 font-black text-[10px] uppercase tracking-widest mb-4 block">{t('plan.step')} 2</span>
                    <h3 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">{t('smartPlan.step2Title')}</h3>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{t('smartPlan.changeSearch')}</button>
                </div>

                <div className="space-y-4 max-w-4xl mx-auto">
                  {flights.map(flight => (
                    <button 
                      key={flight.id}
                      onClick={() => setSelectedFlight(flight)}
                      className={`w-full p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-8 ${selectedFlight?.id === flight.id ? 'bg-slate-950 dark:bg-white border-transparent text-white dark:text-slate-950 shadow-2xl scale-[1.02]' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 hover:border-sky-300 dark:hover:border-sky-500'}`}
                    >
                      <div className="flex items-center gap-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedFlight?.id === flight.id ? 'bg-white/10 dark:bg-slate-900/10' : 'bg-white dark:bg-slate-900 shadow-sm'}`}>
                          <Plane className="w-6 h-6 text-sky-500" />
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] font-black uppercase tracking-widest block mb-1">{flight.validatingAirlineCodes[0]} Airways</span>
                          <span className="text-[9px] opacity-60 uppercase tracking-widest">{flight.itineraries[0].segments.length - 1} {t('smartPlan.stops')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-12">
                        <div className="text-center">
                           <span className="text-xl font-serif font-bold block">{new Date(flight.itineraries[0].segments[0].departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           <span className="text-[9px] opacity-60 uppercase tracking-widest">{flight.itineraries[0].segments[0].departure.iataCode}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-30" />
                        <div className="text-center">
                           <span className="text-xl font-serif font-bold block">{new Date(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           <span className="text-[9px] opacity-60 uppercase tracking-widest">MLE</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-serif font-bold block">${flight.price.total}</span>
                        <span className="text-[9px] opacity-60 uppercase tracking-widest">{t('smartPlan.totalFor', { count: searchCriteria.adults })}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-12 text-center">
                  <button 
                    disabled={!selectedFlight}
                    onClick={() => setStep(3)}
                    className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-20 py-7 rounded-full text-[11px] font-black uppercase tracking-[0.8em] hover:bg-sky-500 transition-all shadow-2xl disabled:opacity-30"
                  >
                    {t('smartPlan.continueHotels')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: HOTELS */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <span className="text-sky-500 font-black text-[10px] uppercase tracking-widest mb-4 block">{t('plan.step')} 3</span>
                    <h3 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">{t('smartPlan.step3Title')}</h3>
                  </div>
                  <button onClick={() => setStep(2)} className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{t('smartPlan.backFlights')}</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {hotels.map(hotelOffer => (
                    <button 
                      key={hotelOffer.hotel.hotelId}
                      onClick={() => setSelectedHotel(hotelOffer)}
                      className={`p-8 rounded-[3rem] border transition-all duration-500 text-left flex flex-col justify-between gap-8 ${selectedHotel?.hotel.hotelId === hotelOffer.hotel.hotelId ? 'bg-slate-950 dark:bg-white border-transparent text-white dark:text-slate-950 shadow-2xl scale-[1.02]' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 hover:border-sky-300 dark:hover:border-sky-500'}`}
                    >
                      <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedHotel?.hotel.hotelId === hotelOffer.hotel.hotelId ? 'bg-white/10 dark:bg-slate-900/10' : 'bg-white dark:bg-slate-900 shadow-sm'}`}>
                          <Hotel className="w-5 h-5 text-sky-500" />
                        </div>
                        <h4 className="text-2xl font-serif font-bold leading-tight">{hotelOffer.hotel.name}</h4>
                        <p className="text-[9px] opacity-60 uppercase tracking-widest">{hotelOffer.offers[0].room.description.text.substring(0, 100)}...</p>
                      </div>
                      
                      <div className="flex justify-between items-end pt-8 border-t border-white/10 dark:border-slate-950/10">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest block mb-1">{t('smartPlan.perNight')}</span>
                          <span className="text-2xl font-serif font-bold">${hotelOffer.offers[0].price.total}</span>
                        </div>
                        <div className="text-right">
                           <span className="text-[9px] font-black uppercase tracking-widest block mb-1">{t('smartPlan.totalStay')}</span>
                           <span className="text-lg font-serif font-bold opacity-60">${(parseFloat(hotelOffer.offers[0].price.total) * 7).toFixed(2)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-12 text-center">
                  <button 
                    disabled={!selectedHotel}
                    onClick={() => setStep(4)}
                    className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-20 py-7 rounded-full text-[11px] font-black uppercase tracking-[0.8em] hover:bg-sky-500 transition-all shadow-2xl disabled:opacity-30"
                  >
                    {t('smartPlan.continueExperiences')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: EXPERIENCES */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <span className="text-sky-500 font-black text-[10px] uppercase tracking-widest mb-4 block">{t('plan.step')} 4</span>
                    <h3 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">{t('smartPlan.step4Title')}</h3>
                  </div>
                  <button onClick={() => setStep(3)} className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{t('smartPlan.backHotels')}</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map(activity => {
                    const isSelected = selectedActivities.find(a => a.id === activity.id);
                    return (
                      <button 
                        key={activity.id}
                        onClick={() => {
                          if (isSelected) setSelectedActivities(prev => prev.filter(a => a.id !== activity.id));
                          else setSelectedActivities(prev => [...prev, activity]);
                        }}
                        className={`group relative rounded-[2.5rem] overflow-hidden border transition-all duration-700 text-left flex flex-col h-full ${isSelected ? 'border-sky-500 shadow-2xl scale-[1.02]' : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 hover:border-sky-300'}`}
                      >
                        <div className="aspect-video overflow-hidden">
                          <img src={activity.pictures[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-8 flex flex-col justify-between flex-1">
                          <div>
                            <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4 leading-tight">{activity.name}</h4>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-loose mb-6">{activity.shortDescription.substring(0, 80)}...</p>
                          </div>
                          <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-white/5">
                            <span className="text-lg font-serif font-bold text-sky-500">${activity.price.amount}</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-sky-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-200'}`}>
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-12 text-center">
                  <button 
                    onClick={() => setStep(5)}
                    className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-20 py-7 rounded-full text-[11px] font-black uppercase tracking-[0.8em] hover:bg-sky-500 transition-all shadow-2xl"
                  >
                    {t('smartPlan.reviewPackage')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: REVIEW */}
            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-16"
              >
                <div className="text-center">
                  <span className="text-sky-500 font-black text-[10px] uppercase tracking-widest mb-4 block">{t('smartPlan.reviewPackage')}</span>
                  <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white">{t('smartPlan.step5Title')}</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Flight Summary */}
                  <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                    <Plane className="w-8 h-8 text-sky-500 mb-8" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">{t('smartPlan.flightDetails')}</h4>
                    <div className="space-y-4">
                      <p className="text-xl font-serif font-bold text-slate-900 dark:text-white">{selectedFlight?.validatingAirlineCodes[0]} Airways</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{searchCriteria.origin} &rarr; MLE</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{searchCriteria.departureDate}</p>
                    </div>
                  </div>

                  {/* Hotel Summary */}
                  <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                    <Hotel className="w-8 h-8 text-sky-500 mb-8" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">{t('smartPlan.sanctuary')}</h4>
                    <div className="space-y-4">
                      <p className="text-xl font-serif font-bold text-slate-900 dark:text-white">{selectedHotel?.hotel.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">7 Nights Stay</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{selectedHotel?.offers[0].room.typeEstimated.category}</p>
                    </div>
                  </div>

                  {/* Experiences Summary */}
                  <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                    <Compass className="w-8 h-8 text-sky-500 mb-8" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">{t('smartPlan.experiences')}</h4>
                    <div className="space-y-2">
                      {selectedActivities.map(a => (
                        <p key={a.id} className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">• {a.name}</p>
                      ))}
                      {selectedActivities.length === 0 && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{t('smartPlan.noActivities')}</p>}
                    </div>
                  </div>
                </div>

                <div className="max-w-xl mx-auto p-12 rounded-[3rem] bg-slate-950 text-white text-center shadow-2xl">
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 mb-4 block">{t('smartPlan.estimatedTotal')}</span>
                   <h4 className="text-6xl font-serif font-bold mb-4">${calculateTotal()}</h4>
                   <p className="text-[9px] uppercase tracking-widest opacity-40">{t('smartPlan.taxesFees')}</p>
                </div>

                <div className="flex flex-col items-center gap-8">
                  <button onClick={() => setStep(6)} className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-20 py-7 rounded-full text-[11px] font-black uppercase tracking-[0.8em] hover:bg-sky-500 transition-all shadow-2xl">{t('smartPlan.confirmFinalize')}</button>
                  <button onClick={() => setStep(4)} className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{t('smartPlan.modifySelections')}</button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: CONFIRMATION */}
            {step === 6 && (
              <motion.div 
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-16"
              >
                <div className="text-center">
                  <span className="text-sky-500 font-black text-[10px] uppercase tracking-widest mb-4 block">{t('smartPlan.step6Title')}</span>
                  <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white">{t('smartPlan.step6Title')}</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.4em] mt-8">{t('smartPlan.step6Subtitle')}</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <User className="w-4 h-4 text-sky-500" /> {t('smartPlan.fullName')}
                    </label>
                    <input 
                      type="text"
                      required
                      value={contactDetails.name}
                      onChange={(e) => setContactDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 transition-all dark:text-white"
                      placeholder={t('contactPage.form.namePlaceholder')}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Mail className="w-4 h-4 text-sky-500" /> {t('smartPlan.emailAddress')}
                    </label>
                    <input 
                      type="email"
                      required
                      value={contactDetails.email}
                      onChange={(e) => setContactDetails(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 transition-all dark:text-white"
                      placeholder={t('contactPage.form.emailPlaceholder')}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Phone className="w-4 h-4 text-sky-500" /> {t('smartPlan.phoneNumber')}
                    </label>
                    <input 
                      type="tel"
                      required
                      value={contactDetails.phone}
                      onChange={(e) => setContactDetails(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 transition-all dark:text-white"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                <div className="pt-12 text-center">
                  <button 
                    disabled={isSubmitting || !contactDetails.email || !contactDetails.name}
                    onClick={handleConfirm}
                    className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-20 py-7 rounded-full text-[11px] font-black uppercase tracking-[0.8em] hover:bg-sky-500 transition-all shadow-2xl disabled:opacity-30 flex items-center gap-4 mx-auto"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isSubmitting ? t('smartPlan.processing') : t('smartPlan.sendItinerary')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SmartPlanner;
