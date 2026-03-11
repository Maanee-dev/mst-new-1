
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Globe, Zap, Gift, ArrowRight } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'United States',
    password: '',
    agree: false
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side - Visual */}
          <div className="hidden md:block w-2/5 bg-sky-600 p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Maldives" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-serif font-medium leading-tight mb-6">Join the Inner Circle.</h3>
                <p className="text-sky-100 text-sm leading-relaxed opacity-80">Become a partner and share the beauty of the Maldives with your network.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Gift size={16} /></div>
                  <span className="text-xs font-bold uppercase tracking-widest">$50 Reward</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Zap size={16} /></div>
                  <span className="text-xs font-bold uppercase tracking-widest">Instant Tracking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 p-8 md:p-16">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center md:text-left"
                >
                  <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em] mb-6 block">Referral Program</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-medium text-slate-900 dark:text-white mb-6 tracking-tight">Earn $50 For Every Friend You Refer.</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-12">Share the magic of Maldives and get rewarded for every successful booking made through your link.</p>
                  
                  <div className="space-y-6 mb-12">
                    {[
                      { icon: <Zap size={18} />, title: 'Easy Sharing', desc: 'Copy your link and share anywhere.' },
                      { icon: <Globe size={18} />, title: 'Real Tracking', desc: 'Monitor clicks and leads in real-time.' },
                      { icon: <Gift size={18} />, title: 'Fast Payouts', desc: 'Get paid directly to your account.' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="text-sky-500 mt-1">{item.icon}</div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleNext}
                    className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-sky-600 dark:hover:bg-sky-100 transition-all flex items-center justify-center gap-4 group"
                  >
                    Get Started - It's Free <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-serif font-medium text-slate-900 dark:text-white mb-8 tracking-tight">Create Your Account</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
                      value={formData.country}
                      onChange={e => setFormData({...formData, country: e.target.value})}
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Maldives</option>
                      <option>Germany</option>
                      <option>Italy</option>
                    </select>
                    <input 
                      type="password" 
                      placeholder="Password" 
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-sky-500 transition-all"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    
                    <label className="flex items-start gap-3 cursor-pointer group py-2">
                      <input 
                        type="checkbox" 
                        className="mt-1 rounded border-slate-200 text-sky-600 focus:ring-sky-500"
                        checked={formData.agree}
                        onChange={e => setFormData({...formData, agree: e.target.checked})}
                      />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed group-hover:text-slate-600 transition-colors">
                        I agree to the Terms of Service and Privacy Policy.
                      </span>
                    </label>

                    <button 
                      type="submit"
                      disabled={!formData.agree}
                      className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-sky-600 dark:hover:bg-sky-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Complete Registration
                    </button>

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-white/5"></div></div>
                      <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest"><span className="bg-white dark:bg-slate-900 px-4 text-slate-400">Or continue with</span></div>
                    </div>

                    <button type="button" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                      <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check size={48} className="text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-serif font-medium text-slate-900 dark:text-white mb-4 tracking-tight">Welcome to the Program!</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-12">Your application has been approved. You can now start earning rewards.</p>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl mb-12 space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Your Referral Code</p>
                      <p className="text-2xl font-black text-sky-600 tracking-[0.2em] uppercase">SARAH-J-2024</p>
                    </div>
                    <div className="pt-6 border-t border-slate-200 dark:border-white/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Your Personalized Inquiry Link</p>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300 break-all">maldives-serenitytravels.com/inquiry/SARAH-J-2024</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      onSuccess();
                      onClose();
                    }}
                    className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-sky-600 dark:hover:bg-sky-100 transition-all"
                  >
                    Go to Dashboard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupModal;
