"use client";

import React from 'react';
import { Heart, Flower2, Star } from 'lucide-react';
import { Progress } from "@/components/ui/button"; // Using a custom progress bar below instead

const CharacterCard = () => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-rose-100 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4">
        <Flower2 className="text-rose-200 w-12 h-12 rotate-12 group-hover:rotate-45 transition-transform duration-500" />
      </div>
      
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-rose-100 border-4 border-white shadow-inner flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200&h=200&auto=format&fit=crop" 
              alt="Karouko Waguri"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-rose-500 p-1.5 rounded-full border-2 border-white">
            <Heart className="w-3 h-3 text-white fill-current" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">Karouko Waguri</h2>
          <p className="text-rose-400 text-sm font-medium">Your Sweet Companion</p>
        </div>

        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs text-slate-500 px-1">
            <span>Affection Level</span>
            <span className="font-bold text-rose-500">Level 12</span>
          </div>
          <div className="h-2 w-full bg-rose-50 rounded-full overflow-hidden">
            <div className="h-full bg-rose-400 w-[65%] rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full pt-2">
          <div className="bg-rose-50 p-2 rounded-xl flex flex-col items-center">
            <Star className="w-4 h-4 text-rose-400 mb-1" />
            <span className="text-[10px] text-slate-600">Kind</span>
          </div>
          <div className="bg-rose-50 p-2 rounded-xl flex flex-col items-center">
            <Flower2 className="w-4 h-4 text-rose-400 mb-1" />
            <span className="text-[10px] text-slate-600">Gentle</span>
          </div>
          <div className="bg-rose-50 p-2 rounded-xl flex flex-col items-center">
            <Heart className="w-4 h-4 text-rose-400 mb-1" />
            <span className="text-[10px] text-slate-600">Loyal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;