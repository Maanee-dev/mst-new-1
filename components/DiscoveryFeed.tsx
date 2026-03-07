import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ShoppingBag, 
  X, 
  Send,
  ChevronDown,
  User,
  Check,
  Trash2
} from 'lucide-react';
import { useBag } from '../context/BagContext';
import { supabase, mapResort } from '../lib/supabase';
import { Accommodation } from '../types';
import { RESORTS } from '../constants';
import UserPanel from './UserPanel';

const CommentSection: React.FC<{ isOpen: boolean; onClose: () => void; resortId: string }> = ({ isOpen, onClose, resortId }) => {
  const [comments, setComments] = useState<ResortComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ResortComment | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      setCurrentUserId(userId || '');

      const { data, error } = await supabase
        .from('resort_comments')
        .select(`
          *,
          likes_count:resort_comment_likes(count)
        `)
        .eq('resort_id', resortId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Also check which ones the current user liked
      let likedCommentIds = new Set<string>();
      if (userId) {
        const { data: userLikes } = await supabase
          .from('resort_comment_likes')
          .select('comment_id')
          .eq('user_id', userId);
        
        likedCommentIds = new Set(userLikes?.map(l => l.comment_id) || []);
      }

      // Group comments by parent_id
      const mainComments = data.filter(c => !c.parent_id);
      const replies = data.filter(c => c.parent_id);

      const threaded = mainComments.map(mc => {
        return {
          ...mc,
          likes_count: mc.likes_count?.[0]?.count || 0,
          is_liked: likedCommentIds.has(mc.id),
          replies: replies.filter(r => r.parent_id === mc.id).map(r => {
            return {
              ...r,
              likes_count: r.likes_count?.[0]?.count || 0,
              is_liked: likedCommentIds.has(r.id)
            };
          })
        };
      });

      setComments(threaded);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [resortId]);

  useEffect(() => {
    if (isOpen && resortId) {
      fetchComments();
    }
  }, [isOpen, resortId, fetchComments]);

  const handleLikeComment = async (commentId: string, isCurrentlyLiked: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to like comments.');
        return;
      }
      const userId = user.id;

      if (isCurrentlyLiked) {
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
      
      fetchComments();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const { error } = await supabase
        .from('resort_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment.');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to add a comment.');
        return;
      }
      
      // If replying to a reply, we still use the top-level parent_id to keep it 2-level
      // but we can prepend the username to the content
      const parentId = replyingTo?.parent_id || replyingTo?.id || null;
      const content = replyingTo?.parent_id 
        ? `@${replyingTo.user_name} ${commentText}` 
        : commentText;

      const newComment = {
        resort_id: resortId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || (user.is_anonymous ? 'Guest Explorer' : 'Explorer'),
        content: content,
        parent_id: parentId
      };

      const { error } = await supabase
        .from('resort_comments')
        .insert([newComment]);

      if (error) {
        if (error.code === '42P01') {
          throw new Error('The "resort_comments" table does not exist in your Supabase database. Please run the SQL schema provided.');
        }
        throw error;
      }

      setCommentText('');
      setReplyingTo(null);
      fetchComments();
    } catch (err: any) {
      console.error('Error adding comment:', err);
      alert(err.message || 'Failed to add comment. Check console for details.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[600]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[601] flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-8 flex justify-between items-center border-b border-gray-100">
              <div>
                <h3 className="text-xl font-serif font-medium text-gray-900">Comments</h3>
                {replyingTo && (
                  <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest mt-1">
                    Replying to {replyingTo.user_name}
                    <button onClick={() => setReplyingTo(null)} className="ml-2 text-gray-400 hover:text-red-500">Cancel</button>
                  </p>
                )}
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <MessageCircle size={40} className="text-gray-200" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 mb-2">No comments yet</h4>
                  <p className="text-gray-400 text-sm font-light text-center max-w-[240px] leading-relaxed">
                    Be the first to share your thoughts on this sanctuary.
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-sky-100 overflow-hidden flex items-center justify-center text-sky-600 font-bold text-xs flex-shrink-0">
                        {comment.user_avatar ? (
                          <img src={comment.user_avatar} alt={comment.user_name} className="w-full h-full object-cover" />
                        ) : (
                          comment.user_name[0]
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{comment.user_name}</span>
                          <span className="text-[10px] text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setReplyingTo(comment)}
                            className="text-[10px] font-black uppercase tracking-widest text-sky-500 hover:text-sky-600"
                          >
                            Reply
                          </button>
                          <button 
                            onClick={() => handleLikeComment(comment.id, !!comment.is_liked)}
                            className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors ${comment.is_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                          >
                            <Heart size={12} fill={comment.is_liked ? "currentColor" : "none"} />
                            {comment.likes_count || 0}
                          </button>
                          {comment.user_id === currentUserId && (
                            <button 
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-14 space-y-4 border-l border-gray-100 pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-500 font-bold text-[10px] flex-shrink-0">
                              {reply.user_avatar ? (
                                <img src={reply.user_avatar} alt={reply.user_name} className="w-full h-full object-cover" />
                              ) : (
                                reply.user_name[0]
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-900">{reply.user_name}</span>
                                <span className="text-[9px] text-gray-400">{new Date(reply.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                                {reply.content.startsWith('@') ? (
                                  <>
                                    <span className="text-sky-500 font-bold">{reply.content.split(' ')[0]}</span>
                                    {reply.content.substring(reply.content.indexOf(' '))}
                                  </>
                                ) : reply.content}
                              </p>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => setReplyingTo(reply)}
                                  className="text-[9px] font-black uppercase tracking-widest text-sky-500 hover:text-sky-600"
                                >
                                  Reply
                                </button>
                                <button 
                                  onClick={() => handleLikeComment(reply.id, !!reply.is_liked)}
                                  className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors ${reply.is_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                  <Heart size={10} fill={reply.is_liked ? "currentColor" : "none"} />
                                  {reply.likes_count || 0}
                                </button>
                                {reply.user_id === currentUserId && (
                                  <button 
                                    onClick={() => handleDeleteComment(reply.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-8 pb-12 bg-white border-t border-gray-50">
              <div className="relative">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder={replyingTo ? `Reply to ${replyingTo.user_name}...` : "Add a comment..."}
                  className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 pr-16 text-sm font-light focus:ring-2 focus:ring-sky-500/20 transition-all"
                />
                <button 
                  onClick={handleAddComment}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-sky-500 hover:scale-110 transition-transform"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ResortSlide: React.FC<{ 
  resort: Accommodation; 
  isLiked: (id: string) => boolean;
  isInBag: (id: string) => boolean;
  toggleLike: (item: any) => void;
  addItem: (item: any) => void;
  handleShare: (resort: Accommodation) => void;
  openComments: (id: string) => void;
}> = ({ resort, isLiked, isInBag, toggleLike, addItem, handleShare, openComments }) => {
  const { setIsUserPanelOpen } = useBag();
  const [activeIdx, setActiveIdx] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const images = (resort.images || []).slice(0, 8);

  useEffect(() => {
    const fetchCommentCount = async () => {
      const { count } = await supabase
        .from('resort_comments')
        .select('*', { count: 'exact', head: true })
        .eq('resort_id', resort.id);
      
      setCommentCount(count || 0);
    };

    fetchCommentCount();
  }, [resort.id]);

  const handleScroll = () => {
    if (galleryRef.current) {
      const scrollLeft = galleryRef.current.scrollLeft;
      const width = galleryRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActiveIdx(index);
    }
  };

  return (
    <div className="w-full h-full flex-shrink-0 snap-center relative overflow-hidden">
      {/* Horizontal Gallery */}
      <div 
        ref={galleryRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-x-auto snap-x snap-mandatory no-scrollbar flex"
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
            <img 
              src={img} 
              alt={`${resort.name} ${idx}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

      {/* Header - Only visible on the first image */}
      <AnimatePresence>
        {activeIdx === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 left-0 right-0 z-[505] flex items-center justify-between px-6 md:px-10 pointer-events-none"
          >
            {/* Profile Icon */}
            <button 
              onClick={() => setIsUserPanelOpen(true)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-white/20 transition-all"
            >
              <User size={20} strokeWidth={1.5} />
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center">
               <svg viewBox="0 0 600 600" className="w-20 h-20 md:w-28 md:h-28 -my-6 md:-my-10 fill-white opacity-90 drop-shadow-2xl">
                 <g transform="translate(0.000000,600.000000) scale(0.100000,-0.100000)">
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
                   <path d="M2840 2790 c0 -5 4 -10 9 -10 36 0 90 -147 61 -165 -21 -13 -9 -25 25 -25 34 0 46 12 25 25 -28 17 27 165 61 165 5 0 9 5 9 10 0 6 -16 10 -35 10 -19 0 -35 -4 -35 -10 0 -5 5 -10 11 -10 5 0 2 -13 -8 -30 -9 -16 -20 -30 -24 -30 -13 0 -39 49 -33 64 5 13 -1 16 -30 16 -20 0 -36 -4 -36 -10z"/>
                   <path d="M3146 2774 c-10 -38 10 -55 24 -20 7 18 16 26 28 24 24 -5 31 -147 7 -160 -27 -16 -16 -28 25 -28 38 0 52 12 30 25 -5 3 -10 42 -10 86 0 88 12 101 49 52 l21 -28 -2 35 -3 35 -81 3 c-81 3 -82 3 -88 -24z"/>
                   <path d="M3366 2791 c-3 -5 1 -11 9 -15 18 -6 22 -150 5 -161 -5 -3 -10 -10 -10 -16 0 -12 57 -12 65 1 3 6 1 10 -4 10 -6 0 -11 18 -11 41 0 33 3 40 16 35 9 -3 19 -6 20 -6 3 0 13 -20 24 -45 14 -32 25 -45 40 -45 21 0 27 14 10 25 -6 4 -19 24 -30 44 -19 38 -19 39 0 56 45 41 6 85 -74 85 -30 0 -57 -4 -60 -9z m112 -43 c3 -22 -2 -30 -23 -40 -33 -15 -44 -3 -38 40 7 45 56 44 61 0z"/>
                   <path d="M3646 2768 c-7 -18 -21 -54 -30 -81 -10 -26 -27 -54 -39 -62 -23 -16 -18 -27 15 -32 36 -6 53 4 38 22 -20 24 -4 45 35 45 39 0 55 -20 36 -44 -10 -12 -6 -15 18 -21 43 -9 55 2 34 29 -10 12 -29 57 -43 99 -27 84 -44 95 -64 45z m39 -55 c5 -20 3 -23 -19 -23 -24 0 -24 2 -14 31 11 32 21 29 33 -8z"/>
                   <path d="M3800 2791 c0 -5 6 -11 13 -14 7 -3 26 -46 41 -97 35 -116 48 -116 86 -2 15 46 32 88 39 95 18 18 13 27 -19 27 -28 0 -41 -14 -21 -22 11 -4 -26 -128 -38 -128 -15 0 -47 123 -33 128 7 2 10 8 6 13 -7 12 -74 12 -74 0z"/>
                   <path d="M4046 2791 c-3 -5 1 -11 9 -15 18 -6 22 -141 5 -151 -30 -19 -8 -35 48 -35 71 0 85 9 79 46 -4 27 -5 28 -12 7 -6 -18 -15 -23 -41 -23 -32 0 -34 2 -34 35 0 31 3 35 25 35 14 0 25 -4 25 -10 0 -5 5 -10 10 -10 6 0 10 14 10 30 0 17 -4 30 -10 30 -5 0 -10 -4 -10 -10 0 -11 -50 -14 -50 -2 0 4 -3 17 -6 30 -6 20 -3 22 35 22 30 0 41 -4 41 -15 0 -8 5 -15 10 -15 6 0 10 14 10 30 l0 30 -69 0 c-39 0 -72 -4 -75 -9z"/>
                   <path d="M4250 2790 c0 -5 7 -10 15 -10 22 0 22 -155 -1 -164 -33 -13 0 -26 67 -26 l69 0 0 35 c0 40 -11 45 -25 13 -7 -14 -20 -22 -37 -23 l-28 -1 0 83 c0 49 4 83 10 83 6 0 10 5 10 10 0 6 -18 10 -40 10 -22 0 -40 -4 -40 -10z"/>
                 </g>
               </svg>
            </div>

            {/* Placeholder for balance */}
            <div className="w-10 h-10 md:w-12 md:h-12" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Overlay - Only visible on the first image */}
      <AnimatePresence>
        {activeIdx === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 p-6 md:p-16 flex flex-col justify-end pointer-events-none"
          >
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 w-full">
              <div className="max-w-2xl pr-20 md:pr-40 pointer-events-auto mb-12 md:mb-0">
                <span className="text-amber-500 text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] mb-4 md:mb-6 block drop-shadow-md">{resort.atoll}</span>
                <h2 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 md:mb-8 leading-[1.1] drop-shadow-lg">{resort.name}</h2>
                <p className="text-white/90 text-xs md:text-lg line-clamp-3 md:line-clamp-2 mb-8 md:mb-10 font-light leading-relaxed max-w-xl drop-shadow-md">
                  {resort.description}
                </p>
                
                {/* Pagination Dots */}
                <div className="flex gap-2 mb-8">
                  {images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeIdx ? 'bg-white scale-125' : 'bg-white/30'}`} 
                    />
                  ))}
                </div>

                {/* Down Arrow */}
                <div className="flex justify-center md:justify-start">
                   <motion.div 
                     animate={{ y: [0, 10, 0] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                     className="text-white/40"
                   >
                     <ChevronDown size={32} strokeWidth={1.5} />
                   </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions Sidebar (Right side) - Always visible */}
      <div className="absolute right-4 md:right-8 bottom-12 md:bottom-16 flex flex-col gap-5 items-center z-[506]">
        <button 
          onClick={() => toggleLike({ 
            id: resort.id, 
            name: resort.name, 
            type: resort.type.toLowerCase() as any, 
            image: resort.images[0], 
            price: resort.price, 
            atoll: resort.atoll 
          })}
          className="group flex flex-col items-center gap-1.5"
        >
          <div className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-xl border border-white/10 ${isLiked(resort.id) ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            <Heart size={22} fill={isLiked(resort.id) ? "currentColor" : "none"} strokeWidth={1.5} />
          </div>
          <span className="text-[7px] font-black text-white uppercase tracking-widest drop-shadow-md">Like</span>
        </button>

        <button 
          onClick={() => openComments(resort.id)}
          className="group flex flex-col items-center gap-1.5"
        >
          <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 flex items-center justify-center transition-all border border-white/10 relative">
            <MessageCircle size={22} strokeWidth={1.5} />
            {commentCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white/20">
                {commentCount}
              </span>
            )}
          </div>
          <span className="text-[7px] font-black text-white uppercase tracking-widest drop-shadow-md">Comment</span>
        </button>

        <button 
          onClick={() => addItem({ 
            id: resort.id, 
            name: resort.name, 
            type: resort.type.toLowerCase() as any, 
            image: resort.images[0], 
            price: resort.price, 
            atoll: resort.atoll 
          })}
          className="group flex flex-col items-center gap-1.5"
        >
          <div className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-xl border border-white/10 overflow-hidden ${isInBag(resort.id) ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            {isInBag(resort.id) ? (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              >
                <Check size={24} strokeWidth={3} />
              </motion.div>
            ) : (
              <ShoppingBag size={22} strokeWidth={1.5} />
            )}
          </div>
          <span className="text-[7px] font-black text-white uppercase tracking-widest drop-shadow-md">Bucket</span>
        </button>

        <button 
          onClick={() => handleShare(resort)}
          className="group flex flex-col items-center gap-1.5"
        >
          <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 flex items-center justify-center transition-all border border-white/10">
            <Share2 size={22} strokeWidth={1.5} />
          </div>
          <span className="text-[7px] font-black text-white uppercase tracking-widest drop-shadow-md">Share</span>
        </button>
      </div>
    </div>
  );
};

const DiscoveryFeed: React.FC = () => {
  const navigate = useNavigate();
  const { 
    setDiscoveryMode, 
    addItem, 
    isInBag, 
    toggleLike, 
    isLiked 
  } = useBag();
  const [resorts, setResorts] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentResortId, setActiveCommentResortId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDiscoveryMode(true);
    return () => setDiscoveryMode(false);
  }, [setDiscoveryMode]);

  useEffect(() => {
    const fetchResorts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('resorts').select('*').limit(20);
        if (error) throw error;
        if (data && data.length > 0) {
          setResorts(data.map(mapResort));
        } else {
          setResorts(RESORTS.slice(0, 10));
        }
      } catch (err) {
        console.error('Error fetching resorts for discovery:', err);
        setResorts(RESORTS.slice(0, 10));
      } finally {
        setLoading(false);
      }
    };

    fetchResorts();
  }, []);

  const handleShare = (resort: Accommodation) => {
    const shareUrl = window.location.origin + `/stays/${resort.slug}`;
    if (navigator.share) {
      navigator.share({
        title: resort.name,
        text: `Check out ${resort.name} in the Maldives!`,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] bg-black overflow-hidden flex flex-col"
      >
        {/* Header Logo - Moved to ResortSlide */}

        {/* Close Button */}
        <div className="absolute top-6 right-6 md:right-10 z-[505]">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/20 hover:bg-black/40 backdrop-blur-xl rounded-full text-white transition-all group border border-white/10"
            aria-label="Close discovery"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Content - Vertical Scroll */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar flex flex-col"
        >
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            resorts.map((resort) => (
              <ResortSlide 
                key={resort.id}
                resort={resort}
                isLiked={isLiked}
                isInBag={isInBag}
                toggleLike={toggleLike}
                addItem={addItem}
                handleShare={handleShare}
                openComments={(id) => setActiveCommentResortId(id)}
              />
            ))
          )}
        </div>

        {/* Comment Section */}
        <CommentSection 
          isOpen={!!activeCommentResortId} 
          resortId={activeCommentResortId || ''}
          onClose={() => setActiveCommentResortId(null)} 
        />

        {/* User Panel */}
        <UserPanel />
      </motion.div>
    </AnimatePresence>
  );
};

export default DiscoveryFeed;
