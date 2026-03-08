
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
      // In a real app, we would call Amadeus Flight Status API
      // Since it's often restricted in test environments, we'll simulate a live feed 
      // with realistic data for Male (MLE) arrivals.
      
      const mockFlights: FlightStatus[] = [
        {
          flightNumber: 'EK652',
          airline: 'Emirates',
          origin: 'DXB',
          destination: 'MLE',
          scheduledArrival: '15:30',
          actualArrival: '15:25',
          status: 'LANDED',
          terminal: 'I'
        },
        {
          flightNumber: 'QR672',
          airline: 'Qatar Airways',
          origin: 'DOH',
          destination: 'MLE',
          scheduledArrival: '16:15',
          status: 'ON TIME',
          terminal: 'I'
        },
        {
          flightNumber: 'UL101',
          airline: 'SriLankan',
          origin: 'CMB',
          destination: 'MLE',
          scheduledArrival: '16:45',
          status: 'EN ROUTE',
          terminal: 'I'
        },
        {
          flightNumber: 'EY278',
          airline: 'Etihad',
          origin: 'AUH',
          destination: 'MLE',
          scheduledArrival: '17:20',
          status: 'DELAYED',
          terminal: 'I'
        },
        {
          flightNumber: 'SQ438',
          airline: 'Singapore Airlines',
          origin: 'SIN',
          destination: 'MLE',
          scheduledArrival: '18:05',
          status: 'ON TIME',
          terminal: 'I'
        },
        {
          flightNumber: 'TK730',
          airline: 'Turkish Airlines',
          origin: 'IST',
          destination: 'MLE',
          scheduledArrival: '18:40',
          status: 'ON TIME',
          terminal: 'I'
        },
        {
          flightNumber: 'BA061',
          airline: 'British Airways',
          origin: 'LHR',
          destination: 'MLE',
          scheduledArrival: '19:15',
          status: 'EN ROUTE',
          terminal: 'I'
        },
        {
          flightNumber: 'AF222',
          airline: 'Air France',
          origin: 'CDG',
          destination: 'MLE',
          scheduledArrival: '20:00',
          status: 'ON TIME',
          terminal: 'I'
        }
      ];

      // Shuffle or filter to make it look "live"
      setFlights(mockFlights.slice(0, limit));
      setLastUpdated(new Date());
    } catch (err) {
      setError('Unable to sync with global flight data.');
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
