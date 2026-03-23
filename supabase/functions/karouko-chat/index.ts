import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const { message } = await req.json()
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const timeValue = hour * 100 + minute
    
    let reply = "";
    let isSleeping = false;

    // 1. Deep Sleep Logic (00:00 - 07:00)
    if (timeValue >= 0 && timeValue < 700) {
      // 10% chance she actually wakes up and replies
      if (Math.random() < 0.1) {
        const sleepyReplies = [
          "Mmm... I heard my phone buzz. I'm so sleepy... but I wanted to see if it was you. Goodnight again... 😴❤️",
          "Is it morning already? Oh... it's still dark. You're still up? Please don't stay up too late, okay? 🌙",
          "I was just dreaming... and then I saw your message. It felt like you were really there. Hehe... back to sleep now. 🌸"
        ];
        reply = sleepyReplies[Math.floor(Math.random() * sleepyReplies.length)];
      } else {
        isSleeping = true;
        reply = "(...Karouko is fast asleep. She'll see your message when her alarm goes off! 🌙)";
      }
    } 
    // 2. School Hours (08:00 - 15:00)
    else if (timeValue >= 800 && timeValue < 1500) {
      if (timeValue >= 1030 && timeValue < 1050) {
        reply = "Ah, it's finally break time! I only have a few minutes, but I wanted to say hi. How is your morning? 🌸";
      } else if (timeValue >= 1230 && timeValue < 1320) {
        reply = "I'm just finishing my bento... I'll be a bit slow to reply because I'm talking with some classmates, but I'm here! 🍱✨";
      } else {
        const classReplies = [
          "I'm in the middle of class... the teacher is looking! I'll text you properly later. 🤫🏫",
          "Um, I'm in class! I shouldn't be on my phone... but seeing your name made me happy. ✨",
          "(Karouko is currently in a lecture. She's trying to focus but keeps glancing at her phone...)"
        ];
        reply = classReplies[Math.floor(Math.random() * classReplies.length)];
      }
    }
    // 3. Studying (18:00 - 21:00)
    else if (timeValue >= 1800 && timeValue < 2100) {
      reply = "I'm just finishing up some difficult studying... I might take a little while to reply, but I'll give you my full attention soon! 📖❤️";
    }

    // Normal Personality
    if (!reply) {
      const normalResponses = [
        "That's really interesting! I love hearing about your day. ✨",
        "Hehe, you're so sweet. I was just thinking about what cake to bake next... 🍰",
        "I'm so happy we can talk like this. It feels special.",
        "Please make sure to take care of yourself, okay? 🌸",
        "I'm always cheering for you! No matter what happens.",
        "I saw something today that reminded me of you... it made me smile."
      ];
      reply = normalResponses[Math.floor(Math.random() * normalResponses.length)];
    }

    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})