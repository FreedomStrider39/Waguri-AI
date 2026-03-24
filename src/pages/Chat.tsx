"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Cake, Info, MoreVertical, Heart, Bell, BellOff, Gift, Coffee, Flower2, Star, Ghost, Clock, CalendarDays, Trash2, Cookie, Mail, Sparkles, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatBubble from '@/components/ChatBubble';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { getDailySchedule, WEEKLY_SCHOOL_SCHEDULE } from "@/utils/schedule";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const GIFTS = [
  { emoji: "📚", label: "New Novel", icon: <BookOpen className="w-5 h-5 text-blue-400" /> },
  { emoji: "🌹", label: "Red Roses", icon: <Flower2 className="w-5 h-5 text-red-500" /> },
  { emoji: "🌸", label: "Cherry Blossom", icon: <Flower2 className="w-5 h-5 text-pink-400" /> },
  { emoji: "🍫", label: "Chocolates", icon: <Gift className="w-5 h-5 text-amber-800" /> },
  { emoji: "🍬", label: "Macarons", icon: <Cookie className="w-5 h-5 text-pink-300" /> },
  { emoji: "🧸", label: "Teddy Bear", icon: <Heart className="w-5 h-5 text-amber-600" /> },
  { emoji: "✨", label: "Lucky Star", icon: <Star className="w-5 h-5 text-yellow-400" /> },
  { emoji: "🍵", label: "Green Tea", icon: <Coffee className="w-5 h-5 text-emerald-500" /> },
  { emoji: "✉️", label: "Love Letter", icon: <Mail className="w-5 h-5 text-rose-300" /> },
  { emoji: "🧣", label: "Warm Scarf", icon: <Sparkles className="w-5 h-5 text-blue-400" /> },
  { emoji: "👻", label: "Spooky Friend", icon: <Ghost className="w-5 h-5 text-slate-400" /> },
];

