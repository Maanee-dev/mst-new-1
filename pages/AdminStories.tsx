
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost, StoryCategory } from '../types';
import { BLOG_POSTS } from '../constants';

const AdminStories: React.FC = () => {
  const [stories, setStories] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('Idle');
  
  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    author: 'Elena Rossi',
    category: 'Dispatch',
    date: new Date().toISOString().split('T')[0],
    is_featured: false
  });

  const fetchStories = async () => {
    const { data } = await supabase.from('stories').select('*').order('date', { ascending: false });
    if (data) setStories(data as BlogPost[]);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: val };
      if (name === 'title' && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      }
      return updated;
    });
  };

  const saveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Saving story...');

    try {
      const storyId = formData.id || crypto.randomUUID();
      const { error } = await supabase.from('stories').upsert({
        ...formData,
        id: storyId
      }, { onConflict: 'id' });

      if (error) throw error;
      
      setStatus('Story saved successfully.');
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        author: 'Elena Rossi',
        category: 'Dispatch',
        date: new Date().toISOString().split('T')[0],
        is_featured: false
      });
      fetchStories();
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    const { error } = await supabase.from('stories').delete().eq('id', id);
    if (!error) {
      fetchStories();
      setStatus('Deleted.');
    }
  };

  const editStory = (story: BlogPost) => {
    setFormData(story);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatus(`Editing: ${story.title}`);
  };

  const syncLocalData = async () => {
    setLoading(true);
    setStatus('Seeding database from local constants...');
    try {
      for (const post of BLOG_POSTS) {
        await supabase.from('stories').upsert(post, { onConflict: 'id' });
      }
      setStatus('Seeding complete.');
      fetchStories();
    } catch (err: any) {
      setStatus(`Seeding failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] pt-40 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Editor Side */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-50 sticky top-32">
            <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[1em] mb-10 block">Content Creator</span>
            <h1 className="text-3xl font-serif font-bold italic mb-8">Editorial Interface</h1>
            
            <form onSubmit={saveStory} className="space-y-8">
              <div className="space-y-4">
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Headline</label>
                <input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="The Art of Silence..." 
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all appearance-none"
                  >
                    <option value="Dispatch">Dispatch</option>
                    <option value="Guide">Guide</option>
                    <option value="Update">Update</option>
                    <option value="Tip">Tip</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Featured</label>
                  <div className="flex items-center h-[52px] bg-slate-50 rounded-2xl px-6">
                    <input 
                      type="checkbox" 
                      name="is_featured" 
                      checked={formData.is_featured} 
                      onChange={handleInputChange}
                      className="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"
                    />
                    <span className="ml-4 text-[8px] font-bold uppercase tracking-widest text-slate-400">Hero Slot</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Slug (URL)</label>
                <input 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-medium tracking-widest focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Excerpt</label>
                <textarea 
                  name="excerpt" 
                  value={formData.excerpt} 
                  onChange={handleInputChange} 
                  rows={2}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-medium leading-relaxed focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Full Narrative</label>
                <textarea 
                  name="content" 
                  value={formData.content} 
                  onChange={handleInputChange} 
                  rows={6}
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-medium leading-relaxed focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Imagery (URL)</label>
                <input 
                  name="image" 
                  value={formData.image} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-medium tracking-widest focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-950 text-white font-bold py-6 rounded-full text-[10px] uppercase tracking-[0.6em] hover:bg-sky-500 transition-all duration-700 shadow-xl disabled:opacity-50"
                >
                  {formData.id ? 'Refine Dispatch' : 'Commit Story'}
                </button>
              </div>

              <p className="text-[7px] font-bold uppercase tracking-[0.4em] text-slate-300 text-center">{status}</p>
            </form>
          </div>
        </div>

        {/* List Side */}
        <div className="lg:col-span-7 space-y-12">
           <div className="flex justify-between items-center mb-12">
              <h3 className="text-4xl font-serif font-bold italic">The Archive</h3>
              <button 
                onClick={syncLocalData}
                className="text-[8px] font-bold uppercase tracking-widest text-sky-500 border border-sky-100 px-6 py-2 rounded-full hover:bg-sky-50 transition-all"
              >
                Sync Local Seeds
              </button>
           </div>

           <div className="space-y-6">
             {stories.map(story => (
               <div key={story.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center gap-8 group hover:shadow-xl transition-all duration-700">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 bg-slate-100">
                     <img src={story.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                  </div>
                  <div className="flex-grow">
                     <div className="flex items-center gap-4 mb-2">
                        <span className="text-[8px] font-bold text-sky-500 uppercase tracking-widest">{story.category}</span>
                        {story.is_featured && <span className="text-[7px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase tracking-widest">Featured</span>}
                     </div>
                     <h4 className="text-xl font-serif font-bold text-slate-900 group-hover:italic transition-all">{story.title}</h4>
                     <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.3em] mt-2">{story.date} • {story.author}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                     <button onClick={() => editStory(story)} className="text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors">Edit</button>
                     <button onClick={() => deleteStory(story.id)} className="text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Delete</button>
                  </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStories;
