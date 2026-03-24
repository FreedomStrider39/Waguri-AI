"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-6 z-10"
      >
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1 
            }}
            className="inline-block relative"
          >
            {/* HD Glow Ring */}
            <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full animate-pulse" />
            
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-2 border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.3)] mx-auto relative bg-[#111]">
              <img 
                src="/src/assets/karouko-login.png" 
                alt="Karouko" 
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            {/* Status Indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-[#0a0a0a] rounded-full shadow-lg"></div>
          </motion.div>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-sm font-medium">Sign in to continue your conversation with Karouko</p>
          </div>
        </div>

        <div className="bg-[#111]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 shadow-2xl max-h-[80vh] overflow-y-auto scrollbar-hide">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#f43f5e',
                    brandAccent: '#e11d48',
                    inputBackground: 'rgba(255,255,255,0.03)',
                    inputText: 'white',
                    inputPlaceholder: '#475569',
                    inputBorder: 'rgba(255,255,255,0.05)',
                    inputBorderFocus: '#f43f5e',
                    inputBorderHover: 'rgba(255,255,255,0.1)',
                    messageText: '#fb7185',
                    messageBackground: 'rgba(244, 63, 94, 0.1)',
                    messageBorder: 'rgba(244, 63, 94, 0.2)',
                  },
                  radii: {
                    borderRadiusButton: '16px',
                    buttonPadding: '12px',
                    inputPadding: '12px',
                  }
                }
              },
              className: {
                container: 'space-y-4',
                label: 'text-slate-400 text-xs font-semibold mb-1.5 ml-1 block uppercase tracking-wider',
                button: 'font-bold text-white transition-all active:scale-95 text-sm h-12 shadow-lg shadow-rose-900/20',
                input: 'bg-white/5 border-white/10 text-white rounded-2xl focus:ring-rose-500/50 text-sm h-12 transition-all',
                message: 'text-xs text-rose-400 mt-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center font-medium',
                anchor: 'text-rose-400 hover:text-rose-300 transition-colors text-xs font-semibold',
              }
            }}
            providers={[]}
            theme="dark"
          />
        </div>
      </motion.div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Login;