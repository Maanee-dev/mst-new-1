
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Info, ChevronDown, ChevronUp, Share2, Star } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { RESORTS } from '../constants';
import { Accommodation } from '../types';
import { Link } from 'react-router-dom';

const DiscoveryFeed: React.FC = () => {
  const { addItem, isInBag } = useBag();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedResorts, setLikedResorts] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [discoveryResorts, setDiscoveryResorts] = useState<Accommodation[]>([]);

  useEffect(() => {
    const shuffled = [...RESORTS]
      .map(resort => ({
        ...resort,
        discoveryScore: (resort.rating * 2) + (Math.random() * 5)
      }))
      .sort((a, b) => (b as any).discoveryScore - (a as any).discoveryScore);
    setDiscoveryResorts(shuffled);
  }, []);

  useEffect(() => {
    const savedLikes = localStorage.getItem('discovery_likes');
    if (savedLikes) {
      setLikedResorts(JSON.parse(savedLikes));
    }
  }, []);

  const toggleLike = (id: string) => {
    const newLikes = likedResorts.includes(id)
      ? likedResorts.filter(likeId => likeId !== id)
      : [...likedResorts, id];
    
    setLikedResorts(newLikes);
    localStorage.setItem('discovery_likes', JSON.stringify(newLikes));
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  };

  const scrollToNext = () => {
    if (containerRef.current && currentIndex < discoveryResorts.length - 1) {
      containerRef.current.scrollTo({
        top: (currentIndex + 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollToPrev = () => {
    if (containerRef.current && currentIndex > 0) {
      containerRef.current.scrollTo({
        top: (currentIndex - 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[200] overflow-hidden">
      {/* Navigation Overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[210] flex items-center gap-8">
        <button className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors">Following</button>
        <button className="text-white text-[10px] font-black uppercase tracking-[0.4em] border-b-2 border-sky-500 pb-1">For You</button>
      </div>

      <Link to="/" className="absolute top-8 left-8 z-[210] text-white/60 hover:text-white transition-colors">
        <ChevronUp className="-rotate-90 w-6 h-6" />
      </Link>

      {/* Vertical Feed */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {discoveryResorts.map((resort, index) => (
          <DiscoverySlide 
            key={resort.id}
            resort={resort}
            isActive={index === currentIndex}
            isLiked={likedResorts.includes(resort.id)}
            onLike={() => toggleLike(resort.id)}
            onAddToBag={() => {
              if (!isInBag(resort.id)) {
                addItem({
                  id: resort.id,
                  type: 'resort',
                  name: resort.name,
                  image: resort.images[0],
                  slug: resort.slug,
                  price: resort.priceRange,
                  details: resort.atoll
                });
              }
            }}
            isInBag={isInBag(resort.id)}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[210] flex flex-col gap-4">
        <button 
          onClick={scrollToPrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-0"
        >
          <ChevronUp size={24} />
        </button>
        <button 
          onClick={scrollToNext}
          disabled={currentIndex === discoveryResorts.length - 1}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-0"
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
};

interface SlideProps {
  resort: Accommodation;
  isActive: boolean;
  isLiked: boolean;
  onLike: () => void;
  onAddToBag: () => void;
  isInBag: boolean;
}

const DiscoverySlide: React.FC<SlideProps> = ({ resort, isActive, isLiked, onLike, onAddToBag, isInBag }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % resort.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isActive, resort.images.length]);

  const [showLikeHeart, setShowLikeHeart] = useState(false);

  const handleDoubleClick = () => {
    if (!isLiked) {
      onLike();
    }
    setShowLikeHeart(true);
    setTimeout(() => setShowLikeHeart(false), 1000);
  };

  return (
    <div 
      className="h-screen w-full snap-start relative overflow-hidden bg-slate-900"
      onDoubleClick={handleDoubleClick}
    >
      {/* Like Heart Animation */}
      <AnimatePresence>
        {showLikeHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-[220] pointer-events-none"
          >
            <Heart size={120} fill="#f43f5e" className="text-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.8)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={resort.images[currentImageIndex]} 
            alt={resort.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-sky-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                {resort.atoll}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={12} fill="currentColor" />
                <span className="text-[10px] font-black">{resort.rating}.0</span>
              </div>
              <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                {resort.priceRange}
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-white tracking-tighter leading-none mb-8">
              {resort.name}
            </h2>

            <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-12 line-clamp-3">
              {resort.description}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link 
                to={`/stays/${resort.slug}`}
                className="bg-white text-black px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-sky-500 hover:text-white transition-all duration-500 shadow-2xl flex items-center gap-3"
              >
                <Info size={14} />
                Explore Sanctuary
              </Link>
              
              <button 
                onClick={onAddToBag}
                className={`px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl flex items-center gap-3 ${isInBag ? 'bg-sky-500 text-white' : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'}`}
              >
                <ShoppingBag size={14} />
                {isInBag ? 'Added to Bag' : 'Add to Selection'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Side Actions */}
      <div className="absolute right-8 bottom-32 z-[210] flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={onLike}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${isLiked ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'}`}
          >
            <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <span className="text-[9px] font-black text-white uppercase tracking-widest">{isLiked ? 'Liked' : 'Like'}</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <Share2 size={24} />
          </button>
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Share</span>
        </div>

        {/* Progress Indicators */}
        <div className="flex flex-col gap-2 mt-4">
          {resort.images.map((_, i) => (
            <div 
              key={i} 
              className={`w-1 transition-all duration-500 rounded-full ${i === currentImageIndex ? 'h-6 bg-sky-500' : 'h-2 bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryFeed;
