import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PrivacyModal from './PrivacyModal';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const paymentImgClass = "h-4 md:h-5 w-auto object-contain grayscale brightness-0 opacity-30 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 dark:invert dark:opacity-10 dark:group-hover:invert-0 dark:group-hover:opacity-100 transition-all duration-700 ease-in-out select-none pointer-events-none";

  return (
    <footer className="bg-white dark:bg-slate-950 pt-32 pb-16 border-t border-slate-100 dark:border-white/5 transition-colors duration-700">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Top Section: Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          <div className="lg:col-span-4">
            <Link to="/" className="text-3xl font-serif font-medium text-slate-900 dark:text-white tracking-[0.2em] uppercase block mb-8">
              SERENITY
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-[10px] leading-[2.5] uppercase tracking-[0.3em] font-medium max-w-sm">
              {t('footer.branding')}
            </p>
          </div>
          
          <div className="lg:col-span-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 bg-slate-50 dark:bg-slate-900/50 p-10 md:p-16 rounded-[3rem] border border-slate-100 dark:border-white/5 transition-colors">
            <div className="max-w-md">
              <h4 className="text-2xl font-serif font-medium text-slate-950 dark:text-white mb-4">{t('footer.newsletter.title')}</h4>
              <p className="text-slate-600 dark:text-slate-400 text-[10px] uppercase tracking-widest font-bold">{t('footer.newsletter.subtitle')}</p>
            </div>
            <form className="w-full md:w-auto flex-1 max-w-sm flex items-center relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t('footer.newsletter.placeholder')} 
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-full px-8 py-5 text-[10px] font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all dark:text-white placeholder:text-slate-200"
              />
              <button className="absolute right-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6 py-3.5 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-sky-500 dark:hover:bg-sky-400 transition-colors">{t('footer.newsletter.button')}</button>
            </form>
          </div>
        </div>

        {/* Middle Section: Detailed Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-20 mb-32 border-b border-slate-50 dark:border-white/5 pb-24 transition-colors">
          
          {/* Column 1: Company */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 dark:text-white">{t('footer.nav.agency')}</h4>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <li><Link to="/about" className="hover:text-sky-500 transition-colors">{t('footer.nav.heritage')}</Link></li>
              <li><Link to="/stories" className="hover:text-sky-500 transition-colors">{t('footer.nav.journal')}</Link></li>
              <li><Link to="/contact" className="hover:text-sky-500 transition-colors">{t('footer.nav.connect')}</Link></li>
              <li><Link to="/careers" className="hover:text-sky-500 transition-colors opacity-60 cursor-not-allowed">{t('footer.nav.careers')}</Link></li>
            </ul>
          </div>

          {/* Column 2: Portfolio */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 dark:text-white">{t('footer.nav.portfolio')}</h4>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <li><Link to="/discovery" className="text-sky-500 hover:text-sky-600 transition-colors">Discovery Feed</Link></li>
              <li><Link to="/stays" className="hover:text-sky-500 transition-colors">{t('footer.nav.luxuryResorts')}</Link></li>
              <li><Link to="/stays?type=GUEST_HOUSE" className="hover:text-sky-500 transition-colors">{t('footer.nav.guestHouses')}</Link></li>
              <li><Link to="/stays?type=LIVEABOARD" className="hover:text-sky-500 transition-colors">{t('footer.nav.liveaboards')}</Link></li>
              <li><Link to="/offers" className="hover:text-sky-500 transition-colors">{t('footer.nav.exclusives')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 dark:text-white">{t('footer.nav.governance')}</h4>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <li><Link to="/terms" className="hover:text-sky-500 transition-colors">{t('footer.nav.terms')}</Link></li>
              <li><button onClick={() => setIsPrivacyOpen(true)} className="hover:text-sky-500 transition-colors text-left uppercase">{t('footer.nav.privacy')}</button></li>
              <li><Link to="/faq" className="hover:text-sky-500 transition-colors">{t('footer.nav.faq')}</Link></li>
              <li><Link to="/safety" className="hover:text-sky-500 transition-colors opacity-60 cursor-not-allowed">{t('footer.nav.safety')}</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 dark:text-white">{t('footer.nav.social')}</h4>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <li><a href="#" className="hover:text-sky-500 transition-colors">{t('footer.nav.instagram')}</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">{t('footer.nav.whatsapp')}</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">{t('footer.nav.twitter')}</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">{t('footer.nav.linkedin')}</a></li>
            </ul>
          </div>

          {/* Column 5: Office Location */}
          <div className="space-y-8 col-span-2 md:col-span-1">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 dark:text-white">{t('footer.office.title')}</h4>
            <div className="text-slate-600 dark:text-slate-400 text-[10px] leading-relaxed uppercase tracking-widest space-y-4 font-medium">
              <p>
                Faith, S.feydhoo<br />
                Addu City, 19040<br />
                Republic of Maldives
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-1">
                <p className="text-slate-900 dark:text-white font-bold">{t('footer.office.hoursTitle')}</p>
                <p>09:00 — 18:00 (GMT+5)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Compliance & Payments */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          
          <div className="order-3 lg:order-1 text-center lg:text-left">
            <p className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-[0.5em] mb-4">
              © 2026 Maldives Serenity Travels. Reg No: SP02722025.
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-[8px] font-bold uppercase tracking-[0.4em]">
              Licensed by Ministry of Tourism: MOT.01.RS.TA.25.PJ0482
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 order-1 lg:order-2 group transition-colors">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg/1920px-Visa_Inc._logo_%282005%E2%80%932014%29.svg.png?20170118154621" alt="Visa" className={paymentImgClass} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className={paymentImgClass} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className={paymentImgClass} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className={paymentImgClass} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Binance_logo.svg/3840px-Binance_logo.svg.png" alt="BINANCE" className={paymentImgClass} />
            <img src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20id%3D%22Wechat-Pay-Logo--Streamline-Ultimate%22%20height%3D%2224%22%20width%3D%2224%22%3E%0A%20%20%3Cdesc%3E%0A%20%20%20%20Wechat%20Pay%20Logo%20Streamline%20Icon%3A%20https%3A%2F%2Fstreamlinehq.com%0A%20%20%3C%2Fdesc%3E%0A%20%20%3Cg%20id%3D%22Wechat-Pay-Logo--Streamline-Ultimate.svg%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M22.74%206.58a0.5%200.5%200%200%200%20-0.67%20-0.09L8.89%2015.65a0.69%200.69%200%200%201%20-1%20-0.23L4.41%209.37a0.7%200.7%200%200%201%200.11%20-0.84%200.67%200.67%200%200%201%200.83%20-0.12l3.85%202.14a0.51%200.51%200%200%200%200.48%200l10.77%20-5.74a0.49%200.49%200%200%200%200.26%20-0.39%200.48%200.48%200%200%200%20-0.17%20-0.42A13.07%2013.07%200%200%200%2012%201C5.38%201%200%205.5%200%2011a9.2%209.2%200%200%200%203.44%207%200.24%200.24%200%200%201%200.09%200.22l-0.43%203.95a0.76%200.76%200%200%200%200.36%200.73%200.76%200.76%200%200%200%200.39%200.1%200.72%200.72%200%200%200%200.42%20-0.13c0.11%20-0.08%202.58%20-1.76%203.43%20-2.38a0.24%200.24%200%200%201%200.2%200%2022.28%2022.28%200%200%200%204.1%200.63c6.62%200%2012%20-4.5%2012%20-10a8.75%208.75%200%200%200%20-1.26%20-4.54Z%22%20fill%3D%22%2309d220%22%20stroke-width%3D%221%22%3E%3C%2Fpath%3E%0A%20%20%20%20%3Cpath%20d%3D%22M8.34%2019.82Z%22%20fill%3D%22%2309d220%22%20stroke-width%3D%221%22%3E%3C%2Fpath%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E" alt="WE CHAT PAY" className={paymentImgClass} />

          </div>

          <div className="order-2 lg:order-3">
             <span className="text-sky-500/60 dark:text-sky-400/30 text-[40px] font-serif select-none">Perspective.</span>
          </div>
        </div>
      </div>
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </footer>
  );
};

export default Footer;