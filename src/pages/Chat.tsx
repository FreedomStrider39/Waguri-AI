"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Cake, Info, MoreVertical, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatBubble from '@/components/ChatBubble';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('karouko_messages');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'initial', 
        text: "Um... hello! I'm Karouko Waguri. I was a bit nervous to message you first, but I'm really glad I did. How are you doing today?", 
        isUser: false, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }
    ];
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('karouko_messages', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate delivery and read status
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMessage.id ? { ...m, status: 'delivered' } : m));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMessage.id ? { ...m, status: 'read' } : m));
      setIsTyping(true);
    }, 1500);

    // Simulate Karouko's thoughtful response
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      const responses = [
        "That's really interesting! I love hearing about your day. It makes me feel closer to you. ✨",
        "Hehe, you're so sweet. I was just thinking about what cake to bake next... maybe something with strawberries? 🍰",
        "I'm so happy we can talk like this. I usually keep things to myself, but with you, it feels different.",
        "Please make sure to take care of yourself, okay? I'd be sad if you pushed yourself too hard. 🌸",
        "I'm always cheering for you! No matter what happens, I'm on your side.",
        "I saw something today that reminded me of you... it made me smile without even realizing it.",
        "Kosuke was asking about you earlier! He thinks you're a cool person too. 😊",
        "Thank you for being so kind to me. It really means a lot."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFF9F9]">
      {/* Header */}
      <header className="bg-white border-b border-rose-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-slate-400 mr-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center space-x-3 hover:bg-rose-50 p-1 rounded-xl transition-colors text-left">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-rose-100 overflow-hidden border border-rose-200">
                    <img 
                      src="/src/assets/karouko.png" 
                      alt="Karouko"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">Karouko Waguri</h3>
                  <span className="text-[10px] text-rose-400 font-medium">Online</span>
                </div>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#FFF9F9] border-l-rose-100">
              <SheetHeader className="items-center text-center pt-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4">
                  <img src="/src/assets/karouko.png" alt="Karouko" className="w-full h-full object-cover" />
                </div>
                <SheetTitle className="text-2xl font-bold text-slate-800">Karouko Waguri</SheetTitle>
                <SheetDescription className="text-rose-400 font-medium">
                  19 years old • Kikyo Private Academy
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-6 px-2">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose-50">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Me</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    I love baking cakes, reading, and spending time with my family. I'm a bit shy at first, but I'm trying my best to be more open!
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-rose-50 text-center">
                    <Cake className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 block">Loves</span>
                    <span className="text-xs font-bold text-slate-700">Sweets</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-rose-50 text-center">
                    <Heart className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 block">Birthday</span>
                    <span className="text-xs font-bold text-slate-700">July 22</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-400">
            <Info className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-400">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-90"
      >
        <div className="text-center my-6">
          <span className="bg-rose-100/50 text-rose-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Today
          </span>
        </div>
        
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            message={msg.text} 
            isUser={msg.isUser} 
            timestamp={msg.time}
            status={msg.status}
          />
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-4 animate-in fade-in duration-300">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-rose-100 flex space-x-1 items-center">
              <div className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-rose-100 pb-8">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="text-rose-300 shrink-0 hover:bg-rose-50 rounded-full">
            <Cake className="w-6 h-6" />
          </Button>
          <Input 
            placeholder="Message Karouko..." 
            className="flex-1 bg-rose-50/50 border-none focus-visible:ring-rose-200 rounded-2xl h-12 text-[15px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <Button 
            onClick={handleSend}
            disabled={isTyping || !inputValue.trim()}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-full w-12 h-12 p-0 shrink-0 shadow-lg shadow-rose-200 disabled:opacity-50 transition-all active:scale-90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;