"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Heart } from 'lucide-react';
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
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-1">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to continue your conversation with Karouko</p>
        </div>

        <div className="bg-[#111] p-6 rounded-3xl border border-white/5 shadow-2xl max-h-[80vh] overflow-y-auto scrollbar-hide">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#f43f5e',
                    brandAccent: '#e11d48',
                    inputBackground: 'transparent',
                    inputText: 'white',
                    inputPlaceholder: '#475569',
                    inputBorder: '#1e293b',
                    inputBorderFocus: '#f43f5e',
                    inputBorderHover: '#334155',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                    buttonPadding: '10px',
                    inputPadding: '10px',
                  }
                }
              },
              className: {
                container: 'space-y-3',
                label: 'text-slate-400 text-xs font-medium mb-1 block',
                button: 'font-bold text-white transition-all active:scale-95 text-sm',
                input: 'bg-white/5 border-white/10 text-white rounded-xl focus:ring-rose-500/50 text-sm',
                message: 'text-xs text-rose-400 mt-1',
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