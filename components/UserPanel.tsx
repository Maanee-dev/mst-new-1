import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, User, Trash2, LogOut, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { supabase } from '../lib/supabase';

const UserPanel: React.FC = () => {
  const { likedResorts, toggleLike, items, removeItem, isUserPanelOpen, setIsUserPanelOpen } = useBag();
  const [user, setUser] = useState<any>(null);
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
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) setAuthMode('profile');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setAuthMode('profile');
      else setAuthMode('login');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const processedEmail = email.trim().toLowerCase();
    console.log('Attempting login for:', processedEmail);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: processedEmail, 
        password 
      });
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      console.log('Login successful:', data.user?.email);
      onClose();
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Invalid email or password. If you haven\'t created an account, please use the "Sign Up" tab. If you have, ensure your email is confirmed.');
      } else if (err.message === 'Email not confirmed') {
        setError('Please confirm your email address. Check your inbox for the confirmation link.');
      } else {
        setError(err.message);
      }
    } finally {
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
      alert('Password reset link sent to your email!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
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
        // Email confirmation is disabled, user is logged in
        onClose();
      } else {
        setSuccessMessage('Account created! Please check your email for a confirmation link before signing in.');
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[700]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-[701] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-500">
                  {user ? (
                    <div className="w-full h-full rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                      {user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()}
                    </div>
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                    {user ? (user.is_anonymous ? 'Guest Explorer' : (user.user_metadata?.full_name || 'Explorer')) : 'Your Profile'}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {user ? (user.is_anonymous ? 'Anonymous Session' : user.email) : 'Personalized Collection'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user && (
                  <button 
                    onClick={handleLogout}
                    className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {authMode !== 'profile' ? (
                <div className="h-full flex flex-col justify-center">
                  <div className="mb-8 text-center">
                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                      {authMode === 'login' ? 'Welcome Back' : 'Join the Journey'}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {authMode === 'login' 
                        ? 'Sign in to access your saved destinations.' 
                        : 'Create an account to start your Maldivian collection.'}
                    </p>
                  </div>

                  <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
                    {authMode === 'signup' && (
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-12 text-sm focus:ring-2 focus:ring-sky-500/20 transition-all"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-12 text-sm focus:ring-2 focus:ring-sky-500/20 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-12 text-sm focus:ring-2 focus:ring-sky-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {successMessage && (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <p className="text-[10px] font-bold text-emerald-600 text-center uppercase tracking-widest leading-relaxed">
                          {successMessage}
                        </p>
                      </div>
                    )}

                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                        <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest leading-relaxed">
                          {error}
                        </p>
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {authMode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
                          {authMode === 'login' ? 'Sign In' : 'Create Account'}
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 flex flex-col gap-4 text-center">
                    <div className="flex items-center gap-4 my-2">
                      <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Or</span>
                      <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5" />
                    </div>

                    <button 
                      onClick={handleGuestLogin}
                      disabled={loading}
                      className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-100 dark:border-white/5"
                    >
                      <User size={18} />
                      Continue as Guest
                    </button>

                    {authMode === 'login' && (
                      <button 
                        onClick={handleForgotPassword}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                    <button 
                      onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors"
                    >
                      {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Liked Destinations */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <Heart size={16} className="text-red-500" fill="currentColor" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Liked Destinations</h3>
                </div>

                {likedResorts.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[2rem]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                      You haven't liked any destinations yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {likedResorts.map((resort) => (
                      <div key={resort.id} className="group relative aspect-[16/9] rounded-[1.5rem] overflow-hidden">
                        <img 
                          src={resort.image && resort.image.length > 10 ? resort.image : 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'} 
                          alt={resort.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                          <div>
                            <span className="text-[8px] font-black text-sky-400 uppercase tracking-widest block mb-1">
                              {resort.type?.replace('_', ' ') || 'Resort'} • {resort.atoll}
                            </span>
                            <h4 className="text-sm font-serif font-bold text-white">{resort.name}</h4>
                          </div>
                          <button 
                            onClick={() => toggleLike(resort)}
                            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Bucket Items */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <ShoppingBag size={16} className="text-sky-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">In Your Bucket</h3>
                </div>

                {items.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[2rem]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                      Your bucket is empty.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image && item.image.length > 10 ? item.image : 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest block mb-1">
                            {item.type.replace('_', ' ')}
                          </span>
                          <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserPanel;
