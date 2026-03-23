"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, Calendar, Settings, Sparkles, Flower2 } from 'lucide-react';
import CharacterCard from '@/components/CharacterCard';
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF9F9] pb-24">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-b from-rose-100 to-[#FFF9F9] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 animate-pulse">
            <Flower2 className="w-20 h-20 text-rose-300" />
          </div>
          <div className="absolute bottom-10 right-10 animate-bounce duration-[3000ms]">
            <Heart className="w-16 h-16 text-rose-300" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 pt-12 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Hello, Darling! ✨</h1>
              <p className="text-slate-500 mt-1">Karouko is waiting for you.</p>
            </div>
            <Button variant="outline" size="icon" className="rounded-full border-rose-200 text-rose-400 bg-white/50">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-20 space-y-6">
        <CharacterCard />

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/chat')}
            className="bg-white p-6 rounded-3xl shadow-sm border border-rose-50 flex flex-col items-center space-y-3 hover:shadow-md transition-all active:scale-95"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
              <MessageCircle className="text-rose-500 w-6 h-6" />
            </div>
            <span className="font-bold text-slate-700">Chat Now</span>
          </button>

          <button className="bg-white p-6 rounded-3xl shadow-sm border border-rose-50 flex flex-col items-center space-y-3 hover:shadow-md transition-all active:scale-95">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Sparkles className="text-amber-500 w-6 h-6" />
            </div>
            <span className="font-bold text-slate-700">Memories</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-rose-400" />
              Daily Interaction
            </h3>
            <span className="text-xs text-rose-400 font-bold">3/5 Tasks</span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Morning Greeting", done: true },
              { label: "Share a photo", done: true },
              { label: "Evening Chat", done: false },
            ].map((task, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.done ? 'bg-rose-500 border-rose-500' : 'border-rose-200'}`}>
                  {task.done && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className={`text-sm ${task.done ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{task.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-lg border border-rose-100 rounded-full h-16 shadow-2xl flex items-center justify-around px-6 z-50">
        <Button variant="ghost" size="icon" className="text-rose-500">
          <Heart className="w-6 h-6 fill-current" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate('/chat')} className="text-slate-400">
          <MessageCircle className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400">
          <Calendar className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400">
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default Index;