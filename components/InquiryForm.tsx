import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accommodation, Offer } from '../types';
import { supabase, mapOffer } from '../lib/supabase';
import { Tag, CheckCircle2 } from 'lucide-react';

interface InquiryFormProps {
  resort: Accommodation;
  onClose: () => void;
  prefillData?: {
    dates?: string;
    guests?: string;
    room?: string;
    mealPlan?: string;
    offerId?: string;
  };
}

const InquiryForm: React.FC<InquiryFormProps> = ({ resort, onClose, prefillData }) => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dates: prefillData?.dates || '',
    guests: prefillData?.guests || '2',
    message: prefillData?.room ? `Inquiry for ${prefillData.room}${prefillData.mealPlan ? ` with ${prefillData.mealPlan.replace('_', ' ')}` : ''}.` : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('resort_id', resort.id);
      
      if (data) {
        const mapped = data.map(o => mapOffer(o));
        setOffers(mapped);
        
        // If prefilled with offerId, set it
        if (prefillData?.offerId) {
          const prefilled = mapped.find(o => o.id === prefillData.offerId);
          if (prefilled) setAppliedOffer(prefilled);
        }
      }
    };
    fetchOffers();
  }, [resort.id, prefillData?.offerId]);

  // Logic to check if dates match an offer
  useEffect(() => {
    if (!formData.dates || prefillData?.offerId) return;

    const checkOffer = () => {
      // Simple check: if the dates string contains any part of the offer title or if we can parse dates
      // For now, let's look for exact matches if we had structured dates, but since it's a string:
      // We'll try to find an offer that might apply. 
      // Realistically, we'd need structured dates here.
      // If the user selects dates from the calendar in RoomSelection, we should pass structured dates.
    };
    checkOffer();
  }, [formData.dates, offers, prefillData?.offerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    navigate('/thank-you', { state: { resortName: resort.name, appliedOffer: appliedOffer?.title } });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/5 max-w-2xl mx-auto w-full max-h-[90vh] overflow-y-auto no-scrollbar">
      <div className="mb-8 md:mb-10">
        <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.6em] mb-3 md:mb-4 block">Bespoke Inquiry</span>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter">Request a Quote for {resort.name}</h3>
      </div>

      {appliedOffer && (
        <div className="mb-8 bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-500/30 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <Tag size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-[11px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest">Offer Applied</h4>
              <CheckCircle2 size={14} className="text-sky-500" />
            </div>
            <p className="text-sm font-serif font-bold text-slate-900 dark:text-white mb-1">{appliedOffer.title}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{appliedOffer.discount} • {appliedOffer.nights} Nights</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all text-slate-900 dark:text-white"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all text-slate-900 dark:text-white"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all text-slate-900 dark:text-white"
              placeholder="+1 234 567 890"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Dates</label>
            <input 
              type="text" 
              value={formData.dates}
              onChange={(e) => setFormData({...formData, dates: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all text-slate-900 dark:text-white"
              placeholder="e.g. Oct 12 - Oct 20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Additional Notes</label>
          <textarea 
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all text-slate-900 dark:text-white resize-none"
            placeholder="Tell us about your dream holiday..."
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
          <button 
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
          <button 
            disabled={isSubmitting}
            type="submit"
            className="w-full sm:w-auto bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold px-12 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-sky-500 hover:text-white transition-all shadow-xl disabled:opacity-50 order-1 sm:order-2"
          >
            {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
