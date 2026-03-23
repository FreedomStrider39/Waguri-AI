"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const navigate = useNavigate();

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

        <p className="text-slate-400 text-sm italic">
          "I'm so happy you're here!"
        </p>
      </div>

      <div className="mt-auto">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;