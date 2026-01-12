// supabase/functions/gift-helper/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

type GiftProfile = {
  recipient: {
    relationship: string;
    age_range: string;
    gender?: string; // Added gender as it's in the form data and backend schema
  };
  occasion: string | null;
  personality: string[];
  interests: string[];
  free_description?: string;
  budget: {
    min: number;
    max: number;
  };
  gift_style: string;
  risk_tolerance: string;
};

Deno.serve(async (req) => {
  // CORS headers for local development and Supabase Edge Functions
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: corsHeaders }
    );
  }

  const apiKey = Deno.env.get("OPENROUTER_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing OPENROUTER_API_KEY" }),
      { status: 500, headers: corsHeaders }
    );
  }

  let giftProfile: GiftProfile;

  try {
    giftProfile = await req.json();
  } catch (_e) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: corsHeaders }
    );
  }

  if (
    !giftProfile.recipient ||
    !giftProfile.recipient.relationship ||
    !giftProfile.recipient.age_range ||
    !giftProfile.budget ||
    typeof giftProfile.budget.min !== "number" ||
    typeof giftProfile.budget.max !== "number"
  ) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid required fields" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const systemPrompt = `
You are a gift planning engine.

You receive a JSON profile describing:
- who the gift is for (relationship, age range),
- the occasion,
- their personality traits and interests,
- an optional free-text description,
- a budget range,
- the desired gift style,
- and the risk tolerance.

Your task:
Suggest 5 specific gift ideas that would fit this person and budget.

For each gift idea, return:
- title: short name of the gift
- description: one-sentence description
- approx_price: a number within the given budget range
- reason: short explanation of why this gift fits (based on interests, personality, relationship, occasion, gift_style, risk_tolerance).

Output STRICTLY VALID JSON with the following structure:
{
  "items": [
    {
      "title": "...",
      "description": "...",
      "approx_price": 0,
      "reason": "..."
    }
  ]
}
No extra text, no markdown, only JSON.
  `.trim();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "allenai/molmo-2-8b:free", // Changed model here
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Here is the gift profile in JSON:\n${JSON.stringify(giftProfile)}`
          }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[gift-helper] LLM request failed:", text);
      return new Response(
        JSON.stringify({ error: "LLM request failed", details: text }),
        { status: 502, headers: corsHeaders }
      );
    }

    const completion = await response.json();
    const content: string | undefined =
      completion.choices?.[0]?.message?.content ?? completion.choices?.[0]?.message;

    if (!content || typeof content !== "string") {
      console.error("[gift-helper] Empty or invalid response from LLM:", content);
      return new Response(
        JSON.stringify({ error: "Empty or invalid response from LLM" }),
        { status: 502, headers: corsHeaders }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (_e) {
      console.error("[gift-helper] LLM did not return valid JSON:", content);
      return new Response(
        JSON.stringify({
          error: "LLM did not return valid JSON",
          raw: content
        }),
        { status: 502, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: corsHeaders
    });
  } catch (e) {
    console.error("[gift-helper] LLM request failed with exception:", String(e));
    return new Response(
      JSON.stringify({ error: "LLM request failed", details: String(e) }),
      { status: 502, headers: corsHeaders }
    );
  }
});