"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Cake, MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatBubble from '@/components/ChatBubble';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('karouko_messages');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'initial', 
        text: "Um... hello! I'm Karouko Waguri. I was a bit nervous to message you first, but I'm really glad I did. How are you doing today?", 
        isUser: false, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Start typing simulation
    setIsTyping(true);

    // Simulate Karouko's thoughtful response
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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds for realism
  };

  const clearChat = () => {
    if (window.confirm("Do you want to clear your conversation history?")) {
      localStorage.removeItem('karouko_messages');
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFF9F9]">
      {/* Header */}
      <header className="bg-white border-b border-rose-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-slate-400 mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 overflow-hidden border border-rose-200">
              <img 
                src="/src/assets/karouko.png" 
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
        <Button variant="ghost" size="icon" onClick={clearChat} className="text-slate-300 hover:text-rose-400">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            message={msg.text} 
            isUser={msg.isUser} 
            timestamp={msg.time} 
          />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4 animate-pulse">
            <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-rose-100 text-rose-300 text-xs font-medium">
              Karouko is typing...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-rose-100">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="text-rose-300 shrink-0">
            <Cake className="w-6 h-6" />
          </Button>
          <Input 
            placeholder="Type a message..." 
            className="flex-1 bg-rose-50/50 border-none focus-visible:ring-rose-200 rounded-2xl h-11"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <Button 
            onClick={handleSend}
            disabled={isTyping || !inputValue.trim()}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl w-11 h-11 p-0 shrink-0 shadow-lg shadow-rose-200 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;