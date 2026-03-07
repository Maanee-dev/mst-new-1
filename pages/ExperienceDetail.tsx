import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Experience } from '../types';
import { EXPERIENCES } from '../constants';
import SEO from '../components/SEO';
import { ArrowLeft, MapPin, Calendar, Check, Sparkles, Share2, Plus } from 'lucide-react';
import ExperienceInquiryForm from '../components/ExperienceInquiryForm';
import { AnimatePresence } from 'motion/react';
import { useBag } from '../context/BagContext';

const ExperienceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const { addItem, isInBag } = useBag();

  useEffect(() => {
    const fetchExperience = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('experiences')
          .select('*, resorts(id, name, slug)')
          .eq('slug', slug)
          .single();

        if (data) {
          setExperience({
            ...data,
            resortName: data.resorts?.name,
            resortSlug: data.resorts?.slug,
            resortId: data.resorts?.id
          } as Experience);
        } else {
          const local = EXPERIENCES.find(e => e.slug === slug);
          setExperience(local || null);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        const local = EXPERIENCES.find(e => e.slug === slug);
        setExperience(local || null);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-slate-100 dark:border-white/5 border-t-sky-500 rounded-full animate-spin mb-8"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Consulting the Archive...</p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-parchment dark:bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-8">Journey Not Found</h1>
        <Link to="/experiences" className="text-sky-500 font-black uppercase tracking-[0.4em] text-[10px] border-b border-sky-100 pb-2">Return to Archives</Link>
      </div>
    );
  }

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen transition-colors duration-700">
      <SEO 
        title={`${experience.title} | Curated Maldives Experiences`}
        description={experience.description}
        image={experience.image}
      />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={experience.image} className="w-full h-full object-cover" alt={experience.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-24 w-full">
          <Link to="/experiences" className="inline-flex items-center gap-3 text-[10px] font-black text-white/60 hover:text-white uppercase tracking-[0.4em] mb-12 transition-colors group">
            <ArrowLeft size={16} className="transform group-hover:-translate-x-2 transition-transform" />
            <span>Back to Archives</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <span className="text-sky-400 font-black uppercase tracking-[1em] text-[10px] mb-6 block">{experience.category}</span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tighter leading-none">
                {experience.title}
              </h1>
            </div>
            
            {experience.resortName && (
              <Link to={`/stays/${experience.resortSlug}`} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all group">
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-4 block">Hosted At</span>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white">
                    <MapPin size={18} />
                  </div>
                  <span className="text-lg font-serif font-bold text-white group-hover:text-sky-400 transition-colors">{experience.resortName}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Main Text */}
          <div className="lg:col-span-7">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 text-xl leading-[2] font-medium mb-12">
                {experience.description}
              </p>
              <div className="h-px w-24 bg-amber-400 mb-12"></div>
              <p className="text-slate-500 dark:text-slate-500 leading-relaxed">
                The Maldives offers a unique canvas for exploration. This curated experience has been selected for its authenticity, environmental respect, and the profound sense of place it provides. Whether you are seeking the adrenaline of the deep or the quietude of a private sandbank, our partners ensure every detail is meticulously handled.
              </p>
            </div>

            {/* Packages Section */}
            {experience.packages && experience.packages.length > 0 && (
              <div className="mt-24">
                <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.5em] mb-12">Available Packages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {experience.packages.map((pkg, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-10 hover:border-sky-500/30 transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-8">
                        <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white">{pkg.name}</h4>
                        <span className="text-sky-500 font-black text-xs">{pkg.price}</span>
                      </div>
                      <ul className="space-y-4 mb-10">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Check size={14} className="text-emerald-500" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => setShowInquiry(true)}
                        className="block w-full text-center bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-5 rounded-2xl text-[9px] uppercase tracking-[0.4em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all"
                      >
                        Select Package
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-12">
              {/* Booking Card */}
              <div className="bg-slate-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <Sparkles className="text-sky-400 mb-8" size={32} />
                <h3 className="text-3xl font-serif font-bold mb-6">Ready to Explore?</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-10">
                  Our travel curators are ready to weave this experience into your bespoke Maldivian itinerary.
                </p>
                <button 
                  onClick={() => setShowInquiry(true)}
                  className="block w-full bg-white text-slate-950 font-black py-6 rounded-2xl text-[10px] uppercase tracking-[0.4em] hover:bg-sky-400 transition-all text-center mb-4"
                >
                  Consult An Expert
                </button>
                <button 
                  onClick={() => {
                    if (experience && !isInBag(experience.id)) {
                      addItem({
                        id: experience.id,
                        type: 'experience',
                        name: experience.title,
                        image: experience.image,
                        slug: experience.slug,
                        details: experience.category
                      });
                    }
                  }}
                  disabled={experience ? isInBag(experience.id) : true}
                  className={`block w-full font-black py-6 rounded-2xl text-[10px] uppercase tracking-[0.4em] transition-all text-center border ${isInBag(experience?.id || '') ? 'bg-sky-500 border-sky-500 text-white' : 'bg-transparent border-white/20 text-white hover:bg-white/10'}`}
                >
                  {isInBag(experience?.id || '') ? 'Added to Bag' : (
                    <span className="flex items-center justify-center gap-2">
                      <Plus size={14} /> Add to Selection
                    </span>
                  )}
                </button>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl p-8">
                  <Calendar className="text-sky-500 mb-4" size={20} />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Availability</span>
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Year Round</span>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl p-8">
                  <Share2 className="text-sky-500 mb-4" size={20} />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Share</span>
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showInquiry && (
          <ExperienceInquiryForm 
            experience={experience} 
            onClose={() => setShowInquiry(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceDetail;
