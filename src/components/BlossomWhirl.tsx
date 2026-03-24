"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_COUNT = 40;

const BlossomWhirl = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'whirl' | 'heart' | 'reveal'>('whirl');

  useEffect(() => {
    const whirlTimer = setTimeout(() => setPhase('heart'), 2000);
    const revealTimer = setTimeout(() => {
      setPhase('reveal');
      setTimeout(onComplete, 1000);
    }, 4000);

    return () => {
      clearTimeout(whirlTimer);
      clearTimeout(revealTimer);
    };
  }, [onComplete]);

  // Generate heart coordinates using the parametric equation
  const getHeartPos = (i: number) => {
    const t = (i / PARTICLE_COUNT) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: x * 8, y: y * 8 }; // Scale up
  };

  const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
    const isPink = i % 2 === 0;
    const heartPos = getHeartPos(i);
    
    return {
      id: i,
      color: isPink ? '#f43f5e' : '#581c87',
      size: Math.random() * 8 + 4,
      initialX: (Math.random() - 0.5) * 1000,
      initialY: (Math.random() - 0.5) * 1000,
      heartX: heartPos.x,
      heartY: heartPos.y,
      delay: Math.random() * 0.5,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      <div className="relative">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              x: p.initialX, 
              y: p.initialY, 
              opacity: 0,
              rotate: 0,
              scale: 0 
            }}
            animate={
              phase === 'whirl' 
                ? { 
                    x: [p.initialX, (Math.random() - 0.5) * 200, 0],
                    y: [p.initialY, (Math.random() - 0.5) * 200, 0],
                    opacity: [0, 1, 0.8],
                    rotate: 720,
                    scale: [0, 1.2, 1],
                    transition: { duration: 2, ease: "easeInOut", delay: p.delay }
                  }
                : phase === 'heart'
                ? {
                    x: p.heartX,
                    y: p.heartY,
                    opacity: 1,
                    rotate: 360,
                    scale: 1,
                    transition: { duration: 1.5, ease: "backOut" }
                  }
                : {
                    x: p.heartX * 2,
                    y: p.heartY * 2,
                    opacity: 0,
                    scale: 0,
                    transition: { duration: 1, ease: "anticipate" }
                  }
            }
            className="absolute rounded-full blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 15px ${p.color}`,
            }}
          />
        ))}

        {/* Central Glow */}
        <motion.div
          animate={
            phase === 'heart' 
              ? { scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] } 
              : { scale: 0, opacity: 0 }
          }
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/20 blur-[80px] rounded-full"
        />
      </div>
    </div>
  );
};

export default BlossomWhirl;