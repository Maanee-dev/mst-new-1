
import React, { useMemo, useState } from 'react';
import { RESORTS } from '../constants';
import { AccommodationType } from '../types';
import ResortCard from '../components/ResortCard';

const GuestHouses: React.FC = () => {
  const [selectedAtoll, setSelectedAtoll] = useState('All');

  const guestHouses = useMemo(() => {
    return RESORTS.filter(r => r.type === AccommodationType.GUEST_HOUSE);
  }, []);

  const atolls = useMemo(() => {
    return ['All', ...Array.from(new Set(guestHouses.map(g => g.atoll)))];
  }, [guestHouses]);

  const filtered = useMemo(() => {
    return guestHouses.filter(g => selectedAtoll === 'All' || g.atoll === selectedAtoll);
  }, [guestHouses, selectedAtoll]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-sky-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Budget Maldives</h1>
          <p className="text-sky-100 max-w-2xl mx-auto font-medium">
            Authentic guest houses on local islands. Experience bikini beaches, whale shark excursions, and the real Maldivian spirit without the resort price tag.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
           {atolls.map(atoll => (
             <button 
               key={atoll}
               onClick={() => setSelectedAtoll(atoll)}
               className={`px-8 py-2 rounded-full font-bold text-sm transition-all border-2 ${selectedAtoll === atoll ? 'bg-sky-600 border-sky-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-sky-300'}`}
             >
               {atoll}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(gh => (
            <ResortCard key={gh.id} resort={gh} />
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-20">
             <p className="text-slate-500 font-medium">No guest houses listed for this island yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestHouses;
