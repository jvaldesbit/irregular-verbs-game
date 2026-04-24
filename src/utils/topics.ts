import { supabase } from './supabase';

export interface TopicMeta {
  id: string;
  slug: string;
  name_en: string;
  name_es: string;
  icon: string;
  sort_order: number;
  payload_url: string;
  created_at: string;
}

export interface TopicField {
  key: string;
  label_en: string;
  label_es: string;
  enabled: boolean;
}

export interface TopicPayload {
  fields: TopicField[];
  pairs?: [string, string][];
  items: Record<string, string>[];
}

export interface LoadedTopic {
  meta: TopicMeta;
  payload: TopicPayload;
}

const ACTIVE_SLUG_KEY = 'verbGame_activeTopic';
const ACTIVE_NAME_KEY = 'verbGame_activeTopicName';
const ACTIVE_ICON_KEY = 'verbGame_activeTopicIcon';

export function getActiveTopicSlug(): string {
  return localStorage.getItem(ACTIVE_SLUG_KEY) ?? 'irregular-verbs';
}

export function getActiveTopicLabel(): { name: string; icon: string } {
  return {
    name: localStorage.getItem(ACTIVE_NAME_KEY) ?? 'Verbos Irregulares',
    icon: localStorage.getItem(ACTIVE_ICON_KEY) ?? '📚',
  };
}

export function setActiveTopic(meta: TopicMeta): void {
  localStorage.setItem(ACTIVE_SLUG_KEY, meta.slug);
  localStorage.setItem(ACTIVE_NAME_KEY, meta.name_es);
  localStorage.setItem(ACTIVE_ICON_KEY, meta.icon);
}

export async function getTopics(): Promise<TopicMeta[]> {
  const { data } = await supabase
    .from('topics')
    .select('*')
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function loadTopicBySlug(slug: string): Promise<LoadedTopic | null> {
  const { data: meta } = await supabase
    .from('topics')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!meta) return null;

  const res = await fetch(meta.payload_url);
  if (!res.ok) throw new Error(`R2 fetch failed (${res.status}): ${meta.payload_url}`);
  const payload: TopicPayload = await res.json();

  return { meta, payload };
}

export async function loadActiveTopic(): Promise<LoadedTopic | null> {
  return loadTopicBySlug(getActiveTopicSlug());
}

// ── Admin helpers ─────────────────────────────────────────────────────────────

export async function createTopicMeta(
  slug: string, nameEn: string, nameEs: string, icon: string, payloadUrl: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('topics').insert({
    slug, name_en: nameEn, name_es: nameEs, icon, payload_url: payloadUrl,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function updateTopicPayloadUrl(
  id: string, payloadUrl: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('topics').update({ payload_url: payloadUrl }).eq('id', id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deleteTopicMeta(id: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('topics').delete().eq('id', id);
  return error ? { ok: false, error: error.message } : { ok: true };
}
