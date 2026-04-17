let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function isSoundEnabled(): boolean {
  try { return localStorage.getItem('verbGameSounds') !== 'false'; } catch { return true; }
}

export function playCorrect(): void {
  if (!isSoundEnabled()) return;
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    ([[523.25, 0, 0.09], [783.99, 0.11, 0.18]] as [number, number, number][]).forEach(([freq, delay, dur]) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.28, now + delay + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
      osc.start(now + delay);
      osc.stop(now + delay + dur);
    });
  } catch { /* AudioContext unavailable */ }
}

export function playWrong(): void {
  if (!isSoundEnabled()) return;
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(311, now);
    osc.frequency.exponentialRampToValueAtTime(155, now + 0.32);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.start(now);
    osc.stop(now + 0.38);
  } catch { /* AudioContext unavailable */ }
}
