import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden transition-colors duration-700">
      <SEO 
        title={t('contactPage.title') + " | Maldives Serenity Travels"} 
        description={t('contactPage.subtitle')}
      />

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506953823976-52e1bdc0149a?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover" 
            alt="Maldives"
          />
          <div className="absolute inset-0 bg-slate-950/30" />
        </div>
        <div className="relative z-10 text-center px-6 reveal active">
          <span className="text-[10px] font-black text-sky-400 uppercase tracking-[1em] mb-8 block">{t('contactPage.badge')}</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white tracking-tighter leading-none">
            {t('contactPage.title')}
          </h1>
          <div className="h-px w-20 bg-amber-400 mx-auto mt-10 mb-10"></div>
          <p className="text-white text-[11px] font-bold uppercase tracking-[0.4em] max-w-xl mx-auto opacity-90">
             {t('contactPage.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-16 reveal">
          <div className="space-y-12">
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-8 transition-colors">{t('contactPage.callOrWhatsapp')}</span>
              <div className="space-y-8">
                <a href="https://wa.me/9607259060" target="_blank" rel="noreferrer" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-slate-950 dark:group-hover:bg-white transition-all duration-500">
                    <svg className="w-5 h-5 group-hover:text-white dark:group-hover:text-slate-950 transition-colors fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-2.652 0-5.147 1.03-7.02 2.905-1.873 1.874-2.901 4.37-2.903 7.027-.001 2.03.543 4.154 1.61 5.9l-.311 1.137-.79 2.884 2.953-.776 1.061-.28z"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold uppercase tracking-widest text-slate-900 dark:text-white transition-colors">+960 725 9060</span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">{t('contactPage.support')}</span>
                  </div>
                </a>
                <a href="https://wa.me/9607202464" target="_blank" rel="noreferrer" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-slate-950 dark:group-hover:bg-white transition-all duration-500">
                    <svg className="w-5 h-5 group-hover:text-white dark:group-hover:text-slate-950 transition-colors fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-2.652 0-5.147 1.03-7.02 2.905-1.873 1.874-2.901 4.37-2.903 7.027-.001 2.03.543 4.154 1.61 5.9l-.311 1.137-.79 2.884 2.953-.776 1.061-.28z"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold uppercase tracking-widest text-slate-900 dark:text-white transition-colors">+960 720 2464</span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">{t('contactPage.directLine')}</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
              <div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-4 transition-colors">{t('contactPage.email')}</span>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] transition-colors">info@maldives-serenitytravels.com</p>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-4 transition-colors">{t('contactPage.address')}</span>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] leading-loose transition-colors">
                  Faith, S.feydhoo<br />
                  Addu City, Maldives
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-7 reveal delay-300">
          {submitted ? (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-16 md:p-24 text-center shadow-2xl border border-slate-50 dark:border-white/5 transition-colors duration-700">
              <h2 className="text-4xl font-serif font-bold mb-6 text-slate-900 dark:text-white">{t('contactPage.form.successTitle')}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] leading-loose mb-12 transition-colors">{t('contactPage.form.successDesc')}</p>
              <button onClick={() => setSubmitted(false)} className="text-[10px] font-black text-sky-500 uppercase tracking-[0.6em] border-b border-sky-100 dark:border-sky-900 pb-2">{t('contactPage.form.sendAnother')}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-50 dark:border-white/5 space-y-10 transition-colors duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-4 transition-colors">{t('contactPage.form.name')}</label>
                  <input type="text" required className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-full px-8 py-5 text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-200 dark:placeholder:text-slate-700 dark:text-white" placeholder={t('contactPage.form.namePlaceholder')} />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-4 transition-colors">{t('contactPage.form.email')}</label>
                  <input type="email" required className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-full px-8 py-5 text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-200 dark:placeholder:text-slate-700 dark:text-white" placeholder={t('contactPage.form.emailPlaceholder')} />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-4 transition-colors">{t('contactPage.form.message')}</label>
                <textarea rows={5} className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] px-8 py-6 text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-200 dark:placeholder:text-slate-700 dark:text-white resize-none" placeholder={t('contactPage.form.messagePlaceholder')}></textarea>
              </div>
              <button type="submit" className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-6 rounded-full text-[11px] uppercase tracking-[0.8em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all duration-700 shadow-2xl">
                {t('contactPage.form.send')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