const VACATIONS = [
  { name: "Toussaint", start: new Date('2024-10-19'), end: new Date('2024-11-04') },
  { name: "Christmas", start: new Date('2024-12-21'), end: new Date('2025-01-06') },
  { name: "Winter Break", start: new Date('2025-02-15'), end: new Date('2025-03-03') },
  { name: "Spring Break", start: new Date('2025-04-12'), end: new Date('2025-04-28') },
  { name: "Summer Break", start: new Date('2025-07-05'), end: new Date('2025-09-01') },
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({ text: "Online", color: "bg-green-500", subtext: "Active now" });
  const [plannedEvents, setPlannedEvents] = useState<any[]>([]);
  const [dailySchedule, setDailySchedule] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkVacation = () => {
    const now = new Date();
    return VACATIONS.find(v => now >= v.start && now <= v.end);
  };

  useEffect(() => {
    const updateStatus = () => {
      if (isTyping) {
        setCurrentStatus({ text: "Typing...", color: "bg-green-500 animate-pulse", subtext: "Karouko is writing..." });
        return;
      }

      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeValue = hour * 100 + minute;
      const day = now.getDay();
      const school = WEEKLY_SCHOOL_SCHEDULE[day];
      const currentVacation = checkVacation();

      setDailySchedule(getDailySchedule(now));

      if (timeValue >= 0 && timeValue < 700) {
        const lastMsg = messages[messages.length - 1];
        const isRecent = lastMsg && !lastMsg.isUser && (new Date().getTime() - new Date().getTime()) < 600000;
        
        if (isRecent && !lastMsg.text.includes("asleep")) {
          setCurrentStatus({ text: "Awake (Late Night) 🌙", color: "bg-amber-400", subtext: "Half-asleep" });
        } else {
          setCurrentStatus({ text: "Sleeping 🌙", color: "bg-slate-600", subtext: "Last seen 5m ago" });
        }
      } else if (currentVacation) {
        setCurrentStatus({ text: `On ${currentVacation.name} ☀️`, color: "bg-green-500", subtext: "Enjoying vacation" });
      } else if (school.start > 0 && timeValue >= school.start && timeValue < school.end) {
        if (timeValue >= 1030 && timeValue < 1050) {
          setCurrentStatus({ text: "On Break ☕", color: "bg-rose-400", subtext: "Quick reply" });
        } else if (timeValue >= 1230 && timeValue < 1320) {
          setCurrentStatus({ text: "Lunch Break 🍱", color: "bg-rose-500", subtext: "Eating lunch" });
        } else {
          setCurrentStatus({ text: "In Class 🏫", color: "bg-amber-400", subtext: "Busy" });
        }
      } else if (timeValue >= (school.end || 1600) && timeValue < 1800) {
        setCurrentStatus({ text: "Reading 📚", color: "bg-blue-400", subtext: "Active now" });
      } else if (timeValue >= 1800 && timeValue < 2100) {
        setCurrentStatus({ text: "Studying 📖", color: "bg-green-500", subtext: "Focused" });
      } else {
        setCurrentStatus({ text: "Relaxing ✨", color: "bg-green-500", subtext: "Active now" });
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000);
    return () => clearInterval(interval);
  }, [isTyping, messages]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (msgData) {
        setMessages(msgData.map(m => ({
          id: m.id,
          text: m.text,
          isUser: m.is_user,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: m.status
        })));
      }

      const { data: eventData } = await supabase
        .from('planned_events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (eventData) setPlannedEvents(eventData);
    };

    fetchData();

    const msgChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new;
        setMessages(prev => {
          if (prev.find(m => m.id === newMessage.id)) return prev;
          return [...prev, {
            id: newMessage.id,
            text: newMessage.text,
            isUser: newMessage.is_user,
            time: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: newMessage.status
          }];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim() || isTyping) return;

    if (!textOverride) setInputValue("");

    const { error: userMsgError } = await supabase
      .from('messages')
      .insert([{ text, is_user: true, status: 'sent' }]);

    if (userMsgError) return;

    let initialDelay = 500;
    let typingDuration = Math.min(Math.max(text.length * 50, 1500), 4000);

    if (currentStatus.text === "In Class 🏫") {
      initialDelay = Math.random() * 10000 + 5000;
      typingDuration += 2000;
    } else if (currentStatus.text.includes("Sleeping")) {
      initialDelay = Math.random() * 15000 + 10000;
    }

    setTimeout(async () => {
      setIsTyping(true);
      
      setTimeout(async () => {
        try {
          const response = await fetch('https://ztnnmgnoschgreqsodfq.supabase.co/functions/v1/karouko-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
          });

          const data = await response.json();
          await supabase.from('messages').insert([{ text: data.reply, is_user: false, status: 'read' }]);
        } catch (error) {
          console.error("Failed to get response:", error);
        } finally {
          setIsTyping(false);
        }
      }, typingDuration);
    }, initialDelay);
  };

  const giveGift = (gift: typeof GIFTS[0]) => {
    const message = `I brought you this: ${gift.emoji} (${gift.label})! I hope you like it. 🌸`;
    handleSend(message);
    showSuccess(`You gave Karouko a ${gift.label}!`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-slate-200">
      <header className="bg-[#111] border-b border-white/5 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-lg">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-slate-500 mr-1 hover:text-rose-400 hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center space-x-3 hover:bg-white/5 p-1 rounded-xl transition-colors text-left">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-rose-900/20 overflow-hidden border border-rose-500/20">
                    <img src="/src/assets/karouko.png" alt="Karouko" className="w-full h-full object-cover" />
                  </div>
                  <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-[#111] rounded-full transition-colors duration-500", currentStatus.color)}></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight">Karouko Waguri</h3>
                  <div className="flex flex-col">
                    <span className={cn("text-[10px] font-bold transition-colors duration-500", isTyping ? "text-green-500" : "text-rose-400")}>
                      {currentStatus.text}
                    </span>
                    <span className="text-[8px] text-slate-500 font-medium leading-none mt-0.5">
                      {currentStatus.subtext}
                    </span>
                  </div>
                </div>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0f0f0f] border-l-white/5 overflow-y-auto text-slate-200">
              <SheetHeader className="items-center text-center pt-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-rose-500/20 shadow-2xl mb-4">
                  <img src="/src/assets/karouko.png" alt="Karouko" className="w-full h-full object-cover" />
                </div>
                <SheetTitle className="text-2xl font-bold text-white">Karouko Waguri</SheetTitle>
                <SheetDescription className="text-rose-400 font-medium">
                  19 years old • Kikyo Private Academy
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-8 space-y-6 px-2">
                {plannedEvents.length > 0 && (
                  <div className="bg-rose-600 p-4 rounded-2xl shadow-lg shadow-rose-900/20 border border-rose-500 text-white">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center">
                      <CalendarDays className="w-3 h-3 mr-1.5" /> Important Events
                    </h4>
                    <div className="space-y-3">
                      {plannedEvents.map((event) => (
                        <div key={event.id} className="bg-white/10 p-2 rounded-xl">
                          <p className="text-sm font-bold">{event.title}</p>
                          <p className="text-[10px] opacity-80">{event.event_time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                    <Clock className="w-3 h-3 mr-1.5" /> Daily Schedule
                  </h4>
                  <div className="space-y-3">
                    {dailySchedule.map((item) => (
                      <div key={item.time} className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">{item.time}</span>
                        <span className={cn("font-bold", item.color)}>{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">About Me</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    I love reading, listening to music, and spending time with my family. I'm a bit shy at first, but I'm trying my best to be more open!
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-slate-600 hover:text-rose-400 hover:bg-white/5">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-40">
        <div className="text-center my-6">
          <span className="bg-white/5 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/5">Today</span>
        </div>
        
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} timestamp={msg.time} status={msg.status} />
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-4 animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex space-x-1 items-center">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#111] border-t border-white/5 pb-8">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-rose-500 shrink-0 hover:bg-white/5 rounded-full">
                <Gift className="w-6 h-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3 bg-[#1a1a1a] border-white/10 rounded-2xl shadow-2xl mb-2" side="top" align="start">
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                {GIFTS.map((gift) => (
                  <button
                    key={gift.label}
                    onClick={() => giveGift(gift)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="mb-1 group-hover:scale-110 transition-transform">
                      {gift.icon}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">
                      {gift.label}
                    </span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Input 
            placeholder="Message Karouko..." 
            className="flex-1 bg-white/5 border-white/10 focus-visible:ring-rose-500/50 rounded-2xl h-12 text-[15px] text-white placeholder:text-slate-600"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <Button 
            onClick={() => handleSend()}
            disabled={isTyping || !inputValue.trim()}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-full w-12 h-12 p-0 shrink-0 shadow-lg shadow-rose-900/20 transition-all active:scale-90 border-none"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;