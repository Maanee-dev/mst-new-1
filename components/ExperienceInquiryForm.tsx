import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Experience } from '../types';
import { Send, X, Calendar, Users, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface ExperienceInquiryFormProps {
  experience: Experience;
  onClose: () => void;
}

const ExperienceInquiryForm: React.FC<ExperienceInquiryFormProps> = ({ experience, onClose }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '2',
    package: experience.packages?.[0]?.name || 'Standard',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    navigate('/thank-you', { 
      state: { 
        resortName: experience.title, 
        type: 'experience',
        packageName: formData.package 
      } 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Sidebar Info */}
          <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/50 p-10 border-r border-slate-100 dark:border-white/5 hidden md:block">
            <span className="text-[9px] font-black text-sky-500 uppercase tracking-[0.4em] mb-8 block">Your Journey</span>
            <div className="aspect-square rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img src={experience.image} alt={experience.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-4 leading-tight">{experience.title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Our specialists will contact you within 24 hours to finalize your bespoke itinerary.
            </p>
          </div>

          {/* Form Area */}
          <div className="md:col-span-8 p-10 md:p-12 max-h-[80vh] overflow-y-auto no-scrollbar">
            <div className="mb-10">
              <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mb-2">Initiate Discovery</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complete the form to request a quote</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-14 pr-6 py-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 transition-all"
                        placeholder="e.g. Oct 2026"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <select 
                        value={formData.guests}
                        onChange={(e) => setFormData({...formData, guests: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-14 pr-6 py-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 transition-all appearance-none"
                      >
                        <option value="1">1 Explorer</option>
                        <option value="2">2 Explorers</option>
                        <option value="3">3 Explorers</option>
                        <option value="4">4+ Explorers</option>
                      </select>
                    </div>
                  </div>
                </div>

                {experience.packages && experience.packages.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Package</label>
                    <div className="grid grid-cols-2 gap-3">
                      {experience.packages.map((pkg) => (
                        <button
                          key={pkg.name}
                          type="button"
                          onClick={() => setFormData({...formData, package: pkg.name})}
                          className={`p-4 rounded-2xl border text-left transition-all ${formData.package === pkg.name ? 'bg-sky-500 border-sky-500 text-white' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400'}`}
                        >
                          <div className="text-[9px] font-black uppercase tracking-widest mb-1">{pkg.name}</div>
                          <div className="text-[8px] font-bold opacity-80">{pkg.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Notes</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-6 top-6 text-slate-400" size={14} />
                    <textarea 
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-14 pr-6 py-6 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                      placeholder="Any specific requests or preferences?"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-6 rounded-2xl text-[10px] uppercase tracking-[0.4em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-white dark:border-slate-600 dark:border-t-slate-950 rounded-full animate-spin"></div>
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExperienceInquiryForm;
