const DEFAULT_SETTINGS = {
  forms: { present: true, past: true, participle: true, spanish: true }
};

export async function loadVerbs(): Promise<any[]> {
  const base = import.meta.env.BASE_URL;
  const res = await fetch(`${base}data/verbs.json`);
  if (!res.ok) throw new Error(`verbs.json fetch failed: ${res.status}`);
  return res.json();
}

export function loadSettings(): typeof DEFAULT_SETTINGS {
  try {
    const raw = localStorage.getItem('verbGameSettings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.forms) return parsed;
    }
  } catch { /* ignore bad localStorage */ }
  return structuredClone(DEFAULT_SETTINGS);
}

export async function loadData(): Promise<{ verbs: any[]; settings: typeof DEFAULT_SETTINGS }> {
  const verbs = await loadVerbs();
  const settings = loadSettings();
  return { verbs, settings };
}
