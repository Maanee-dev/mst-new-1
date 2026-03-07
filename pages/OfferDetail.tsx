
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, mapOffer } from '../lib/supabase';
import { Offer } from '../types';
import { OFFERS } from '../constants';
import SEO from '../components/SEO';
import { ChevronLeft, Calendar, MapPin, Star, Check, ArrowRight, Utensils, Info, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useBag } from '../context/BagContext';

const OfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem, isInBag } = useBag();

  useEffect(() => {
    const fetchOffer = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('offers')
          .select('*, resorts(*)')
          .eq('id', id)
          .single();

        if (data) {
          setOffer(mapOffer(data));
        } else {
          const localOffer = OFFERS.find(o => o.id === id);
          if (localOffer) setOffer(localOffer);
        }
      } catch (err) {
        console.error("Error fetching offer:", err);
        const localOffer = OFFERS.find(o => o.id === id);
        if (localOffer) setOffer(localOffer);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-100 dark:border-white/5 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-parchment dark:bg-slate-950 flex flex-col items-center justify-center px-6">
        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6">Offer not found</h2>
        <Link to="/offers" className="text-sky-500 font-black uppercase tracking-widest text-[10px] border-b border-sky-100 pb-2">
          Back to all offers
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-700">
      <SEO 
        title={`${offer.title} | Exclusive Maldives Offer`}
        description={`Experience luxury with our ${offer.title} at ${offer.resortName}. ${offer.discount} for ${offer.nights} nights.`}
        image={offer.image}
      />

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={offer.image} className="w-full h-full object-cover" alt={offer.title} />
          <div className="absolute inset-0 bg-slate-950/40" />
        </div>
        
        <div className="absolute top-24 md:top-32 left-6 lg:left-20 z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 md:gap-3 text-white/80 hover:text-white transition-colors group mb-4 md:mb-8"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform md:w-[20px] md:h-[20px]" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Back</span>
          </button>
        </div>

        <div className="relative h-full flex flex-col justify-end pb-12 md:pb-20 px-6 lg:px-20 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-amber-400 text-slate-950 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] mb-4 md:mb-8 inline-block shadow-xl">
              {offer.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-serif font-bold text-white tracking-tighter leading-tight md:leading-[1.1] lg:leading-none mb-6 md:mb-8">
              {offer.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-8 text-white/90">
              <div className="flex items-center gap-2 md:gap-3">
                <MapPin size={16} className="text-sky-400 md:w-[18px] md:h-[18px]" />
                <span className="text-[9px] md:text-[10px] lg:text-[11px] font-bold uppercase tracking-widest">{offer.resortName}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Calendar size={16} className="text-sky-400 md:w-[18px] md:h-[18px]" />
                <span className="text-[9px] md:text-[10px] lg:text-[11px] font-bold uppercase tracking-widest">{offer.nights} Nights</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < offer.rating ? "text-amber-400 fill-current" : "text-white/20"} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Details */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 dark:border-white/5">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8">About this privilege</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-[2] mb-12">
                {offer.description || `Experience the pinnacle of Maldivian luxury with this curated ${offer.category.toLowerCase()} offer at ${offer.resortName}. 
                Designed for those who seek the extraordinary, this package combines world-class accommodation in a ${offer.roomCategory} 
                with bespoke privileges and the legendary hospitality of the Maldives.`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-white/5">
                  <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6">
                    <Check size={20} />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Inclusions</h4>
                  <ul className="space-y-3">
                    {['Daily Gourmet Breakfast', 'Return Luxury Transfers', 'Welcome Amenities', 'Personal Island Host'].map((item, i) => (
                      <li key={i} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-white/5">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                    <Utensils size={20} />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Dining</h4>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
                    Enjoy curated culinary experiences across the resort's signature venues. Bespoke dining arrangements can be tailored to your vision.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-white/5 pt-12">
                <div className="flex items-center gap-4 mb-8">
                  <Info size={20} className="text-sky-500" />
                  <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">Terms & Conditions</h3>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-[2]">
                  Valid for stays until {new Date(offer.expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. 
                  Subject to availability at the time of booking. Blackout dates may apply. 
                  Cannot be combined with other promotions.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Booking */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-slate-950 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-[0.4em] mb-8 block">Investment</span>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-black tracking-tighter">US$ {offer.price.toLocaleString()}</span>
                </div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-10">
                  {offer.priceSubtext}
                </p>

                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Discount</span>
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">{offer.discount}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Category</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{offer.roomCategory}</span>
                  </div>
                </div>

                <Link 
                  to={`/inquire/${offer.resortSlug}?offerId=${offer.id}`}
                  className="w-full py-6 bg-white text-slate-950 rounded-full text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-sky-500 hover:text-white transition-all shadow-xl mb-4"
                >
                  Inquire Now
                  <ArrowRight size={16} />
                </Link>

                <button 
                  onClick={() => {
                    if (offer && !isInBag(offer.id)) {
                      addItem({
                        id: offer.id,
                        type: 'offer',
                        name: offer.title,
                        image: offer.image,
                        slug: offer.resortSlug,
                        price: offer.price,
                        details: offer.resortName
                      });
                    }
                  }}
                  disabled={offer ? isInBag(offer.id) : true}
                  className={`w-full py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-xl border ${isInBag(offer?.id || '') ? 'bg-sky-500 border-sky-500 text-white' : 'bg-transparent border-white/20 text-white hover:bg-white/10'}`}
                >
                  {isInBag(offer?.id || '') ? (
                    <>
                      <Check size={16} strokeWidth={3} /> Added to Bag
                    </>
                  ) : (
                    <>
                      <Plus size={16} strokeWidth={3} /> Add to Selection
                    </>
                  )}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-6">Need Assistance?</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-8">
                  Our private travel consultants are available to refine this discovery to your exact vision.
                </p>
                <Link to="/contact" className="text-sky-500 font-black uppercase tracking-widest text-[9px] flex items-center gap-3 group">
                  Contact Consultant
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Resort Spotlight */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 py-32">
        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-[4rem] p-12 md:p-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <span className="text-sky-500 font-bold uppercase tracking-[1em] text-[10px] mb-8 block">The Sanctuary</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-8 tracking-tighter">
              {offer.resortName}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-[2] mb-12">
              Discover a world of unparalleled beauty and sophistication. {offer.resortName} offers a unique perspective 
              on the Maldivian archipelago, where every moment is crafted to perfection.
            </p>
            <Link 
              to={`/stays/${offer.resortSlug}`}
              className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white group"
            >
              <span className="border-b border-slate-900 dark:border-white pb-1">Explore Resort</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="lg:w-1/2 aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
            <img src={offer.image} className="w-full h-full object-cover" alt={offer.resortName} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfferDetail;
