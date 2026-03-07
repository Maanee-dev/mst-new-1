import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import CalendarSelector from './CalendarSelector';
import GuestSelector from './GuestSelector';

interface BagProps {
  isOpen: boolean;
  onClose: () => void;
}

const Bag: React.FC<BagProps> = ({ isOpen, onClose }) => {
  const { 
    items, 
    removeItem, 
    clearBag, 
    totalItems, 
    startDate, 
    endDate, 
    adults, 
    childrenCount, 
    setStartDate, 
    setEndDate, 
    setAdults, 
    setChildrenCount
  } = useBag();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleStartExploring = () => {
    onClose();
    navigate('/discovery');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('inquiries').insert({
        inquiry_type: 'bulk_bag',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        notes: formData.notes,
        metadata: {
          items: items.map(i => ({ id: i.id, type: i.type, name: i.name })),
          startDate,
          endDate,
          adults,
          childrenCount
        }
      });

      if (error) throw error;
      
      setIsSubmitted(true);
      setTimeout(() => {
        clearBag();
        onClose();
        navigate('/thank-you', { 
          state: { 
            itemName: 'Your Curated Selection',
            type: 'bulk'
          } 
        });
      }, 2000);
    } catch (err) {
      console.error('Inquiry failed:', err);
      alert('We encountered an error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[400]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-[401] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-sky-500" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Your Selection ({totalItems})</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200">
                    <ShoppingBag size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-slate-400 mb-2">Your bag is empty.</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                      Explore our stays and experiences to curate your perfect Maldivian escape.
                    </p>
                  </div>
                  <button 
                    onClick={handleStartExploring}
                    className="text-[10px] font-black text-sky-500 uppercase tracking-widest border-b border-sky-500 pb-1"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Item List */}
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="pr-2">
                              <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest block mb-1">{item.type}</span>
                              <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white leading-tight break-words">{item.name}</h4>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {item.price && (
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                              {typeof item.price === 'number' ? `From US$ ${item.price.toLocaleString()}` : item.price}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inquiry Form */}
                  {!isSubmitted ? (
                    <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                      <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] mb-6">Request Bulk Quote</h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                          <CalendarSelector 
                            range={{ from: startDate, to: endDate }}
                            onChange={(range) => {
                              setStartDate(range?.from);
                              setEndDate(range?.to);
                            }}
                          />
                          <GuestSelector 
                            adults={adults}
                            children={childrenCount}
                            onChange={(a, c) => {
                              setAdults(a);
                              setChildrenCount(c);
                            }}
                          />
                        </div>
                        <input 
                          required
                          type="text" 
                          placeholder="FULL NAME" 
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                        <input 
                          required
                          type="email" 
                          placeholder="EMAIL ADDRESS" 
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                        <input 
                          type="tel" 
                          placeholder="PHONE NUMBER" 
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                        <textarea 
                          placeholder="SPECIAL REQUESTS OR NOTES..." 
                          rows={3}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                          value={formData.notes}
                          onChange={e => setFormData({...formData, notes: e.target.value})}
                        />
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-sky-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                          {isSubmitting ? 'Dispatching...' : (
                            <>
                              Request Quote <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="pt-8 border-t border-slate-100 dark:border-white/5 text-center">
                      <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} />
                      </div>
                      <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">Inquiry Dispatched.</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                        Our travel curators will contact you shortly with a bespoke proposal.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Bag;
