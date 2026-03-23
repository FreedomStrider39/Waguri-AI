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
      // Fetch the latest message from Karouko to display on the home screen
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
    <div className="min-h-screen bg-[#FFF9F9] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="relative inline-block">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl mx-auto">
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
          <h1 className="text-4xl font-bold text-slate-800">Karouko Waguri</h1>
          <p className="text-rose-400 font-medium text-lg">She's been waiting for you...</p>
        </div>

        <Button 
          onClick={() => navigate('/chat')}
          className="w-full h-16 text-xl font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-3xl shadow-xl shadow-rose-200 transition-all active:scale-95 flex items-center justify-center space-x-3"
        >
          <MessageCircle className="w-6 h-6" />
          <span>Start Talking</span>
        </Button>

        <div className="px-4">
          <p className="text-slate-400 text-sm italic line-clamp-2">
            "{lastMessage}"
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;