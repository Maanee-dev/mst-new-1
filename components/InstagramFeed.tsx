import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Instagram, LogOut, RefreshCw, ExternalLink } from 'lucide-react';

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
}

export default function InstagramFeed() {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [feed, setFeed] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'INSTAGRAM_AUTH_SUCCESS') {
        setIsConnected(true);
        fetchFeed();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/auth/instagram/status');
      const data = await res.json();
      setIsConnected(data.connected);
      if (data.connected) {
        fetchFeed();
      }
    } catch (err) {
      console.error('Status check failed', err);
    }
  };

  const fetchFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/instagram/feed');
      if (!res.ok) throw new Error('Failed to fetch feed');
      const data = await res.json();
      setFeed(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const res = await fetch('/api/auth/instagram/url');
      const { url } = await res.json();
      window.open(url, 'instagram_oauth', 'width=600,height=700');
    } catch (err) {
      alert('Failed to start Instagram connection');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/instagram/logout', { method: 'POST' });
      setIsConnected(false);
      setFeed([]);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (isConnected === null) return null;

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 reveal">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold text-sky-500 uppercase tracking-[1em] mb-4 block">{t('instagram.badge')}</span>
            <h3 className="text-4xl md:text-6xl font-serif font-medium text-slate-900 dark:text-white tracking-tighter leading-none transition-colors">
              {t('instagram.title')}
            </h3>
          </div>
          
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={fetchFeed}
                  disabled={loading}
                  className="p-3 rounded-full border border-slate-100 dark:border-white/10 text-slate-400 hover:text-sky-500 transition-colors"
                  title={t('instagram.tryAgain')}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('instagram.disconnect')}
                </button>
              </div>
            ) : (
              <button 
                onClick={handleConnect}
                className="flex items-center gap-4 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Instagram className="w-5 h-5" />
                {t('instagram.connect')}
              </button>
            )}
          </div>
        </div>

        {isConnected ? (
          <>
            {error && (
              <div className="p-8 bg-red-50 dark:bg-red-950/20 rounded-[2rem] text-center">
                <p className="text-red-500 font-bold text-sm uppercase tracking-widest">{error}</p>
                <button onClick={fetchFeed} className="mt-4 text-[10px] font-bold text-slate-900 dark:text-white border-b border-slate-900 dark:border-white pb-1">{t('instagram.tryAgain')}</button>
              </div>
            )}

            {loading && feed.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-[2rem] bg-slate-100 dark:bg-slate-900 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {feed.map((item) => (
                  <a 
                    key={item.id} 
                    href={item.permalink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative aspect-square rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm hover:shadow-2xl transition-all duration-700"
                  >
                    <img 
                      src={item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url} 
                      alt={item.caption || 'Instagram post'} 
                      className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                      <p className="text-white text-[10px] md:text-[12px] font-medium line-clamp-3 mb-4 leading-relaxed">
                        {item.caption}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-[8px] font-bold uppercase tracking-widest">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {feed.length === 0 && !loading && !error && (
              <div className="text-center py-20">
                <p className="text-slate-400 font-serif text-xl">{t('instagram.noMedia')}</p>
              </div>
            )}
          </>
        ) : (
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 p-12 md:p-24 text-center">
            <div className="max-w-xl mx-auto">
              <Instagram className="w-16 h-16 mx-auto mb-8 text-slate-200 dark:text-slate-800" />
              <h4 className="text-2xl md:text-3xl font-serif font-medium text-slate-900 dark:text-white mb-6">
                {t('instagram.connectTitle')}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 font-medium">
                {t('instagram.connectDesc')}
              </p>
              <button 
                onClick={handleConnect}
                className="inline-flex items-center gap-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform"
              >
                {t('instagram.linkAccount')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
