
import React from 'react';
import { motion } from 'motion/react';

const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800',
    resort: 'Patina Maldives',
    bw: true,
    text: 'A sanctuary of modern design and natural beauty.'
  },
  {
    url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800',
    resort: 'One&Only Reethi Rah',
    bw: true,
    text: 'Ultra-luxury redefined in the heart of the Indian Ocean.'
  },
  {
    url: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=800',
    resort: 'Villa Nautica Paradise Island Resort',
    bw: true,
    text: 'Where the rhythm of the ocean meets timeless elegance.'
  },
  {
    url: 'https://images.unsplash.com/photo-1502602898657-3e917247a183?auto=format&fit=crop&q=80&w=800',
    resort: 'Sun Siyam Olhuveli',
    bw: true,
    text: 'Traditional Maldivian charm with a contemporary twist.'
  },
  {
    url: 'https://images.unsplash.com/photo-1510011564758-29df30730163?auto=format&fit=crop&q=80&w=800',
    resort: 'JOALI Maldives',
    bw: false,
    text: 'The first art-immersive resort in the Maldives.'
  },
  {
    url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=800',
    resort: 'The Nautilus Maldives',
    bw: false,
    text: 'A world of your own making, where time stands still.'
  },
  {
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
    resort: 'NH Collection Maldives Reethi Resort',
    bw: false,
    text: 'Eco-friendly luxury on a lush tropical island.'
  },
  {
    url: 'https://images.unsplash.com/photo-1506929199175-6374f608c05a?auto=format&fit=crop&q=80&w=800',
    resort: 'Patina Maldives',
    bw: true,
    text: 'Spiritual harmony and artistic expression.'
  },
  {
    url: 'https://images.unsplash.com/photo-1516815231560-8581bb6309f2?auto=format&fit=crop&q=80&w=800',
    resort: 'One&Only Reethi Rah',
    bw: true,
    text: 'Secluded villas and pristine white sands.'
  },
  {
    url: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&q=80&w=800',
    resort: 'JOALI Maldives',
    bw: false,
    text: 'Joy of living in every detail.'
  }
];

const maldivesFacts = [
  "The Maldives consists of 1,192 coral islands grouped in a double chain of 26 atolls.",
  "It is the lowest-lying country in the world, with an average ground level of 1.5 meters.",
  "The islands are famous for their white sandy beaches and crystal clear turquoise lagoons.",
  "Maldives is home to some of the most diverse marine life, including whale sharks and manta rays.",
  "Each resort is typically located on its own private island, ensuring ultimate seclusion.",
  "The traditional Maldivian culture is a rich blend of African, Indian, and Arabian influences."
];

const GalleryRow: React.FC<{ images: typeof galleryImages; direction: 'left' | 'right'; speed?: number }> = ({ images, direction, speed = 40 }) => {
  const duplicatedImages = [...images, ...images, ...images]; // Triple for smooth looping

  return (
    <div className="flex overflow-hidden py-4">
      <motion.div
        className="flex gap-6 px-3"
        animate={{
          x: direction === 'left' ? [0, -100 * images.length] : [-100 * images.length, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedImages.map((img, idx) => (
          <div
            key={`${img.resort}-${idx}`}
            className="flex-shrink-0 w-[300px] md:w-[450px] relative group"
          >
            <div className={`aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg transition-all duration-700 ${img.bw ? 'grayscale hover:grayscale-0' : ''}`}>
              <img
                src={img.url}
                alt={img.resort}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-4 px-2">
              <span className="text-[8px] font-black text-sky-500 uppercase tracking-[0.4em] mb-1 block">{img.resort}</span>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-relaxed line-clamp-1">
                {img.text}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const MaldivesGallery: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-16 reveal">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-black text-sky-500 uppercase tracking-[1em] mb-8 block">The Archipelago</span>
            <h3 className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none">
              Island <br /> Perspectives.
            </h3>
          </div>
          <div className="max-w-md">
            <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] leading-loose">
              A curated visual journey through the most prestigious sanctuaries of the Maldives, captured in both timeless monochrome and vibrant color.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <GalleryRow images={galleryImages.slice(0, 5)} direction="left" speed={50} />
        
        {/* Fact Marquee */}
        <div className="py-12 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-white/5 overflow-hidden">
          <motion.div
            className="flex gap-24 whitespace-nowrap"
            animate={{ x: [0, -2000] }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          >
            {[...maldivesFacts, ...maldivesFacts].map((fact, i) => (
              <span key={i} className="text-2xl md:text-4xl font-serif font-medium text-slate-300 dark:text-slate-700 italic">
                {fact}
              </span>
            ))}
          </motion.div>
        </div>

        <GalleryRow images={galleryImages.slice(5)} direction="right" speed={60} />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-20 text-center reveal">
        <div className="inline-flex items-center gap-4 text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em]">
          <span>Interactive Horizon</span>
          <div className="w-24 h-px bg-slate-100 dark:bg-white/5"></div>
          <span>Scroll to Explore Manually</span>
        </div>
      </div>
    </section>
  );
};

export default MaldivesGallery;
