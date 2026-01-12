import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.33.0/mod.ts";

// Define the expected input structure from the frontend
interface GiftProfile {
  recipient: {
    relationship: string;
    age_range: string;
    gender?: string;
  };
  occasion?: string;
  personality?: string[];
  interests?: string[];
  free_description?: string;
  budget: {
    min: number;
    max: number;
  };
  gift_style: string;
  risk_tolerance: string;
}

// Define the expected output structure from OpenAI
interface OpenAIGiftIdea {
  title: string;
  description: string;
  approx_price: number;
  reason: string;
}

interface OpenAIResponse {
  items: OpenAIGiftIdea[];
}

serve(async (req) => {
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

  // Ensure the request method is POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      headers: corsHeaders,
      status: 405,
    });
  }

  // Get OpenAI API key from environment variables
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing OpenAI API key" }), {
      headers: corsHeaders,
      status: 500,
    });
  }

  let giftProfile: GiftProfile;
  try {
    const body = await req.json();
    // Basic validation for required fields and types
    if (
      !body.recipient ||
      typeof body.recipient.relationship !== 'string' ||
      typeof body.recipient.age_range !== 'string' ||
      !body.budget ||
      typeof body.budget.min !== 'number' ||
      typeof body.budget.max !== 'number' ||
      typeof body.gift_style !== 'string' ||
      typeof body.risk_tolerance !== 'string'
    ) {
      throw new Error("Invalid gift profile payload: missing required fields or incorrect types.");
    }
    giftProfile = body as GiftProfile;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON body", details: error.message }), {
      headers: corsHeaders,
      status: 400,
    });
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const systemPrompt = `You are a gift planning engine. You receive a JSON profile describing who the gift is for, their personality, interests, and budget. Suggest 5 gift ideas that would fit this person and budget. For each idea, include: a short title, a short description, an approximate price within the given budget, and a short explanation of why it fits. Return the result as a JSON object with a "items" array.`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using gpt-3.5-turbo as a cost-effective default
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: JSON.stringify(giftProfile),
        },
      ],
      response_format: { type: "json_object" }, // Instruct OpenAI to return JSON
      temperature: 0.7, // A bit creative, but not too wild
      max_tokens: 500, // Limit response size
    });

    const rawOutput = chatCompletion.choices[0].message.content;
    if (!rawOutput) {
      throw new Error("OpenAI returned an empty response.");
    }

    const openaiResponse: OpenAIResponse = JSON.parse(rawOutput);

    // Basic validation of OpenAI's output structure
    if (!openaiResponse.items || !Array.isArray(openaiResponse.items)) {
      throw new Error("OpenAI response is not in the expected format (missing 'items' array).");
    }

    return new Response(JSON.stringify(openaiResponse), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("OpenAI request failed:", error);
    return new Response(JSON.stringify({ error: "OpenAI request failed", details: error.message }), {
      headers: corsHeaders,
      status: 502,
    });
  }
});