import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, User, Trash2, LogOut, Mail, Lock, Chrome, Star, Gift, Shield } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { supabase } from '../lib/supabase';

const UserPanel: React.FC = () => {
  const { likedResorts, toggleLike, items, removeItem, isUserPanelOpen, setIsUserPanelOpen, memberStatus, memberDiscount, user } = useBag();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'profile'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onClose = () => {
    setIsUserPanelOpen(false);
    setSuccessMessage(null);
    setError(null);
  };

  useEffect(() => {
    if (user) {
      setAuthMode('profile');
    } else {
      setAuthMode('login');
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const processedEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: processedEmail, 
        password 
      });
      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' 
        ? 'Invalid email or password.' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      alert('Password reset link sent!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    const processedEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: processedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      
      if (data.session) {
        onClose();
      } else {
        setSuccessMessage('Account created! Please check your email.');
        setAuthMode('login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthMode('login');
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isUserPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[700]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-950 z-[701] shadow-2xl flex flex-col border-l border-slate-100 dark:border-white/5"
          >
            {/* Minimal Header */}
            <div className="absolute top-6 right-6 z-10">
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {authMode !== 'profile' ? (
                <div className="min-h-full flex flex-col justify-center py-12">
                  <div className="mb-10">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                      {authMode === 'login' ? 'Welcome Back' : 'Join Serenity'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
                      {authMode === 'login' 
                        ? 'Access your curated collection of island escapes.' 
                        : 'Begin your journey to the Maldives.'}
                    </p>
                  </div>

                  {/* Google Login */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium py-3.5 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-3 mb-6"
                  >
                    <Chrome size={18} />
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100 dark:border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest">
                      <span className="bg-white dark:bg-slate-950 px-2 text-slate-400">Or email</span>
                    </div>
                  </div>

                  <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
                    {authMode === 'signup' && (
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={16} />
                        <input 
                          type="text" 
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    )}
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={16} />
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={16} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-3.5 pl-11 pr-12 text-sm focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-sky-500 transition-colors"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {successMessage && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg text-xs text-emerald-600 text-center">
                        {successMessage}
                      </div>
                    )}

                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-xs text-red-500 text-center">
                        {error}
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg shadow-slate-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        authMode === 'login' ? 'Sign In' : 'Create Account'
                      )}
                    </button>
                  </form>

                  <div className="mt-8 flex flex-col gap-3 text-center">
                    <button 
                      onClick={handleGuestLogin}
                      disabled={loading}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      Continue as Guest
                    </button>

                    <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-4">
                      <button 
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                        className="hover:text-sky-500 transition-colors"
                      >
                        {authMode === 'login' ? "Create an account" : "Sign in instead"}
                      </button>
                      {authMode === 'login' && (
                        <>
                          <span>•</span>
                          <button 
                            onClick={handleForgotPassword}
                            className="hover:text-sky-500 transition-colors"
                          >
                            Forgot Password
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-12 pb-8">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xl font-bold">
                      {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || <User />}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {user?.is_anonymous ? 'Guest Explorer' : (user?.user_metadata?.full_name || 'Explorer')}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user?.is_anonymous ? 'Anonymous Session' : user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Member Benefits */}
                  {!user?.is_anonymous && (
                    <div className="mb-10 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 rounded-2xl p-6 text-white dark:text-slate-900 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="text-yellow-400 dark:text-yellow-600" size={16} fill="currentColor" />
                          <span className="text-xs font-black uppercase tracking-widest">{memberStatus} Member</span>
                        </div>
                        <span className="text-xs font-bold opacity-80">Points: 0</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-medium opacity-90">
                          <Gift size={16} />
                          <span>{(memberDiscount * 100).toFixed(0)}% Member Discount Applied</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium opacity-90">
                          <Shield size={16} />
                          <span>Best Price Guarantee</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Liked Destinations */}
                  <section className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                        <Heart size={14} /> Liked
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">{likedResorts.length} items</span>
                    </div>

                    {likedResorts.length === 0 ? (
                      <div className="py-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                        <p className="text-xs text-slate-400">No favorites yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {likedResorts.map((resort) => (
                          <div key={resort.id} className="group flex gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                            <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={resort.image || 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'} 
                                alt={resort.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{resort.name}</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{resort.atoll}</p>
                            </div>
                            <button 
                              onClick={() => toggleLike(resort)}
                              className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Bucket Items */}
                  <section className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                        <ShoppingBag size={14} /> Bucket
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">{items.length} items</span>
                    </div>

                    {items.length === 0 ? (
                      <div className="py-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                        <p className="text-xs text-slate-400">Your bucket is empty.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="group flex gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                            <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={item.image || 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.type.replace('_', ' ')}</p>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <button 
                    onClick={handleLogout}
                    className="w-full py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors border-t border-slate-100 dark:border-white/5"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserPanel;
