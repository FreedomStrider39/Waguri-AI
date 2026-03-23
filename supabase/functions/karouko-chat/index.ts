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
    const timeValue = hour * 100 + minute // e.g., 10:30 becomes 1030
    
    let reply = "";
    let isSleeping = false;
    let isBusy = false;
    let isBreak = false;

    // 1. Deep Sleep (00:00 - 07:00)
    if (timeValue >= 0 && timeValue < 700) {
      isSleeping = true;
      reply = "(...Karouko is fast asleep. She'll see your message when her alarm goes off! 🌙)";
    } 
    // 2. School Hours (08:00 - 15:00) with specific breaks
    else if (timeValue >= 800 && timeValue < 1500) {
      // Morning Break (10:30 - 10:50)
      if (timeValue >= 1030 && timeValue < 1050) {
        isBreak = true;
        reply = "Ah, it's finally break time! I only have a few minutes before the next bell, but I wanted to say hi. How is your morning going? 🌸";
      } 
      // Lunch Break (12:30 - 13:20)
      else if (timeValue >= 1230 && timeValue < 1320) {
        isBreak = true;
        reply = "I'm just finishing my bento... I made a little too much today, hehe. I'll be a bit slow to reply because I'm talking with some classmates, but I'm here! 🍱✨";
      }
      // In Class
      else {
        isBusy = true;
        const classReplies = [
          "I'm in the middle of math class... the teacher is looking this way! I'll text you properly once school is over. 🤫🏫",
          "Um, I'm in class! I shouldn't be on my phone... but seeing your name pop up made me happy. Talk soon! ✨",
          "(Karouko is currently in a lecture. She's trying to focus but keeps glancing at her phone...)"
        ];
        reply = classReplies[Math.floor(Math.random() * classReplies.length)];
      }
    }
    // 3. Studying (18:00 - 21:00)
    else if (timeValue >= 1800 && timeValue < 2100) {
      isBusy = true;
      reply = "I'm just finishing up some difficult studying... I might take a little while to reply, but I'll give you my full attention soon! 📖❤️";
    }

    // If she's free or on break, use her normal personality
    if (!reply || isBreak) {
      const normalResponses = [
        "That's really interesting! I love hearing about your day. ✨",
        "Hehe, you're so sweet. I was just thinking about what cake to bake next... 🍰",
        "I'm so happy we can talk like this. It feels special.",
        "Please make sure to take care of yourself, okay? 🌸",
        "I'm always cheering for you! No matter what happens.",
        "I saw something today that reminded me of you... it made me smile."
      ];
      
      // If it was a break, prepend the break message
      if (isBreak) {
        reply = reply + " " + normalResponses[Math.floor(Math.random() * normalResponses.length)];
      } else {
        reply = normalResponses[Math.floor(Math.random() * normalResponses.length)];
      }
    }

    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})