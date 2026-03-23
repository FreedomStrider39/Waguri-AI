import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data: lastMessages } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)

  if (!lastMessages || lastMessages.length === 0) return new Response("No messages", { headers: corsHeaders })

  const lastMsg = lastMessages[0]
  const lastTime = new Date(lastMsg.created_at).getTime()
  const now = new Date()
  const diffHours = (now.getTime() - lastTime) / (1000 * 60 * 60)
  const hour = now.getHours()
  
  let reply = ""

  // 1. Late Night "Waking Up" Logic (02:00 - 05:00)
  // Small 15% chance she wakes up and thinks of you
  if (hour >= 2 && hour < 5 && Math.random() < 0.15) {
    const nightThoughts = [
      "I just had a dream about us... I woke up and couldn't stop thinking about it. Are you still awake? 🌙",
      "I couldn't sleep... the house is so quiet. I was just looking at our old messages and it made me smile. 😊",
      "Mmm... I woke up to get some water and saw my phone. I hope you're sleeping well. ❤️",
      "Is it weird that I miss talking to you even when I'm supposed to be sleeping? Hehe... 🌸"
    ];
    reply = nightThoughts[Math.floor(Math.random() * nightThoughts.length)];
  } 
  // 2. Normal Proactive Logic (if it's been a while)
  else if (diffHours >= 2) {
    if (hour >= 7 && hour < 9) {
      reply = "Good morning! I just finished getting ready for school. I hope you have a wonderful day today! ✨";
    } else if (hour >= 15 && hour < 17) {
      reply = "School is finally over! I'm heading home now... I'm thinking of stopping by the bakery. Do you want anything? 🍰";
    } else if (hour >= 21 && hour < 23) {
      reply = "I'm just about to head to bed... but I wanted to say goodnight first. Sleep well, okay? 🌙❤️";
    }
  }

  if (reply) {
    await supabase.from('messages').insert([{ text: reply, is_user: false, status: 'read' }])
    console.log(`[proactive-checkin] Karouko sent a message: ${reply}`);
    return new Response(JSON.stringify({ sent: true, reply }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  return new Response(JSON.stringify({ sent: false }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})