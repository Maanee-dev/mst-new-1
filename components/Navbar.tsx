import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';
import { useBag } from '../context/BagContext';
import Bag from './Bag';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { totalItems } = useBag();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsBagOpen(false);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isOpen || isBagOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }, [isOpen, isBagOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleBag = () => setIsBagOpen(!isBagOpen);

  const navLinks = [
    { name: t('stays'), path: '/stays' },
    { name: t('offers'), path: '/offers' },
    { name: t('experiences'), path: '/experiences' },
    { name: t('stories'), path: '/stories' },
    { name: t('discovery'), path: '/discovery' },
  ];

  const ctaLinks = [
    { name: t('planTrip'), path: '/plan' },
    { name: 'Inquire', path: '/inquire' },
  ];

  const isHomePage = location.pathname === '/';
  // Nav becomes "solid" (glass) when scrolled, when menu is open, or on subpages
  const isNavSolid = (scrolled || isOpen || !isHomePage);
  
  // Reactive Color Logic for Ghost Elements
  // If nav is solid and it's NOT dark mode, use slate-900. Otherwise (on hero or dark mode), use white.
  const elementColorClass = isNavSolid ? 'text-slate-900 dark:text-white' : 'text-white';
  const elementBgClass = isNavSolid ? 'bg-slate-900 dark:bg-white' : 'bg-white';
  const logoFillClass = isNavSolid ? 'fill-slate-900 dark:fill-white' : 'fill-white';
  const elementShadowClass = isNavSolid ? '' : 'drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]';

  return (
    <>
      {/* Header */}
      <nav className={`fixed w-full z-[300] transition-all duration-1000 ${isNavSolid ? 'glass-nav py-4 border-b border-slate-100/50 dark:border-white/5 shadow-sm' : 'bg-transparent py-8 md:py-10'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center relative">
          
          {/* Left: Discover Toggle (Ghost Style - Reactive Color) */}
          <div className="flex-1 flex items-center">
            <button 
              onClick={toggleMenu}
              className="group flex items-center gap-4 focus:outline-none relative z-[301]"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <div className={`relative w-8 h-8 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${elementShadowClass}`}>
                <div className="relative w-6 h-5 flex items-center justify-center">
                  <span className={`absolute block h-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${elementBgClass} ${isOpen ? 'w-6 rotate-45' : 'w-6 -translate-y-[5px]'}`}></span>
                  <span className={`absolute block h-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${elementBgClass} ${isOpen ? 'w-0 opacity-0' : 'w-4 translate-x-[-4px]'}`}></span>
                  <span className={`absolute block h-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${elementBgClass} ${isOpen ? 'w-6 -rotate-45' : 'w-6 translate-y-[5px]'}`}></span>
                </div>
              </div>
              <span className={`hidden lg:block text-[9px] font-black uppercase tracking-[0.6em] transition-all duration-700 ${elementColorClass} ${elementShadowClass} ${isOpen ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
                {t('discover')}
              </span>
            </button>
          </div>

          {/* Center: Brand Identity Logo */}
          <Link to="/" aria-label="Maldives Serenity Travels Home" className="flex flex-col items-center group transition-transform duration-500 hover:scale-[1.02] relative z-10">
            <div className="flex flex-col items-center">
              <svg 
                version="1.0" 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 600 600"
                preserveAspectRatio="xMidYMid meet"
                className={`w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48 -my-6 md:-my-10 lg:-my-16 transition-all duration-1000 ${logoFillClass}`}
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
          </Link>

          {/* Right: Plan CTA (Ghost Style - Reactive Color) */}
          <div className="flex-1 flex justify-end items-center gap-4 md:gap-8">
            {/* Shopping Bag Icon */}
            <button 
              onClick={toggleBag}
              className="group relative p-2 focus:outline-none transition-transform hover:scale-110 active:scale-90"
              aria-label="View selection"
            >
              <ShoppingBag className={`w-5 h-5 md:w-6 md:h-6 ${elementColorClass} ${elementShadowClass}`} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-sky-500 text-white text-[8px] md:text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </button>

            <Link 
              to="/plan" 
              aria-label="Plan your trip"
              className={`hidden lg:flex group relative items-center justify-center px-6 py-3 rounded-full border transition-all duration-500 hover:scale-105 ${isNavSolid ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-transparent hover:bg-sky-500 hover:text-white dark:hover:bg-sky-400 dark:hover:text-white' : 'bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                  {t('planTrip')}
                </span>
                <span className="font-serif text-lg leading-none transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Bag Sidebar */}
      <Bag isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />

      {/* Fullscreen Overlay Menu */}
      <div className={`fixed inset-0 z-[250] bg-white dark:bg-slate-950 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth flex flex-col bg-parchment dark:bg-slate-950">
          <div className="m-auto flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 pt-32 pb-24 text-center w-full min-h-max">
            <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4 lg:space-y-2 w-full">
              {navLinks.map((link, i) => (
                <div key={link.name} className="overflow-hidden py-1 md:py-2">
                  <Link 
                    to={link.path}
                    style={{ transitionDelay: `${150 + i * 80}ms` }}
                    className={`block text-3xl sm:text-4xl md:text-5xl lg:text-[5rem] font-serif font-medium text-slate-900 dark:text-white hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-700 transform leading-tight ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                  >
                    {link.name}.
                  </Link>
                </div>
              ))}
            </div>

            {/* CTA Buttons in Overlay */}
            <div className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-[280px] sm:max-w-md transition-all duration-1000 delay-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {ctaLinks.map((cta, i) => (
                <Link
                  key={cta.name}
                  to={cta.path}
                  className={`w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 shadow-xl text-center ${i === 0 ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-400 dark:hover:text-white' : 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-100 dark:border-white/5 hover:border-sky-500'}`}
                >
                  {cta.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className={`mt-auto mb-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16 transition-all duration-1000 delay-500 pb-10 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a href="#" className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors">Instagram</a>
            <Link to="/contact" className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors">Inquiries</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;