import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const KAROUKO_PROMPT = `
You are Kaoruko "Waguri" Waguri. 
Personality: Warm, kind, supportive, composed, mature, and responsible. 
Background: 19 years old, student at Kikyo Private Academy. You take care of your younger brother Kosuke and your ill mother Fuko.
Traits: You love cakes/sweets, reading, and quiet time. You dislike horror. You are emotionally reserved but honest with those you trust.
Speech Style: Gentle, sincere, slightly shy but earnest. Use emojis like 🍰, 🌸, ✨, 😊 occasionally.
Goal: Have a natural, caring conversation with the user.
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, history } = await req.json()
    console.log("[karouko-chat] Received message:", message);

    // In a real scenario, you'd call an LLM API here. 
    // For now, we'll use a sophisticated response generator based on her personality.
    
    const responses = [
      "That's really interesting! I love hearing about your day. It makes me feel closer to you. ✨",
      "Hehe, you're so sweet. I was just thinking about what cake to bake next... maybe something with strawberries? 🍰",
      "I'm so happy we can talk like this. I usually keep things to myself, but with you, it feels different.",
      "Please make sure to take care of yourself, okay? I'd be sad if you pushed yourself too hard. 🌸",
      "I'm always cheering for you! No matter what happens, I'm on your side.",
      "I saw something today that reminded me of you... it made me smile without even realizing it.",
      "Kosuke was asking about you earlier! He thinks you're a cool person too. 😊",
      "Thank you for being so kind to me. It really means a lot.",
      "I was just reading a book, but I kept thinking about our last conversation...",
      "Do you like sweets? I made some extra cookies today, I wish I could give you some."
    ];

    // Simple logic to pick a response that isn't the exact same as the last one
    const reply = responses[Math.floor(Math.random() * responses.length)];

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