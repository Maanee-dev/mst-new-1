
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { supabase, mapOffer } from '../lib/supabase';
import { RESORTS, OFFERS, EXPERIENCES } from '../constants';
import { Accommodation, AccommodationType, TransferType, MealPlan, Offer, Experience } from '../types';
import ResortCard from '../components/ResortCard';
import SEO from '../components/SEO';
import ExperienceInquiryForm from '../components/ExperienceInquiryForm';
import { AnimatePresence } from 'motion/react';
import { ArrowRight, Plus, Check } from 'lucide-react';
import { useBag } from '../context/BagContext';

const INQUIRY_STORAGE_KEY = 'serenity_inquiry_draft';

const COUNTRIES = [
  { name: 'United Kingdom', code: '+44' },
  { name: 'United States', code: '+1' },
  { name: 'United Arab Emirates', code: '+971' },
  { name: 'Germany', code: '+49' },
  { name: 'Russia', code: '+7' },
  { name: 'India', code: '+91' },
  { name: 'China', code: '+86' },
  { name: 'Italy', code: '+39' },
  { name: 'France', code: '+33' },
  { name: 'Switzerland', code: '+41' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'Australia', code: '+61' },
  { name: 'Maldives', code: '+960' }
].sort((a, b) => a.name.localeCompare(b.name));

