
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  Search,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Star
} from 'lucide-react';
import { supabase, mapResort } from '../lib/supabase';
import { Accommodation, RoomType } from '../types';
import SEO from '../components/SEO';

const STORAGE_KEY = 'serenity_ota_draft';

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

enum View {
  LISTING = 'LISTING',
  RESORT_DETAIL = 'RESORT_DETAIL',
  CHECKOUT = 'CHECKOUT',
  SUCCESS = 'SUCCESS'
}

const Reservations: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialResortSlug = searchParams.get('resort');

  const [view, setView] = useState<View>(View.LISTING);
  const [loading, setLoading] = useState(true);
  const [resorts, setResorts] = useState<Accommodation[]>([]);
  const [selectedResort, setSelectedResort] = useState<Accommodation | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    country: 'United Kingdom',
    countryCode: '+44',
    notes: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (!formData.checkIn || (formData.checkIn && formData.checkOut)) {
      setFormData({ ...formData, checkIn: dateStr, checkOut: '' });
    } else {
      if (new Date(dateStr) < new Date(formData.checkIn)) {
        setFormData({ ...formData, checkIn: dateStr, checkOut: '' });
      } else {
        setFormData({ ...formData, checkOut: dateStr });
        setIsDatePickerOpen(false);
      }
    }
  };

  const isSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return formData.checkIn === dateStr || formData.checkOut === dateStr;
  };

  const isInRange = (date: Date) => {
    if (!formData.checkIn || !formData.checkOut) return false;
    const d = date.getTime();
    const start = new Date(formData.checkIn).getTime();
    const end = new Date(formData.checkOut).getTime();
    return d > start && d < end;
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  // Fetch Resorts
  useEffect(() => {
    const fetchResorts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('resorts')
          .select('*')
          .order('name', { ascending: true });
        
        if (data) {
          const mapped = data.map(mapResort);
          setResorts(mapped);
          
          if (initialResortSlug) {
            const found = mapped.find(r => r.slug === initialResortSlug);
            if (found) {
              setSelectedResort(found);
              setView(View.RESORT_DETAIL);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching resorts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResorts();

    // Load draft
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, [initialResortSlug]);

  // Save draft
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const filteredResorts = useMemo(() => {
    return resorts.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.atoll.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [resorts, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResort || !selectedRoom) return;
    setIsSubmitting(true);
    
    try {
      const { error: submitError } = await supabase.from('inquiries').insert({
        inquiry_type: selectedRoom.isOnRequest ? 'resort_reservation_request' : 'resort_instant_booking',
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: `${formData.countryCode} ${formData.customerPhone}`,
        country: formData.country,
        resort_id: selectedResort.id,
        resort_name: selectedResort.name,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        room_type: selectedRoom.name,
        guests: parseInt(formData.guests),
        notes: formData.notes,
        metadata: {
          room_id: selectedRoom.id,
          price: selectedRoom.price,
          is_instant: !selectedRoom.isOnRequest,
          payment_simulated: !selectedRoom.isOnRequest
        }
      });

      if (submitError) throw submitError;

      setView(View.SUCCESS);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Submission error:", err);
      alert("We encountered an error processing your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/10 border-t-sky-500 rounded-full animate-spin mb-8"></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Initializing OTA Portal</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white selection:bg-sky-500/30 selection:text-white pb-20">
      <SEO 
        title="Reservations | Maldives Serenity Travels"
        description="Book your luxury Maldives resort stay instantly. Compare rooms, check availability, and secure your sanctuary with our modern reservation portal."
      />

      {/* OTA Search Bar (Sticky) */}
      <div className="sticky top-0 z-[100] bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 pt-24 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-0 bg-white/[0.03] rounded-3xl lg:rounded-full border border-white/5">
            <div className="flex-[1.5] relative group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Destination or Resort" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-16 pr-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] outline-none placeholder:text-slate-700"
              />
            </div>
            
            <div className="hidden lg:block w-px h-8 bg-white/5 my-auto"></div>
            
            <div 
              className="flex-1 flex items-center gap-4 px-8 py-6 lg:py-0 cursor-pointer hover:bg-white/[0.02] transition-colors relative"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            >
              <Calendar className="w-4 h-4 text-slate-600" />
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Check In'}
                  <span className="mx-3 text-slate-800">—</span>
                  {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Check Out'}
                </p>
              </div>

              {isDatePickerOpen && (
                <div 
                  className="absolute top-full left-0 mt-4 bg-slate-900 border border-white/10 rounded-3xl p-8 w-[320px] shadow-2xl z-[200]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ArrowLeft className="w-4 h-4" /></button>
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors rotate-180"><ArrowLeft className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['S','M','T','W','T','F','S'].map(d => (
                      <div key={d} className="text-[8px] font-bold text-slate-600 text-center uppercase">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((date, i) => (
                      <div key={i} className="aspect-square flex items-center justify-center">
                        {date ? (
                          <button
                            disabled={isPast(date)}
                            onClick={() => handleDateSelect(date)}
                            className={`
                              w-full h-full text-[10px] font-bold rounded-lg transition-all
                              ${isPast(date) ? 'text-slate-800 cursor-not-allowed' : 'hover:bg-sky-500/20'}
                              ${isSelected(date) ? 'bg-sky-500 text-white' : ''}
                              ${isInRange(date) ? 'bg-sky-500/10 text-sky-400' : ''}
                            `}
                          >
                            {date.getDate()}
                          </button>
                        ) : <div />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block w-px h-8 bg-white/5 my-auto"></div>

            <div className="flex-1 flex items-center gap-4 px-8 py-6 lg:py-0">
              <Users className="w-4 h-4 text-slate-600" />
              <select 
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="bg-transparent text-[10px] font-bold uppercase tracking-[0.2em] outline-none appearance-none cursor-pointer w-full"
              >
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n} className="bg-slate-900">{n} Guests</option>)}
              </select>
            </div>

            <button 
              onClick={() => {
                if (view !== View.LISTING) setView(View.LISTING);
              }}
              className="bg-white text-slate-950 px-12 py-6 rounded-3xl lg:rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-sky-500 hover:text-white transition-all m-1"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <AnimatePresence mode="wait">
          {view === View.LISTING && (
            <motion.div 
              key="listing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24"
            >
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                  <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-[0.85]">
                    The Private <br />
                    <span className="text-sky-500">Collection.</span>
                  </h1>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Curated Sanctuary Portfolio • {filteredResorts.length} Properties</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-3xl">
                {filteredResorts.map((resort) => (
                  <motion.div 
                    key={resort.id}
                    onClick={() => {
                      setSelectedResort(resort);
                      setView(View.RESORT_DETAIL);
                      setSearchParams({ resort: resort.slug });
                    }}
                    className="group relative bg-slate-950 p-8 cursor-pointer transition-all duration-500 hover:bg-white hover:text-slate-950"
                  >
                    <div className="aspect-[16/10] overflow-hidden rounded-2xl mb-8 relative">
                      <img src={resort.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={resort.name} />
                      <div className="absolute top-4 left-4">
                        <span className="bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest text-white">{resort.atoll}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-3xl font-serif italic leading-none">{resort.name}</h3>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-2.5 h-2.5 ${i < resort.rating ? 'fill-current' : 'opacity-20'}`} />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 line-clamp-2 leading-relaxed">
                        {resort.shortDescription}
                      </p>

                      <div className="pt-6 border-t border-current/10 flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-[8px] font-bold uppercase tracking-widest opacity-40">Starting From</p>
                          <p className="text-xl font-serif italic">${resort.roomTypes?.[0]?.price || '850'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all">
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === View.RESORT_DETAIL && selectedResort && (
            <motion.div 
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              <div className="flex flex-col lg:flex-row gap-16">
                <div className="lg:col-span-8 space-y-16 flex-1">
                  <div className="aspect-[21/9] rounded-3xl overflow-hidden relative">
                    <img src={selectedResort.images[0]} className="w-full h-full object-cover" alt={selectedResort.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    <div className="absolute bottom-12 left-12">
                      <button 
                        onClick={() => {
                          setView(View.LISTING);
                          setSearchParams({});
                        }}
                        className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Collection
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-w-3xl space-y-8">
                    <div className="space-y-2">
                      <span className="text-sky-500 font-bold text-[10px] uppercase tracking-[0.5em]">{selectedResort.atoll}</span>
                      <h2 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-none">{selectedResort.name}</h2>
                    </div>
                    <p className="text-slate-400 text-xl font-serif italic leading-relaxed">{selectedResort.description}</p>
                  </div>

                  <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-500 italic">Available Residences</h3>
                      <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">{selectedResort.roomTypes?.length} OPTIONS</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-3xl">
                      {selectedResort.roomTypes?.map((room) => (
                        <div key={room.id} className="group bg-slate-950 p-8 flex flex-col md:flex-row gap-12 items-center transition-all hover:bg-white hover:text-slate-950">
                          <div className="w-full md:w-64 aspect-square rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={room.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={room.name} />
                          </div>
                          <div className="flex-1 min-w-0 space-y-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-3xl font-serif italic mb-2">{room.name}</h4>
                                <p className="text-[9px] font-mono uppercase tracking-widest opacity-60">{room.size} • {room.capacity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl font-serif italic leading-none">${room.price}</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest opacity-40">Per Night</p>
                              </div>
                            </div>
                            <p className="text-[11px] font-serif italic leading-relaxed opacity-60 line-clamp-2">{room.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {room.highlights.slice(0, 3).map(h => (
                                <span key={h} className="text-[8px] font-bold uppercase tracking-widest border border-current/10 px-3 py-1 rounded-full">{h}</span>
                              ))}
                            </div>
                          </div>
                          <div className="w-full md:w-auto">
                            <button 
                              onClick={() => {
                                setSelectedRoom(room);
                                setView(View.CHECKOUT);
                              }}
                              className={`w-full md:w-40 py-5 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] transition-all ${room.isOnRequest ? 'border border-current/20 hover:bg-slate-950 hover:text-white' : 'bg-slate-950 text-white hover:bg-sky-500'}`}
                            >
                              {room.isOnRequest ? 'Inquire' : 'Select'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:w-96">
                  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 space-y-10 sticky top-48">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500 border-b border-white/5 pb-8 italic">Reservation Details</h3>
                    <div className="space-y-8">
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Timeline</p>
                          <p className="text-[10px] font-mono uppercase tracking-widest">
                            {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'SELECT'}
                            <span className="mx-2 text-slate-800">—</span>
                            {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'SELECT'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center">
                          <Users className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Occupancy</p>
                          <p className="text-[10px] font-mono uppercase tracking-widest">{formData.guests} GUESTS</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-10 border-t border-white/5 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Best Price Guarantee</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Secure Payments</span>
                        <CreditCard className="w-4 h-4 text-sky-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === View.CHECKOUT && selectedResort && selectedRoom && (
            <motion.div 
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              <button 
                onClick={() => setView(View.RESORT_DETAIL)}
                className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-600 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Selection
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-8 space-y-12">
                  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 md:p-16 space-y-16">
                    <div className="space-y-4">
                      <span className="text-sky-500 font-bold text-[10px] uppercase tracking-[0.5em] italic">Guest Information</span>
                      <h2 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-none">Personal <br />Details.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Your Name" 
                          className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-serif italic focus:outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-800" 
                          value={formData.customerName} 
                          onChange={e => setFormData({...formData, customerName: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="email@example.com" 
                          className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-serif italic focus:outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-800" 
                          value={formData.customerEmail} 
                          onChange={e => setFormData({...formData, customerEmail: e.target.value})} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">Country of Residence</label>
                        <select 
                          className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-serif italic focus:outline-none focus:border-sky-500 transition-all text-white appearance-none cursor-pointer" 
                          value={formData.country} 
                          onChange={e => {
                            const selected = COUNTRIES.find(c => c.name === e.target.value);
                            setFormData({...formData, country: e.target.value, countryCode: selected?.code || '+44'});
                          }}
                        >
                          {COUNTRIES.map(c => <option key={c.name} value={c.name} className="bg-slate-900">{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">Phone Number</label>
                        <div className="flex gap-6">
                          <div className="border-b border-white/10 py-4 text-xl font-serif italic text-slate-500 min-w-[60px]">{formData.countryCode}</div>
                          <input 
                            type="tel" 
                            placeholder="Number" 
                            className="flex-1 bg-transparent border-b border-white/10 py-4 text-xl font-serif italic focus:outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-800" 
                            value={formData.customerPhone} 
                            onChange={e => setFormData({...formData, customerPhone: e.target.value})} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {!selectedRoom.isOnRequest && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 md:p-16 space-y-16">
                      <div className="space-y-4">
                        <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.5em] italic">Secure Payment</span>
                        <h2 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-none">Instant <br />Booking.</h2>
                      </div>

                      <div className="space-y-12">
                        <div className="space-y-4">
                          <label className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">Card Number</label>
                          <div className="relative">
                            <CreditCard className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                            <input 
                              type="text" 
                              placeholder="0000 0000 0000 0000" 
                              className="w-full bg-transparent border-b border-white/10 pl-10 py-4 text-xl font-serif italic focus:outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-800" 
                              value={formData.cardNumber} 
                              onChange={e => setFormData({...formData, cardNumber: e.target.value})} 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12">
                          <div className="space-y-4">
                            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">Expiry Date</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-serif italic focus:outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-800" 
                              value={formData.expiry} 
                              onChange={e => setFormData({...formData, expiry: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">CVV</label>
                            <input 
                              type="text" 
                              placeholder="000" 
                              className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-serif italic focus:outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-800" 
                              value={formData.cvv} 
                              onChange={e => setFormData({...formData, cvv: e.target.value})} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-8 p-10 bg-sky-500/[0.02] rounded-3xl border border-sky-500/5">
                    <ShieldCheck className="w-8 h-8 text-sky-500 flex-shrink-0" />
                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-[0.2em]">
                      Your data is encrypted and processed securely. By clicking the button below, you agree to our terms of service and cancellation policy.
                    </p>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.customerName || !formData.customerEmail}
                    className="w-full bg-white text-slate-950 font-bold py-8 rounded-full text-[11px] uppercase tracking-[0.6em] hover:bg-sky-500 hover:text-white transition-all shadow-xl disabled:opacity-10"
                  >
                    {isSubmitting ? 'Processing...' : (selectedRoom.isOnRequest ? 'Submit Request' : 'Confirm Booking')}
                  </button>
                </div>

                <div className="lg:w-96 sticky top-48">
                  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 space-y-10">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-sky-500 border-b border-white/5 pb-8 italic">Summary</h3>
                    
                    <div className="space-y-10">
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                          <img src={selectedResort.images[0]} className="w-full h-full object-cover grayscale" alt="" />
                        </div>
                        <div>
                          <p className="text-xl font-serif italic leading-none">{selectedResort.name}</p>
                          <p className="text-[9px] text-slate-700 uppercase tracking-widest mt-2">{selectedResort.atoll}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Residence</span>
                          <span className="text-[10px] font-mono uppercase tracking-widest">{selectedRoom.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Timeline</span>
                          <span className="text-[10px] font-mono uppercase tracking-widest">
                            {new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(formData.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Occupancy</span>
                          <span className="text-[10px] font-mono uppercase tracking-widest">{formData.guests} GUESTS</span>
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 space-y-8">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Rate per Night</span>
                          <span className="text-2xl font-serif italic text-white">${selectedRoom.price}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/[0.03] p-8 rounded-2xl border border-white/5">
                          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Total Estimated</span>
                          <span className="text-4xl font-serif italic text-white">
                            ${selectedRoom.price * (formData.checkIn && formData.checkOut ? Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === View.SUCCESS && (
            <motion.div 
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto text-center space-y-16 py-32"
            >
              <div className="w-32 h-32 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-16 relative">
                <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping" />
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-8">
                <h2 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-none">Confirmed.</h2>
                <p className="text-slate-400 text-xl font-serif italic leading-relaxed max-w-md mx-auto">
                  {selectedRoom?.isOnRequest 
                    ? "Your inquiry has been dispatched. A travel specialist will contact you shortly to finalize your stay."
                    : "Your booking is confirmed. A confirmation email with your digital itinerary has been sent."}
                </p>
              </div>
              <div className="pt-16">
                <button 
                  onClick={() => {
                    setView(View.LISTING);
                    setSelectedResort(null);
                    setSelectedRoom(null);
                  }}
                  className="bg-white text-slate-950 px-16 py-8 rounded-full text-[11px] font-bold uppercase tracking-[0.6em] hover:bg-sky-500 hover:text-white transition-all shadow-2xl"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* OTA Footer Info */}
      <footer className="max-w-7xl mx-auto px-6 mt-20 pb-20 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-800" />
            <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em]">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-slate-800" />
            <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em]">Instant Confirmation</span>
          </div>
        </div>
        <p className="text-[8px] font-bold text-slate-800 uppercase tracking-[0.5em]">Maldives Serenity Travels • OTA v4.0</p>
      </footer>

      {/* Date Picker Modal (Simplified Inline for now) */}
      <AnimatePresence>
        {/* You could add a full date picker modal here if needed */}
      </AnimatePresence>
    </div>
  );
};

export default Reservations;
