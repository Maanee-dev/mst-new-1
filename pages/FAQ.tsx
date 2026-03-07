import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Plane, ShieldCheck, CreditCard, Sun } from 'lucide-react';
import SEO from '../components/SEO';

const FAQ_DATA = [
  {
    category: "Planning & Arrival",
    icon: <Plane className="w-5 h-5" />,
    questions: [
      {
        q: "Do I need a visa to visit the Maldives?",
        a: "A free 30-day tourist visa is granted to all nationalities upon arrival, provided you have a valid passport (at least 6 months validity), a confirmed resort booking, and a return ticket."
      },
      {
        q: "How do I get to my resort from the airport?",
        a: "Transfers are arranged by your resort and typically involve a seaplane, speedboat, or domestic flight. Seaplanes only operate during daylight hours (6:00 AM - 4:00 PM). We coordinate all logistics for you."
      },
      {
        q: "What is the best time to visit?",
        a: "The peak season is from December to April (dry season). However, the Maldives is a year-round destination. May to October is the wet season, offering better value and excellent conditions for surfing and manta ray sightings."
      }
    ]
  },
  {
    category: "Island Life",
    icon: <Sun className="w-5 h-5" />,
    questions: [
      {
        q: "What should I pack?",
        a: "Lightweight cotton clothing, swimwear, high-SPF sunscreen, and polarized sunglasses are essential. Most resorts have a 'no shoes, no news' philosophy, so casual footwear or flip-flops are sufficient. Note: Dress modestly when visiting local inhabited islands."
      },
      {
        q: "Is there a dress code at resorts?",
        a: "Most resorts are casual during the day. For dinner, 'island chic' is common—smart-casual attire. Some ultra-luxury resorts may have specific requirements for certain fine-dining venues."
      }
    ]
  },
  {
    category: "Currency & Payments",
    icon: <CreditCard className="w-5 h-5" />,
    questions: [
      {
        q: "What currency is used?",
        a: "The local currency is the Maldivian Rufiyaa (MVR), but US Dollars are widely accepted and preferred at all resorts. Major credit cards (Visa, Mastercard, Amex) are accepted everywhere."
      },
      {
        q: "Are tips expected?",
        a: "A 10% service charge is added to almost everything. Additional tipping is not mandatory but highly appreciated for exceptional service from villa hosts, waiters, and boat crews."
      }
    ]
  },
  {
    category: "Health & Safety",
    icon: <ShieldCheck className="w-5 h-5" />,
    questions: [
      {
        q: "Is the water safe to drink?",
        a: "Tap water is generally desalinated and not recommended for drinking. Resorts provide complimentary bottled or treated glass-bottled water in your villa daily."
      },
      {
        q: "What medical facilities are available?",
        a: "All resorts have an on-site clinic or doctor for basic medical needs. For emergencies, transfers to Male' (the capital) or regional hospitals are arranged. We strongly recommend comprehensive travel insurance."
      }
    ]
  }
];

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen pt-32 pb-24 transition-colors duration-700">
      <SEO 
        title="Travel FAQ | Maldives Serenity Travels" 
        description="Find answers to common questions about traveling to the Maldives, including visas, transfers, packing tips, and more."
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="mb-24 md:mb-32">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-[1em] mb-8 block"
          >
            Knowledge Base
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-serif font-bold text-slate-950 dark:text-white tracking-tighter leading-none"
          >
            Travel <br /> <span className="italic text-sky-600">Intelligence.</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-4">
              {FAQ_DATA.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCategory(idx);
                    setOpenIndex(0);
                  }}
                  className={`w-full flex items-center justify-between p-8 rounded-[2rem] transition-all duration-500 group ${
                    activeCategory === idx 
                      ? 'bg-white dark:bg-slate-900 shadow-xl border-sky-500/20' 
                      : 'hover:bg-white/50 dark:hover:bg-slate-900/30'
                  } border border-transparent`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      activeCategory === idx ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {cat.icon}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${
                      activeCategory === idx ? 'text-slate-950 dark:text-white' : 'text-slate-400'
                    }`}>
                      {cat.category}
                    </span>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${
                    activeCategory === idx ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  } text-sky-600`} />
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {FAQ_DATA[activeCategory].questions.map((item, qIdx) => (
                    <div 
                      key={qIdx}
                      className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-500 hover:shadow-lg"
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === qIdx ? null : qIdx)}
                        className="w-full p-8 md:p-10 flex items-center justify-between text-left group"
                      >
                        <span className="text-lg md:text-xl font-serif font-bold text-slate-950 dark:text-white tracking-tight group-hover:text-sky-600 transition-colors">
                          {item.q}
                        </span>
                        <div className={`w-10 h-10 rounded-full border border-slate-100 dark:border-white/10 flex items-center justify-center transition-all ${
                          openIndex === qIdx ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 rotate-180' : 'text-slate-400'
                        }`}>
                          {openIndex === qIdx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                      </button>
                      
                      <motion.div
                        initial={false}
                        animate={{ height: openIndex === qIdx ? 'auto' : 0, opacity: openIndex === qIdx ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 md:px-10 pb-10 pt-2 border-t border-slate-50 dark:border-white/5">
                          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Support Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 p-12 md:p-16 rounded-[4rem] bg-sky-600 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-md text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 tracking-tight">Still have questions?</h3>
                  <p className="text-white/80 text-lg leading-relaxed font-medium">
                    Our travel experts are available 24/7 to provide personalized assistance for your Maldivian journey.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link to="/contact" className="bg-white text-slate-950 font-black px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] hover:bg-slate-100 transition-all shadow-xl">
                    Contact Us
                  </Link>
                  <a href="https://wa.me/9600000000" className="border border-white/30 text-white font-black px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-slate-950 transition-all">
                    WhatsApp Direct
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default FAQ;