interface ResortFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const ResortDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [resort, setResort] = useState<Accommodation | null>(null);
  const [allResorts, setAllResorts] = useState<Accommodation[]>([]);
  const [resortOffers, setResortOffers] = useState<Offer[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [faqs, setFaqs] = useState<ResortFAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  
  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteData, setQuoteData] = useState({
    checkIn: '',
    checkOut: '',
    roomType: '',
    mealPlan: '',
    customerName: '',
    customerEmail: '',
    country: 'United Kingdom',
    countryCode: '+44',
    customerPhone: '',
    notes: ''
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { addItem, isInBag } = useBag();

  useEffect(() => {
    const saved = localStorage.getItem(INQUIRY_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQuoteData(prev => ({
          ...prev,
          customerName: parsed.customerName || '',
          customerEmail: parsed.customerEmail || '',
          customerPhone: parsed.customerPhone || '',
          country: parsed.country || 'United Kingdom',
          countryCode: parsed.countryCode || '+44'
        }));
      } catch (e) {
        console.error("Failed to load inquiry draft:", e);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      customerName: quoteData.customerName,
      customerEmail: quoteData.customerEmail,
      customerPhone: quoteData.customerPhone,
      country: quoteData.country,
      countryCode: quoteData.countryCode
    };
    localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [quoteData.customerName, quoteData.customerEmail, quoteData.customerPhone, quoteData.country, quoteData.countryCode]);

  const parseHighlights = (item: any): string[] => {
    if (Array.isArray(item)) return item;
    if (!item || item === '[]') return [];
    try {
      let cleaned = typeof item === 'string' ? item.trim() : item;
      if (typeof cleaned === 'string' && cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
      }
      cleaned = typeof cleaned === 'string' ? cleaned.replace(/""/g, '"') : cleaned;
      const parsed = JSON.parse(cleaned);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      if (typeof item === 'string') {
        return item.split(',').map(s => s.trim().replace(/^["[]+|["\]]+$/g, '')).filter(Boolean);
      }
      return [];
    }
  };

  const similarStays = useMemo(() => {
    if (!resort || allResorts.length === 0) return [];
    const brandName = resort.name.split(' ')[0];
    let matches = allResorts.filter(r => r.slug !== slug && r.name.toLowerCase().includes(brandName.toLowerCase()));
    if (matches.length < 2) {
      const atollMatches = allResorts.filter(r => r.slug !== slug && r.atoll === resort.atoll && !matches.find(m => m.id === r.id));
      matches = [...matches, ...atollMatches];
    }
    if (matches.length < 3) {
      const typeMatches = allResorts.filter(r => r.slug !== slug && r.type === resort.type && !matches.find(m => m.id === r.id));
      matches = [...matches, ...typeMatches];
    }
    return matches.slice(0, 6);
  }, [resort, allResorts, slug]);

  useEffect(() => {
    const fetchFullDetails = async () => {
      setLoading(true);
      try {
        const { data: allData } = await supabase.from('resorts').select('*');
        if (allData) {
           const mapped = allData.map(item => ({ 
             ...item, 
             priceRange: item.price_range,
             transfers: item.transfers || [],
             mealPlans: item.meal_plans || [],
             roomTypes: item.room_types || [],
             diningVenues: item.dining_venues || [],
             images: item.images || []
           })) as unknown as Accommodation[];
           setAllResorts(mapped.length > 0 ? mapped : RESORTS);
        } else {
           setAllResorts(RESORTS);
        }

        const localBackup = RESORTS.find(r => r.slug === slug);
        const { data: resData } = await supabase.from('resorts').select('*').eq('slug', slug).maybeSingle();

        if (resData) {
          const rawRooms = (resData.room_types && resData.room_types.length > 0) ? resData.room_types : (localBackup?.roomTypes || []);
          const rawDining = (resData.dining_venues && resData.dining_venues.length > 0) ? resData.dining_venues : (localBackup?.diningVenues || []);

          const mappedResort: Accommodation = {
            id: resData.id,
            name: resData.name,
            slug: resData.slug,
            type: (resData.type || localBackup?.type || 'RESORT') as AccommodationType,
            atoll: resData.atoll || localBackup?.atoll || 'Unknown Atoll',
            priceRange: resData.price_range || localBackup?.priceRange || '$$$$',
            rating: resData.rating || localBackup?.rating || 5,
            description: resData.description || localBackup?.description || '',
            shortDescription: resData.short_description || localBackup?.shortDescription || '',
            images: (resData.images && resData.images.length > 0) ? resData.images : (localBackup?.images || []),
            features: (resData.features && resData.features.length > 0) ? resData.features : (localBackup?.features || []),
            transfers: (resData.transfers || localBackup?.transfers || []) as TransferType[],
            mealPlans: (resData.meal_plans || localBackup?.mealPlans || []) as MealPlan[],
            uvp: resData.uvp || localBackup?.uvp || 'A sanctuary defined by perspective.',
            isFeatured: resData.is_featured || false,
            roomTypes: rawRooms.map((r: any) => ({
              ...r,
              highlights: parseHighlights(r.highlights)
            })),
            diningVenues: rawDining.map((d: any) => ({
              ...d,
              highlights: parseHighlights(d.highlights)
            }))
          };
          setResort(mappedResort);

          // Fetch Offers
          const { data: offersData } = await supabase.from('offers').select('*').eq('resort_id', resData.id);
          if (offersData && offersData.length > 0) {
            setResortOffers(offersData.map(mapOffer));
          } else {
            const local = OFFERS.filter(o => o.resortId === resData.id || o.resortName === resData.name);
            setResortOffers(local);
          }

          // Fetch Experiences
          const { data: expData } = await supabase
            .from('experiences')
            .select('*, resorts(id, name, slug)')
            .or(`resort_id.eq.${resData.id},atoll.eq.${resData.atoll}`);
            
          if (expData && expData.length > 0) {
            setExperiences(expData.map(item => ({
              ...item,
              resortName: item.resorts?.name,
              resortSlug: item.resorts?.slug,
              resortId: item.resorts?.id
            })) as Experience[]);
          } else {
            const local = EXPERIENCES.filter(e => e.resortId === resData.id);
            setExperiences(local);
          }

          // Fetch FAQs
          const { data: faqData } = await supabase
            .from('resort_faqs')
            .select('*')
            .eq('resort_id', resData.id)
            .order('category', { ascending: true });
          
          if (faqData) setFaqs(faqData);

        } else if (localBackup) {
          setResort(localBackup);
          setResortOffers(OFFERS.filter(o => o.resortId === localBackup.id));
          const localExps = EXPERIENCES.filter(e => e.resortId === localBackup.id);
          setExperiences(localExps);
        }
      } catch (error) {
        console.error('Data acquisition error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!loading && resort) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [loading, resort]);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resort) return;
    setIsSubmitting(true);
    try {
      const fullPhone = `${quoteData.countryCode} ${quoteData.customerPhone}`;
      
      const { error } = await supabase.from('inquiries').insert({
        inquiry_type: 'resort_specific',
        customer_name: quoteData.customerName,
        customer_email: quoteData.customerEmail,
        customer_phone: fullPhone,
        country: quoteData.country,
        resort_id: resort.id,
        resort_name: resort.name,
        check_in: quoteData.checkIn,
        check_out: quoteData.checkOut,
        room_type: quoteData.roomType,
        meal_plan: quoteData.mealPlan,
        notes: quoteData.notes
      });

      if (error) throw error;
      
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      alert('We encountered an error processing your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (formStep === 1 && (!quoteData.customerName || !quoteData.customerEmail || !quoteData.customerPhone)) return;
    if (formStep === 2 && (!quoteData.checkIn || !quoteData.checkOut)) return;
    setFormStep(s => s + 1);
  };

  const prevStep = () => setFormStep(s => s - 1);

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isDateSelected = (date: Date) => {
    if (!date) return false;
    const dStr = date.toISOString().split('T')[0];
    return dStr === quoteData.checkIn || dStr === quoteData.checkOut;
  };

  const isDateInRange = (date: Date) => {
    if (!date || !quoteData.checkIn || !quoteData.checkOut) return false;
    const dStr = date.toISOString().split('T')[0];
    return dStr > quoteData.checkIn && dStr < quoteData.checkOut;
  };

  const handleDateClick = (date: Date) => {
    if (!date) return;
    const dStr = date.toISOString().split('T')[0];
    if (!quoteData.checkIn || (quoteData.checkIn && quoteData.checkOut)) {
      setQuoteData({ ...quoteData, checkIn: dStr, checkOut: '' });
    } else {
      if (dStr < quoteData.checkIn) {
        setQuoteData({ ...quoteData, checkIn: dStr, checkOut: quoteData.checkIn });
      } else {
        setQuoteData({ ...quoteData, checkOut: dStr });
      }
    }
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  if (loading) return (
    <div className="min-h-screen bg-parchment dark:bg-slate-950 flex flex-col items-center justify-center">
       <div className="w-8 h-8 border-[1px] border-slate-200 dark:border-white/10 border-t-sky-500 rounded-full animate-spin mb-8"></div>
       <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Consulting the Atolls...</p>
    </div>
  );

  if (!resort) return <Navigate to="/" replace />;

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen selection:bg-sky-100 selection:text-sky-900 pb-20 overflow-x-hidden transition-colors duration-700">
      <SEO 
        title={`${resort.name} | Luxury Resort ${resort.atoll} Maldives`} 
        description={`${resort.name} in ${resort.atoll} Atoll offers ${resort.shortDescription}. Experience the best overwater villas and private island luxury in the Maldives.`} 
        image={resort.images[0]}
        keywords={[
          resort.name,
          `${resort.name} Maldives`,
          `${resort.name} ${resort.atoll}`,
          `luxury resort ${resort.atoll}`,
          'Maldives overwater villas',
          'Maldives private island',
          `${resort.name} offers`,
          `${resort.name} reviews`,
          'Maldives luxury travel',
          'bespoke Maldives holidays'
        ]}
        type="hotel"
        schema={{
          "@context": "https://schema.org",
          "@type": "Hotel",
          "name": resort.name,
          "description": resort.description,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": resort.atoll,
            "addressCountry": "MV"
          },
          "image": resort.images,
          "starRating": {
            "@type": "Rating",
            "ratingValue": resort.rating
          },
          "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": faqs.map(f => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
              }
            }))
          }
        }}
      />
      
      {/* Cinematic Hero */}
      <section className="relative w-full pt-20 md:pt-28 lg:pt-32 px-4 md:px-6 lg:px-12 reveal active">
        <div className="relative aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] w-full rounded-[2.5rem] md:rounded-[3.5rem] lg:rounded-[4.5rem] overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-900">
          <img src={resort.images[0]} alt={resort.name} className="w-full h-full object-cover transition-transform duration-[15s] ease-out hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12">
             <span className="text-[11px] font-black text-sky-400 uppercase tracking-[0.8em] mb-4 md:mb-8 block reveal">{resort.atoll}</span>
             <h1 className="text-3xl md:text-4xl lg:text-7xl xl:text-[8rem] font-serif font-bold text-white tracking-tighter leading-[1.1] drop-shadow-2xl reveal active delay-300">{resort.name}</h1>
             <div className="flex flex-col md:flex-row items-center gap-6 mt-12 reveal delay-500">
               <button 
                 onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                 className="bg-white text-slate-950 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-sky-500 hover:text-white transition-all duration-700 shadow-2xl"
               >
                 Inquire Now
               </button>
               <button 
                 onClick={() => {
                   if (resort && !isInBag(resort.id)) {
                     addItem({
                       id: resort.id,
                       type: 'resort',
                       name: resort.name,
                       image: resort.images[0],
                       slug: resort.slug,
                       price: resort.priceRange,
                       details: resort.atoll
                     });
                   }
                 }}
                 className={`px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 shadow-2xl flex items-center gap-3 ${isInBag(resort.id) ? 'bg-sky-500 text-white' : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'}`}
               >
                 {isInBag(resort.id) ? (
                   <>
                     <Check size={14} /> Added to Bag
                   </>
                 ) : (
                   <>
                     <Plus size={14} /> Add to Selection
                   </>
                 )}
               </button>
             </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-12 md:py-16 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 lg:gap-32 items-start">
          <div className="lg:col-span-7 reveal">
            <div className="flex items-center gap-6 mb-6 md:mb-8">
              <div className="w-10 h-[1px] bg-sky-500"></div>
              <span className="text-[11px] font-black text-sky-600 uppercase tracking-[0.8em] block">The Manifesto</span>
            </div>
            <p className="text-2xl md:text-2xl lg:text-4xl xl:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-[1.2] tracking-tight mb-8 md:mb-12 transition-colors">
              "{resort.uvp}"
            </p>
            <div className="text-slate-800 dark:text-slate-200 text-base md:text-base lg:text-lg xl:text-xl leading-[1.6] md:leading-[1.8] font-semibold space-y-4 md:space-y-6 max-w-3xl transition-colors">
              <p>{resort.description}</p>
            </div>
          </div>
          <div className="lg:col-span-5 reveal active delay-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 lg:p-12 shadow-sm border-[1px] border-slate-100 dark:border-white/5 transition-colors">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950 dark:text-white mb-6 md:mb-8 border-b-[1px] border-slate-50 dark:border-white/5 pb-4 md:pb-6">Essential Amenities</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                {resort.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-[1.5] transition-transform flex-shrink-0"></div>
                    <span className="text-[10px] md:text-[11px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-[0.2em] transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 md:mt-10 pt-8 border-t-[1px] border-slate-50 dark:border-white/5 grid grid-cols-2 gap-6 md:gap-8">
                <div>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2 block">Arrival</span>
                  <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest leading-relaxed transition-colors">
                    {resort.transfers.map(t => t.replace(/_/g, ' ')).join(' • ')}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2 block">Meal Plan</span>
                  <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest leading-relaxed transition-colors">
                    {resort.mealPlans.map(m => m.replace(/_/g, ' ')).join(' • ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Journey Section */}
      {resort.images && resort.images.length > 0 && (
        <section id="gallery" className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 md:mb-24 reveal">
              <div className="max-w-2xl">
                <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-4 md:mb-8 block">Visual Journey</span>
                <h3 className="text-4xl md:text-5xl lg:text-8xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none transition-colors">The Gallery.</h3>
              </div>
              <div className="flex flex-col items-start md:items-end gap-4">
                <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] max-w-xs leading-loose text-left md:text-right">
                  A curated collection of moments captured across the sanctuary, from dawn to the deep blue.
                </p>
                <div className="flex items-center gap-4 text-[9px] font-black text-sky-500 uppercase tracking-widest">
                   <span>Scroll to explore</span>
                   <div className="w-12 h-px bg-sky-500/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-sky-500 animate-scroll-line"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="flex gap-6 md:gap-10 overflow-x-auto pb-12 px-6 lg:px-12 no-scrollbar snap-x snap-mandatory scroll-smooth">
              {resort.images.map((image, idx) => {
                // Alternate aspect ratios for visual rhythm
                const isWide = idx % 3 === 0;
                const isTall = idx % 4 === 2;
                
                let widthClass = 'w-[75vw] sm:w-[350px] md:w-[450px] lg:w-[500px]';
                let aspectClass = 'aspect-square';
                
                if (isWide) {
                  widthClass = 'w-[85vw] sm:w-[500px] md:w-[700px] lg:w-[850px]';
                  aspectClass = 'aspect-[16/9]';
                } else if (isTall) {
                  widthClass = 'w-[65vw] sm:w-[300px] md:w-[400px] lg:w-[450px]';
                  aspectClass = 'aspect-[3/4]';
                }

                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedImage(image)}
                    className={`reveal flex-shrink-0 group relative overflow-hidden rounded-[2rem] md:rounded-[3.5rem] ${widthClass} ${aspectClass} bg-slate-100 dark:bg-slate-900 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-1000 snap-center md:snap-start`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <img 
                      src={image} 
                      alt={`${resort.name} gallery ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-700"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 md:p-12 animate-in fade-in duration-500"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Fullscreen view" 
              className="max-w-full max-h-full object-contain rounded-[1rem] md:rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Offers Section */}
      {resortOffers.length > 0 && (
        <section className="py-16 md:py-24 bg-amber-50/30 dark:bg-amber-950/10 border-y-[1px] border-amber-100/50 dark:border-amber-900/20 transition-colors">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 reveal">
              <span className="text-[11px] font-black text-amber-500 uppercase tracking-[1em] mb-6 block">Limited Engagements</span>
              <h3 className="text-3xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-tight transition-colors">Bespoke Privileges.</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {resortOffers.map((offer) => (
                <div key={offer.id} className="reveal bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 shadow-xl border border-amber-50 dark:border-white/5 flex flex-col md:flex-row gap-8 md:gap-10 items-center transition-colors">
                   <div className="w-full md:w-1/3 aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img src={offer.image} className="w-full h-full object-cover" alt={offer.title} />
                   </div>
                   <div className="flex-1 w-full text-center md:text-left">
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                         <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{offer.discount}</span>
                         <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{offer.category}</span>
                      </div>
                      <h4 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6">{offer.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mb-8 leading-loose transition-colors">Experience the archipelago with negotiated rates curated for your vision.</p>
                      <button onClick={() => {
                        const form = document.getElementById('inquiry-form');
                        form?.scrollIntoView({ behavior: 'smooth' });
                      }} className="text-[10px] font-black text-slate-950 dark:text-white border-b border-slate-950 dark:border-white pb-1 hover:text-amber-500 hover:border-amber-500 transition-all uppercase tracking-widest">Secure This Offer</button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Residences Section */}
      {resort.roomTypes && resort.roomTypes.length > 0 && (
        <section className="py-16 md:py-32 bg-white dark:bg-slate-950 border-y-[1px] border-slate-50 dark:border-white/5 overflow-hidden transition-colors">
          <div className="max-w-[1440px] mx-auto">
             <div className="px-6 lg:px-12 mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-end gap-6 reveal">
                <div>
                   <span className="text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.8em] mb-4 block">Accommodation</span>
                   <h3 className="text-3xl md:text-3xl lg:text-5xl font-serif font-bold text-slate-950 dark:text-white tracking-tighter transition-colors">The Residences.</h3>
                </div>
                <p className="hidden md:block text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">Slide to explore Portfolio</p>
             </div>
             <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar px-6 lg:px-12 pb-8 snap-x snap-mandatory">
                {resort.roomTypes.map((room, i) => (
                  <div key={i} className="flex-shrink-0 w-[82vw] md:w-[400px] snap-center md:snap-start reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="relative aspect-[16/10] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-6 md:mb-8 group shadow-lg">
                       <img src={room.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={room.name} />
                       <div className="absolute top-4 left-4 md:top-6 md:left-6 flex gap-2">
                          {room.size && <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-sm border dark:border-white/5">{room.size}</span>}
                          {room.capacity && <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-sm border dark:border-white/5">{room.capacity}</span>}
                       </div>
                    </div>
                    <h4 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3 md:mb-4 transition-colors">{room.name}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[13px] leading-relaxed mb-6 font-medium line-clamp-2 transition-colors">{room.description}</p>
                    <div className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3">
                       {room.highlights.map((h, j) => (
                         <div key={j} className="flex items-center gap-3">
                           <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
                           <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 transition-colors">{h}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* Gastronomy Section */}
      {resort.diningVenues && resort.diningVenues.length > 0 && (
        <section className="py-16 md:py-32 bg-parchment dark:bg-slate-900/30 border-b-[1px] border-slate-50 dark:border-white/5 overflow-hidden transition-colors">
          <div className="max-w-[1440px] mx-auto">
              <div className="px-6 lg:px-12 mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-end gap-6 reveal">
                <div>
                  <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-4 block">Gastronomy</span>
                  <h3 className="text-3xl md:text-3xl lg:text-5xl font-serif font-bold text-slate-950 dark:text-white tracking-tighter transition-colors">The Atoll Table.</h3>
                </div>
                <p className="hidden md:block text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">Swipe for Culinary Vibe</p>
              </div>
              <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar px-6 lg:px-12 pb-8 snap-x snap-mandatory">
                 {resort.diningVenues.map((venue, i) => (
                    <div key={i} className="flex-shrink-0 w-[82vw] md:w-[420px] snap-center md:snap-start reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                       <div className="relative aspect-[4/3] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-6 md:mb-8 shadow-lg group bg-slate-100 dark:bg-slate-800">
                          <img src={venue.image} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105" alt={venue.name} />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                             <span className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em]">{venue.cuisine}</span>
                          </div>
                       </div>
                       <div className="px-2">
                          <div className="flex items-center gap-4 mb-4">
                             <span className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-full">{venue.vibe}</span>
                          </div>
                          <h4 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3 md:mb-4 transition-colors">{venue.name}</h4>
                          <p className="text-slate-500 dark:text-slate-400 text-[13px] leading-relaxed mb-6 font-medium line-clamp-2 transition-colors">{venue.description}</p>
                          <div className="space-y-2">
                             {(venue.highlights || []).slice(0, 3).map((h, j) => (
                               <div key={j} className="flex items-center gap-3">
                                 <div className="w-3 md:w-4 h-px bg-slate-200 dark:bg-white/10"></div>
                                 <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">{h}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
          </div>
        </section>
      )}

      {/* Island Experiences Section */}
      {experiences.length > 0 && (
        <section className="py-24 md:py-48 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20 reveal">
              <div className="max-w-2xl">
                <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-8 block">Island Perspective</span>
                <h3 className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none">Curated <br/> Experiences.</h3>
              </div>
              <Link to="/experiences" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-slate-950 dark:hover:text-white transition-colors border-b border-slate-100 dark:border-white/5 pb-2">
                Explore All Journeys
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="reveal group flex flex-col" style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden mb-10 shadow-sm group-hover:shadow-2xl transition-all duration-1000 bg-slate-100 dark:bg-slate-900">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-8 left-8">
                      <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white shadow-lg border border-white/20 dark:border-white/5">
                        {exp.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-4">
                    <h4 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6 group-hover:text-sky-600 transition-colors">{exp.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 line-clamp-2">{exp.description}</p>
                    
                    <div className="flex items-center gap-8">
                      <button 
                        onClick={() => setSelectedExperience(exp)}
                        className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white group/btn"
                      >
                        <span className="border-b border-transparent group-hover/btn:border-slate-900 dark:group-hover/btn:border-white pb-1 transition-all">Request Experience</span>
                        <ArrowRight size={16} className="transform group-hover/btn:translate-x-2 transition-transform" />
                      </button>
                      <Link to={`/experiences/${exp.slug}`} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-slate-950 dark:hover:text-white transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INTELLIGENT INSIGHTS (FAQ SECTION) */}
      {faqs.length > 0 && (
        <section className="py-24 md:py-48 bg-white dark:bg-slate-950 transition-colors">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
             <div className="lg:col-span-4 reveal">
                <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-8 block">Intelligence</span>
                <h3 className="text-4xl md:text-4xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-tight transition-colors">Bespoke <br/> Insights.</h3>
                <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] mt-12 leading-loose transition-colors">Expertly curated answers regarding {resort.name} and the archipelago.</p>
             </div>
             
             <div className="lg:col-span-8 reveal delay-300">
                <div className="space-y-4">
                   {faqs.map((faq) => (
                     <div 
                       key={faq.id} 
                       className={`border-b-[1px] border-slate-100 dark:border-white/5 transition-all duration-700 ${openFaq === faq.id ? 'pb-12' : 'pb-6'}`}
                     >
                        <button 
                          onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                          className="w-full flex justify-between items-center text-left group"
                        >
                           <h4 className={`text-xl md:text-2xl font-serif font-bold transition-all duration-500 ${openFaq === faq.id ? 'text-sky-600 dark:text-sky-400' : 'text-slate-900 dark:text-white group-hover:text-sky-500'}`}>
                             {faq.question}
                           </h4>
                           <div className={`w-10 h-10 rounded-full border border-slate-100 dark:border-white/10 flex items-center justify-center transition-all duration-700 ${openFaq === faq.id ? 'bg-sky-500 border-sky-500 rotate-45' : 'group-hover:border-sky-500'}`}>
                              <svg className={`w-4 h-4 transition-colors ${openFaq === faq.id ? 'text-white' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                           </div>
                        </button>
                        <div className={`grid transition-all duration-700 ease-in-out ${openFaq === faq.id ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                           <div className="overflow-hidden">
                              <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed font-medium transition-colors">
                                {faq.answer}
                              </p>
                              <div className="mt-8">
                                 <span className="text-[8px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">Category: {faq.category}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </section>
      )}

      {/* Inquiry Form Section */}
      <section id="inquiry-form" className="py-20 md:py-32 lg:py-48 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <h2 className="text-[40vw] font-serif whitespace-nowrap -rotate-12 select-none"></h2>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start relative z-10">
           <div className="reveal text-center lg:text-left">
              <span className="text-[11px] font-black text-sky-400 uppercase tracking-[1em] mb-8 md:mb-12 block">Secure Your Stay</span>
              <h3 className="text-4xl md:text-4xl lg:text-8xl font-serif font-bold mb-8 md:mb-12 tracking-tighter leading-tight">Send an Inquiry.</h3>
              {!isSubmitted && (
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-12">
                  {[1, 2, 3].map(s => (
                    <React.Fragment key={s}>
                      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-700 ${formStep === s ? 'bg-sky-500 text-white shadow-[0_0_25px_rgba(56,189,248,0.5)] scale-110' : formStep > s ? 'bg-slate-800 text-sky-500' : 'bg-slate-900 text-slate-600'}`}>
                        {s}
                      </div>
                      {s < 3 && <div className="w-6 md:w-10 h-px bg-slate-800"></div>}
                    </React.Fragment>
                  ))}
                </div>
              )}
              <p className="text-slate-400 text-lg md:text-xl lg:text-2xl leading-relaxed opacity-80 uppercase tracking-[0.2em] font-medium max-w-md mx-auto lg:mx-0">
                {formStep === 1 ? "Tell us about yourself." : formStep === 2 ? "When would you like to visit?" : "Choose your stay preferences."}
              </p>
           </div>
           
           <div className="reveal delay-300 w-full">
             {isSubmitted ? (
               <div className="bg-white dark:bg-slate-900 text-slate-950 dark:text-white p-12 md:p-20 rounded-[2.5rem] md:rounded-[3.5rem] text-center shadow-2xl animate-in zoom-in-95 duration-700 transition-colors">
                  <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full flex items-center justify-center mx-auto mb-10">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-serif font-bold mb-6">Dispatch Sent.</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] leading-[2.5] mb-12">Our travel experts will contact you within 24 hours.</p>
                  <button onClick={() => { setIsSubmitted(false); setFormStep(1); }} className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-[0.6em] border-b-[2px] border-slate-950 dark:border-white pb-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Submit Another</button>
               </div>
             ) : (
               <div className="bg-white/5 backdrop-blur-3xl p-6 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 shadow-2xl overflow-hidden">
                  {formStep === 1 && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
                      <div className="space-y-4 md:space-y-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-4">Full Name</label>
                           <input type="text" placeholder="IDENTITY" className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 text-[16px] md:text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all text-white placeholder:text-white/20" value={quoteData.customerName} onChange={e => setQuoteData({...quoteData, customerName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-4">Email Address</label>
                           <input type="email" placeholder="DIGITAL CONTACT" className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 text-[16px] md:text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all text-white placeholder:text-white/20" value={quoteData.customerEmail} onChange={e => setQuoteData({...quoteData, customerEmail: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-4">Country</label>
                             <select className="w-full bg-white/10 border border-white/10 rounded-full px-8 py-5 text-[16px] md:text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all text-white appearance-none cursor-pointer" value={quoteData.country} onChange={e => {
                               const selected = COUNTRIES.find(c => c.name === e.target.value);
                               setQuoteData({...quoteData, country: e.target.value, countryCode: selected?.code || '+44'});
                             }}>
                                {COUNTRIES.map(c => <option key={c.name} value={c.name} className="bg-slate-900">{c.name}</option>)}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-4">Phone Number</label>
                             <div className="flex gap-2">
                                <div className="bg-white/10 border border-white/10 rounded-full px-4 py-5 text-[10px] font-bold text-white/60 min-w-[70px] text-center flex items-center justify-center">{quoteData.countryCode}</div>
                                <input type="tel" placeholder="NUMBER" className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-[16px] md:text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all text-white placeholder:text-white/20" value={quoteData.customerPhone} onChange={e => setQuoteData({...quoteData, customerPhone: e.target.value})} />
                             </div>
                          </div>
                        </div>
                      </div>
                      <button onClick={nextStep} className="w-full bg-white text-slate-950 font-black py-6 md:py-8 rounded-full text-[11px] uppercase tracking-[0.8em] hover:bg-sky-400 hover:text-white transition-all duration-700 shadow-2xl">NEXT: CHOOSE DATES</button>
                    </div>
                  )}

                  {formStep === 2 && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
                       <div className="bg-white/5 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8">
                          <div className="flex justify-between items-center mb-8 px-2">
                             <button onClick={() => changeMonth(-1)} className="text-white/40 hover:text-white transition-colors p-2 text-lg">&larr;</button>
                             <h4 className="text-[10px] font-black uppercase tracking-[0.6em]">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                             <button onClick={() => changeMonth(1)} className="text-white/40 hover:text-white transition-colors p-2 text-lg">&rarr;</button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 mb-4">
                             {['S','M','T','W','T','F','S'].map(d => (
                               <div key={d} className="text-center text-[8px] font-black text-white/20">{d}</div>
                             ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                             {generateCalendarDays(currentMonth).map((day, i) => (
                               <button 
                                 key={i} 
                                 disabled={!day || (day < new Date())}
                                 onClick={() => day && handleDateClick(day)}
                                 className={`aspect-square flex items-center justify-center rounded-full text-[9px] md:text-[10px] font-bold transition-all ${!day ? 'invisible' : (day < new Date() ? 'text-white/10' : (isDateSelected(day) ? 'bg-sky-500 text-white shadow-lg scale-110' : (isDateInRange(day) ? 'bg-sky-500/20 text-sky-400' : 'text-white/60 hover:bg-white/10')))}`}
                               >
                                 {day?.getDate()}
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                             <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block mb-1">Check In</span>
                             <p className="text-[10px] font-bold tracking-widest text-sky-400">{quoteData.checkIn || 'NOT SET'}</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                             <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block mb-1">Check Out</span>
                             <p className="text-[10px] font-bold tracking-widest text-sky-400">{quoteData.checkOut || 'NOT SET'}</p>
                          </div>
                       </div>
                       <div className="flex flex-col sm:flex-row gap-4">
                          <button onClick={prevStep} className="flex-1 border border-white/10 text-white font-black py-6 rounded-full text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all">BACK</button>
                          <button onClick={nextStep} disabled={!quoteData.checkIn || !quoteData.checkOut} className="flex-[2] bg-white text-slate-950 font-black py-6 rounded-full text-[10px] uppercase tracking-[0.8em] hover:bg-sky-400 hover:text-white transition-all disabled:opacity-20">PROCEED</button>
                       </div>
                    </div>
                  )}

                  {formStep === 3 && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
                      <div className="space-y-5">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-4">Preferred Residence?</label>
                           <select className="w-full bg-white/10 border border-white/10 rounded-full px-8 py-5 text-[16px] md:text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all text-white appearance-none cursor-pointer" value={quoteData.roomType} onChange={e => setQuoteData({...quoteData, roomType: e.target.value})}>
                                <option value="" className="bg-slate-900 text-white">SELECT A ROOM</option>
                                {resort.roomTypes?.map((r, i) => (
                                  <option key={i} value={r.name} className="bg-slate-900 text-white">{r.name}</option>
                                ))}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-4">Meal Plan?</label>
                           <select className="w-full bg-white/10 border border-white/10 rounded-full px-8 py-5 text-[16px] md:text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all text-white appearance-none cursor-pointer" value={quoteData.mealPlan} onChange={e => setQuoteData({...quoteData, mealPlan: e.target.value})}>
                                <option value="" className="bg-slate-900 text-white">SELECT MEAL PLAN</option>
                                {resort.mealPlans?.map((m, i) => (
                                  <option key={i} value={m} className="bg-slate-900 text-white">{m.replace(/_/g, ' ')}</option>
                                ))}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-4">Special Requests?</label>
                           <textarea rows={4} placeholder="TELL US MORE ABOUT YOUR VISION..." className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-[16px] md:text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all text-white placeholder:text-white/20 resize-none" value={quoteData.notes} onChange={e => setQuoteData({...quoteData, notes: e.target.value})}></textarea>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={prevStep} className="flex-1 border border-white/10 text-white font-black py-6 rounded-full text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all">BACK</button>
                        <button onClick={handleQuoteSubmit} disabled={isSubmitting} className="flex-[2] bg-white text-slate-950 font-black py-6 rounded-full text-[10px] uppercase tracking-[0.8em] hover:bg-sky-400 hover:text-white transition-all duration-700 shadow-2xl disabled:opacity-50">
                          {isSubmitting ? 'DISPATCHING...' : 'SEND INQUIRY'}
                        </button>
                      </div>
                    </div>
                  )}
               </div>
             )}
           </div>
        </div>
      </section>

      {/* Similar Sanctuaries */}
      {similarStays.length > 0 && (
        <section className="py-24 md:py-48 bg-parchment dark:bg-slate-950/20 border-t-[1px] border-slate-50 dark:border-white/5 transition-colors">
          <div className="max-w-[1440px] mx-auto">
            <div className="px-6 lg:px-12 mb-16 md:mb-24 reveal">
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.8em] mb-4 block">Refined Selection</span>
              <h3 className="text-3xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter transition-colors">Similar Sanctuaries.</h3>
            </div>
            
            <div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar px-6 lg:px-12 pb-12 snap-x snap-mandatory">
              {similarStays.map((s, idx) => (
                <div key={s.id} className="flex-shrink-0 w-[82vw] md:w-[45vw] lg:w-[32vw] snap-start reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
                  <ResortCard resort={s} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 reveal transition-colors">
         <Link to="/stays" className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.6em] hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-4">
           <span className="text-lg">←</span> Return to Portfolio
         </Link>
         <span className="text-[10px] font-black text-slate-300 dark:text-slate-800 uppercase tracking-[0.4em] text-center">Defined by Perspective • 2026 Archive</span>
      </div>

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

export default ResortDetail;
