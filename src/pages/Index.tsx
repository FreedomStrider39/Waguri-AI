"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [lastMessage, setLastMessage] = useState<string>("I'm so happy you're here!");

  useEffect(() => {
    const fetchLastMessage = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('text')
        .eq('is_user', false)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setLastMessage(data[0].text);
      }
    };

    fetchLastMessage();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full" />

      <div className="max-w-md w-full space-y-8 text-center z-10">
        <div className="relative inline-block">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.2)] mx-auto">
            <img 
              src="/src/assets/karouko.png" 
              alt="Karouko Waguri"
              className="w-full h-full object-cover"
            />
          </div>
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
      </div>

      <div className="mt-auto z-10">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;