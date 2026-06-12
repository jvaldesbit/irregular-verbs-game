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
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const CHUNK = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  const base64 = btoa(binary);

  const FUNCTION_URL = 'https://fjifxqxdjckxutmoqkmg.supabase.co/functions/v1/extract-topic';
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqaWZ4cXhkamNreHV0bW9xa21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MjI2MjcsImV4cCI6MjA5MjI5ODYyN30.3xA4l7oPkNpel8cTz_26nMqhyZxduMPrmv6Fpa8RLc0';

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ base64, mimeType: file.type }),
  });

  const data = await res.json() as any;

  if (!res.ok) {
    throw new Error(data?.error ?? `Server error ${res.status}`);
  }

  return data as GeminiResult;
}
