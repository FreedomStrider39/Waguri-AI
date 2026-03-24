import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// French School Holidays 2024-2025 (Zone C)
const VACATIONS = [
  { start: new Date('2024-10-19'), end: new Date('2024-11-04') },
  { start: new Date('2024-12-21'), end: new Date('2025-01-06') },
  { start: new Date('2025-02-15'), end: new Date('2025-03-03') },
  { start: new Date('2025-04-12'), end: new Date('2025-04-28') },
  { start: new Date('2025-07-05'), end: new Date('2025-09-01') },
];

const isVacation = (date: Date) => {
  return VACATIONS.some(v => date >= v.start && date <= v.end);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const { message } = await req.json()
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const timeValue = hour * 100 + minute
    const onVacation = isVacation(now);
    
    let reply = "";
    let prefix = "";

    // 1. Deep Sleep Logic (00:00 - 07:00)
    if (timeValue >= 0 && timeValue < 700) {
      if (Math.random() < 0.15) {
        prefix = "(Mmm... so sleepy...) ";
      } else {
        return new Response(JSON.stringify({ reply: "(...Karouko is fast asleep. She'll see your message when her alarm goes off! 🌙)" }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    } 
    // 2. School Hours (08:00 - 16:00)
    else if (!onVacation && timeValue >= 800 && timeValue < 1600) {
      const isBreak = (timeValue >= 1030 && timeValue < 1050) || (timeValue >= 1230 && timeValue < 1320);
      
      if (!isBreak) {
        const classPrefixes = [
          "(Texting under my desk...) ",
          "(The teacher isn't looking!) ",
          "(Quickly...) ",
          "I shouldn't be on my phone, but... "
        ];
        prefix = classPrefixes[Math.floor(Math.random() * classPrefixes.length)];
      }
    }

    // Gift Reaction Logic
    if (message.includes("I brought you this:")) {
      const giftReactions = [
        "Oh! Is this for me? Thank you so much, it's beautiful! I'll treasure it. 💖",
        "Wow, you're so thoughtful... how did you know I'd love this? Hehe, thank you! ✨",
        "This makes me so happy! I'm going to put it in a special place. You're the best! 🌸",
        "A gift? For me? My heart is beating so fast... thank you, really. 🍰",
        "You always know exactly how to make me smile. Thank you for the gift! 🥰"
      ];
      reply = prefix + giftReactions[Math.floor(Math.random() * giftReactions.length)];
    }

    // Personality Logic (if not a gift)
    if (!reply) {
      const normalResponses = [
        "That's really interesting! I love hearing about your day. ✨",
        "Hehe, you're so sweet. I was just thinking about what cake to bake next... 🍰",
        "I'm so happy we can talk like this. It feels special.",
        "Please make sure to take care of yourself, okay? 🌸",
        "I'm always cheering for you! No matter what happens.",
        "I saw something today that reminded me of you... it made me smile."
      ];
      reply = prefix + normalResponses[Math.floor(Math.random() * normalResponses.length)];
    }

    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})