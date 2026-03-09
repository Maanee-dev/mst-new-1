
import React, { useState } from 'react';
import { Plane, MapPin, Clock, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';
import LiveFlightBoard from '../components/LiveFlightBoard';

const FlightBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'arrivals' | 'departures'>('arrivals');

  return (
    <div className="min-h-screen bg-parchment dark:bg-slate-950 transition-colors duration-700 pt-32 pb-20">
      <SEO 
        title="Live Flight Board | Velana International Airport (MLE)" 
        description="Real-time arrivals and departures at Velana International Airport. Monitor landing times, delays, and flight status for all major carriers."
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 reveal active">
          <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-8 block">Velana Operations</span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-[0.85] mb-12">
            The Flight <br /> Board.
          </h1>
          <p className="text-slate-400 dark:text-slate-600 text-[11px] font-black uppercase tracking-[0.5em] leading-[2] max-w-lg">
            A sophisticated real-time interface for Velana International Airport (MLE). Global distribution data for the discerning voyager.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-12 reveal active delay-300">
          <button 
            onClick={() => setActiveTab('arrivals')}
            className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${activeTab === 'arrivals' ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-white/5'}`}
          >
            Arrivals
          </button>
          <button 
            onClick={() => setActiveTab('departures')}
            className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${activeTab === 'departures' ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-white/5'}`}
          >
            Departures
          </button>
        </div>

        {/* Board */}
        <div className="reveal active delay-500">
          {activeTab === 'arrivals' ? (
            <LiveFlightBoard limit={20} showHeader={false} />
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border border-slate-100 dark:border-white/5 shadow-2xl">
              <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center mx-auto mb-12 border border-slate-100 dark:border-white/10">
                <Plane className="text-slate-200 dark:text-slate-800 -rotate-45" size={40} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6">Departures Feed Offline.</h3>
              <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] max-w-xs mx-auto leading-loose">
                Departure data is currently being synchronized with the global distribution system. Please check back shortly.
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 reveal active delay-700">
          <div className="p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mb-8">
              <Clock size={20} className="text-sky-500" />
            </div>
            <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Real-Time Sync</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-loose">
              Our systems pull live data from the Amadeus Global Distribution System every 60 seconds to ensure precision.
            </p>
          </div>
          <div className="p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mb-8">
              <MapPin size={20} className="text-sky-500" />
            </div>
            <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Velana Hub</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-loose">
              Velana International (MLE) is the primary gateway to the Maldives, handling over 30 international carriers daily.
            </p>
          </div>
          <div className="p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mb-8">
              <RefreshCw size={20} className="text-sky-500" />
            </div>
            <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Auto-Refresh</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-loose">
              The flight board automatically updates to reflect the latest landing times and gate assignments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBoard;
