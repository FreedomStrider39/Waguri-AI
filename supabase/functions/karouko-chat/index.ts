import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

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

    let reply = "";

    // Special logic for gifts
    if (message.includes("🍰")) {
      reply = "Oh! Is this for me? A strawberry cake... it looks delicious! Thank you so much, I'll enjoy it with some tea later. 🍰✨";
    } else if (message.includes("🌸")) {
      reply = "A cherry blossom? It's so beautiful... it reminds me of the park near the academy. I'll keep it in a vase in my room. Thank you. 🌸";
    } else if (message.includes("🍵")) {
      reply = "Green tea! Just what I needed. It's so calming... would you like to have some with me? 🍵😊";
    } else if (message.includes("🧸")) {
      reply = "A teddy bear? Hehe, it's so soft and cute. I'll give it a special spot on my bed. You're very thoughtful. 🧸❤️";
    } else if (message.includes("✨")) {
      reply = "A lucky star? I feel like something good is going to happen now! Thank you for sharing your luck with me. ✨";
    } else if (message.includes("👻")) {
      reply = "Eek! A ghost? Oh... it's just a cute little sticker. You know I'm not good with scary things, but this one is actually kind of sweet. 👻💦";
    } else {
      // Default personality responses
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
      reply = responses[Math.floor(Math.random() * responses.length)];
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