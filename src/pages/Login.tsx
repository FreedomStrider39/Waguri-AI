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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 z-10"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-2">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400">Sign in to continue your conversation with Karouko</p>
        </div>

        <div className="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl">
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
                    buttonPadding: '12px',
                    inputPadding: '12px',
                  }
                }
              },
              className: {
                container: 'space-y-4',
                label: 'text-slate-400 text-sm font-medium mb-1.5 block',
                button: 'font-bold text-white transition-all active:scale-95',
                input: 'bg-white/5 border-white/10 text-white rounded-xl focus:ring-rose-500/50',
              }
            }}
            providers={[]}
            theme="dark"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;