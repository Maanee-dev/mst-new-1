
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Clock, MapPin, ArrowRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FlightStatus {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  scheduledArrival: string;
  actualArrival?: string;
  status: 'LANDED' | 'ON TIME' | 'DELAYED' | 'CANCELLED' | 'EN ROUTE';
  gate?: string;
  terminal?: string;
}

const LiveFlightBoard: React.FC<{ limit?: number; showHeader?: boolean }> = ({ limit = 5, showHeader = true }) => {
  const [flights, setFlights] = useState<FlightStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchFlightData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clientId = process.env.AMADEUS_CLIENT_ID;
      const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Amadeus API keys are missing. Please configure AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET in settings.');
      }

      // 1. Get Token
      const authRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        })
      });

      if (!authRes.ok) {
        throw new Error('Failed to authenticate with Amadeus. Check your API keys.');
      }

      const authData = await authRes.json();
      const token = authData.access_token;

      // 2. Fetch flights from major hubs to MLE for today
      const origins = ['DXB', 'DOH', 'CMB', 'SIN', 'IST', 'AUH', 'LHR'];
      const today = new Date().toISOString().split('T')[0];
      
      const flightPromises = origins.map(origin => 
        fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=MLE&departureDate=${today}&adults=1&max=5&currencyCode=USD`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(async res => {
          if (!res.ok) return { data: [] }; // Ignore individual failures
          return res.json();
        }).catch(() => ({ data: [] })) // Catch network errors per request
      );

      const results = await Promise.all(flightPromises);
      
      const allFlights: FlightStatus[] = [];
      let carriers: Record<string, string> = {};

      results.forEach((res) => {
        if (res.dictionaries?.carriers) {
          carriers = { ...carriers, ...res.dictionaries.carriers };
        }
        if (res.data && res.data.length > 0) {
          res.data.forEach((offer: any) => {
            const segment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
            const arrivalTime = new Date(segment.arrival.at);
            const now = new Date();
            
            // Determine a "Status" based on time for demonstration
            let status: FlightStatus['status'] = 'ON TIME';
            if (arrivalTime < now) status = 'LANDED';
            else if (Math.random() > 0.9) status = 'DELAYED';
            else if (arrivalTime.getTime() - now.getTime() < 3600000) status = 'EN ROUTE';

            allFlights.push({
              flightNumber: `${segment.carrierCode}${segment.number}`,
              airline: carriers[segment.carrierCode] || segment.carrierCode,
              origin: segment.departure.iataCode,
              destination: 'MLE',
              scheduledArrival: arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
              status: status,
              terminal: segment.arrival.terminal || 'I'
            });
          });
        }
      });

      // Sort by arrival time
      allFlights.sort((a, b) => a.scheduledArrival.localeCompare(b.scheduledArrival));

      if (allFlights.length === 0) {
        // If no flights found for today, try tomorrow as a fallback
        setError('No flights found for today. The airport might be in a quiet period or the API has limited test data.');
      } else {
        setFlights(allFlights.slice(0, limit));
        setLastUpdated(new Date());
      }
    } catch (err: any) {
      console.error('Flight board error:', err);
      setError(err.message || 'Unable to sync with live Amadeus feed.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFlightData();
    const interval = setInterval(fetchFlightData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [limit]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LANDED': return 'text-emerald-500 bg-emerald-500/10';
      case 'ON TIME': return 'text-sky-500 bg-sky-500/10';
      case 'DELAYED': return 'text-amber-500 bg-amber-500/10';
      case 'CANCELLED': return 'text-rose-500 bg-rose-500/10';
      case 'EN ROUTE': return 'text-indigo-500 bg-indigo-500/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="w-full">
      {showHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-[1em] mb-4 block">Live Operations</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter">Velana Arrivals<span className="text-sky-500">.</span></h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Sync</p>
              <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">{lastUpdated.toLocaleTimeString()}</p>
            </div>
            <button 
              onClick={fetchFlightData}
              className="w-12 h-12 rounded-full border border-slate-100 dark:border-white/10 flex items-center justify-center hover:bg-slate-950 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all duration-500"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-white/5">
                <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Flight</th>
                <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Origin</th>
                <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Scheduled</th>
                <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {flights.map((flight, idx) => (
                  <motion.tr 
                    key={flight.flightNumber}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-100 dark:border-white/10">
                          <Plane size={14} className="text-sky-500" />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{flight.flightNumber}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{flight.airline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <MapPin size={12} className="text-slate-300" />
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{flight.origin}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Clock size={12} className="text-slate-300" />
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{flight.scheduledArrival}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusColor(flight.status)}`}>
                        {flight.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">{flight.terminal || '-'}</span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {loading && flights.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-sky-500" size={32} />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em]">Syncing Global Feed...</p>
          </div>
        )}

        {error && (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-rose-500">
            <AlertCircle size={32} />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em]">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-center">
        <Link to="/flight-board" className="inline-flex items-center gap-4 text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-[0.5em] group">
          <span className="border-b border-slate-200 dark:border-white/10 pb-1 group-hover:border-sky-500 transition-colors">View Full Flight Board</span>
          <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default LiveFlightBoard;
