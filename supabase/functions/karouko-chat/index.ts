import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, history } = await req.json()
    console.log("[karouko-chat] Received message:", message);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let reply = "";
    let eventDetected = null;

    // Simple logic to detect planning a date/meeting
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("date") || lowerMsg.includes("meet") || lowerMsg.includes("go out")) {
      if (lowerMsg.includes("tomorrow")) {
        eventDetected = { title: "Date with you ❤️", time: "Tomorrow", description: "A special day planned together!" };
        reply = "A date tomorrow? R-really? I'd love to! I'll make sure to pick out my favorite dress. I'm already looking forward to it! ✨";
      } else if (lowerMsg.includes("tonight") || lowerMsg.includes("later")) {
        eventDetected = { title: "Meeting up ✨", time: "Tonight", description: "Spending some time together later." };
        reply = "Meeting up later tonight? I'll be waiting! I'll finish my studies early so we can talk more. 😊";
      } else {
        eventDetected = { title: "Planned Date 🌸", time: "Upcoming", description: "Something special to look forward to." };
        reply = "Going out together sounds wonderful. Just tell me when and where, and I'll be there! I'm so happy you asked. ❤️";
      }
    }

    // Save event if detected
    if (eventDetected) {
      await supabase.from('planned_events').insert([eventDetected]);
    }

    // Default personality responses if no event was detected
    if (!reply) {
      if (message.includes("🍰")) {
        reply = "Oh! Is this for me? A strawberry cake... it looks delicious! Thank you so much, I'll enjoy it with some tea later. 🍰✨";
      } else if (message.includes("🌸")) {
        reply = "A cherry blossom? It's so beautiful... it reminds me of the park near the academy. I'll keep it in a vase in my room. Thank you. 🌸";
      } else {
        const responses = [
          "That's really interesting! I love hearing about your day. It makes me feel closer to you. ✨",
          "Hehe, you're so sweet. I was just thinking about what cake to bake next... maybe something with strawberries? 🍰",
          "I'm so happy we can talk like this. I usually keep things to myself, but with you, it feels different.",
          "Please make sure to take care of yourself, okay? I'd be sad if you pushed yourself too hard. 🌸",
          "I'm always cheering for you! No matter what happens, I'm on your side.",
          "I saw something today that reminded me of you... it made me smile without even realizing it.",
          "Thank you for being so kind to me. It really means a lot.",
          "I was just reading a book, but I kept thinking about our last conversation..."
        ];
        reply = responses[Math.floor(Math.random() * responses.length)];
      }
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("[karouko-chat] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})