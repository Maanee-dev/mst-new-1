
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Experience, BlogPost } from '../types';
import { EXPERIENCES, BLOG_POSTS } from '../constants';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowRight, Sparkles, MapPin, Calendar, Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import ExperienceInquiryForm from '../components/ExperienceInquiryForm';
import { AnimatePresence } from 'motion/react';
import { useBag } from '../context/BagContext';

/**
 * Experiences Page: Redesigned with editorial flair, packages, and integrated blog.
 */
const Experiences: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [stories, setStories] = useState<BlogPost[]>([]);
  const [heroGalleryImage, setHeroGalleryImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const { addItem, isInBag } = useBag();
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['All', 'Adventure', 'Wellness', 'Water Sports', 'Relaxation', 'Culture', 'Culinary'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch a random image from resorts
        const { data: resortData } = await supabase
          .from('resorts')
          .select('images')
          .limit(20);
        
        if (resortData && resortData.length > 0) {
          // Flatten all images from all fetched resorts
          const allImages = resortData.flatMap(r => r.images || []).filter(Boolean);
          if (allImages.length > 0) {
            const randomIdx = Math.floor(Math.random() * allImages.length);
            setHeroGalleryImage(allImages[randomIdx]);
          }
        }

        // Fetch Experiences
        const { data: expData } = await supabase
          .from('experiences')
          .select('*, resorts(id, name, slug)')
          .order('created_at', { ascending: true });
        
        if (expData && expData.length > 0) {
          const mapped = expData.map(item => ({
            ...item,
            resortName: item.resorts?.name,
            resortSlug: item.resorts?.slug,
            resortId: item.resorts?.id
          })) as Experience[];
          setExperiences(mapped);
        } else {
          setExperiences(EXPERIENCES);
        }

        // Fetch Stories for the bottom section
        const { data: storyData } = await supabase
          .from('stories')
          .select('*')
          .order('date', { ascending: false })
          .limit(3);

        if (storyData && storyData.length > 0) {
          setStories(storyData as BlogPost[]);
        } else {
          setStories(BLOG_POSTS.slice(0, 3));
        }
      } catch (err) {
        console.error('Data fetch error:', err);
        setExperiences(EXPERIENCES);
        setStories(BLOG_POSTS.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, experiences, activeCategory]);

  const filteredExperiences = useMemo(() => {
    if (activeCategory === 'All') return experiences;
    return experiences.filter(exp => exp.category === activeCategory);
  }, [experiences, activeCategory]);

  const paginatedExperiences = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExperiences.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExperiences, currentPage]);

  const totalPages = Math.ceil(filteredExperiences.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen selection:bg-sky-100 selection:text-sky-900 transition-colors duration-700">
      <style>{`
        @keyframes scroll-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-down {
          animation: scroll-down 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
      `}</style>
      <SEO 
        title="Curated Maldives Experiences | Bespoke Adventures & Journeys" 
        description="Browse our collection of curated Maldivian experiences. From deep-sea diving and whale shark safaris to private island wellness retreats, discover the archipelago's unique perspective."
        keywords={['Maldives adventures', 'luxury excursions Maldives', 'whale shark safari', 'Maldives activities']}
        image="https://www.maldives.com/uploads/PATINA_MALDIVES_VELI_BAR_BEACH_2557e9da43.jpg"
      />

      {/* Editorial Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroGalleryImage || "https://www.maldives.com/uploads/PATINA_MALDIVES_VELI_BAR_BEACH_2557e9da43.jpg"} 
            className="w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[10s]" 
            alt="Maldives Discovery"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/40" />
        </div>
        <div className="relative z-10 text-center px-6 reveal active">
          <span className="text-[10px] font-black text-sky-400 mb-8 block tracking-[1em] uppercase">The Perspective</span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white tracking-tighter leading-none mb-12">
            Curated <br /> Living.
          </h1>
          <div className="h-px w-24 bg-amber-400 mx-auto mb-12"></div>
          <p className="text-white text-[11px] font-bold max-w-xl mx-auto uppercase tracking-[0.5em] leading-loose opacity-80">
            A dynamic collection of moments that transcend the standard holiday.
          </p>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <span className="text-[8px] font-black text-white uppercase tracking-[0.5em] vertical-rl rotate-180">Scroll</span>
          <div className="w-px h-12 bg-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-400 animate-scroll-down"></div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-20 md:top-24 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 overflow-x-auto no-scrollbar transition-all duration-700">
         <div className="max-w-7xl mx-auto px-6 py-8 flex justify-start md:justify-center items-center gap-12 md:gap-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] transition-all whitespace-nowrap pb-2 border-b-2 ${activeCategory === cat ? 'border-sky-500 text-slate-950 dark:text-white' : 'border-transparent text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                {cat}
              </button>
            ))}
         </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32">
        {loading ? (
          <div className="py-40 text-center flex flex-col items-center">
            <div className="w-10 h-10 border-2 border-slate-100 dark:border-white/5 border-t-sky-500 rounded-full animate-spin mb-8"></div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Consulting the Archive...</p>
          </div>
        ) : filteredExperiences.length > 0 ? (
          <div className="space-y-48">
            
            {/* 1. FEATURED EXPERIENCE GRID */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {paginatedExperiences.map((exp, idx) => {
                const isLarge = idx % 3 === 0;
                return (
                  <div 
                    key={exp.id} 
                    className={`reveal group flex flex-col ${isLarge ? 'lg:col-span-12' : 'lg:col-span-6'}`}
                    style={{ transitionDelay: `${(idx % 3) * 100}ms` }}
                  >
                    <div className={`relative rounded-[3rem] md:rounded-[4rem] overflow-hidden mb-12 shadow-sm transition-all duration-1000 group-hover:shadow-2xl bg-slate-100 dark:bg-slate-900 ${isLarge ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
                      <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-105" />
                      <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-8 left-8 flex items-center gap-3">
                         <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white shadow-lg border border-white/20 dark:border-white/5">
                            {exp.category}
                         </span>
                         <button 
                           onClick={(e) => {
                             e.preventDefault();
                             if (isInBag(exp.id)) return;
                             addItem({
                               id: exp.id,
                               type: 'experience',
                               name: exp.title,
                               image: exp.image,
                               slug: exp.slug,
                               details: exp.category
                             });
                           }}
                           className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isInBag(exp.id) ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white hover:bg-sky-500 hover:text-white'}`}
                         >
                           {isInBag(exp.id) ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                         </button>
                      </div>

                      {/* Action Button */}
                      <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                         <Link 
                           to={`/experiences/${exp.slug}`}
                           className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-950 dark:text-white shadow-2xl hover:bg-sky-500 hover:text-white transition-all"
                         >
                           <ArrowRight size={24} />
                         </Link>
                      </div>
                    </div>
                    
                    <div className={`px-4 ${isLarge ? 'max-w-4xl' : ''}`}>
                       <div className="flex items-center gap-6 mb-6">
                          {exp.resortName && (
                            <Link to={`/stays/${exp.resortSlug}`} className="flex items-center gap-2 text-[9px] font-black text-sky-500 uppercase tracking-widest hover:text-slate-950 dark:hover:text-white transition-colors">
                               <MapPin size={12} />
                               <span>{exp.resortName}</span>
                            </Link>
                          )}
                          <div className="h-px w-8 bg-slate-200 dark:bg-white/10"></div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bespoke Journey</span>
                       </div>
                       
                       <h3 className={`${isLarge ? 'text-4xl md:text-6xl' : 'text-3xl'} font-serif font-bold text-slate-950 dark:text-white mb-8 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors tracking-tight leading-tight`}>
                         {exp.title}
                       </h3>
                       
                       <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-12 opacity-85 line-clamp-3">
                         {exp.description}
                       </p>

                       {/* Experience Packages */}
                       {exp.packages && exp.packages.length > 0 && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                           {exp.packages.map((pkg, pIdx) => (
                             <div key={pIdx} className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-3xl p-8 hover:border-sky-500/30 transition-all">
                               <div className="flex justify-between items-start mb-6">
                                 <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{pkg.name}</h4>
                                 <span className="text-sky-500 font-black text-[10px]">{pkg.price}</span>
                               </div>
                               <ul className="space-y-3">
                                 {pkg.features.map((feat, fIdx) => (
                                   <li key={fIdx} className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                     <Check size={10} className="text-emerald-500" />
                                     {feat}
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           ))}
                         </div>
                       )}

                       <div className="flex items-center gap-12">
                          <button 
                            onClick={() => setSelectedExperience(exp)}
                            className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white group/btn"
                          >
                             <span className="border-b border-transparent group-hover/btn:border-slate-900 dark:group-hover/btn:border-white pb-1 transition-all">Initiate Discovery</span>
                             <ArrowRight size={16} className="transform group-hover/btn:translate-x-2 transition-transform" />
                          </button>
                          <Link to={`/experiences/${exp.slug}`} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-slate-950 dark:hover:text-white transition-colors">
                             View Details
                          </Link>
                       </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-8 pt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-16 h-16 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="flex items-center gap-4">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-12 h-12 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === i + 1 ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-16 h-16 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}

            {/* 2. LOGISTICS SECTION */}
            <section className="reveal bg-white dark:bg-slate-900 rounded-[4rem] p-12 md:p-24 lg:p-32 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
                  <Sparkles className="w-full h-full" />
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
                  <div>
                     <span className="text-[10px] font-black text-sky-500 uppercase tracking-[1em] mb-12 block">Private Transit</span>
                     <h3 className="text-5xl md:text-7xl font-serif font-bold text-slate-950 dark:text-white mb-12 leading-tight">Elevated Arrivals.</h3>
                     <p className="text-slate-500 dark:text-slate-400 text-lg leading-[2] mb-16 opacity-90">
                        From chartered seaplanes to luxury yacht transfers and private jet handling at Velana International. We manage the mechanics of your arrival so you can remain in the moment.
                     </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          { icon: <Calendar size={16} />, title: 'VIP Handling', desc: 'Seamless terminal access' },
                          { icon: <Sparkles size={16} />, title: 'Yacht Charter', desc: 'Private atoll voyaging' }
                        ].map((item, i) => (
                          <div key={i} className="flex gap-6">
                             <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sky-500 flex-shrink-0">
                                {item.icon}
                             </div>
                             <div>
                                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">{item.title}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                     <img src="https://media.cntravellerme.com/photos/688772d2218e21363710fbbb/master/w_1600%2Cc_limit/GwilhTwa8AA9RnU.jpeg" alt="Private Seaplane" className="w-full h-full object-cover" />
                  </div>
               </div>
            </section>

            {/* 3. LATEST STORIES (BLOG SECTION) */}
            <section className="reveal">
               <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                  <div className="max-w-2xl">
                     <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-8 block">The Archives</span>
                     <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter">Latest Stories.</h3>
                  </div>
                  <Link to="/stories" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-slate-950 dark:hover:text-white transition-colors border-b border-slate-100 dark:border-white/5 pb-2">
                     View All Dispatches
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {stories.map((story) => (
                    <Link key={story.id} to={`/stories/${story.slug}`} className="group flex flex-col">
                       <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                          <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105" />
                       </div>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 block">{story.category} • {new Date(story.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                       <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-4 group-hover:text-sky-500 transition-colors leading-tight">{story.title}</h4>
                       <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-relaxed line-clamp-2 opacity-80">
                          {story.excerpt}
                       </p>
                    </Link>
                  ))}
               </div>
            </section>
          </div>
        ) : (
          <div className="py-40 text-center reveal active">
             <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6">No archives found.</h3>
             <button onClick={() => setActiveCategory('All')} className="text-sky-500 dark:text-sky-400 font-black uppercase tracking-[0.4em] text-[10px] border-b border-sky-100 dark:border-sky-900 pb-2">Reset Filter</button>
          </div>
        )}
      </main>

      {/* CTA Footer */}
      <section className="py-48 bg-slate-950 text-white relative overflow-hidden text-center">
         <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center pointer-events-none">
            <h2 className="text-[40vw] font-serif whitespace-nowrap">Vision</h2>
         </div>
         <div className="max-w-4xl mx-auto px-6 relative z-10 reveal">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[1em] mb-12 block">Bespoke Curation</span>
            <h3 className="text-6xl md:text-9xl font-serif font-bold mb-16 tracking-tighter">Your Journey <br /> Starts Here.</h3>
            <Link to="/plan" className="inline-block bg-white text-slate-950 font-black px-16 py-7 rounded-full hover:bg-sky-500 dark:hover:bg-sky-400 transition-all duration-700 uppercase tracking-[0.5em] text-[10px] shadow-2xl">
               Consult An Expert
            </Link>
         </div>
      </section>

      <AnimatePresence>
        {selectedExperience && (
          <ExperienceInquiryForm 
            experience={selectedExperience} 
            onClose={() => setSelectedExperience(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Experiences;
