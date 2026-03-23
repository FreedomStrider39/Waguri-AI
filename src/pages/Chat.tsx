"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Cake, Info, MoreVertical, Heart, Bell, BellOff, Gift, Coffee, Flower2, Star, Ghost, Clock, CalendarDays, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatBubble from '@/components/ChatBubble';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
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
  { emoji: "🍰", label: "Strawberry Cake", icon: <Cake className="w-5 h-5 text-rose-400" /> },
  { emoji: "🌸", label: "Cherry Blossom", icon: <Flower2 className="w-5 h-5 text-pink-400" /> },
  { emoji: "🍵", label: "Green Tea", icon: <Coffee className="w-5 h-5 text-emerald-500" /> },
  { emoji: "🧸", label: "Teddy Bear", icon: <Heart className="w-5 h-5 text-amber-600" /> },
  { emoji: "✨", label: "Lucky Star", icon: <Star className="w-5 h-5 text-yellow-400" /> },
  { emoji: "👻", label: "Spooky Friend", icon: <Ghost className="w-5 h-5 text-slate-400" /> },
];

const STATIC_SCHEDULE = [
  { time: "00:00 - 07:00", activity: "Sleeping 🌙", color: "text-slate-400" },
  { time: "08:00 - 15:00", activity: "At School 🏫", color: "text-amber-500" },
  { time: "15:00 - 18:00", activity: "Baking 🍰", color: "text-rose-500" },
  { time: "18:00 - 22:00", activity: "Studying 📖", color: "text-blue-500" },
  { time: "22:00 - 00:00", activity: "Relaxing ✨", color: "text-purple-500" },
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({ text: "Online", color: "bg-green-500", subtext: "Active now" });
  const [plannedEvents, setPlannedEvents] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Dynamic Status Logic
  useEffect(() => {
    const updateStatus = () => {
      if (isTyping) {
        setCurrentStatus({ text: "Typing...", color: "bg-green-500 animate-pulse", subtext: "Karouko is writing..." });
        return;
      }

      const hour = new Date().getHours();
      if (hour >= 0 && hour < 7) {
        setCurrentStatus({ text: "Sleeping 🌙", color: "bg-slate-300", subtext: "Last seen 5m ago" });
      } else if (hour >= 8 && hour < 15) {
        setCurrentStatus({ text: "At School 🏫", color: "bg-amber-400", subtext: "Online" });
      } else if (hour >= 15 && hour < 18) {
        setCurrentStatus({ text: "Baking 🍰", color: "bg-green-500", subtext: "Active now" });
      } else if (hour >= 18 && hour < 22) {
        setCurrentStatus({ text: "Studying 📖", color: "bg-green-500", subtext: "Online" });
      } else {
        setCurrentStatus({ text: "Relaxing ✨", color: "bg-green-500", subtext: "Active now" });
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000);
    return () => clearInterval(interval);
  }, [isTyping]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    const fetchData = async () => {
      // Fetch Messages
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (msgData && msgData.length > 0) {
        setMessages(msgData.map(m => ({
          id: m.id,
          text: m.text,
          isUser: m.is_user,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: m.status
        })));
      } else {
        setMessages([{ 
          id: 'initial', 
          text: "Um... hello! I'm Karouko Waguri. I was a bit nervous to message you first, but I'm really glad I did. How are you doing today?", 
          isUser: false, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }]);
      }

      // Fetch Planned Events
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

    const eventChannel = supabase
      .channel('public:planned_events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'planned_events' }, () => {
        supabase.from('planned_events').select('*').order('created_at', { ascending: false })
          .then(({ data }) => { if (data) setPlannedEvents(data); });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(eventChannel);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      showError("This browser doesn't support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      showSuccess("Karouko can now reach you anytime! 🌸");
    } else {
      showError("Notifications were denied.");
    }
  };

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim() || isTyping) return;

    if (!textOverride) setInputValue("");

    const { error: userMsgError } = await supabase
      .from('messages')
      .insert([{ text, is_user: true, status: 'sent' }]);

    if (userMsgError) return;

    setIsTyping(true);

    try {
      const response = await fetch('https://ztnnmgnoschgreqsodfq.supabase.co/functions/v1/karouko-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.slice(-5) })
      });

      const data = await response.json();
      await supabase.from('messages').insert([{ text: data.reply, is_user: false, status: 'read' }]);
    } catch (error) {
      console.error("Failed to get response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const giveGift = (gift: typeof GIFTS[0]) => {
    const message = `I brought you this: ${gift.emoji} (${gift.label})! I hope you like it. 🌸`;
    handleSend(message);
    showSuccess(`You gave Karouko a ${gift.label}!`);
  };

  const deleteEvent = async (id: string) => {
    await supabase.from('planned_events').delete().eq('id', id);
    showSuccess("Event removed from schedule.");
  };

  const clearChat = async () => {
    if (window.confirm("Do you want to clear your conversation history?")) {
      await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      setMessages([]);
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFF9F9]">
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
                    <img src="/src/assets/karouko.png" alt="Karouko" className="w-full h-full object-cover" />
                  </div>
                  <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full transition-colors duration-500", currentStatus.color)}></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">Karouko Waguri</h3>
                  <div className="flex flex-col">
                    <span className={cn("text-[10px] font-bold transition-colors duration-500", isTyping ? "text-green-500" : "text-rose-400")}>
                      {currentStatus.text}
                    </span>
                    <span className="text-[8px] text-slate-400 font-medium leading-none mt-0.5">
                      {currentStatus.subtext}
                    </span>
                  </div>
                </div>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#FFF9F9] border-l-rose-100 overflow-y-auto">
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
                {/* Planned Events Section */}
                {plannedEvents.length > 0 && (
                  <div className="bg-rose-500 p-4 rounded-2xl shadow-lg shadow-rose-200 border border-rose-400 text-white">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center">
                      <CalendarDays className="w-3 h-3 mr-1.5" /> Important Events
                    </h4>
                    <div className="space-y-3">
                      {plannedEvents.map((event) => (
                        <div key={event.id} className="bg-white/10 p-2 rounded-xl relative group">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold">{event.title}</p>
                              <p className="text-[10px] opacity-80">{event.event_time}</p>
                            </div>
                            <button 
                              onClick={() => deleteEvent(event.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded-lg"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose-50">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                    <Clock className="w-3 h-3 mr-1.5" /> Daily Schedule
                  </h4>
                  <div className="space-y-3">
                    {STATIC_SCHEDULE.map((item) => (
                      <div key={item.time} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">{item.time}</span>
                        <span className={cn("font-bold", item.color)}>{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant={notificationsEnabled ? "outline" : "default"}
                  className={notificationsEnabled ? "w-full border-rose-200 text-rose-400" : "w-full bg-rose-500 hover:bg-rose-600"}
                  onClick={requestNotificationPermission}
                >
                  {notificationsEnabled ? <BellOff className="w-4 h-4 mr-2" /> : <Bell className="w-4 h-4 mr-2" />}
                  {notificationsEnabled ? "Notifications On" : "Enable Notifications"}
                </Button>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose-50">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Me</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    I love baking cakes, reading, and spending time with my family. I'm a bit shy at first, but I'm trying my best to be more open!
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={requestNotificationPermission}
            className={notificationsEnabled ? "text-rose-400" : "text-slate-300"}
          >
            {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={clearChat} className="text-slate-300 hover:text-rose-400">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-90">
        <div className="text-center my-6">
          <span className="bg-rose-100/50 text-rose-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
        </div>
        
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} timestamp={msg.time} status={msg.status} />
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

      <div className="p-4 bg-white border-t border-rose-100 pb-8">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-rose-400 shrink-0 hover:bg-rose-50 rounded-full">
                <Gift className="w-6 h-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 bg-white border-rose-100 rounded-2xl shadow-xl mb-2" side="top" align="start">
              <div className="grid grid-cols-3 gap-2">
                {GIFTS.map((gift) => (
                  <button
                    key={gift.label}
                    onClick={() => giveGift(gift)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-rose-50 transition-colors group"
                  >
                    <div className="mb-1 group-hover:scale-110 transition-transform">
                      {gift.icon}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">
                      {gift.label}
                    </span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Input 
            placeholder="Message Karouko..." 
            className="flex-1 bg-rose-50/50 border-none focus-visible:ring-rose-200 rounded-2xl h-12 text-[15px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <Button 
            onClick={() => handleSend()}
            disabled={isTyping || !inputValue.trim()}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-full w-12 h-12 p-0 shrink-0 shadow-lg shadow-rose-200 transition-all active:scale-90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;