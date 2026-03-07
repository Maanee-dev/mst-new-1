
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { 
  CheckCircle2,
  ArrowRight,
  Quote,
  Star,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';

const AboutUs: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  };

  const pillars = [
    {
      number: "01",
      title: "Maldives Specialists",
      description: "Our team consists of local experts with intimate knowledge of every atoll, ensuring you discover the true, hidden essence of the islands."
    },
    {
      number: "02",
      title: "Direct Resort Partnerships",
      description: "We maintain direct relationships with the finest resorts, allowing us to offer exclusive privileges and the most competitive rates for our guests."
    },
    {
      number: "03",
      title: "Data-Driven Travel Planning",
      description: "We leverage deep industry insights and seasonal data to recommend the perfect timing and destination for your specific travel desires."
    },
    {
      number: "04",
      title: "Tailor-Made Experiences",
      description: "Every itinerary is a blank canvas. We meticulously craft each detail to align with your personal definition of luxury and serenity."
    }
  ];

  const googleReviews = [
    {
      name: "Mohamed Ahil",
      date: "5 months ago",
      rating: 5,
      text: "Amazing full week getaway! Everything was perfectly organized, hassle-free, and beyond expectations. Smooth transfers between the islands and resorts, Big thanks to serenity travels for making it unforgettable!",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjW_LoFG_CziG69lCL4BFpF6ylcbR2DZIXTmRUUl9qDAFQQa-Ic=w144-h144-p-rp-mo-br100"
    },
    {
      name: "riven",
      date: "1 month ago",
      rating: 5,
      text: "My experience with Maldives Serenity Travels was truly remarkable. From the very beginning, their professionalism and genuine care made me feel confident that I was in the best hands. They listened closely to my preferences and created a journey that felt personal, effortless, and unforgettable.",
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocKB7z9FTyBQupGTzq7C7_vWZ6muBa9il0RBzrEoXjDHtJ1opQ=w72-h72-p-rp-mo-br100"
    },
    {
      name: "sara",
      date: "3 months ago",
      rating: 5,
      text: "I had an incredible experience booking my trip with Maldives Serenity Travels. From the very start, their team was professional, friendly, and truly dedicated to ensuring a smooth and unforgettable travel experience. They took the time to understand my preferences, offering personalized recommendations that perfectly matched what I was looking for.",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXcSSuS5_LDcrbWqPFnmCbNHON_PpoyC2fXUzx6NXgjRqWFbXS8=w144-h144-p-rp-mo-br100"
    }
  ];

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen selection:bg-sky-100 selection:text-sky-900 transition-colors duration-700 font-sans">
      <SEO 
        title="About Us | Maldives Serenity Travels" 
        description="Learn about Maldives Serenity Travels, your trusted specialist for curated luxury resort experiences and bespoke island escapes in the Maldives."
        keywords={['Maldives travel agency', 'luxury travel specialist', 'about Maldives Serenity Travels', 'bespoke Maldives holidays']}
      />

      {/* Magazine Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-2/3 h-full z-0">
          <motion.div 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img 
              src="https://maldives-serenitytravels.com/images/Screenshot 2026-02-24 at 23.30.16.png" 
              className="w-full h-full object-cover" 
              alt="Serene Maldives Horizon"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#fcfbf9]/50 to-[#fcfbf9] dark:via-slate-950/50 dark:to-slate-950" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="text-[11px] uppercase tracking-[1em] font-black mb-12 block text-sky-600 dark:text-sky-400">
                Volume 01 — The Heritage
              </span>
              <h1 className="text-[12vw] lg:text-[10rem] font-serif font-bold text-slate-950 dark:text-white leading-[0.82] tracking-tighter mb-12">
                CURATING <br />
                <span className="italic font-medium text-sky-600/90 dark:text-sky-100/90 ml-[0.5em]">SILENCE.</span>
              </h1>
            </motion.div>
            
            <div className="flex flex-col md:flex-row items-start md:items-end gap-12 mt-12">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium leading-loose max-w-md"
              >
                Maldives Serenity Travels is a boutique agency born from the southern frontier of the archipelago, dedicated to the art of the bespoke journey.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex gap-6"
              >
                <Link to="/stays" className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black px-10 py-5 rounded-full hover:bg-sky-600 dark:hover:bg-sky-400 transition-all duration-500 uppercase tracking-[0.3em] text-[10px] shadow-xl group">
                  Explore <ArrowRight className="inline-block ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Split Layout: The Narrative */}
      <section className="py-32 md:py-40 lg:py-64 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <motion.div {...fadeIn}>
                <div className="flex items-center gap-4 mb-12">
                  <span className="text-[10px] font-black text-sky-600 uppercase tracking-[1em]">The Narrative</span>
                  <div className="h-[1px] flex-grow bg-slate-100 dark:bg-white/10"></div>
                </div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-950 dark:text-white leading-[0.9] mb-12 tracking-tighter">
                  A Passion for the <br /> 
                  <span className="text-sky-600 italic font-medium">Southern Frontier.</span>
                </h2>
                <div className="space-y-8 text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                  <p>
                    Maldives Serenity Travels was born from a deep-rooted love for the Maldivian archipelago and a desire to share its most hidden sanctuaries with the world. Based in the southern atolls, we bridge the gap between local intimacy and global luxury standards.
                  </p>
                  <p>
                    Our journey began with a simple mission: to provide a level of personalized service that transcends the typical travel booking. We don't just book rooms; we manifest dreams through direct resort partnerships and a meticulous eye for detail.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-7 order-1 lg:order-2 relative">
              <motion.div 
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="relative z-10 aspect-[16/10] rounded-[4rem] overflow-hidden shadow-2xl"
              >
                <img 
                  src="https://maldives-serenitytravels.com/images/Screenshot 2026-02-24 at 23.31.53.png" 
                  className="w-full h-full object-cover" 
                  alt="Luxury Maldivian Resort"
                />
              </motion.div>
              {/* Floating Element */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -bottom-12 -right-12 z-20 bg-sky-600 text-white p-12 rounded-[3rem] shadow-2xl hidden md:block max-w-xs"
              >
                <Quote className="w-8 h-8 text-white/30 mb-6" />
                <p className="font-serif italic text-2xl leading-relaxed">
                  "Luxury is found in the silence of the islands."
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section: Prestige Layout */}
      <section className="py-32 md:py-40 lg:py-64 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-700">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div {...fadeIn} className="relative">
              {/* Oval Mask Image */}
              <div className="relative w-full max-w-md mx-auto aspect-[3/4] overflow-hidden rounded-[100%] shadow-2xl border-[12px] border-white dark:border-slate-800">
                <img 
                  src="https://media.licdn.com/dms/image/v2/D5603AQHvPDMWFI6FGw/profile-displayphoto-scale_400_400/B56ZkqP.j4HUAg-/0/1757350461407?e=1773273600&v=beta&t=8Qcc59UhOAvdsNEM38ans4n2PswfgfTA3ceXxW5zA-U" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
                  alt="Founder of Maldives Serenity Travels"
                />
              </div>
              {/* Vertical Rail Text */}
              <div className="absolute top-1/2 -left-12 -translate-y-1/2 hidden xl:block">
                <span className="writing-mode-vertical-rl rotate-180 text-[10px] font-black uppercase tracking-[1em] text-slate-300 dark:text-slate-700">
                  ESTABLISHED 2024 — ADDU CITY
                </span>
              </div>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <span className="text-sky-600 font-black uppercase tracking-[0.8em] text-[10px] mb-8 block">The Visionary</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-950 dark:text-white leading-[0.9] mb-12 tracking-tighter">
                Maanee <br /> 
                <span className="italic font-medium text-sky-600">Ali.</span>
              </h2>
              <div className="space-y-8 text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium mb-12">
                <p>
                  "I grew up in the southern atolls, where the ocean isn't just a view—it's a way of life. I founded Serenity Travels to bring that authentic, quiet luxury to the world. We don't just sell holidays; we share our home."
                </p>
                <p>
                  Maanee's deep connections with resort founders and local island councils ensure that Serenity guests receive a level of access and hospitality that is truly unparalleled in the industry.
                </p>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-16 h-[1px] bg-slate-200 dark:bg-white/10"></div>
                <span className="font-serif italic text-2xl text-slate-400 dark:text-slate-600">Founder & CEO</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision: Asymmetrical Grid */}
      <section className="py-32 md:py-40 lg:py-64 bg-white dark:bg-slate-950">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <motion.div {...fadeIn} className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 p-16 md:p-24 rounded-[4rem]">
              <span className="text-sky-600 font-black uppercase tracking-[0.8em] text-[9px] mb-12 block">Our Mission</span>
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-950 dark:text-white mb-12 tracking-tight leading-[0.9]">Seamless, Personalized <br /> Luxury.</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium max-w-xl">
                To provide discerning travelers with a seamless and deeply personalized journey to the Maldives, ensuring every stay is a masterpiece of comfort, privacy, and authentic island hospitality.
              </p>
            </motion.div>
            
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="lg:col-span-5 bg-sky-600 p-16 md:p-24 rounded-[4rem] text-white flex flex-col justify-end">
              <span className="text-white/60 font-black uppercase tracking-[0.8em] text-[9px] mb-12 block">Our Vision</span>
              <h3 className="text-4xl md:text-5xl font-serif font-bold mb-12 tracking-tight leading-[0.9]">The Trusted <br /> Specialist.</h3>
              <p className="text-white/80 text-lg leading-relaxed font-medium">
                To be recognized as the premier trusted specialist for Maldivian travel, setting the global benchmark for curated island escapes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* USP Section: Oversized Typographic */}
      <section className="py-32 md:py-40 lg:py-64 bg-parchment dark:bg-slate-950">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-32">
            <motion.span {...fadeIn} className="text-sky-600 font-black uppercase tracking-[1em] text-[10px] mb-8 block">The Serenity Edge</motion.span>
            <motion.h2 {...fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-slate-950 dark:text-white tracking-tighter">What Makes Us Different.</motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
            {pillars.map((pillar, i) => (
              <motion.div 
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <span className="absolute -top-16 -left-8 text-[10rem] font-serif font-black text-slate-100 dark:text-slate-900/50 -z-10 group-hover:text-sky-500/10 transition-colors duration-700">
                  {pillar.number}
                </span>
                <div className="pt-12">
                  <h4 className="text-[14px] font-black uppercase tracking-[0.4em] text-slate-950 dark:text-white mb-8">{pillar.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews: Atmospheric Masonry */}
      <section className="py-32 md:py-40 lg:py-64 bg-slate-950 relative overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-32">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-current" />)}
                </div>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">4.9/5 ON GOOGLE</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tighter">Verified <br /> <span className="italic text-sky-400">Satisfaction.</span></h2>
            </div>
            
            <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl px-10 py-6 rounded-full border border-white/10">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">G</div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Google Reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {googleReviews.map((review, i) => (
              <motion.div 
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className={`bg-white/5 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/10 relative group ${i === 1 ? 'md:translate-y-12' : ''}`}
              >
                <div className="flex items-center gap-6 mb-10">
                  <div className="relative">
                    <img src={review.avatar} className="w-16 h-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 border-2 border-white/10" alt={review.name} />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-950">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-1">{review.name}</h4>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{review.date}</p>
                  </div>
                </div>
                <p className="text-white/80 text-lg leading-relaxed italic font-serif mb-8">
                  "{review.text}"
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-current" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Credibility: Minimalist Grid */}
      <section className="py-32 md:py-40 lg:py-64 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn} className="mb-32">
            <span className="text-sky-600 font-black uppercase tracking-[1em] text-[10px] mb-12 block">Confidence & Security</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-950 dark:text-white mb-16 tracking-tight leading-tight">
              Licensed by the Ministry of Tourism, <br /> Republic of Maldives.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
               <div className="text-[10px] font-black uppercase tracking-widest">Ministry of Tourism</div>
               <div className="text-[10px] font-black uppercase tracking-widest">Maldives Registry</div>
               <div className="text-[10px] font-black uppercase tracking-widest">Verified Satisfaction</div>
               <div className="text-[10px] font-black uppercase tracking-widest">Secure Payments</div>
            </div>
          </motion.div>
          
          <motion.div {...fadeIn} className="flex flex-col items-center gap-12">
            <div className="w-24 h-[1px] bg-slate-100 dark:bg-white/10"></div>
            <div className="flex gap-8">
              <a href="#" className="text-slate-300 hover:text-sky-600 transition-colors"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="text-slate-300 hover:text-sky-600 transition-colors"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="text-slate-300 hover:text-sky-600 transition-colors"><Twitter className="w-6 h-6" /></a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA: Split Bold Layout */}
      <section className="min-h-[80vh] grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-slate-950 flex flex-col justify-center p-16 md:p-32 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <h2 className="text-[40vw] font-serif -rotate-12 translate-y-1/4 whitespace-nowrap">Perspective</h2>
          </div>
          <div className="relative z-10">
            <span className="text-sky-400 font-black uppercase tracking-[1.5em] text-[10px] mb-12 block">Your Journey Awaits</span>
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-16 tracking-tighter leading-[0.85]">Manifest Your <br /> Maldivian <br /> Dream.</h3>
            <Link to="/plan" className="inline-flex items-center gap-6 bg-white text-slate-950 font-black px-16 py-7 rounded-full hover:bg-sky-500 hover:text-white transition-all duration-700 uppercase tracking-[0.5em] text-[11px] shadow-2xl">
              Plan My Trip <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="relative hidden lg:block">
          <img 
            src="https://maldives-serenitytravels.com/images/Screenshot 2026-02-24 at 23.33.11.png" 
            className="w-full h-full object-cover" 
            alt="Maldives Sunset"
          />
          <div className="absolute inset-0 bg-sky-900/20 mix-blend-multiply" />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
