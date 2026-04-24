import { loadActiveTopic, getActiveTopicSlug } from './topics';
import type { TopicField } from './topics';

export type { TopicField };

export interface GameSettings {
  forms: Record<string, boolean>;
}

export interface LoadedData {
  items:     Record<string, string>[];
  fields:    TopicField[];
  pairs:     [string, string][] | null;
  settings:  GameSettings;
  topicName: string;
  topicIcon: string;
}

const SETTINGS_KEY = 'verbGameSettings';

function settingsKey(): string {
  return `${SETTINGS_KEY}_${getActiveTopicSlug()}`;
}

export function loadSettings(fields: TopicField[]): GameSettings {
  try {
    // Per-topic settings first
    const raw = localStorage.getItem(settingsKey());
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.forms) return parsed;
    }
    // Migrate from old flat key (irregular-verbs only)
    const legacy = localStorage.getItem(SETTINGS_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed?.forms) {
        const forms: Record<string, boolean> = {};
        fields.forEach(f => {
          forms[f.key] = f.key in parsed.forms ? parsed.forms[f.key] : f.enabled;
        });
        return { forms };
      }
    }
  } catch { /* ignore */ }

  const forms: Record<string, boolean> = {};
  fields.forEach(f => { forms[f.key] = f.enabled; });
  return { forms };
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(settingsKey(), JSON.stringify(settings));
}

// Fallback when Supabase / R2 is unreachable
const FALLBACK_FIELDS: TopicField[] = [
  { key: 'present',    label_en: 'Base Form',       label_es: 'Forma Base',    enabled: true  },
  { key: 'past',       label_en: 'Simple Past',     label_es: 'Pasado Simple', enabled: true  },
  { key: 'participle', label_en: 'Past Participle', label_es: 'Participio',    enabled: true  },
  { key: 'spanish',    label_en: 'Spanish',         label_es: 'Español',       enabled: true  },
];

export async function loadData(): Promise<LoadedData> {
  try {
    const loaded = await loadActiveTopic();
    if (loaded && loaded.payload.items.length > 0) {
      const settings = loadSettings(loaded.payload.fields);
      return {
        items:     loaded.payload.items,
        fields:    loaded.payload.fields,
        pairs:     loaded.payload.pairs ?? null,
        settings,
        topicName: loaded.meta.name_es,
        topicIcon: loaded.meta.icon,
      };
    }
  } catch (err) {
    console.warn('[loadData] Supabase/R2 unavailable, falling back to verbs.json', err);
  }

  // Static fallback
  const base = import.meta.env.BASE_URL;
  const res  = await fetch(`${base}data/verbs.json`);
  if (!res.ok) throw new Error(`verbs.json fetch failed: ${res.status}`);
  const items = await res.json();
  return {
    items,
    fields:    FALLBACK_FIELDS,
    pairs:     null,
    settings:  loadSettings(FALLBACK_FIELDS),
    topicName: 'Verbos Irregulares',
    topicIcon: '📚',
  };
}

// ── Question helpers (shared by all game pages) ───────────────────────────────

export function getAvailablePairs(
  fields: TopicField[],
  pairs: [string, string][] | null,
  settings: GameSettings
): [string, string][] {
  const enabled = new Set(
    fields.filter(f => settings.forms[f.key] !== false).map(f => f.key)
  );

  if (pairs && pairs.length > 0) {
    return pairs.filter(([a, b]) => enabled.has(a) && enabled.has(b));
  }

  // No pairs defined: all bidirectional combinations
  const keys = [...enabled];
  const result: [string, string][] = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      if (i !== j) result.push([keys[i], keys[j]]);
    }
  }
  return result;
}

export function buildLabels(fields: TopicField[]): Record<string, string> {
  const m: Record<string, string> = {};
  fields.forEach(f => { m[f.key] = f.label_en.toUpperCase(); });
  return m;
}
