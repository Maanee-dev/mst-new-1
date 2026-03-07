import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase, mapResort } from '../lib/supabase';
import { Accommodation, BlogPost } from '../types';
import { BLOG_POSTS, RESORTS } from '../constants';
import ResortCard from '../components/ResortCard';
import SEO from '../components/SEO';
import InstagramFeed from '../components/InstagramFeed';
import { useBag } from '../context/BagContext';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setDiscoveryMode } = useBag();
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [featuredResorts, setFeaturedResorts] = useState<Accommodation[]>([]);
  const [recentStories, setRecentStories] = useState<BlogPost[]>([]);
  const [activeVibe, setActiveVibe] = useState<'Adventure' | 'Quiet' | 'Family' | 'Romance'>('Quiet');

  const typingIdx = useRef(0);
  const charIdx = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: resortsData, error: resortError } = await supabase
          .from('resorts')
          .select('*')
          .limit(6);
        
        if (resortError) throw resortError;
        if (resortsData && resortsData.length > 0) {
          setFeaturedResorts(resortsData.map(mapResort));
        } else {
          setFeaturedResorts(RESORTS.slice(0, 6));
        }

        const { data: storiesData, error: storyError } = await supabase
          .from('stories')
          .select('*')
          .order('date', { ascending: false })
          .limit(3);

        if (storyError) throw storyError;
        if (storiesData && storiesData.length > 0) {
          setRecentStories(storiesData as BlogPost[]);
        } else {
          setRecentStories(BLOG_POSTS.slice(0, 3) as BlogPost[]);
        }
      } catch (err) {
        console.error("Supabase connection error:", err);
        setFeaturedResorts(RESORTS.slice(0, 6));
        setRecentStories(BLOG_POSTS.slice(0, 3) as BlogPost[]);
      }
    };
    fetchData();
  }, []);

  const heroSlides = [
    {
      type: 'video',
      src: 'https://maldives-serenitytravels.com/images/Villa Resorts - Brand Video - Reel 2 - 1080 x 1920.mp4',
      title: t('hero.title1'),
      titleAlt: t('hero.title1Alt'),
      subtitle: t('hero.subtitle1')
    },
    {
      type: 'image',
      src: 'https://maldives-serenitytravels.com/images/hero-image2',
      title: t('hero.title2'),
      titleAlt: t('hero.title2Alt'),
      subtitle: t('hero.subtitle2')
    },
    {
      type: 'image',
      src: 'https://maldives-serenitytravels.com/images/hero-image-11.png',
      title: t('hero.title3'),
      titleAlt: t('hero.title3Alt'),
      subtitle: t('hero.subtitle3')
    }
  ];

  const searchKeywords = [
    t('hero.searchPlaceholder'),
    t('hero.keyword1', "Beach Resorts..."), 
    t('hero.keyword2', "Honeymoon Hotels..."), 
    t('hero.keyword3', "Best Family Stays..."), 
    t('hero.keyword4', "North Male Atoll..."), 
    t('hero.keyword5', "Cheap Deals...")
  ];

  useEffect(() => {
    let timer: number;
    const handleTyping = () => {
      const currentWord = searchKeywords[typingIdx.current];
      if (isDeleting.current) {
        setTypedPlaceholder(currentWord.substring(0, charIdx.current - 1));
        charIdx.current--;
      } else {
        setTypedPlaceholder(currentWord.substring(0, charIdx.current + 1));
        charIdx.current++;
      }
      let typingSpeed = isDeleting.current ? 40 : 120;
      if (!isDeleting.current && charIdx.current === currentWord.length) {
        isDeleting.current = true;
        typingSpeed = 2000;
      } else if (isDeleting.current && charIdx.current === 0) {
        isDeleting.current = false;
        typingIdx.current = (typingIdx.current + 1) % searchKeywords.length;
        typingSpeed = 500;
      }
      timer = window.setTimeout(handleTyping, typingSpeed);
    };
    timer = window.setTimeout(handleTyping, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [featuredResorts, recentStories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const vibes = [
    { name: 'Quiet', label: t('vibe.quietName'), desc: t('vibe.quietDesc'), color: 'bg-sky-50 dark:bg-sky-950/20', icon: '🌊' },
    { name: 'Adventure', label: t('vibe.adventureName'), desc: t('vibe.adventureDesc'), color: 'bg-amber-50 dark:bg-amber-950/20', icon: '🐋' },
    { name: 'Family', label: t('vibe.familyName'), desc: t('vibe.familyDesc'), color: 'bg-emerald-50 dark:bg-emerald-950/20', icon: '👨‍👩‍👧‍👦' },
    { name: 'Romance', label: t('vibe.romanceName'), desc: t('vibe.romanceDesc'), color: 'bg-rose-50 dark:bg-rose-950/20', icon: '🌅' }
  ];

  return (
    <div className="bg-parchment dark:bg-slate-950 selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      <SEO 
        title={t('seo.homeTitle')} 
        description={t('seo.homeDesc')}
        isOrganization={true}
        keywords={[
          'Maldives luxury travel', 'best resorts Maldives', 'Maldives holiday packages', 
          'overwater villas Maldives', 'Maldives honeymoon', 'private island resorts',
          'Maldives travel agency', 'luxury travel Maldives', 'bespoke Maldives escapes',
          'Addu City travel', 'Southern atolls Maldives', 'Maldives vacation planning'
        ]}
      />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, idx) => (
            <div key={idx} className={`absolute inset-0 transition-all duration-[3000ms] ease-out ${heroIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
              {slide.type === 'video' ? (
                <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-60">
                  <source src={slide.src} type="video/mp4" />
                  <track kind="captions" src={undefined} label="No captions" />
                </video>
              ) : (
                <div className="w-full h-full bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${slide.src})` }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>
          ))}
        </div>
        <div className="relative z-10 w-full max-w-[1600px] px-6 sm:px-12 md:px-16 lg:px-20">
          <div className="flex flex-col items-start text-left">
            <span className="text-[11px] font-bold uppercase tracking-[1em] text-sky-400 mb-8 block reveal active">{heroSlides[heroIndex].subtitle}</span>
            <div className="mb-16 reveal active">
               <h1 className="sr-only">Maldives Serenity Travels</h1>
               <div className="flex flex-col">
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem] font-serif font-medium text-white leading-none tracking-tighter">{heroSlides[heroIndex].title}</span>
                <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[13rem] font-serif font-medium text-white leading-[0.8] tracking-tighter opacity-90">{heroSlides[heroIndex].titleAlt}<span className="text-sky-500">.</span></span>
               </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl reveal active delay-500 scroll-mt-32">
              <form onSubmit={handleSearch} className="flex-1 w-full">
                <div className="relative group">
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder={typedPlaceholder} 
                    className="w-full bg-white/5 backdrop-blur-3xl border border-white/20 rounded-full pl-10 pr-24 py-6 text-white text-[12px] md:text-[14px] font-bold uppercase tracking-[0.4em] outline-none focus:bg-white focus:text-slate-950 dark:focus:text-slate-900 placeholder:text-white/30 shadow-2xl transition-all" 
                  />
                  <button type="submit" aria-label="Search" className="absolute right-2 top-2 bottom-2 bg-slate-950 text-white w-16 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all shadow-xl"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Resort Logos Marquee */}
      <section className="py-12 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 mb-8">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.8em] block text-center">Our Prestigious Partners</span>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="flex animate-marquee whitespace-nowrap items-center gap-16 md:gap-32 px-12">
            {[
    { name: "Soneva", logo: "https://upload.wikimedia.org/wikipedia/id/1/1e/Soneva_logo.png" },
              { name: "Gili Lankanfushi", logo: "https://online.fliphtml5.com/dseh/accountlogo.png" },
              { name: "Joali", logo: "https://assets.planespotters.net/files/airlines/3/joali-maldives_c9c097_opr.png" },
              { name: "Waldorf Astoria", logo: "https://www.hilton.com/modules/assets/svgs/logos/WA.svg" },
              { name: "Four Seasons", logo: "https://cdn.brandfetch.io/idNTtNfigd/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" },
              { name: "St. Regis", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/St._Regis_Hotels_%26_Resorts_logo.svg/960px-St._Regis_Hotels_%26_Resorts_logo.svg.png?_=20181030042916" },
              { name: "Six Senses", logo: "https://consent.trustarc.com/get?name=SS_BRAND_standard_logo.png" },
              { name: "Ritz-Carlton", logo: "https://cdn.brandfetch.io/idpw9SCyJ0/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" }
            ].map((resort, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <img 
                  src={resort.logo} 
                  alt={`${resort.name} Logo`} 
                  className="h-8 md:h-12 w-auto grayscale brightness-0 dark:invert opacity-40 transition-all duration-700 object-contain max-w-[120px] md:max-w-[180px] group-hover:grayscale-0 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const span = document.createElement('span');
                    span.className = "text-xl md:text-3xl font-serif font-bold text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em] group-hover:text-sky-500 transition-colors duration-500";
                    span.innerText = resort.name;
                    target.parentElement?.prepend(span);
                  }}
                />
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
    { name: "Soneva", logo: "https://upload.wikimedia.org/wikipedia/id/1/1e/Soneva_logo.png" },
              { name: "Gili Lankanfushi", logo: "https://online.fliphtml5.com/dseh/accountlogo.png" },
              { name: "Joali", logo: "https://assets.planespotters.net/files/airlines/3/joali-maldives_c9c097_opr.png" },
              { name: "Waldorf Astoria", logo: "https://www.hilton.com/modules/assets/svgs/logos/WA.svg" },
              { name: "Four Seasons", logo: "https://cdn.brandfetch.io/idNTtNfigd/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" },
              { name: "St. Regis", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/St._Regis_Hotels_%26_Resorts_logo.svg/960px-St._Regis_Hotels_%26_Resorts_logo.svg.png?_=20181030042916" },
              { name: "Six Senses", logo: "https://consent.trustarc.com/get?name=SS_BRAND_standard_logo.png" },
              { name: "Ritz-Carlton", logo: "https://cdn.brandfetch.io/idpw9SCyJ0/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" }
            ].map((resort, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-4 group cursor-default">
                <img 
                  src={resort.logo} 
                  alt={`${resort.name} Logo`} 
                  className="h-8 md:h-12 w-auto grayscale brightness-0 dark:invert opacity-40 transition-all duration-700 object-contain max-w-[120px] md:max-w-[180px] group-hover:grayscale-0 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const span = document.createElement('span');
                    span.className = "text-xl md:text-3xl font-serif font-bold text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em] group-hover:text-sky-500 transition-colors duration-500";
                    span.innerText = resort.name;
                    target.parentElement?.prepend(span);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 lg:py-48 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">
            <div className="lg:w-1/2 relative order-2 lg:order-1 reveal">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl z-10 group bg-slate-100 dark:bg-slate-900">
                <img 
                  src="https://maldives-serenitytravels.com/images/Screenshot 2026-02-23 at 00.17.04.png" 
                  className="w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110" 
                  alt="Beautiful Maldives" 
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="absolute -bottom-10 -right-4 md:-bottom-16 md:-right-16 bg-parchment dark:bg-slate-900 p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl z-20 max-w-[280px] md:max-w-[380px] border border-slate-50 dark:border-white/5 reveal delay-500">
                <p className="text-slate-900 dark:text-white font-serif text-xl md:text-3xl leading-[1.4]">"{t('philosophy.quote')}"</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-8 h-px bg-sky-500"></div>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{t('philosophy.quoteAuthor')}</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2 reveal">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-12 h-[1px] bg-sky-500"></div>
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[1.2em]">{t('philosophy.badge')}</span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif font-medium text-slate-950 dark:text-white leading-[0.95] mb-12 tracking-tighter">
                {t('philosophy.title')}
              </h2>
              <div className="max-w-xl">
                <p className="text-slate-600 dark:text-slate-300 text-lg md:text-2xl leading-[1.7] mb-12 font-medium opacity-90">
                  {t('philosophy.subtitle')}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-[1.8] mb-12">
                  {t('philosophy.description')}
                </p>
                <Link to="/about" className="inline-flex items-center gap-6 text-[10px] font-bold text-slate-950 dark:text-white uppercase tracking-[0.5em] group transition-all">
                  <span className="border-b-2 border-slate-100 dark:border-white/10 pb-1 group-hover:border-sky-500 transition-colors">{t('readStory')}</span>
                  <div className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-slate-950 dark:group-hover:bg-white transition-all duration-700">
                    <svg className="w-5 h-5 text-slate-950 dark:text-white group-hover:text-white dark:group-hover:text-slate-950 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIBE FINDER SECTION */}
      <section className="py-24 md:py-32 lg:py-48 bg-parchment dark:bg-slate-900/50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 text-center mb-24 reveal">
           <span className="text-sky-500 font-bold uppercase tracking-[1em] text-[10px] mb-8 block">{t('vibe.badge')}</span>
           <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-slate-950 dark:text-white tracking-tighter">{t('vibe.title')}</h2>
        </div>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 reveal">
          {vibes.map((v) => (
            <button 
              key={v.name}
              onClick={() => setActiveVibe(v.name as any)}
              className={`p-10 rounded-[3rem] text-center transition-all duration-700 border-2 ${activeVibe === v.name ? 'bg-white dark:bg-slate-800 border-sky-500 shadow-2xl scale-105' : 'bg-slate-50 dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-white/5'}`}
            >
              <div className="text-4xl mb-6">{v.icon}</div>
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white mb-4">{v.label}</h3>
              <p className={`text-[10px] font-bold uppercase tracking-widest leading-loose ${activeVibe === v.name ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                {v.desc}
              </p>
            </button>
          ))}
        </div>
        <div className="text-center reveal">
           <Link to={`/search?q=${activeVibe}`} className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold px-16 py-7 rounded-full text-[11px] uppercase tracking-[0.8em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all duration-700 shadow-2xl">
             {t('vibe.exploreBtn')} {t(`vibe.${activeVibe.toLowerCase()}Name`)}
           </Link>
        </div>
      </section>

      {/* THE COLLECTION */}
      <section className="py-24 md:py-32 lg:py-48 bg-white dark:bg-slate-950 overflow-hidden border-b border-slate-50 dark:border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="mb-20 md:mb-32 reveal flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="max-w-xl text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[1.2em] mb-8 block">{t('collection.badge')}</span>
              <h3 className="text-4xl md:text-7xl lg:text-8xl font-serif font-medium text-slate-900 dark:text-white tracking-tighter leading-none">{t('collection.title')}</h3>
              <p className="mt-12 text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold tracking-[0.4em] leading-loose">
                 {t('collection.description')}
              </p>
            </div>
            <div className="w-24 h-[1px] bg-amber-400 mb-4 hidden md:block"></div>
          </div>
          <div className="reveal no-scrollbar overflow-x-auto flex gap-8 md:gap-16 pb-12 snap-x snap-mandatory">
            {featuredResorts.map((resort) => (
              <div key={resort.id} className="flex-shrink-0 w-[85vw] sm:w-[55vw] lg:w-[35vw] snap-start">
                <ResortCard resort={resort} />
              </div>
            ))}
            <div className="flex-shrink-0 w-[85vw] sm:w-[55vw] lg:w-[35vw] snap-start flex items-center justify-center">
              <Link to="/stays" className="group w-full aspect-[4/5] rounded-[3rem] bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-white/5 flex flex-col items-center justify-center p-12 text-center hover:bg-slate-950 dark:hover:bg-white transition-all duration-1000">
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-sky-400 uppercase tracking-[1em] mb-8 block">{t('seeAll')}</span>
                <h4 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white dark:group-hover:text-slate-950 group-hover:text-white leading-tight">{t('collection.findVilla')}</h4>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* THE JOURNAL - LATEST STORIES */}
      <section className="py-24 md:py-32 lg:py-48 bg-parchment dark:bg-slate-900/30">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="text-center mb-24 reveal">
            <span className="text-sky-500 font-bold uppercase tracking-[1em] text-[10px] mb-8 block">{t('journal.badge')}</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-slate-950 dark:text-white tracking-tighter">{t('journal.title')}</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-24">
            {recentStories.map((post, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;
              const isThird = idx === 2;

              return (
                <Link 
                  key={post.id} 
                  to={`/stories/${post.slug}`} 
                  className={`group reveal relative flex flex-col ${
                    isFirst ? 'lg:col-span-8' : 
                    isSecond ? 'lg:col-span-4' : 
                    'lg:col-span-12 lg:flex-row lg:items-center lg:gap-16'
                  }`}
                >
                  <div className={`relative rounded-[2.5rem] overflow-hidden mb-8 shadow-sm transition-all duration-1000 group-hover:shadow-2xl group-hover:-translate-y-2 bg-slate-100 dark:bg-slate-800 w-full ${
                    isFirst ? 'aspect-[16/9]' : 
                    isSecond ? 'aspect-[3/4]' : 
                    'aspect-[16/9] lg:aspect-[21/9] lg:w-3/5 lg:mb-0'
                  }`}>
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105" />
                    <div className="absolute top-8 left-8">
                      <span className="bg-white/95 backdrop-blur-md px-5 py-2 rounded-full text-[9px] font-bold text-slate-900 uppercase tracking-[0.4em] shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className={`px-4 ${isThird ? 'lg:flex-1 lg:px-0' : ''}`}>
                    <span className="text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-[0.4em] mb-4 block">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <h3 className={`font-serif font-bold text-slate-900 dark:text-white mb-6 group-hover:text-sky-600 transition-colors leading-tight ${
                      isFirst ? 'text-3xl md:text-4xl' : 
                      isSecond ? 'text-2xl' : 
                      'text-3xl md:text-5xl lg:text-6xl'
                    }`}>
                      {post.title}
                    </h3>
                    {isThird && (
                      <p className="hidden lg:block text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-xl leading-relaxed">
                        {post.excerpt || 'Discover the hidden gems and untold stories of the Maldivian archipelago through our curated lens.'}
                      </p>
                    )}
                    <div className="h-px w-12 bg-slate-200 dark:bg-white/10 group-hover:w-full group-hover:bg-sky-500 transition-all duration-1000"></div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center reveal">
            <Link to="/stories" className="inline-flex items-center gap-6 text-[10px] font-bold text-slate-950 dark:text-white uppercase tracking-[0.5em] group transition-all">
              <span className="border-b-2 border-slate-100 dark:border-white/10 pb-1 group-hover:border-sky-500 transition-colors">{t('readMore')}</span>
              <div className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-slate-950 dark:group-hover:bg-white transition-all duration-700">
                <svg className="w-5 h-5 text-slate-950 dark:text-white group-hover:text-white dark:group-hover:text-slate-950 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* FINAL CTA */}
      <section className="py-24 md:py-32 lg:py-48 bg-slate-950 relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center pointer-events-none">
          <h2 className="text-[35vw] font-serif whitespace-nowrap -rotate-12 translate-y-1/2"></h2>
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 reveal">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[1.5em] mb-12 block">{t('hero.readyBadge', 'Ready for a Holiday?')}</span>
          <h3 className="text-5xl md:text-7xl lg:text-9xl font-serif font-medium mb-16 tracking-tighter">{t('startJourney')}.</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <Link to="/plan" className="w-full md:w-auto bg-white text-slate-950 font-bold px-16 py-7 rounded-full hover:bg-sky-400 hover:text-white transition-all duration-700 uppercase tracking-[0.5em] text-[11px] shadow-2xl">
              {t('contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;