
import React, { useState } from 'react';
import { Copy, Check, Share2, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReferralLinkProps {
  link: string;
  code: string;
}

const ReferralLink: React.FC<ReferralLinkProps> = ({ link, code }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-sky-600 to-blue-800 p-8 md:p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-200 mb-4 block">Your Unique Referral Link</span>
            <h2 className="text-2xl md:text-4xl font-serif font-medium tracking-tight">Share the magic of Maldives.</h2>
          </div>
          <div className="flex gap-4">
            <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10">
              <QrCode size={20} />
            </button>
            <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="relative group">
              <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-5 text-sm font-bold tracking-wide pr-32 truncate">
                {link}
              </div>
              <button 
                onClick={() => copyToClipboard(link, setCopiedLink)}
                className="absolute right-2 top-2 bottom-2 bg-white text-slate-900 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-100 transition-all flex items-center gap-2"
              >
                <AnimatePresence mode="wait">
                  {copiedLink ? (
                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500" /> COPIED
                    </motion.div>
                  ) : (
                    <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <Copy size={14} /> COPY LINK
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="relative group">
              <div className="w-full bg-amber-400/20 backdrop-blur-xl border border-amber-400/30 rounded-2xl px-6 py-5 text-sm font-black tracking-[0.2em] text-amber-400 text-center">
                {code}
              </div>
              <button 
                onClick={() => copyToClipboard(code, setCopiedCode)}
                className="absolute right-2 top-2 bottom-2 bg-amber-400 text-slate-900 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-300 transition-all"
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-6 items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-200">Quick Share:</span>
          <div className="flex gap-4">
            {['WhatsApp', 'Facebook', 'X', 'LinkedIn', 'Email'].map(platform => (
              <button key={platform} className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralLink;
