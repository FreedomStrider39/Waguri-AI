"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from 'lucide-react';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

const ChatBubble = ({ message, isUser, timestamp, status = 'read' }: ChatBubbleProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm relative group",
        isUser 
          ? "bg-rose-500 text-white rounded-tr-none" 
          : "bg-white text-slate-800 rounded-tl-none border border-rose-100"
      )}>
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message}</p>
        
        <div className={cn(
          "flex items-center mt-1 space-x-1 justify-end",
          isUser ? "text-rose-100" : "text-slate-400"
        )}>
          <span className="text-[10px] opacity-70">
            {timestamp}
          </span>
          {isUser && (
            <span className="flex items-center">
              {status === 'sending' && <div className="w-2 h-2 border-b border-white rounded-full animate-spin" />}
              {status === 'sent' && <Check className="w-3 h-3" />}
              {status === 'delivered' && <CheckCheck className="w-3 h-3" />}
              {status === 'read' && <CheckCheck className="w-3 h-3 text-blue-300" />}
            </span>
          )}
        </div>

        {/* Bubble Tail */}
        <div className={cn(
          "absolute top-0 w-2 h-2",
          isUser 
            ? "-right-1 bg-rose-500 [clip-path:polygon(0_0,0_100%,100%_0)]" 
            : "-left-1 bg-white border-l border-t border-rose-100 [clip-path:polygon(0_0,100%_100%,100%_0)]"
        )} />
      </div>
    </div>
  );
};

export default ChatBubble;