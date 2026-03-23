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

  // 1. Get the last message
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

  // 2. Logic for "IRL" feel: Check time of day
  const hour = now.getHours()
  let reply = ""

  // If it's been more than an hour since the last message, she might check in
  if (diffHours >= 1) {
    if (hour >= 6 && hour < 10) {
      reply = "Good morning! I just woke up and was wondering if you've had breakfast yet? I'm making some pancakes... 🥞"
    } else if (hour >= 22 || hour < 2) {
      reply = "It's getting pretty late... are you still awake? Please don't push yourself too hard, okay? 🌙"
    } else {
      const followUps = [
        "Um... are you still there? I was just thinking about what you said earlier. 😊",
        "I hope your day is going well! I'm just about to start baking, and it made me think of you. 🍰",
        "I was re-reading our messages... I really enjoy talking to you. I hope I'm not bothering you!",
        "The sky looks really pretty right now. I wish I could show you. ✨",
        "I'm a little lonely... but I'll wait for you to come back! 🌸"
      ];
      reply = followUps[Math.floor(Math.random() * followUps.length)];
    }

    // 3. Insert the message so it's there when they come back
    await supabase.from('messages').insert([{ text: reply, is_user: false, status: 'read' }])

    console.log(`[proactive-checkin] Karouko sent a check-in: ${reply}`);
    return new Response(JSON.stringify({ sent: true, reply }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  return new Response(JSON.stringify({ sent: false }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})