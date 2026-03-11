
import React, { useState } from 'react';
import SEO from '../components/SEO';
import Dashboard from '../components/referral/Dashboard';
import SignupModal from '../components/referral/SignupModal';
import { motion } from 'motion/react';

const ReferralPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  if (isLoggedIn) {
    return (
      <>
        <SEO 
          title="Partner Dashboard | Maldives Serenity Travels" 
          description="Manage your referral earnings and track your performance as a Maldives Serenity Travels partner."
        />
        <Dashboard />
      </>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-700">
      <SEO 
        title="Partner Program | Maldives Serenity Travels" 
        description="Join the Maldives Serenity Travels Partner Program and earn $50 for every successful referral booking."
      />
      
      {/* Landing Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506929199175-6374f608c05a?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover opacity-40 dark:opacity-20" 
            alt="Maldives"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white dark:from-slate-950/0 dark:via-slate-950/50 dark:to-slate-950" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[12px] font-black text-sky-500 uppercase tracking-[1.2em] mb-12 block">Partner Program</span>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-medium text-slate-900 dark:text-white tracking-tighter leading-[0.85] mb-12">
              Share Paradise. <br /> <span className="italic text-sky-600">Earn Rewards.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-lg md:text-2xl leading-relaxed mb-16 font-medium">
              Join our exclusive network of travel enthusiasts and earn $50 USD for every successful booking made through your referral.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button 
                onClick={() => setIsSignupOpen(true)}
                className="w-full sm:w-auto bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-16 py-7 rounded-full font-black text-[11px] uppercase tracking-[0.8em] hover:bg-sky-600 dark:hover:bg-sky-100 transition-all shadow-2xl"
              >
                Join Now - It's Free
              </button>
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-16 py-7 rounded-full font-black text-[11px] uppercase tracking-[0.8em] border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition-all"
              >
                Partner Login
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 md:py-48 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { step: '01', title: 'Join', desc: 'Sign up in seconds and get your unique referral link and code.' },
              { step: '02', title: 'Share', desc: 'Recommend our luxury resorts to your friends, family, or audience.' },
              { step: '03', title: 'Earn', desc: 'Receive $50 USD for every confirmed booking made through your link.' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <span className="text-8xl md:text-9xl font-serif font-black text-slate-100 dark:text-slate-800 absolute -top-12 -left-4 z-0">{item.step}</span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif font-medium text-slate-900 dark:text-white mb-6 tracking-tight">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Modal */}
      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)} 
        onSuccess={() => setIsLoggedIn(true)} 
      />
    </div>
  );
};

export default ReferralPage;
