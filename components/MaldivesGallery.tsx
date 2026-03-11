import React, { useEffect, useState, useRef } from 'react';
import { useAnimationFrame } from 'motion/react';
import { supabase, mapResort } from '../lib/supabase';

interface GalleryImage {
  url: string;
  resort: string;
}

const RESORT_NAMES = [
  'Patina Maldives',
  'One&Only Reethi Rah',
  'Villa Nautica Paradise Island Resort',
  'Sun Siyam Olhuveli',
  'JOALI Maldives',
  'The Nautilus Maldives',
  'NH Collection Maldives Reethi Resort'
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
      className="flex overflow-x-auto no-scrollbar py-4 cursor-grab active:cursor-grabbing select-none"
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
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-1000">
              <img
                src={img.url}
                alt={img.resort}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
                draggable={false}
              />
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
            resort.images.forEach(imgUrl => {
              allImages.push({
                url: imgUrl,
                resort: resort.name
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
    <section className="py-12 md:py-24 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="space-y-8">
        <GalleryRow rowImages={row1} direction="left" speed={1.2} />
        <GalleryRow rowImages={row2} direction="right" speed={1.5} />
      </div>
    </section>
  );
};

export default MaldivesGallery;
