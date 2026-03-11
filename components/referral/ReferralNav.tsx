
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Palmtree } from 'lucide-react';

import { supabase } from '../../lib/supabase';

interface ReferralNavProps {
  onLogout?: () => void;
  onLogin?: () => void;
}

const ReferralNav: React.FC<ReferralNavProps> = ({ onLogout, onLogin }) => {
  const location = useLocation();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = session ? [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/referral' },
    { icon: Users, label: 'Referrals', path: '/referral/list' },
    { icon: CreditCard, label: 'Earnings', path: '/referral/earnings' },
    { icon: Settings, label: 'Settings', path: '/referral/settings' },
  ] : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-600/20 group-hover:scale-110 transition-transform">
            <Palmtree size={20} />
          </div>
          <span className="font-serif font-medium text-xl tracking-tight text-slate-900 dark:text-white">Serenity <span className="italic text-sky-600">Partners</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                  isActive ? 'text-sky-600' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={14} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-8 left-0 right-0 h-0.5 bg-sky-600"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mr-4"
          >
            Back to Website
          </Link>
          {!session && (
            <button
              onClick={onLogin}
              className="bg-sky-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-sky-700 transition-all"
            >
              Partner Login
            </button>
          )}
          {session && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-rose-600 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ReferralNav;
