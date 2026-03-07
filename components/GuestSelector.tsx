import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Minus, Users, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GuestSelectorProps {
  adults: number;
  children: number;
  onChange: (adults: number, children: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ adults, children, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        const portalEl = document.getElementById('guest-portal');
        if (portalEl && portalEl.contains(event.target as Node)) return;
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen]);

  const dropdown = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          style={{ 
            position: 'absolute',
            top: coords.top + 8,
            left: Math.min(coords.left, window.innerWidth - 300),
            width: Math.max(coords.width, 280),
            zIndex: 9999
          }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 p-6"
        >
          <div className="space-y-6">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Adults</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ages 13+</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onChange(Math.max(1, adults - 1), children)}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold text-slate-900 dark:text-white w-4 text-center">{adults}</span>
                <button
                  type="button"
                  onClick={() => onChange(adults + 1, children)}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Children</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ages 0-12</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onChange(adults, Math.max(0, children - 1))}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold text-slate-900 dark:text-white w-4 text-center">{children}</span>
                <button
                  type="button"
                  onClick={() => onChange(adults, children + 1)}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-6 py-3 bg-sky-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-sky-600 transition-colors"
          >
            Apply Selection
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-16 pr-6 py-5 text-sm focus:ring-2 focus:ring-sky-500 transition-all text-slate-900 dark:text-white flex items-center justify-between group"
      >
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
          <Users size={18} />
        </div>
        <span className="truncate">
          {adults} {adults === 1 ? 'Adult' : 'Adults'}
          {children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(
        <div id="guest-portal" className="portal-root">{dropdown}</div>,
        document.body
      )}
    </div>
  );
};

export default GuestSelector;
