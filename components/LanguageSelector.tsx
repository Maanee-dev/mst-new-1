
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div ref={containerRef} className="fixed bottom-24 left-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="absolute bottom-full left-0 mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden min-w-[180px]"
          >
            <div className="py-2 max-h-[400px] overflow-y-auto no-scrollbar">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    i18n.language === lang.code ? 'bg-sky-50 dark:bg-sky-900/20' : ''
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    i18n.language === lang.code ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full shadow-2xl flex items-center justify-center transition-all duration-700 hover:scale-110 active:scale-95 group"
        aria-label="Change Language"
      >
        <Languages className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-sky-500 transition-colors" />
        
        <div className="absolute left-full ml-4 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[8px] font-black uppercase tracking-[0.3em] rounded-full opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 pointer-events-none whitespace-nowrap shadow-xl">
          {currentLanguage.name}
        </div>
      </button>
    </div>
  );
};

export default LanguageSelector;
