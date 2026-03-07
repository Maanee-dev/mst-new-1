
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';
import { RESORTS } from '../constants';
import { AccommodationType, TransferType, MealPlan } from '../types';
import ResortCard from '../components/ResortCard';

const Resorts: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  const [filterQuery, setFilterQuery] = useState(initialQuery);
  const [selectedAtoll, setSelectedAtoll] = useState<string>('All');
  const [selectedTransfer, setSelectedTransfer] = useState<string>('All');

  const atolls = useMemo(() => {
    const set = new Set(RESORTS.filter(r => r.type === AccommodationType.RESORT).map(r => r.atoll));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredResorts = useMemo(() => {
    let list = RESORTS.filter(r => r.type === AccommodationType.RESORT);

    if (filterQuery.trim()) {
      const fuse = new Fuse(list, {
        keys: ['name', 'atoll', 'shortDescription'],
        threshold: 0.35,
      });
      list = fuse.search(filterQuery).map(r => r.item);
    }

    return list.filter(resort => {
      const matchesAtoll = selectedAtoll === 'All' || resort.atoll === selectedAtoll;
      const matchesTransfer = selectedTransfer === 'All' || 
                              resort.transfers.some(t => t.toString() === selectedTransfer);

      return matchesAtoll && matchesTransfer;
    });
  }, [filterQuery, selectedAtoll, selectedTransfer]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-sky-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Maldives Luxury Resorts</h1>
          <p className="text-sky-200 max-w-2xl mx-auto font-medium">
            Explore the world's most exclusive overwater villas and private island sanctuaries. 
            From Noonu to South Ari, find your perfect atoll escape.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">Search</h3>
              <input 
                type="text" 
                placeholder="Resort name..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">Atoll</h3>
              <div className="space-y-2">
                {atolls.map(atoll => (
                  <label key={atoll} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="atoll" 
                      className="w-4 h-4 text-sky-600 focus:ring-sky-500" 
                      checked={selectedAtoll === atoll}
                      onChange={() => setSelectedAtoll(atoll)}
                    />
                    <span className={`text-sm ${selectedAtoll === atoll ? 'text-sky-600 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                      {atoll}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">Transfer Method</h3>
              <div className="space-y-2">
                {['All', ...Object.values(TransferType)].map(t => (
                  <label key={t} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="transfer" 
                      className="w-4 h-4 text-sky-600 focus:ring-sky-500" 
                      checked={selectedTransfer === t}
                      onChange={() => setSelectedTransfer(t)}
                    />
                    <span className={`text-sm ${selectedTransfer === t ? 'text-sky-600 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                      {t.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
              <h4 className="font-bold text-sky-900 text-sm mb-2">Need advice?</h4>
              <p className="text-xs text-sky-700 leading-relaxed mb-4">Our local experts can help you choose the best island based on your budget and preferences.</p>
              <button className="w-full bg-sky-600 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-sky-700 transition-colors">
                Chat With Us
              </button>
            </div>
          </aside>

          {/* Listing Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-8">
              <p className="text-slate-500 text-sm font-medium">Showing <span className="text-slate-900 font-bold">{filteredResorts.length}</span> resorts</p>
              <select className="bg-transparent border-none text-sm font-bold text-slate-700 focus:outline-none cursor-pointer">
                <option>Featured First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {filteredResorts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredResorts.map(resort => (
                  <ResortCard key={resort.id} resort={resort} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
                <span className="text-4xl mb-4 block">🏝️</span>
                <h3 className="text-xl font-bold text-slate-800">No resorts found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => { setSelectedAtoll('All'); setSelectedTransfer('All'); setFilterQuery(''); }}
                  className="mt-6 text-sky-600 font-bold underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resorts;
