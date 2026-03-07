import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Set up a listener for auth state changes (handles the hash parsing)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (window.opener) {
          // Send the session to the parent window
          window.opener.postMessage({ type: 'OAUTH_SUCCESS', session }, '*');
          // Close the popup
          window.close();
        } else {
          // Fallback if not in a popup
          navigate('/');
        }
      }
    });

    // 2. Also check immediate session state (in case it was already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_SUCCESS', session }, '*');
          window.close();
        } else {
          navigate('/');
        }
      }
    });

    // 3. Handle errors in the URL hash
    const params = new URLSearchParams(window.location.hash.substring(1)); // Remove #
    const error = params.get('error_description');
    if (error) {
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_ERROR', error }, '*');
        window.close();
      } else {
        // Show error on screen if not in popup
        console.error('Auth error:', error);
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs uppercase tracking-widest">Finalizing secure login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
