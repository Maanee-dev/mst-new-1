import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimationFrame } from 'motion/react';
import { supabase, mapResort } from '../lib/supabase';

interface GalleryImage {
  url: string;
  resort: string;
  bw: boolean;
  text: string;
}

const maldivesFacts = [
  "The Maldives consists of 1,192 coral islands grouped in a double chain of 26 atolls.",
  "It is the lowest-lying country in the world, with an average ground level of 1.5 meters.",
  "The islands are famous for their white sandy beaches and crystal clear turquoise lagoons.",
  "Maldives is home to some of the most diverse marine life, including whale sharks and manta rays.",
  "Each resort is typically located on its own private island, ensuring ultimate seclusion.",
  "The traditional Maldivian culture is a rich blend of African, Indian, and Arabian influences."
];

const RESORT_NAMES = [
  'Patina Maldives',
  'One&Only Reethi Rah',
  'Villa Nautica Paradise Island Resort',
  'Sun Siyam Olhuveli',
  'JOALI Maldives',
  'The Nautilus Maldives',
  'NH Collection Maldives Reethi Resort'
];

const BW_RESORTS = [
  'Patina Maldives',
  'One&Only Reethi Rah',
  'Villa Nautica Paradise Island Resort',
  'Sun Siyam Olhuveli'
];

const GalleryRow: React.FC<{ rowImages: GalleryImage[]; direction: 'left' | 'right'; speed?: number }> = ({ rowImages, direction, speed = 1 }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Use 3 sets for a seamless infinite scroll experience
  const duplicatedImages = [...rowImages, ...rowImages, ...rowImages];

  useAnimationFrame((time, delta) => {
    if (!scrollRef.current || isHovered) return;

    const scrollAmount = (speed * delta) / 16; // Normalize speed
    if (direction === 'left') {
      scrollRef.current.scrollLeft += scrollAmount;
      // Reset to middle set when reaching the end of the first set
      if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 3) {
        scrollRef.current.scrollLeft -= scrollRef.current.scrollWidth / 3;
      }
    } else {
      scrollRef.current.scrollLeft -= scrollAmount;
      // Reset to middle set when reaching the beginning
      if (scrollRef.current.scrollLeft <= 0) {
        scrollRef.current.scrollLeft += scrollRef.current.scrollWidth / 3;
      }
    }
  });

  // Initial scroll position for right direction
  useEffect(() => {
    if (scrollRef.current && direction === 'right') {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
    }
  }, [direction, rowImages.length]);

  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto no-scrollbar py-8 cursor-grab active:cursor-grabbing select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="flex gap-8 px-4">
        {duplicatedImages.map((img, idx) => (
          <div
            key={`${img.resort}-${idx}`}
            className="flex-shrink-0 w-[280px] md:w-[420px] relative group"
          >
            <div className={`aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-1000 ${img.bw ? 'grayscale hover:grayscale-0' : ''}`}>
              <img
                src={img.url}
                alt={img.resort}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
                draggable={false}
              />
            </div>
            <div className="mt-6 px-4">
              <span className="text-[9px] font-black text-sky-500 uppercase tracking-[0.5em] mb-2 block">{img.resort}</span>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed line-clamp-1">
                {img.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MaldivesGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResortImages = async () => {
      try {
        const { data, error } = await supabase
          .from('resorts')
          .select('*')
          .in('name', RESORT_NAMES);

        if (error) throw error;

        if (data) {
          const mappedResorts = data.map(item => mapResort(item));
          const allImages: GalleryImage[] = [];

          mappedResorts.forEach(resort => {
            const isBW = BW_RESORTS.includes(resort.name);
            resort.images.forEach(imgUrl => {
              allImages.push({
                url: imgUrl,
                resort: resort.name,
                bw: isBW,
                text: resort.shortDescription || `Experience the beauty of ${resort.name}.`
              });
            });
          });

          setImages(allImages.sort(() => Math.random() - 0.5));
        }
      } catch (err) {
        console.error('Failed to fetch gallery images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResortImages();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-slate-950 flex items-center justify-center min-h-[600px]">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  const half = Math.ceil(images.length / 2);
  const row1 = images.slice(0, half);
  const row2 = images.slice(half);

  return (
    <section className="py-24 md:py-32 lg:py-48 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-24 reveal active">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="max-w-3xl">
            <span className="text-[12px] font-black text-sky-500 uppercase tracking-[1.2em] mb-10 block">The Archipelago</span>
            <h3 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
              Island <br /> Perspectives.
            </h3>
          </div>
          <div className="max-w-lg">
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-[0.5em] leading-[2]">
              A curated visual journey through the most prestigious sanctuaries of the Maldives, captured in both timeless monochrome and vibrant color.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <GalleryRow rowImages={row1} direction="left" speed={1.2} />
        
        {/* Fact Marquee */}
        <div className="py-16 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-white/5 overflow-hidden">
          <motion.div
            className="flex gap-32 whitespace-nowrap px-12"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          >
            {[...maldivesFacts, ...maldivesFacts].map((fact, i) => (
              <span key={i} className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-slate-300 dark:text-slate-700 italic">
                {fact}
              </span>
            ))}
          </motion.div>
        </div>

        <GalleryRow rowImages={row2} direction="right" speed={1.5} />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-32 text-center reveal active">
        <div className="inline-flex items-center gap-6 text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.6em]">
          <div className="w-16 h-px bg-slate-100 dark:bg-white/5"></div>
          <span>Interactive Horizon — Drag or Scroll to Explore</span>
          <div className="w-16 h-px bg-slate-100 dark:bg-white/5"></div>
        </div>
      </div>
    </section>
  );
};

export default MaldivesGallery;
