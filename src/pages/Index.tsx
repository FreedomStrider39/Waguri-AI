"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/components/AuthProvider';

const Index = () => {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [lastMessage, setLastMessage] = useState<string>("I'm so happy you're here!");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login');
    }
  }, [session, authLoading, navigate]);

  useEffect(() => {
    const fetchLastMessage = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('messages')
        .select('text')
        .eq('is_user', false)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setLastMessage(data[0].text);
      }
    };

    fetchLastMessage();
    
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full border-2 border-rose-500/20 flex items-center justify-center">
                <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse" />
              </div>
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-rose-500"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-rose-400 font-medium tracking-widest uppercase text-xs"
            >
              Connecting to Karouko...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md w-full space-y-8 text-center z-10"
          >
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-rose-400">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>

            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full" />

            <div className="relative inline-block">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="w-48 h-48 rounded-full overflow-hidden border-4 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.2)] mx-auto"
              >
                <img 
                  src="/src/assets/karouko.png" 
                  alt="Karouko Waguri"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute -bottom-2 -right-2 bg-rose-500 p-3 rounded-full shadow-lg animate-bounce">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white tracking-tight">Karouko Waguri</h1>
              <p className="text-rose-400 font-medium text-lg">She's been waiting for you...</p>
            </div>

            <Button 
              onClick={() => navigate('/chat')}
              className="w-full h-16 text-xl font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-3xl shadow-xl shadow-rose-900/20 transition-all active:scale-95 flex items-center justify-center space-x-3 border-none"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Start Talking</span>
            </Button>

            <div className="px-4">
              <p className="text-slate-500 text-sm italic line-clamp-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                "{lastMessage}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto z-10">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;