import type { TopicPayload } from './topics';

export interface LocalTopicMeta {
  slug: string;
  name_en: string;
  name_es: string;
  icon: string;
  source: 'local';
  created_at: string;
}

const INDEX_KEY   = 'verbGame_localTopics';
const payloadKey  = (slug: string) => `verbGame_localPayload_${slug}`;

export function getLocalTopics(): LocalTopicMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveLocalTopic(meta: Omit<LocalTopicMeta, 'source' | 'created_at'>, payload: TopicPayload): LocalTopicMeta {
  const full: LocalTopicMeta = {
    ...meta,
    source: 'local',
    created_at: new Date().toISOString(),
  };

  const topics = getLocalTopics().filter(t => t.slug !== full.slug);
  topics.unshift(full);
  localStorage.setItem(INDEX_KEY, JSON.stringify(topics));
  localStorage.setItem(payloadKey(full.slug), JSON.stringify(payload));

  return full;
}

export function loadLocalPayload(slug: string): TopicPayload | null {
  try {
    const raw = localStorage.getItem(payloadKey(slug));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function deleteLocalTopic(slug: string): void {
  const topics = getLocalTopics().filter(t => t.slug !== slug);
  localStorage.setItem(INDEX_KEY, JSON.stringify(topics));
  localStorage.removeItem(payloadKey(slug));
}
