import React from 'react';
import SEO from '../components/SEO';
import { Cookie, Shield, Globe, Settings, Clock } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="bg-[#FCFAF7] dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-700">
      <SEO 
        title="Cookie Policy | Maldives Serenity Travels" 
        description="Learn how Maldives Serenity Travels uses cookies and similar technologies to improve your experience."
        keywords={['Maldives travel cookies', 'cookie policy', 'data tracking Maldives', 'Serenity Maldives legal']}
      />
      
      {/* Cinematic Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1578922746465-3a805228b223?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover" 
            alt="Maldives Resort"
          />
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center px-6">
          <span className="text-[10px] font-black text-sky-400 uppercase tracking-[1.2em] mb-8 block">Transparency</span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter italic leading-none">
            Cookie <br /> Policy.
          </h1>
          <div className="h-px w-16 bg-amber-400 mx-auto mt-8 mb-8"></div>
          <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.5em]">Effective Date: March 11, 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 lg:p-24 shadow-2xl border border-slate-100 dark:border-white/5 transition-colors duration-700">
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            
            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Cookie className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">1. Introduction</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Understanding Cookies</p>
              </div>
            </div>
            
            <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-12">
              <p>
                This Cookie Policy explains how Maldives Serenity Travels ("we," "our," or "us") uses cookies and similar tracking technologies when you visit our website.
              </p>
              <p>
                Cookies are small text files stored on your device that help websites recognize you, remember your preferences, and improve your browsing experience.
              </p>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Settings className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">2. Types of Cookies We Use</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Categorization</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">Strictly Necessary</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Essential for website functionality, security, and booking processes.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">Performance</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Help us understand how visitors interact with our site via Google Analytics.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">Functionality</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Remember your preferences like language, currency, and recently viewed resorts.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">Marketing</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Used to deliver relevant advertisements and measure campaign effectiveness.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Globe className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">3. Google API & Service Cookies</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Third-Party Integration</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-12">
              Our website integrates with Google services (Maps, Analytics, OAuth). These services may set cookies to maintain authentication state and provide core functionality. These are subject to Google's Privacy Policy.
            </p>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Shield className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">4. Managing Your Preferences</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">User Control</p>
              </div>
            </div>

            <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-12">
              <p>
                You can manage your cookie preferences through our consent banner or your browser settings. Most browsers allow you to block or delete cookies.
              </p>
              <div className="bg-sky-50 dark:bg-sky-900/20 p-8 rounded-3xl border border-sky-100 dark:border-sky-500/20">
                <h4 className="text-[10px] font-black text-sky-900 dark:text-sky-300 uppercase tracking-[0.3em] mb-4">Browser Controls:</h4>
                <ul className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest list-none p-0 m-0">
                  <li>• Chrome Settings</li>
                  <li>• Safari Preferences</li>
                  <li>• Firefox Options</li>
                  <li>• Edge Settings</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Clock className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">5. Retention</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Data Lifespan</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-12">
              Session cookies expire when you close your browser. Persistent cookies remain on your device for a set period (typically 30 days to 2 years) or until manually deleted.
            </p>

            <div className="pt-12 border-t border-slate-100 dark:border-white/5 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] mb-4">Questions about our cookies?</p>
              <p className="text-slate-900 dark:text-white font-serif italic text-xl">privacy@maldives-serenitytravels.com</p>
              <p className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-8">© 2026 Maldives Serenity Travels. All Rights Reserved.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
