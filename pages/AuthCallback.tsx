import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the hash/query params from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // If opened in a popup
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_SUCCESS', session }, '*');
          window.close();
        } else {
          // If opened directly (fallback)
          navigate('/');
        }
      } else {
        // Handle error or no session
         const params = new URLSearchParams(window.location.search);
         const error = params.get('error_description');
         if (error) {
             if (window.opener) {
                 window.opener.postMessage({ type: 'OAUTH_ERROR', error }, '*');
                 window.close();
             }
         }
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs uppercase tracking-widest">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
