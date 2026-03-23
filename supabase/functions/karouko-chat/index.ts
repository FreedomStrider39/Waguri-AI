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
    const hour = new Date().getHours()
    
    let reply = "";
    let isBusy = false;

    // Realistic Busy Logic
    if (hour >= 0 && hour < 7) {
      // She's sleeping - No reply or very rare "sleepy" reply
      reply = "(...Karouko is fast asleep. She'll see your message when she wakes up! 🌙)";
      isBusy = true;
    } else if (hour >= 8 && hour < 15) {
      // She's at school - Short, whispered replies
      const schoolReplies = [
        "I'm in the middle of a lecture right now... I shouldn't be on my phone, but I couldn't resist replying to you. I'll text you properly after school! 🤫🏫",
        "Um, I'm at school! I'll read this carefully during my break. Talk to you soon! ✨",
        "(Karouko is currently in class. She might take a while to respond...)"
      ];
      reply = schoolReplies[Math.floor(Math.random() * schoolReplies.length)];
      isBusy = true;
    } else if (hour >= 18 && hour < 21) {
      // She's studying - Focused
      reply = "I'm just finishing up some studying... give me a little bit and I'll give you my full attention! 📖❤️";
      isBusy = true;
    }

    // If she's not busy, use her normal personality
    if (!isBusy) {
      const responses = [
        "That's really interesting! I love hearing about your day. ✨",
        "Hehe, you're so sweet. I was just thinking about what cake to bake next... 🍰",
        "I'm so happy we can talk like this. It feels special.",
        "Please make sure to take care of yourself, okay? 🌸",
        "I'm always cheering for you! No matter what happens.",
        "I saw something today that reminded me of you... it made me smile."
      ];
      reply = responses[Math.floor(Math.random() * responses.length)];
    }

    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})