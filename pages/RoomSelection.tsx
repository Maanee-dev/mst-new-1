import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, mapResort } from '../lib/supabase';
import { Accommodation, RoomType, MealPlan } from '../types';
import SEO from '../components/SEO';
import { ChevronLeft, Check, Info, Users, Maximize2, Utensils, Edit2, X, ArrowRight, Plus } from 'lucide-react';
import InquiryForm from '../components/InquiryForm';
import ExperienceInquiryForm from '../components/ExperienceInquiryForm';
import CalendarSelector from '../components/CalendarSelector';
import GuestSelector from '../components/GuestSelector';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Offer, Experience } from '../types';
import { mapOffer } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { EXPERIENCES } from '../constants';
import { useBag } from '../context/BagContext';

const RoomSelection: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem, isInBag } = useBag();
  
  const [resort, setResort] = useState<Accommodation | null>(null);
  const [resortOffers, setResortOffers] = useState<Offer[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Room, 2: Meal Plan
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange | undefined>(undefined);
  const [tempAdults, setTempAdults] = useState(2);
  const [tempChildren, setTempChildren] = useState(0);

  const dates = searchParams.get('dates') || 'Not specified';
  const guests = searchParams.get('guests') || '2';
  const offerId = searchParams.get('offerId');

  useEffect(() => {
    // Try to parse dates if they exist
    if (dates && dates !== 'Not specified') {
      // This is a simplified parser for the string format "MMM d - MMM d"
      // In a real app, we'd store dates as ISO strings in search params
    }
  }, [dates]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    const fetchResort = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('resorts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        
        if (data) {
          const mappedResort = mapResort(data);
          setResort(mappedResort);
          
          // Fetch offers for this resort
          const { data: offersData } = await supabase
            .from('offers')
            .select('*, resorts(slug)')
            .eq('resort_id', data.id);
            
          if (offersData) {
            setResortOffers(offersData.map(o => mapOffer(o)));
          }

          // Fetch experiences for this resort
          const { data: expData } = await supabase
            .from('experiences')
            .select('*, resorts(id, name, slug)')
            .or(`resort_id.eq.${data.id},atoll.eq.${data.atoll}`);
            
          if (expData && expData.length > 0) {
            setExperiences(expData.map(item => ({
              ...item,
              resortName: item.resorts?.name,
              resortSlug: item.resorts?.slug,
              resortId: item.resorts?.id
            })) as Experience[]);
          } else {
            const local = EXPERIENCES.filter(e => e.resortId === data.id);
            setExperiences(local);
          }
        } else {
          navigate('/inquire');
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResort();
  }, [slug, navigate]);

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
  }, [loading, resort, currentStep]);

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-100 dark:border-white/5 border-t-sky-500 rounded-full animate-spin mb-8"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Sanctuaries...</p>
      </div>
    );
  }

  if (!resort) return null;

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-700">
      <SEO title={`Select Room - ${resort.name}`} description={`Choose your preferred residence at ${resort.name}.`} />

      {/* Header */}
      <header className="pt-32 pb-12 px-6 max-w-[1440px] mx-auto">
        <button 
          onClick={() => {
            if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
            } else {
              navigate(-1);
            }
          }}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-sky-500 transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          {currentStep > 1 ? 'Back to Room Selection' : 'Back to Discovery'}
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.6em] mb-4 block">{resort.atoll}</span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter">{resort.name}</h1>
          </div>
          
          <div className="w-full lg:w-auto overflow-hidden">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-white/5 shadow-2xl flex items-center gap-8 overflow-x-auto no-scrollbar whitespace-nowrap">
              <button 
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex flex-col items-center justify-center gap-1 group pr-8 border-r border-slate-100 dark:border-white/5 flex-shrink-0"
              >
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-sky-500 transition-colors">Gallery</span>
                <div className="w-4 h-px bg-slate-200 dark:bg-white/10 group-hover:bg-sky-500 transition-all"></div>
              </button>
              
              <div className="flex-shrink-0 pr-8 border-r border-slate-100 dark:border-white/5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Selected Dates</span>
                {isEditingDetails ? (
                  <div className="min-w-[140px]">
                    <CalendarSelector 
                      range={tempRange}
                      onChange={setTempRange}
                    />
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">{dates}</p>
                )}
              </div>
              
              <div className="flex-shrink-0 pr-8 border-r border-slate-100 dark:border-white/5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Guests</span>
                {isEditingDetails ? (
                  <div className="min-w-[140px]">
                    <GuestSelector 
                      adults={tempAdults}
                      children={tempChildren}
                      onChange={(a, c) => {
                        setTempAdults(a);
                        setTempChildren(c);
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">{guests} Adults</p>
                )}
              </div>
              
              <div className="flex-shrink-0 pr-8 border-r border-slate-100 dark:border-white/5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Transfer</span>
                <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">{(resort.transferMode || '').replace(/_/g, ' ')}</p>
              </div>

              <div className="flex-shrink-0">
                {isEditingDetails ? (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        if (tempRange?.from) {
                          const dateStr = `${format(tempRange.from, 'MMM d')}${tempRange.to ? ` - ${format(tempRange.to, 'MMM d')}` : ''}`;
                          newParams.set('dates', dateStr);
                        }
                        newParams.set('guests', `${tempAdults + tempChildren}`);
                        setSearchParams(newParams);
                        setIsEditingDetails(false);
                      }}
                      className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20"
                    >
                      <Check size={16} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingDetails(false);
                      }}
                      className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditingDetails(true)}
                    className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group shadow-sm"
                  >
                    <Edit2 size={16} className="group-hover:text-sky-500 transition-colors" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step Indicator (Mobile Only) */}
        <div className="lg:hidden mt-12 flex items-center gap-4">
          <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${currentStep >= 1 ? 'bg-sky-500' : 'bg-slate-200 dark:bg-white/10'}`}></div>
          <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${currentStep >= 2 ? 'bg-sky-500' : 'bg-slate-200 dark:bg-white/10'}`}></div>
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Step {currentStep}/2</div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* About & Room List (Step 1) */}
        <div className={`lg:col-span-8 space-y-12 ${currentStep !== 1 ? 'hidden lg:block' : ''}`}>
          <div className="reveal">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] mb-6">The Sanctuary</h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-serif leading-relaxed italic">
              {resort.description}
            </p>
          </div>

          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] mb-8">Available Residences</h2>
          
          {resort.roomTypes?.map((room, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border transition-all duration-500 ${selectedRoom?.name === room.name ? 'border-sky-500 shadow-2xl ring-1 ring-sky-500' : 'border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl'}`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden relative">
                  <img src={room.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={room.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                <div className="flex-1 p-8 md:p-10 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">{room.name}</h3>
                    {selectedRoom?.name === room.name && (
                      <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                    {room.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Maximize2 size={14} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{room.size || 'Spacious'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Users size={14} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{room.capacity || 'Flexible'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {(room.highlights || []).slice(0, 3).map((h, i) => (
                      <span key={i} className="bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-white/5">
                        {h}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedRoom(room);
                      setSelectedMealPlan(null);
                      setShowInquiryForm(false);
                      if (window.innerWidth < 1024) {
                        setCurrentStep(2);
                      }
                    }}
                    className={`w-full py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all ${selectedRoom?.name === room.name ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-sky-500 hover:text-white'}`}
                  >
                    {selectedRoom?.name === room.name ? 'Room Selected' : 'Select This Residence'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selection Summary & Meal Plans (Step 2) */}
        <aside className={`lg:col-span-4 ${currentStep !== 2 ? 'hidden lg:block' : ''}`}>
          <div className="sticky top-32 space-y-8">
            <AnimatePresence mode="wait">
              {selectedRoom ? (
                <motion.div 
                  key="selection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl"
                >
                  <div className="mb-10">
                    <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Your Selection</h3>
                    <div className="flex gap-4 items-center mb-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={selectedRoom.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white leading-tight">{selectedRoom.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{resort.name}</p>
                      </div>
                    </div>
                  </div>

                    <div className="mb-10">
                      <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Select Meal Plan</h3>
                      <div className="space-y-3">
                        {resort.mealPlans.map(plan => {
                          const planDesc = {
                            'BED_BREAKFAST': 'Start your day with a curated morning feast.',
                            'HALF_BOARD': 'Includes breakfast and a sophisticated dinner.',
                            'FULL_BOARD': 'Complete culinary coverage for your stay.',
                            'ALL_INCLUSIVE': 'Unlimited indulgence across all venues.'
                          }[plan] || 'Bespoke dining arrangements.';

                          return (
                            <button 
                              key={plan}
                              onClick={() => setSelectedMealPlan(plan)}
                              className={`w-full flex flex-col p-5 rounded-2xl border transition-all text-left ${selectedMealPlan === plan ? 'bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:border-sky-500/30' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-white/10'}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <Utensils size={14} className={selectedMealPlan === plan ? 'text-sky-500' : 'text-slate-400'} />
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedMealPlan === plan ? 'text-sky-600 dark:text-sky-400' : 'text-slate-900 dark:text-white'}`}>
                                    {(plan || '').replace(/_/g, ' ')}
                                  </span>
                                </div>
                                {selectedMealPlan === plan && <Check size={14} strokeWidth={3} className="text-sky-500" />}
                              </div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                {planDesc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  <button 
                    disabled={!selectedMealPlan}
                    onClick={() => setShowInquiryForm(true)}
                    className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-sky-500 hover:text-white transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Proceed to Inquiry
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] p-12 border border-dashed border-slate-200 dark:border-white/10 text-center"
                >
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Info size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-400 mb-4">No Selection.</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                    Please select your preferred residence from the list to continue your journey.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </main>

      {/* Special Offers Section */}
      {resortOffers.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 mt-32 reveal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
            <div className="max-w-2xl">
              <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-8 block">Exclusive Privileges</span>
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none">Resort Offers.</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resortOffers.map((offer) => (
              <div key={offer.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={offer.image} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" alt={offer.title} />
                  <div className="absolute top-6 left-6">
                    <div className="bg-amber-400 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {offer.nights} NIGHTS
                    </div>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <span className="text-[9px] font-black text-sky-500 uppercase tracking-[0.3em] mb-4 block">{offer.category}</span>
                  <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-4 group-hover:text-sky-500 transition-colors">{offer.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-8 line-clamp-2">
                    {offer.discount}
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Starting from</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">US$ {offer.price.toLocaleString()}</span>
                    </div>
                    <Link 
                      to={`/offers/${offer.id}`}
                      className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Visual Journey Section */}
      {resort.images && resort.images.length > 0 && (
        <section id="gallery" className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors overflow-hidden mt-24">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 md:mb-24 reveal">
              <div className="max-w-2xl">
                <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-4 md:mb-8 block">Visual Journey</span>
                <h3 className="text-4xl md:text-5xl lg:text-8xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none transition-colors">The Gallery.</h3>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="flex gap-6 md:gap-10 overflow-x-auto pb-12 px-6 lg:px-12 no-scrollbar snap-x snap-mandatory scroll-smooth">
              {resort.images.map((image, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 w-[85vw] md:w-[600px] lg:w-[800px] aspect-[16/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl snap-center md:snap-start reveal"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <img src={image} className="w-full h-full object-cover transition-transform duration-[8s] hover:scale-110" alt={`Gallery ${idx}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Island Experiences Section */}
      {experiences.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 mt-32 reveal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
            <div className="max-w-2xl">
              <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-8 block">Island Perspective</span>
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none">Curated Experiences.</h3>
            </div>
            <Link to="/experiences" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-slate-950 dark:hover:text-white transition-colors border-b border-slate-100 dark:border-white/5 pb-2">
              Explore All Journeys
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={exp.image} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" alt={exp.title} />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-sm">
                      {exp.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-4 group-hover:text-sky-500 transition-colors">{exp.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-8 line-clamp-2">
                    {exp.description}
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedExperience(exp)}
                        className="text-[10px] font-black text-slate-950 dark:text-white border-b border-slate-950 dark:border-white pb-1 hover:text-sky-500 hover:border-sky-500 transition-all uppercase tracking-widest"
                      >
                        Request
                      </button>
                      <button 
                        onClick={() => {
                          if (!isInBag(exp.id)) {
                            addItem({
                              id: exp.id,
                              type: 'experience',
                              name: exp.title,
                              image: exp.image,
                              slug: exp.slug,
                              details: exp.category
                            });
                          }
                        }}
                        className={`p-2 rounded-full transition-all duration-500 ${isInBag(exp.id) ? 'bg-sky-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-sky-500 hover:text-white'}`}
                      >
                        {isInBag(exp.id) ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                      </button>
                    </div>
                    <Link 
                      to={`/experiences/${exp.slug}`}
                      className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Inquiry Form Modal */}
      <AnimatePresence>
        {showInquiryForm && selectedRoom && selectedMealPlan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <InquiryForm 
                resort={resort} 
                prefillData={{
                  dates,
                  guests,
                  room: selectedRoom.name,
                  mealPlan: selectedMealPlan,
                  offerId: offerId || undefined
                }}
                onClose={() => setShowInquiryForm(false)} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default RoomSelection;
