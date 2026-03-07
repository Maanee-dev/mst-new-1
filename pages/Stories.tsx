
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { supabase } from '../lib/supabase';
import { BlogPost, StoryCategory } from '../types';
import { BLOG_POSTS } from '../constants';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Stories: React.FC = () => {
  const [stories, setStories] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<StoryCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const gridRef = React.useRef<HTMLDivElement>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Fits the varied grid pattern perfectly

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('stories')
          .select('*')
          .order('date', { ascending: false });
        
        if (data && data.length > 0) {
          setStories(data as BlogPost[]);
        } else {
          setStories(BLOG_POSTS as BlogPost[]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setStories(BLOG_POSTS as BlogPost[]);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const featuredStories = useMemo(() => {
    return stories.filter(s => s.is_featured).length > 0 
      ? stories.filter(s => s.is_featured)
      : stories.slice(0, 3);
  }, [stories]);

  useEffect(() => {
    if (featuredStories.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % featuredStories.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredStories]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [stories, activeCategory, searchQuery, currentPage]);

  const handleCategoryChange = (cat: StoryCategory | 'All') => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const categories: (StoryCategory | 'All')[] = ['All', 'Dispatch', 'Guide', 'Update', 'Tip'];

  const filteredStories = useMemo(() => {
    let list = stories;

    if (activeCategory !== 'All') {
      list = list.filter(post => post.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const fuse = new Fuse(list, {
        keys: ['title', 'excerpt', 'category'],
        threshold: 0.35,
      });
      list = fuse.search(searchQuery).map(r => r.item);
    }

    return list;
  }, [stories, activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredStories.length / itemsPerPage);
  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStories.slice(start, start + itemsPerPage);
  }, [filteredStories, currentPage]);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    if (gridRef.current) {
      const offset = gridRef.current.offsetTop - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen transition-colors duration-700">
      <SEO 
        title="The Serenity Journal | Maldivian Travel Insights & Stories" 
        description="A dynamic editorial archive of Maldivian heritage, luxury insights, and travel intelligence. Read our dispatches on seaplane arrivals, atoll guides, and bespoke luxury updates."
        keywords={[
          'Maldives travel blog', 'Maldives travel stories', 'luxury travel insights Maldives',
          'Maldives heritage', 'atoll guides Maldives', 'Maldives travel tips',
          'seaplane arrivals Maldives', 'Maldives luxury updates', 'Maldives vacation guide',
          'Maldives serenity travels journal'
        ]}
      />

      {/* Rotating Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          {featuredStories.length > 0 && (
            <motion.div
              key={featuredStories[currentHeroIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <img 
                src={featuredStories[currentHeroIndex].image} 
                className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom" 
                alt={featuredStories[currentHeroIndex].title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <div className="max-w-5xl text-center">
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-[10px] font-black text-sky-400 uppercase tracking-[1em] mb-8 block"
                  >
                    Featured {featuredStories[currentHeroIndex].category}
                  </motion.span>
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white tracking-tighter leading-none mb-12"
                  >
                    {featuredStories[currentHeroIndex].title.split(' ').length > 7 
                      ? featuredStories[currentHeroIndex].title.split(' ').slice(0, 7).join(' ') + '...'
                      : featuredStories[currentHeroIndex].title}
                  </motion.h1>
                  <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 1 }}
                    className="h-px w-24 bg-amber-400 mx-auto mb-12 origin-center"
                  ></motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <Link 
                      to={`/stories/${featuredStories[currentHeroIndex].slug}`}
                      className="inline-block bg-white text-slate-950 font-black px-12 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] hover:bg-sky-500 hover:text-white transition-all shadow-2xl"
                    >
                      Read Dispatch
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Navigation */}
        {featuredStories.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8">
            <button 
              onClick={() => setCurrentHeroIndex((prev) => (prev - 1 + featuredStories.length) % featuredStories.length)}
              className="p-4 rounded-full border border-white/10 text-white hover:bg-white hover:text-slate-950 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-3">
              {featuredStories.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentHeroIndex(i)}
                  className={`h-1 transition-all duration-500 rounded-full ${currentHeroIndex === i ? 'w-12 bg-sky-500' : 'w-4 bg-white/20'}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setCurrentHeroIndex((prev) => (prev + 1) % featuredStories.length)}
              className="p-4 rounded-full border border-white/10 text-white hover:bg-white hover:text-slate-950 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 lg:px-12">
        
        {/* Filter & Search Bar */}
        <div ref={gridRef} className="mb-24 flex flex-col md:flex-row justify-between items-center gap-12 border-b border-slate-100 dark:border-white/5 pb-12 reveal transition-colors">
          <div className="flex flex-wrap justify-center gap-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-all pb-2 border-b-2 ${activeCategory === cat ? 'border-sky-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {cat}s
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              placeholder="SEARCH ARCHIVES..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 text-[16px] md:text-[10px] font-bold uppercase tracking-widest outline-none focus:border-slate-950 dark:focus:border-white text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-40 text-center reveal active">
             <div className="w-10 h-10 border-2 border-slate-100 dark:border-white/5 border-t-sky-500 rounded-full animate-spin mx-auto mb-8"></div>
             <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Accessing records...</p>
          </div>
        ) : paginatedStories.length > 0 ? (
          <>
            {/* Stories Grid with Varied Widths */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {paginatedStories.map((post, idx) => {
                // Varied width logic: 
                // idx 0 is large (2 cols on lg)
                // idx 3 is large (2 cols on lg)
                const isLarge = idx === 0 || idx === 4;
                
                return (
                  <Link 
                    key={post.id} 
                    to={`/stories/${post.slug}`} 
                    className={`group flex flex-col reveal ${isLarge ? 'lg:col-span-2' : ''}`}
                    style={{ transitionDelay: `${(idx % itemsPerPage) * 100}ms` }}
                  >
                    <div className={`relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] shadow-sm group-hover:shadow-2xl transition-all duration-1000 ${isLarge ? 'aspect-[16/9]' : 'aspect-[4/5]'} mb-8 bg-slate-100 dark:bg-slate-900`}>
                       <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-[4s] ease-out group-hover:scale-105" />
                       <div className="absolute top-6 left-6">
                          <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-1.5 rounded-full text-[8px] font-bold text-slate-900 dark:text-white uppercase tracking-widest shadow-sm transition-colors border dark:border-white/5">
                             {post.category}
                          </span>
                       </div>
                    </div>
                    <div className={isLarge ? 'max-w-2xl' : ''}>
                      <span className="text-slate-500 dark:text-slate-600 font-bold text-[8px] uppercase tracking-[0.4em] mb-4 block">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <h2 className={`${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'} font-serif font-bold text-slate-900 dark:text-white mb-4 transition-all duration-500 leading-tight transition-colors`}>
                        {post.title}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium opacity-90 line-clamp-2 transition-colors">
                        {post.excerpt}
                      </p>
                      <div className="mt-6 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Read Story</span>
                        <div className="h-px w-8 bg-slate-900 dark:bg-white"></div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Architecture */}
            {totalPages > 1 && (
              <div className="mt-32 flex justify-center items-center gap-4">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-950 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all disabled:opacity-20"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-12 h-12 rounded-full text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-950 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all disabled:opacity-20"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-40 text-center reveal active">
             <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6 transition-colors">No archives found.</h3>
             <button onClick={() => {setActiveCategory('All'); setSearchQuery('');}} className="text-sky-500 dark:text-sky-400 font-bold uppercase tracking-widest text-[10px] border-b border-sky-200 dark:border-sky-800 transition-colors">Reset Filters</button>
          </div>
        )}
      </div>

      <section className="py-48 bg-white dark:bg-slate-950 border-t border-slate-50 dark:border-white/5 transition-colors duration-700">
         <div className="max-w-4xl mx-auto px-6 text-center reveal">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-950 dark:text-white mb-12 transition-colors">The Archives</h2>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-[0.5em] mb-20 leading-loose transition-colors">
               Access our full collection of Maldivian dispatches <br className="hidden md:block"/> and photographic journals.
            </p>
            <div className="flex flex-wrap justify-center gap-10">
               {['Aesthetics', 'Heritage', 'Sustainability', 'Cuisine'].map(tag => (
                 <button key={tag} className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-[0.4em] hover:text-slate-950 dark:hover:text-white transition-colors border-b border-transparent hover:border-slate-950 dark:hover:border-white pb-2">
                   {tag}
                 </button>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Stories;
