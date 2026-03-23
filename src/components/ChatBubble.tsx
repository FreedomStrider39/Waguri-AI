"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

const ChatBubble = ({ message, isUser, timestamp }: ChatBubbleProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] px-4 py-3 rounded-2xl shadow-sm",
        isUser 
          ? "bg-rose-500 text-white rounded-tr-none" 
          : "bg-white text-slate-800 rounded-tl-none border border-rose-100"
      )}>
        <p className="text-sm md:text-base leading-relaxed">{message}</p>
        <span className={cn(
          "text-[10px] mt-1 block opacity-70",
          isUser ? "text-right" : "text-left"
        )}>
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;