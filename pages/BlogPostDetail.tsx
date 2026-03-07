
import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../constants';

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        
        if (data) {
          setPost(data);
        } else {
          // Fallback to local
          const local = BLOG_POSTS.find(b => b.slug === slug);
          if (local) setPost(local as BlogPost);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Serenity Journal`;
      window.scrollTo(0, 0);
    }
  }, [post]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7] dark:bg-slate-950">
       <div className="w-10 h-10 border-2 border-slate-100 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!post) return <Navigate to="/" replace />;

  return (
    <article className="bg-white dark:bg-slate-950 min-h-screen selection:bg-sky-100 dark:selection:bg-sky-900/30">
      <div className="relative h-[70vh] w-full overflow-hidden">
         <img src={post.image} alt={post.title} className="w-full h-full object-cover scale-105" />
         <div className="absolute inset-0 bg-slate-950/20"></div>
         <div className="absolute bottom-0 left-0 right-0 p-8 md:p-20 max-w-7xl mx-auto text-white">
            <Link to="/stories" className="text-white/60 font-bold text-[9px] uppercase tracking-[0.5em] mb-10 inline-block hover:text-white transition-colors">← The Journal</Link>
            <div className="flex items-center gap-6 mb-8">
               <span className="bg-sky-500 text-white px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] shadow-xl">{post.category}</span>
               <span className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-60">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] tracking-tighter drop-shadow-2xl max-w-5xl">{post.title}</h1>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-32 md:py-48">
        <div className="flex items-center gap-8 mb-20 pb-12 border-b border-slate-50 dark:border-slate-900">
           <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xl font-serif font-bold text-slate-800 dark:text-slate-200">
              {post.author.charAt(0)}
           </div>
           <div>
              <p className="text-slate-900 dark:text-slate-100 font-bold uppercase tracking-widest text-[10px] mb-1">Curated by</p>
              <p className="text-slate-400 dark:text-slate-500 font-serif text-lg">{post.author}</p>
           </div>
        </div>

        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
           <p className="text-2xl md:text-4xl font-serif text-slate-800 dark:text-slate-200 leading-[1.5] mb-20 border-l-4 border-amber-400 pl-10">
             {post.excerpt}
           </p>
           
           <div className="text-slate-600 dark:text-slate-400 leading-[2.2] text-lg md:text-xl font-medium space-y-12">
             {post.content.split('\n').map((para, i) => (
               <p key={i}>{para}</p>
             ))}
             
             <div className="bg-[#FCFAF7] dark:bg-slate-900/50 p-12 md:p-20 rounded-[3rem] border border-slate-50 dark:border-slate-800 my-24 text-center">
                <span className="text-sky-500 font-bold text-[9px] uppercase tracking-[1em] mb-10 block">Bespoke Guidance</span>
                <h4 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-8">Experience the Perspective</h4>
                <p className="text-slate-400 dark:text-slate-500 text-sm mb-12 uppercase tracking-widest leading-loose max-w-md mx-auto">We specialize in crafting Maldivian journeys that match your aesthetic perfectly.</p>
                <Link to="/plan" className="bg-slate-950 dark:bg-white dark:text-slate-950 text-white font-bold px-12 py-6 rounded-full hover:bg-sky-500 dark:hover:bg-sky-400 transition-all inline-block shadow-2xl text-[10px] uppercase tracking-[0.5em]">
                   Initiate Planning
                </Link>
             </div>
           </div>
        </div>
        
        <div className="mt-32 pt-12 border-t border-slate-50 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-300 dark:text-slate-700">
           <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Digital Dispatch • Serenity Travels</span>
           <div className="flex gap-12 text-[9px] font-bold uppercase tracking-widest">
              <span className="cursor-pointer hover:text-slate-950 dark:hover:text-white transition-colors">Instagram</span>
              <span className="cursor-pointer hover:text-slate-950 dark:hover:text-white transition-colors">X</span>
              <span className="cursor-pointer hover:text-slate-950 dark:hover:text-white transition-colors">WhatsApp</span>
           </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostDetail;
