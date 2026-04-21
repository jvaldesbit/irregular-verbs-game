import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fjifxqxdjckxutmoqkmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqaWZ4cXhkamNreHV0bW9xa21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MjI2MjcsImV4cCI6MjA5MjI5ODYyN30.3xA4l7oPkNpel8cTz_26nMqhyZxduMPrmv6Fpa8RLc0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Universe {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

export interface UniverseScore {
  id: string;
  universe_code: string;
  player_email: string;
  player_name: string;
  game: string;
  score: number;
  details: string;
  created_at: string;
}

const SESSION_KEY = 'verbGame_universe';

export interface UniverseSession {
  code: string;
  name: string;
  playerName: string;
  playerEmail: string;
}

export function getUniverseSession(): UniverseSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUniverseSession(session: UniverseSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearUniverseSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function joinUniverse(
  code: string,
  playerName: string,
  playerEmail: string
): Promise<{ ok: boolean; universe?: Universe; error?: string }> {
  const { data, error } = await supabase
    .from('universes')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .maybeSingle();

  if (error) {
    return { ok: false, error: 'Connection error. Please try again.' };
  }
  if (!data) {
    return { ok: false, error: 'Universe code not found.' };
  }

  setUniverseSession({
    code: data.code,
    name: data.name,
    playerName: playerName.trim(),
    playerEmail: playerEmail.trim().toLowerCase(),
  });

  return { ok: true, universe: data };
}

export async function saveUniverseScore(
  game: string,
  score: number,
  details: string
): Promise<boolean> {
  const session = getUniverseSession();
  if (!session) return false;

  const { error } = await supabase.from('universe_scores').insert({
    universe_code: session.code,
    player_name: session.playerName,
    player_email: session.playerEmail,
    game,
    score,
    details,
  });

  return !error;
}

export async function getLeaderboard(
  code: string,
  game?: string
): Promise<UniverseScore[]> {
  let query = supabase
    .from('universe_scores')
    .select('*')
    .eq('universe_code', code.toUpperCase())
    .order('score', { ascending: false })
    .limit(50);

  if (game) query = query.eq('game', game);

  const { data } = await query;
  return data ?? [];
}

// ── App session tracking ───────────────────────────────────────────────────

export interface AppSession {
  session_id: string;
  player_name: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  first_seen: string;
  last_seen: string;
  visit_count: number;
}

export async function trackAppSession(
  sessionId: string,
  playerName: string,
  deviceType: string,
  browser: string,
  os: string
): Promise<void> {
  await supabase.rpc('upsert_app_session', {
    p_session_id: sessionId,
    p_player_name: playerName,
    p_device_type: deviceType,
    p_browser: browser,
    p_os: os,
  });
}

export async function getAppSessions(): Promise<AppSession[]> {
  const { data } = await supabase
    .from('app_sessions')
    .select('*')
    .order('last_seen', { ascending: false })
    .limit(500);
  return data ?? [];
}

// ── Admin ──────────────────────────────────────────────────────────────────

export async function adminLogin(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function adminLogout() {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getAllUniverses(): Promise<Universe[]> {
  const { data } = await supabase
    .from('universes')
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function createUniverse(
  code: string,
  name: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('universes')
    .insert({ code: code.toUpperCase().trim(), name: name.trim() });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteUniverse(code: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('universes')
    .delete()
    .eq('code', code);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getAllScores(universeCode?: string): Promise<UniverseScore[]> {
  let query = supabase
    .from('universe_scores')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (universeCode) query = query.eq('universe_code', universeCode);
  const { data } = await query;
  return data ?? [];
}
