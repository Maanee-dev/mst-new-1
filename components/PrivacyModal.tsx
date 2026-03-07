import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9998] transition-all"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999] p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] rounded-[3rem] shadow-2xl pointer-events-auto overflow-hidden flex flex-col border border-slate-100 dark:border-white/5"
            >
              {/* Header */}
              <div className="p-8 md:p-12 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-medium text-slate-950 dark:text-white tracking-tight">Privacy Policy</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Last Updated: February 2026</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-950 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all duration-500 group"
                >
                  <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                <div className="space-y-12">
                  <section>
                    <div className="flex items-center gap-4 mb-6">
                      <Eye className="w-5 h-5 text-sky-500" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950 dark:text-white">Information We Collect</h3>
                    </div>
                    <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                      <p>At Maldives Serenity Travels, we collect information that you provide directly to us when you inquire about our services, book a trip, or subscribe to our newsletter.</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Personal identifiers (Name, Email, Phone Number, Passport details for bookings)</li>
                        <li>Travel preferences and requirements</li>
                        <li>Payment information (processed securely through our partners)</li>
                        <li>Communication history with our travel experts</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-4 mb-6">
                      <Lock className="w-5 h-5 text-sky-500" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950 dark:text-white">How We Use Your Data</h3>
                    </div>
                    <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                      <p>Your data is used exclusively to provide you with the best possible travel experience. This includes:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Processing your resort bookings and transfers</li>
                        <li>Communicating important updates regarding your journey</li>
                        <li>Personalizing our recommendations based on your "vibe"</li>
                        <li>Improving our website and digital services</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-4 mb-6">
                      <FileText className="w-5 h-5 text-sky-500" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950 dark:text-white">Data Protection</h3>
                    </div>
                    <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                      <p>We implement industry-standard security measures to protect your personal information. We do not sell or lease your data to third parties. Information is only shared with our trusted resort partners and transfer providers as necessary to fulfill your booking.</p>
                    </div>
                  </section>

                  <section className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950 dark:text-white mb-4">Questions?</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      If you have any questions about our privacy practices, please contact our Data Protection Officer at <span className="text-sky-600 dark:text-sky-400 font-bold">privacy@maldives-serenitytravels.com</span>
                    </p>
                  </section>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 md:p-10 border-t border-slate-50 dark:border-white/5 flex justify-center">
                <button 
                  onClick={onClose}
                  className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all duration-500 shadow-xl"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PrivacyModal;
