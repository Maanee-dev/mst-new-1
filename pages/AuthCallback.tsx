import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Initializing...');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const handleAuth = async () => {
      setStatus('Checking URL hash...');
      
      // 1. Check for hash in URL
      const hash = window.location.hash;
      setDebugInfo(`Hash present: ${hash.length > 0}`);
      
      if (hash && hash.includes('access_token')) {
        setStatus('Parsing tokens...');
        
        // Parse hash manually to be sure
        const params = new URLSearchParams(hash.substring(1)); // remove #
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (accessToken && refreshToken) {
           setStatus('Setting session manually...');
           try {
             const { data, error } = await supabase.auth.setSession({
               access_token: accessToken,
               refresh_token: refreshToken,
             });
             
             if (error) throw error;
             
             if (data.session) {
               setStatus('Session set! Notifying parent...');
               
               // Method 1: PostMessage
               if (window.opener) {
                 window.opener.postMessage({ type: 'OAUTH_SUCCESS', session: data.session }, '*');
               }

               // Method 2: BroadcastChannel (Backup for when opener is null)
               try {
                 const channel = new BroadcastChannel('auth_channel');
                 channel.postMessage({ type: 'OAUTH_SUCCESS', session: data.session });
                 channel.close();
               } catch (e) {
                 console.log('BroadcastChannel not supported');
               }

               setStatus('Login Successful!');
               
               // Attempt to close after a short delay
               setTimeout(() => {
                 if (window.opener) {
                   window.close();
                 } else {
                   // If no opener, we might be in a redirect flow (fallback)
                   navigate('/');
                 }
               }, 1000);
               return;
             }
           } catch (err: any) {
             setStatus(`Error setting session: ${err.message}`);
             setDebugInfo(JSON.stringify(err));
           }
        }
      }

      // 2. Fallback to getSession
      setStatus('Checking existing session...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setStatus('Session found. Notifying parent...');
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_SUCCESS', session }, '*');
          setTimeout(() => window.close(), 500);
        } else {
          navigate('/');
        }
      } else {
        // If we are here and have a hash but failed to set session, show error
        if (hash && hash.includes('access_token')) {
             // Already handled in try/catch above
        } else {
            setStatus('No session found.');
            const queryParams = new URLSearchParams(window.location.search);
            const error = queryParams.get('error_description');
            if (error) {
               setStatus(`Auth Error: ${error}`);
            }
        }
      }
    };

    handleAuth();
  }, [navigate]);

  const handleManualClose = () => {
    if (window.opener) {
        window.close();
    } else {
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
      <div className="w-12 h-12 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-mono mb-4">{status}</p>
      
      <button 
        onClick={handleManualClose}
        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-medium transition-colors mb-4"
      >
        Close Window
      </button>

      {debugInfo && (
        <pre className="text-xs text-slate-500 max-w-md overflow-auto bg-slate-900 p-2 rounded">
          {debugInfo}
        </pre>
      )}
    </div>
  );
};

export default AuthCallback;
