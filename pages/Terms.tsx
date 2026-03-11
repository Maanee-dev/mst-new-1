import React from 'react';
import SEO from '../components/SEO';
import { Scale, FileText, CreditCard, ShieldAlert, Globe, AlertTriangle } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="bg-[#FCFAF7] dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-700">
      <SEO 
        title="Terms of Service | Maldives Serenity Travels" 
        description="The legal framework and terms of service for luxury travel planning and bookings with Maldives Serenity Travels."
        keywords={['Maldives travel terms', 'booking conditions Maldives', 'Serenity Maldives legal', 'travel agency terms']}
      />
      
      {/* Cinematic Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover" 
            alt="Maldives Texture"
          />
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center px-6">
          <span className="text-[10px] font-black text-sky-400 uppercase tracking-[1.2em] mb-8 block">Legal Framework</span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter italic leading-none">
            Terms of <br /> Service.
          </h1>
          <div className="h-px w-16 bg-amber-400 mx-auto mt-8 mb-8"></div>
          <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.5em]">Effective Date: March 11, 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 lg:p-24 shadow-2xl border border-slate-100 dark:border-white/5 transition-colors duration-700">
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            
            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Scale className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Legal Agreement</p>
              </div>
            </div>
            
            <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-12">
              <p>
                By accessing or using the Maldives Serenity Travels website, mobile applications, booking platform, or any related services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not access or use our Services.
              </p>
              <p>
                You must be at least <strong>18 years of age</strong> to use our Services. By using our Services, you represent and warrant that you are of legal age to form a binding contract and all information you provide is accurate and complete.
              </p>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Globe className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">3. Services Description</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Scope of Agency</p>
              </div>
            </div>

            <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-12">
              <p>
                Maldives Serenity Travels specializes in curated luxury resort recommendations, bespoke itinerary design, and private transfer arrangements.
              </p>
              <p className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-white/5 italic">
                We act as an <strong>intermediary and travel agent</strong>, not as the ultimate provider of travel services. We are not liable for the acts, omissions, or failures of third-party suppliers including resorts, airlines, and transfer operators.
              </p>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <CreditCard className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">5. Bookings & Payments</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Financial Commitments</p>
              </div>
            </div>

            <div className="overflow-x-auto mb-12">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5">
                    <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Payment Type</th>
                    <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Timing</th>
                    <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 dark:text-slate-400">
                  <tr className="border-b border-slate-50 dark:border-white/5">
                    <td className="py-4 font-bold">Deposit</td>
                    <td className="py-4">At booking confirmation</td>
                    <td className="py-4">30-50% of total</td>
                  </tr>
                  <tr className="border-b border-slate-50 dark:border-white/5">
                    <td className="py-4 font-bold">Balance</td>
                    <td className="py-4">45-60 days before arrival</td>
                    <td className="py-4">Remaining balance</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">Last-Minute</td>
                    <td className="py-4">Within 30 days of arrival</td>
                    <td className="py-4">100% at booking</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <ShieldAlert className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">5.3 Cancellation Policy</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Refund Schedules</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">60+ Days</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Full refund minus administrative fee ($250).</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">45-59 Days</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">75% refund. Resort cancellation fees may apply.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">30-44 Days</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">50% refund. Subject to partner policies.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">0-14 Days</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">No refund. Full forfeiture of payment.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <AlertTriangle className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">10. Limitation of Liability</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Risk & Responsibility</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-12">
              To the maximum extent permitted by law, our liability for direct damages is limited to the total amount paid by you for the specific booking. We are not liable for indirect, consequential, or emotional distress damages.
            </p>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <FileText className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">13. Governing Law</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Jurisdiction</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-12">
              These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of Maldives</strong>. Any legal action shall be brought exclusively in the courts of Malé, Maldives.
            </p>

            <div className="pt-12 border-t border-slate-100 dark:border-white/5 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] mb-4">Legal Inquiries</p>
              <p className="text-slate-900 dark:text-white font-serif italic text-xl">legal@maldives-serenitytravels.com</p>
              <p className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-8">© 2026 Maldives Serenity Travels. All Rights Reserved.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
