
import React, { useState, useEffect } from 'react';

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('serenity-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('serenity-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('serenity-theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 left-8 z-[100] w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full shadow-2xl flex items-center justify-center transition-all duration-700 hover:scale-110 active:scale-95 group"
      aria-label="Toggle Dark Mode"
    >
      <div className="relative w-6 h-6 overflow-hidden">
        {/* Sun Icon */}
        <svg 
          className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-700 transform ${isDark ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        {/* Moon Icon */}
        <svg 
          className={`absolute inset-0 w-6 h-6 text-sky-400 transition-all duration-700 transform ${isDark ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
      <div className="absolute left-full ml-4 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[8px] font-black uppercase tracking-[0.3em] rounded-full opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 pointer-events-none whitespace-nowrap shadow-xl">
        {isDark ? 'Light Aesthetic' : 'Dark Perspective'}
      </div>
    </button>
  );
};

export default DarkModeToggle;
