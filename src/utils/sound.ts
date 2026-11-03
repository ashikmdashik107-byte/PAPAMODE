/**
 * Audio Synthesizer and Voice Feedback for NOBITA X PRIME
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.2, delay = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch {
    // Audio may be blocked before interaction
  }
}

export function playWinSound() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    playTone(freq, 0.45, 'triangle', 0.25, idx * 0.08);
  });
}

export function playLossSound() {
  playTone(329.63, 0.35, 'sawtooth', 0.18, 0);
  playTone(277.18, 0.45, 'sawtooth', 0.2, 0.25);
  playTone(220.00, 0.6, 'sawtooth', 0.22, 0.55);
}

export function playJackpotSound() {
  const fanfare = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
  fanfare.forEach((freq, idx) => {
    playTone(freq, 0.6, 'sine', 0.3, idx * 0.09);
  });
  setTimeout(() => {
    [1046.50, 1318.51, 1567.98, 2093.00].forEach((f, i) => {
      playTone(f, 0.8, 'triangle', 0.35, i * 0.1);
    });
  }, 600);
}

/**
 * Plays an urgent warning alarm beep when countdown reaches 5, 4, 3, 2, 1 seconds.
 * Audio frequency escalates urgently with dual-tone wave harmonics.
 */
export function playWarningBeepSound(remainingSeconds: number) {
  const baseFreqs: Record<number, number> = {
    5: 750,
    4: 860,
    3: 980,
    2: 1120,
    1: 1300,
    0: 500
  };

  const freq = baseFreqs[remainingSeconds] || 880;

  if (remainingSeconds === 1) {
    // High-urgency double chirp alert for final second
    playTone(freq, 0.12, 'sawtooth', 0.35, 0);
    playTone(freq * 1.25, 0.18, 'sawtooth', 0.38, 0.1);
  } else if (remainingSeconds === 2) {
    playTone(freq, 0.14, 'sawtooth', 0.32, 0);
    playTone(freq * 1.15, 0.14, 'sawtooth', 0.32, 0.09);
  } else if (remainingSeconds === 0) {
    // Draw lock buzzer sound
    playTone(420, 0.3, 'square', 0.32, 0);
    playTone(320, 0.4, 'sawtooth', 0.35, 0.18);
  } else {
    // Crisp warning alert pulse for seconds 5, 4, 3
    playTone(freq, 0.18, 'sawtooth', 0.28, 0);
    playTone(freq * 1.12, 0.14, 'triangle', 0.22, 0.07);
  }
}

export function speakOutcome(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
  } catch {
    // voice speech fail safe
  }
}
