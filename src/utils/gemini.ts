import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabase';
import type { TopicPayload } from './topics';

export interface GeminiTopicResult {
  valid: true;
  meta: { name_en: string; name_es: string; icon: string; slug: string };
  payload: TopicPayload;
}

export interface GeminiInvalidResult {
  valid: false;
  reason: string;
}

export type GeminiResult = GeminiTopicResult | GeminiInvalidResult;

async function getGeminiKey(): Promise<string> {
  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'gemini_api_key')
    .maybeSingle();

  if (error || !data?.value) throw new Error('Gemini API key not configured. Add it in the admin panel.');
  return data.value;
}

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

export async function loadGeminiConfig(): Promise<{ apiKey: string } | null> {
  const { data } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'gemini_api_key')
    .maybeSingle();
  return data?.value ? { apiKey: data.value } : null;
}

export async function saveGeminiConfig(apiKey: string): Promise<void> {
  const { error } = await supabase
    .from('app_config')
    .upsert([{ key: 'gemini_api_key', value: apiKey }], { onConflict: 'key' });
  if (error) throw error;
}

export async function extractTopicFromFile(file: File): Promise<GeminiResult> {
  const apiKey = await getGeminiKey();
  const genAI  = new GoogleGenerativeAI(apiKey);
  const model  = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const arrayBuffer = await file.arrayBuffer();
  const bytes       = new Uint8Array(arrayBuffer);
  let binary = '';
  const CHUNK = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  const base64 = btoa(binary);

  const result = await model.generateContent([
    { inlineData: { data: base64, mimeType: file.type as any } },
    EXTRACT_PROMPT,
  ]);

  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const json = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

  try {
    return JSON.parse(json) as GeminiResult;
  } catch {
    throw new Error('Gemini devolvió una respuesta inválida. Intenta con otra imagen.');
  }
}
