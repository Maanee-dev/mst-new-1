
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
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

          // Shuffle images for a "random" feel as requested
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

  const GalleryRow: React.FC<{ rowImages: GalleryImage[]; direction: 'left' | 'right'; speed?: number }> = ({ rowImages, direction, speed = 40 }) => {
    if (rowImages.length === 0) return null;
    const duplicatedImages = [...rowImages, ...rowImages, ...rowImages]; // Triple for smooth looping

    return (
      <div className="flex overflow-hidden py-4">
        <motion.div
          className="flex gap-6 px-3"
          animate={{
            x: direction === 'left' ? [0, -100 * rowImages.length] : [-100 * rowImages.length, 0],
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

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-slate-950 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  const half = Math.ceil(images.length / 2);
  const row1 = images.slice(0, half);
  const row2 = images.slice(half);

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-16 reveal active">
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
        <GalleryRow rowImages={row1} direction="left" speed={60} />
        
        {/* Fact Marquee */}
        <div className="py-12 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-white/5 overflow-hidden">
          <motion.div
            className="flex gap-24 whitespace-nowrap"
            animate={{ x: [0, -2000] }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            {[...maldivesFacts, ...maldivesFacts].map((fact, i) => (
              <span key={i} className="text-2xl md:text-4xl font-serif font-medium text-slate-300 dark:text-slate-700 italic">
                {fact}
              </span>
            ))}
          </motion.div>
        </div>

        <GalleryRow rowImages={row2} direction="right" speed={70} />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-20 text-center reveal active">
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
