import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RESORTS } from '../constants';
import ResortCard from '../components/ResortCard';

export default function Home() {
  const featuredResorts = RESORTS.slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#FCFAF7]">
      {/* Hero Section */}
      <section className="pt-48 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center reveal">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 mb-8 block">Discover a Serene Escape</span>
          <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-serif font-bold text-slate-900 mb-12 leading-[1.1] tracking-tight">
            Where Nature <br /> Embraces Luxury
          </h1>
          <div className="flex flex-col items-center mt-16">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-900 mb-6">Select Your Stay</span>
            <div className="w-px h-16 bg-slate-900"></div>
          </div>
        </div>

        {/* Asymmetric Image Grid */}
        <div className="max-w-[1400px] mx-auto mt-32 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 px-6 lg:px-12">
          <div className="md:col-span-4 h-[500px] lg:h-[700px] reveal transition-all duration-1000">
            <img 
              src="https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover" 
              alt="Soneva Jani" 
            />
          </div>
          <div className="md:col-span-5 h-[600px] lg:h-[800px] md:-mt-12 reveal transition-all duration-1000 delay-200">
            <img 
              src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover" 
              alt="Coastal" 
            />
          </div>
          <div className="md:col-span-3 h-[400px] lg:h-[600px] md:mt-24 reveal transition-all duration-1000 delay-500">
            <img 
              src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover" 
              alt="Resort" 
            />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 px-6 max-w-4xl mx-auto text-center reveal">
        <p className="text-2xl md:text-4xl font-serif font-bold text-slate-900 leading-[1.5] mb-4">Serenity is a tranquil hotel</p>
        <p className="text-2xl md:text-4xl font-serif font-bold text-slate-900 leading-[1.5] mb-4">nestled amidst the Maldives' majestic</p>
        <p className="text-2xl md:text-4xl font-serif font-bold text-slate-900 leading-[1.5]">atolls, offering a harmonious blend of minimalist luxury and nature.</p>
      </section>

      {/* Featured Stays */}
      <section className="py-40 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 reveal">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">Comfort and Space Combined</h2>
              <p className="text-slate-400 text-sm font-medium tracking-wide">Relish the charm of our spacious rooms and separate houses.</p>
            </div>
            <Link to="/stays" className="group flex items-center gap-6 pb-2 border-b border-slate-900">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-900">Select Accommodation</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredResorts.map(resort => (
              <ResortCard key={resort.id} resort={resort} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}