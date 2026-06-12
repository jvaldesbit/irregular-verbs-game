import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const EXTRACT_PROMPT = `You are an educational content extractor. Analyze this image or document and extract structured learning data suitable for flashcard-style study.

Return ONLY a valid JSON object — no markdown, no explanation, just raw JSON — in this exact format:

{
  "valid": true,
  "meta": {
    "name_en": "Topic name in English (2-4 words)",
    "name_es": "Topic name in Spanish (2-4 words)",
    "icon": "single relevant emoji",
    "slug": "kebab-case-slug-max-30-chars"
  },
  "payload": {
    "fields": [
      { "key": "snake_case_key", "label_en": "Label in English", "label_es": "Label in Spanish", "enabled": true }
    ],
    "items": [
      { "field_key_1": "value", "field_key_2": "value" }
    ]
  }
}

Rules:
- Extract at minimum 5 items (more is better — capture everything visible)
- Every item must contain ALL field keys defined in fields[]
- Fields represent the columns or categories of the data (e.g. base form, past tense, translation)
- The first field should be the "question" side of the flashcard
- IMPORTANT: Ignore any pronunciation guides, phonetic transcriptions, or IPA notation present in the image — do NOT include them as fields or values. Written pronunciation is not valid learning content.
- If the image does not contain educational content suitable for flashcard learning, return:
  { "valid": false, "reason": "explanation in Spanish of why it cannot be used" }`;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) return json({ error: 'Gemini API key not configured on server.' }, 500);

  let base64: string, mimeType: string;
  try {
    const body = await req.json();
    base64   = body.base64;
    mimeType = body.mimeType;
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  if (!base64 || !mimeType) return json({ error: 'Missing base64 or mimeType.' }, 400);

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { inlineData: { data: base64, mimeType } },
          { text: EXTRACT_PROMPT },
        ]}],
      }),
    }
  );

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    console.error('Gemini error:', geminiRes.status, errText);
    return json({ error: `Gemini returned ${geminiRes.status}. Check API key or quota.` }, 502);
  }

  const data = await geminiRes.json() as any;
  const text = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

  try {
    return json(JSON.parse(cleaned));
  } catch {
    console.error('Non-JSON from Gemini:', text);
    return json({ error: 'Gemini returned an invalid response.' }, 502);
  }
});
