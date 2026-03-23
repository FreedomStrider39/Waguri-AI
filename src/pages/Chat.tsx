"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MoreVertical, Smile } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatBubble from '@/components/ChatBubble';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Good morning! I was just thinking about you. Did you sleep well?", isUser: false, time: "08:30 AM" },
    { id: 2, text: "I did! Just woke up. How about you?", isUser: true, time: "08:32 AM" },
    { id: 3, text: "I slept wonderfully. I'm actually making some tea right now... I wish I could share some with you. 🍵", isUser: false, time: "08:33 AM" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate Karouko's response
    setTimeout(() => {
      const responses = [
        "That sounds lovely! Tell me more about it. ✨",
        "Hehe, you always know how to make me smile. 😊",
        "I'm so happy we're talking right now. I was feeling a bit lonely.",
        "You're so hardworking! Please don't forget to take a break, okay? I'll be here waiting.",
        "I'm cheering for you! You can do it! 🌸"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: randomResponse,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFF9F9]">
      {/* Header */}
      <header className="bg-white border-b border-rose-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-slate-400">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 overflow-hidden border border-rose-200">
              <img 
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=100&h=100&auto=format&fit=crop" 
                alt="Karouko"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Karouko Waguri</h3>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
                <span className="text-[10px] text-slate-400">Online</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-400">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
      >
        <div className="text-center py-4">
          <span className="text-[10px] bg-rose-50 text-rose-400 px-3 py-1 rounded-full font-medium uppercase tracking-wider">
            Today
          </span>
        </div>
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            message={msg.text} 
            isUser={msg.isUser} 
            timestamp={msg.time} 
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-rose-100">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="text-rose-300 shrink-0">
            <Smile className="w-6 h-6" />
          </Button>
          <Input 
            placeholder="Type a message..." 
            className="flex-1 bg-rose-50/50 border-none focus-visible:ring-rose-200 rounded-2xl h-11"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            onClick={handleSend}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl w-11 h-11 p-0 shrink-0 shadow-lg shadow-rose-200"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;