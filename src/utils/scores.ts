export type GameId = 'quick-match' | 'speed-challenge' | 'type-master' | 'memory-cards' | 'practice';

export interface ScoreEntry {
  name: string;
  score: number;
  label: string;
  date: string;
}

const SCORES_KEY = 'verbGameRecords';
const NAME_KEY   = 'verbGamePlayerName';

export function getPlayerName(): string {
  try { return localStorage.getItem(NAME_KEY) || ''; } catch { return ''; }
}

export function setPlayerName(name: string): void {
  try { localStorage.setItem(NAME_KEY, name.trim()); } catch {}
}

export function getScores(gameId: GameId): ScoreEntry[] {
  try {
    const all = JSON.parse(localStorage.getItem(SCORES_KEY) || '{}');
    return (all[gameId] || []) as ScoreEntry[];
  } catch { return []; }
}

export function saveScore(gameId: GameId, score: number, label: string, nameOverride?: string): boolean {
  const name = nameOverride?.trim() || getPlayerName();
  if (!name || score <= 0) return false;
  if (nameOverride?.trim()) setPlayerName(nameOverride.trim());
  try {
    const all = JSON.parse(localStorage.getItem(SCORES_KEY) || '{}');
    if (!all[gameId]) all[gameId] = [];
    all[gameId].unshift({ name, score, label, date: new Date().toISOString() });
    all[gameId] = (all[gameId] as ScoreEntry[]).slice(0, 10);
    localStorage.setItem(SCORES_KEY, JSON.stringify(all));
    return true;
  } catch { return false; }
}

export function getBest(gameId: GameId): ScoreEntry | null {
  const scores = getScores(gameId);
  if (!scores.length) return null;
  return scores.reduce((a, b) => a.score >= b.score ? a : b);
}
