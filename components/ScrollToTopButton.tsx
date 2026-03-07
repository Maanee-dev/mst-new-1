
import React, { useState, useEffect } from 'react';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-28 right-8 z-[90] p-4 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md text-slate-900 shadow-sm transition-all duration-700 hover:shadow-2xl hover:border-slate-900 hover:-translate-y-2 focus:outline-none group ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <div className="relative overflow-hidden w-4 h-4">
        <svg 
          className="w-4 h-4 transition-all duration-500 group-hover:-translate-y-full" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
        </svg>
        <svg 
          className="w-4 h-4 absolute top-full left-0 transition-all duration-500 group-hover:-translate-y-full" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
        </svg>
      </div>
    </button>
  );
};

export default ScrollToTopButton;
