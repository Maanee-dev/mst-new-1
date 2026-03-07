
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, X, Heart, ShoppingBag, Share2, MessageCircle, Check, Send } from 'lucide-react';
import { supabase, mapResort } from '../lib/supabase';
import { RESORTS } from '../constants';
import { Accommodation, ResortComment } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { useBag } from '../context/BagContext';
import UserPanel from '../components/UserPanel';
import { User } from 'lucide-react';

const DiscoveryForYou: React.FC = () => {
  const [shuffledResorts, setShuffledResorts] = useState<Accommodation[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<ResortComment[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ResortComment | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem, isInBag, setIsUserPanelOpen } = useBag();

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const { data, error } = await supabase.from('resorts').select('*');
        let resorts: Accommodation[] = [];
        if (data && data.length > 0) {
          resorts = data.map(mapResort);
        } else {
          resorts = [...RESORTS];
        }
        // Shuffle resorts
        const shuffled = resorts.sort(() => Math.random() - 0.5);
        setShuffledResorts(shuffled);

        // Fetch comment counts for all resorts
        const { data: countsData } = await supabase
          .from('resort_comments')
          .select('resort_id');
        
        if (countsData) {
          const counts: Record<string, number> = {};
          countsData.forEach(c => {
            counts[c.resort_id] = (counts[c.resort_id] || 0) + 1;
          });
          setCommentCounts(counts);
        }
      } catch (err) {
        console.error('Failed to fetch resorts:', err);
        setShuffledResorts([...RESORTS].sort(() => Math.random() - 0.5));
      }
    };
    fetchResorts();
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddToBag = (resort: Accommodation) => {
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
  };

  const fetchComments = async (resortId: string) => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('resort_comments')
        .select('*')
        .eq('resort_id', resortId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group comments by parent_id
      const mainComments = data.filter(c => !c.parent_id);
      const replies = data.filter(c => c.parent_id);

      const threaded = mainComments.map(mc => ({
        ...mc,
        replies: replies.filter(r => r.parent_id === mc.id)
      }));

      setComments(threaded);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (showComments && shuffledResorts[activeIndex]) {
      fetchComments(shuffledResorts[activeIndex].id);
    }
  }, [showComments, activeIndex, shuffledResorts]);

  const handleSendComment = async (resortId: string) => {
    if (!commentText.trim()) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const parentId = replyingTo?.parent_id || replyingTo?.id || null;
      const content = replyingTo?.parent_id 
        ? `@${replyingTo.user_name} ${commentText}` 
        : commentText;

      const newComment = {
        resort_id: resortId,
        user_id: user?.id || 'anonymous',
        user_name: user?.user_metadata?.full_name || 'Island Explorer',
        content: content,
        parent_id: parentId,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('resort_comments')
        .insert([newComment]);

      if (error) throw error;

      setCommentText('');
      setReplyingTo(null);
      fetchComments(resortId);
    } catch (err) {
      console.error('Error adding comment:', err);
      // Fallback for local testing if table doesn't exist
      const localComment: ResortComment = {
        id: Math.random().toString(36).substr(2, 9),
        resort_id: resortId,
        user_id: 'local',
        user_name: 'Island Explorer',
        content: replyingTo ? `@${replyingTo.user_name} ${commentText}` : commentText,
        created_at: new Date().toISOString(),
        parent_id: replyingTo?.id
      };
      
      if (replyingTo) {
        setComments(prev => prev.map(c => 
          c.id === (replyingTo.parent_id || replyingTo.id) 
            ? { ...c, replies: [...(c.replies || []), localComment] }
            : c
        ));
      } else {
        setComments(prev => [...prev, localComment]);
      }
      setCommentText('');
      setReplyingTo(null);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to like comments.');
        return;
      }
      const userId = user.id;

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('resort_comment_likes')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        await supabase
          .from('resort_comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', userId);
      } else {
        await supabase
          .from('resort_comment_likes')
          .insert([{ comment_id: commentId, user_id: userId }]);
      }
      
      if (shuffledResorts[activeIndex]) {
        fetchComments(shuffledResorts[activeIndex].id);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // Fallback local toggle
      setComments(prev => prev.map(c => {
        if (c.id === commentId) return { ...c, is_liked: !c.is_liked, likes_count: (c.likes_count || 0) + (c.is_liked ? -1 : 1) };
        if (c.replies) return { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, is_liked: !r.is_liked, likes_count: (r.likes_count || 0) + (r.is_liked ? -1 : 1) } : r) };
        return c;
      }));
    }
  };

  if (shuffledResorts.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black z-[100] overflow-hidden">
      <SEO 
        title="Discovery For You | Maldives Serenity Travels" 
        description="Discover your perfect Maldivian escape through our curated vertical feed."
      />

      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex-1">
          <button 
            onClick={() => setIsUserPanelOpen(true)}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors shadow-lg"
          >
            <User size={20} />
          </button>
        </div>
        
        {/* Center: Brand Identity Logo */}
        <Link to="/" aria-label="Maldives Serenity Travels Home" className="flex flex-col items-center group transition-transform duration-500 hover:scale-[1.02] relative z-10">
          <svg 
            version="1.0" 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 600"
            preserveAspectRatio="xMidYMid meet"
            className="w-20 h-20 md:w-32 md:h-32 lg:w-44 lg:h-44 -my-6 md:-my-10 lg:-my-16 fill-white drop-shadow-lg transition-all duration-1000"
            aria-hidden="true"
          >
            <g transform="translate(0.000000,600.000000) scale(0.100000,-0.100000)" stroke="none">
              <path d="M3116 3398 c-10 -14 -16 -44 -16 -81 0 -63 -18 -108 -67 -166 -27 -32 -33 -34 -100 -37 -159 -6 -255 -146 -123 -179 75 -18 277 140 338 266 38 77 59 183 41 205 -17 21 -56 17 -73 -8z"/>
              <path d="M2630 3340 c-28 -18 -41 -355 -16 -415 16 -37 44 -46 65 -21 7 8 13 88 17 214 5 200 5 200 -18 216 -26 19 -28 19 -48 6z"/>
              <path d="M3213 3243 c-21 -8 -16 -61 7 -73 38 -21 80 22 60 61 -10 18 -40 24 -67 12z"/>
              <path d="M2045 3162 c-16 -11 -36 -26 -44 -35 -20 -26 -52 -20 -87 14 l-32 31 -59 -34 c-57 -34 -58 -35 -61 -84 -5 -90 52 -112 86 -34 l17 41 54 -41 c68 -50 67 -50 118 7 l43 48 30 -35 c17 -19 42 -48 55 -63 29 -34 56 -32 69 4 8 23 2 37 -39 100 -70 107 -89 118 -150 81z"/>
              <path d="M3745 3166 c-17 -7 -44 -30 -61 -51 -19 -24 -40 -38 -58 -40 -56 -7 -73 -48 -35 -86 17 -17 29 -20 58 -16 30 5 43 1 75 -23 65 -49 167 -36 174 22 3 24 -1 28 -32 34 -42 7 -42 7 -15 44 56 75 -18 155 -106 116z"/>
              <path d="M3982 3120 c-37 -36 -48 -85 -33 -133 8 -24 8 -42 2 -61 -23 -59 67 -69 104 -12 18 27 14 41 -25 103 -13 21 -12 25 20 58 28 29 32 39 24 53 -19 30 -58 26 -92 -8z"/>
              <path d="M2425 3099 c-16 -10 -39 -19 -49 -19 -25 0 -91 -70 -100 -106 -18 -69 69 -90 121 -29 33 38 33 38 72 25 29 -9 43 -10 60 -1 22 12 28 45 10 57 -6 3 -19 26 -29 50 -22 49 -38 54 -85 23z"/>
              <path d="M3331 3101 c-25 -16 4 -86 54 -137 52 -51 62 -53 115 -18 45 30 56 56 46 110 -10 52 -32 54 -72 8 l-33 -39 -39 43 c-42 44 -48 47 -71 33z"/>
              <path d="M3200 3030 c-14 -25 15 -93 41 -98 23 -4 49 25 49 54 0 52 -68 85 -90 44z"/>
              <path d="M4146 3018 c-43 -60 17 -123 68 -72 29 29 6 94 -34 94 -10 0 -26 -10 -34 -22z"/>
              <path d="M1475 2802 c-76 -15 -61 -77 30 -128 41 -23 27 -64 -22 -64 -16 0 -25 8 -29 25 -8 30 -20 32 -27 4 -10 -37 2 -49 49 -49 103 0 113 80 16 132 -20 11 -32 25 -32 38 0 29 52 28 73 -2 l16 -23 0 31 c1 33 -24 45 -74 36z"/>
              <path d="M4495 2803 c-66 -16 -63 -73 5 -115 51 -32 59 -45 38 -66 -22 -22 -57 -14 -64 13 -8 30 -20 32 -27 4 -10 -37 2 -49 49 -49 103 0 113 80 16 132 -44 23 -44 58 -1 58 22 0 32 -5 36 -20 8 -30 23 -24 23 10 0 19 -5 30 -14 30 -8 0 -20 2 -28 4 -7 2 -22 1 -33 -1z"/>
              <path d="M1616 2791 c-4 -5 -2 -12 4 -16 14 -9 13 -148 -2 -163 -17 -17 10 -24 77 -19 66 5 68 7 62 44 -4 27 -5 27 -12 6 -6 -18 -15 -23 -46 -23 -37 0 -39 2 -39 30 0 35 23 49 51 32 27 -17 29 -15 29 18 0 29 -13 40 -25 20 -15 -25 -55 -11 -55 20 0 28 2 30 40 30 29 0 40 -4 40 -15 0 -8 5 -15 11 -15 6 0 9 12 7 28 -3 26 -5 27 -70 30 -36 2 -69 -2 -72 -7z"/>
              <path d="M1820 2790 c0 -5 5 -10 10 -10 6 0 10 -33 10 -79 0 -44 -4 -83 -10 -86 -5 -3 -10 -10 -10 -16 0 -12 57 -12 65 1 3 6 1 10 -4 10 -6 0 -11 18 -11 41 0 33 3 40 16 35 9 -3 19 -6 24 -6 5 0 14 -15 20 -34 14 -42 34 -60 57 -51 16 6 16 8 3 18 -9 7 -25 28 -37 48 -20 36 -20 37 -2 53 25 21 24 51 -3 70 -25 18 -128 22 -128 6z m113 -31 c6 -23 -23 -59 -48 -59 -11 0 -15 11 -15 40 0 37 2 40 29 40 21 0 30 -6 34 -21z"/>
              <path d="M2036 2792 c-3 -6 1 -15 9 -22 22 -18 20 -127 -1 -152 -23 -24 -2 -32 71 -26 65 5 68 8 62 45 -4 27 -5 27 -12 6 -6 -18 -15 -23 -44 -23 -34 0 -36 2 -36 32 0 35 26 51 48 29 18 -18 27 -12 27 19 0 17 -4 30 -10 30 -5 0 -10 -4 -10 -10 0 -5 -13 -10 -30 -10 -27 0 -30 3 -30 30 0 28 2 30 40 30 29 0 40 -4 40 -15 0 -8 5 -15 11 -15 6 0 9 12 7 28 -3 26 -5 27 -70 30 -36 2 -69 -1 -72 -6z"/>
              <path d="M2240 2790 c0 -5 5 -10 10 -10 6 0 10 -33 10 -79 0 -44 -4 -83 -10 -86 -20 -12 -9 -25 20 -25 29 0 40 13 20 25 -5 3 -10 38 -10 77 l0 71 58 -83 c78 -114 84 -113 81 1 -1 63 2 94 10 97 23 8 10 22 -20 22 -24 0 -30 -3 -25 -16 11 -29 19 -124 10 -124 -5 0 -29 32 -54 70 -37 57 -50 69 -72 70 -16 0 -28 -4 -28 -10z"/>
              <path d="M2500 2790 c0 -5 5 -10 10 -10 18 0 12 -149 -7 -168 -16 -16 -15 -17 16 -20 46 -5 72 6 49 19 -25 14 -27 169 -2 169 8 0 12 5 9 10 -3 6 -22 10 -41 10 -19 0 -34 -4 -34 -10z"/>
              <path d="M2634 2786 c-3 -8 -4 -25 -2 -38 4 -22 5 -22 13 -3 10 23 24 35 43 35 20 0 17 -156 -4 -164 -25 -10 -6 -26 31 -26 36 0 54 14 30 24 -26 10 -21 166 5 166 13 0 24 -10 30 -25 13 -35 20 -31 20 10 l0 35 -80 0 c-61 0 -82 -4 -86 -14z"/>
              <path d="M2840 2790 c0 -5 4 -10 9 -10 36 0 90 -147 61 -165 -21 -13 -9 -25 25 -25 34 0 46 12 25 25 -28 17 27 165 61 165 5 0 9 5 9 10 0 6 -16 10 -35 10 -19 0 -35 -4 -35 -10 0 -5 5 -10 11 -10 0 -5 5 -10 11 -10 5 0 2 -13 -8 -30 -9 -16 -20 -30 -24 -30 -13 0 -39 49 -33 64 5 13 -1 16 -30 16 -20 0 -36 -4 -36 -10z"/>
              <path d="M3146 2774 c-10 -38 10 -55 24 -20 7 18 16 26 28 24 24 -5 31 -147 7 -160 -27 -16 -16 -28 25 -28 38 0 52 12 30 25 -5 3 -10 42 -10 86 0 88 12 101 49 52 l21 -28 -2 35 -3 35 -81 3 c-81 3 -82 3 -88 -24z"/>
              <path d="M3366 2791 c-3 -5 1 -11 9 -15 18 -6 22 -150 5 -161 -5 -3 -10 -10 -10 -16 0 -12 57 -12 65 1 3 6 1 10 -4 10 -6 0 -11 18 -11 41 0 33 3 40 16 35 9 -3 19 -6 20 -6 3 0 13 -20 24 -45 14 -32 25 -45 40 -45 21 0 27 14 10 25 -6 4 -19 24 -30 44 -19 38 -19 39 0 56 45 41 6 85 -74 85 -30 0 -57 -4 -60 -9z m112 -43 c3 -22 -2 -30 -23 -40 -33 -15 -44 -3 -38 40 7 45 56 44 61 0z"/>
              <path d="M3646 2768 c-7 -18 -21 -54 -30 -81 -10 -26 -27 -54 -39 -62 -23 -16 -18 -27 15 -32 36 -6 53 4 38 22 -20 24 -4 45 35 45 39 0 55 -20 36 -44 -10 -12 -6 -15 18 -21 43 -9 55 2 34 29 -10 12 -29 57 -43 99 -27 84 -44 95 -64 45z m39 -55 c5 -20 3 -23 -19 -23 -24 0 -24 2 -14 31 11 32 21 29 33 -8z"/>
              <path d="M3800 2791 c0 -5 6 -11 13 -14 7 -3 26 -46 41 -97 35 -116 48 -116 86 -2 15 46 32 88 39 95 18 18 13 27 -19 27 -28 0 -41 -14 -21 -22 11 -4 -26 -128 -38 -128 -15 0 -47 123 -33 128 7 2 10 8 6 13 -7 12 -74 12 -74 0z"/>
              <path d="M4046 2791 c-3 -5 1 -11 9 -15 18 -6 22 -141 5 -151 -30 -19 -8 -35 48 -35 71 0 85 9 79 46 -4 27 -5 28 -12 7 -6 -18 -15 -23 -41 -23 -32 0 -34 2 -34 35 0 31 3 35 25 35 14 0 25 -4 25 -10 0 -5 5 -10 10 -10 6 0 10 14 10 30 0 17 -4 30 -10 30 -5 0 -10 -4 -10 -10 0 -11 -50 -14 -50 -2 0 4 -3 17 -6 30 -6 20 -3 22 35 22 30 0 41 -4 41 -15 0 -8 5 -15 10 -15 6 0 10 14 10 30 l0 30 -69 0 c-39 0 -72 -4 -75 -9z"/>
              <path d="M4250 2790 c0 -5 7 -10 15 -10 22 0 22 -155 -1 -164 -33 -13 0 -26 67 -26 l69 0 0 35 c0 40 -11 45 -25 13 -7 -14 -20 -22 -37 -23 l-28 -1 0 83 c0 49 4 83 10 83 6 0 10 5 10 10 0 6 -18 10 -40 10 -22 0 -40 -4 -40 -10z"/>
            </g>
          </svg>
        </Link>

        {/* Right: Close Button */}
        <div className="flex-1 flex justify-end">
          <Link to="/" className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors shadow-lg">
            <X size={20} />
          </Link>
        </div>
      </div>

      {/* Vertical Feed */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {shuffledResorts.map((resort, index) => (
          <div 
            key={resort.id}
            className="h-full w-full snap-start relative flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Horizontal Image Scroll */}
            <div className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
              {resort.images.map((img, i) => (
                <div key={i} className="min-w-full h-full snap-center relative">
                  <img 
                    src={img} 
                    alt={`${resort.name} ${i + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Bottom Gradient Overlay (for text readability) */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Content Overlay & Actions */}
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-12 flex items-end justify-between gap-4 md:gap-8">
              {/* Text Content (Bottom Left) */}
              <div className="flex-1 max-w-[calc(100%-70px)] md:max-w-2xl pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <span className="text-[10px] md:text-[11px] font-black text-sky-400 uppercase tracking-[0.6em] mb-2 md:mb-4 block">
                    {resort.atoll}
                  </span>
                  <h2 className="text-3xl md:text-6xl font-serif font-bold text-white tracking-tighter mb-2 md:mb-4 leading-tight">
                    {resort.name}
                  </h2>
                  <p className="text-white/80 text-xs md:text-base leading-relaxed line-clamp-3 md:line-clamp-2 mb-4 md:mb-6">
                    {resort.shortDescription || resort.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      {resort.images.map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === 0 ? 'bg-sky-400' : 'bg-white/20'}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons (Right Side Vertical Stack) */}
              <div className="flex flex-col gap-4 md:gap-7 items-center pb-4 md:pb-8 z-10">
                {/* Profile Avatar */}
                <div className="flex flex-col items-center gap-1 group mb-2">
                  <div className="relative">
                    <Link to={`/stays/${resort.slug}`} className="block">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white overflow-hidden shadow-xl transition-transform group-hover:scale-105">
                        <img 
                          src={resort.images[0]} 
                          alt={resort.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-rose-500 text-white rounded-full p-1 border-2 border-black hover:scale-110 transition-transform">
                      <Check size={10} strokeWidth={4} className="hidden group-hover:block" />
                      <span className="block group-hover:hidden text-[10px] font-bold leading-none">+</span>
                    </button>
                  </div>
                </div>

                {/* Like Button */}
                <button 
                  onClick={() => toggleLike(resort.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`p-3 md:p-4 rounded-full backdrop-blur-md border transition-all duration-500 ${likedIds.has(resort.id) ? 'bg-red-500 border-red-500 text-white scale-110' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
                    <Heart size={20} className="md:w-6 md:h-6" fill={likedIds.has(resort.id) ? "currentColor" : "none"} />
                  </div>
                  <span className="text-[7px] md:text-[9px] font-black text-white uppercase tracking-widest drop-shadow-md">
                    {likedIds.has(resort.id) ? 'Liked' : 'Like'}
                  </span>
                </button>

                {/* Comment Button */}
                <button 
                  onClick={() => setShowComments(true)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="p-3 md:p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all relative">
                    <MessageCircle size={20} className="md:w-6 md:h-6" />
                    {commentCounts[resort.id] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white/20">
                        {commentCounts[resort.id]}
                      </span>
                    )}
                  </div>
                  <span className="text-[7px] md:text-[9px] font-black text-white uppercase tracking-widest drop-shadow-md">Comment</span>
                </button>

                {/* Bucket / Add to Bag Button */}
                <button 
                  onClick={() => handleAddToBag(resort)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`p-3 md:p-4 rounded-full backdrop-blur-md border transition-all duration-500 ${isInBag(resort.id) ? 'bg-sky-500 border-sky-500 text-white scale-110' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
                    {isInBag(resort.id) ? <Check size={20} className="md:w-6 md:h-6" /> : <ShoppingBag size={20} className="md:w-6 md:h-6" />}
                  </div>
                  <span className="text-[7px] md:text-[9px] font-black text-white uppercase tracking-widest drop-shadow-md text-center">
                    {isInBag(resort.id) ? 'Added' : 'Bucket'}
                  </span>
                </button>

                {/* Share Button */}
                <button className="flex flex-col items-center gap-1 group">
                  <div className="p-3 md:p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all">
                    <Share2 size={20} className="md:w-6 md:h-6" />
                  </div>
                  <span className="text-[7px] md:text-[9px] font-black text-white uppercase tracking-widest drop-shadow-md">Share</span>
                </button>
              </div>
            </div>

            {/* Scroll Indicator */}
            {index < shuffledResorts.length - 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
                <ChevronDown size={24} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comment Modal */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
            onClick={() => setShowComments(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Comments</h3>
                  {replyingTo && (
                    <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest mt-1">
                      Replying to {replyingTo.user_name}
                      <button onClick={() => setReplyingTo(null)} className="ml-2 text-red-500 hover:underline">Cancel</button>
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setShowComments(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="h-80 overflow-y-auto mb-6 no-scrollbar">
                {loadingComments ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : comments.length ? (
                  <div className="space-y-8">
                    {comments.map((comment) => (
                      <div key={comment.id} className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0">
                            {comment.user_name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{comment.user_name}</span>
                              <span className="text-[8px] text-slate-400 uppercase tracking-widest">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{comment.content}</p>
                            <div className="flex items-center gap-6">
                              <button 
                                onClick={() => setReplyingTo(comment)}
                                className="text-[9px] font-black uppercase tracking-widest text-sky-500 hover:text-sky-600 transition-colors"
                              >
                                Reply
                              </button>
                              <button 
                                onClick={() => handleLikeComment(comment.id)}
                                className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${comment.is_liked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                              >
                                <Heart size={12} fill={comment.is_liked ? "currentColor" : "none"} />
                                {comment.likes_count || 0}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Threaded Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-14 space-y-6 border-l border-slate-100 dark:border-white/5 pl-6">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-[10px] shrink-0">
                                  {reply.user_name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{reply.user_name}</span>
                                    <span className="text-[8px] text-slate-400 uppercase tracking-widest">
                                      {new Date(reply.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                                    {reply.content.startsWith('@') ? (
                                      <>
                                        <span className="text-sky-500 font-bold">{reply.content.split(' ')[0]}</span>
                                        {reply.content.substring(reply.content.indexOf(' '))}
                                      </>
                                    ) : reply.content}
                                  </p>
                                  <div className="flex items-center gap-4">
                                    <button 
                                      onClick={() => setReplyingTo(reply)}
                                      className="text-[8px] font-black uppercase tracking-widest text-sky-500 hover:text-sky-600"
                                    >
                                      Reply
                                    </button>
                                    <button 
                                      onClick={() => handleLikeComment(reply.id)}
                                      className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest transition-colors ${reply.is_liked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                                    >
                                      <Heart size={10} fill={reply.is_liked ? "currentColor" : "none"} />
                                      {reply.likes_count || 0}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                    <MessageCircle size={48} className="opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest">No comments yet</p>
                    <p className="text-[10px] text-center max-w-[200px]">Be the first to share your thoughts on this sanctuary.</p>
                  </div>
                )}
              </div>

              <div className="relative">
                <input 
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendComment(shuffledResorts[activeIndex].id)}
                  placeholder={replyingTo ? `Reply to ${replyingTo.user_name}...` : "Add a comment..."}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-6 pr-14 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
                <button 
                  onClick={() => handleSendComment(shuffledResorts[activeIndex].id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-4 text-sky-500 hover:text-sky-600 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Hints */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-40">
        <div className="flex items-center gap-4 group">
          <div className="w-1 h-12 bg-white/20 rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute top-0 inset-x-0 bg-sky-400"
              style={{ height: `${((activeIndex + 1) / shuffledResorts.length) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            {activeIndex + 1} / {shuffledResorts.length}
          </span>
        </div>
      </div>

      <UserPanel />
    </div>
  );
};

export default DiscoveryForYou;
