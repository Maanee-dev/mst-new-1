
import React, { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumbers = [
    { number: '9607259060', label: 'Reservations', formatted: '+960 725 9060' },
    { number: '9607202464', label: 'Direct Line', formatted: '+960 720 2464' }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Support" : "Open Support"}
        className="fixed bottom-8 right-8 z-[100] bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center justify-center border border-white/10"
      >
        <div className="relative">
          {isOpen ? (
            <X size={24} />
          ) : (
            <div className="flex items-center gap-3">
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                Contact Us
              </span>
              <MessageCircle size={24} />
            </div>
          )}
        </div>
      </button>

      <div className={`fixed bottom-24 right-8 z-[100] w-[300px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden flex flex-col transition-all duration-500 transform origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
        <div className="bg-slate-950 p-6 text-white">
          <h3 className="font-serif text-lg mb-1">Need Assistance?</h3>
          <p className="text-[10px] uppercase tracking-widest text-slate-400">Connect with our team via WhatsApp</p>
        </div>

        <div className="p-6 space-y-4">
          {whatsappNumbers.map((item, idx) => (
            <a
              key={idx}
              href={`https://wa.me/${item.number}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Phone size={18} fill="currentColor" />
              </div>
              <div>
                <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{item.label}</span>
                <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.formatted}</span>
              </div>
            </a>
          ))}
        </div>
        
        <div className="px-6 pb-6 text-center">
          <p className="text-[9px] text-slate-400 leading-relaxed">
            Available daily from 9:00 AM to 10:00 PM (Maldives Time)
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
