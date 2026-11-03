export type Language = 'en';

export interface Translations {
  appTitle: string;
  serverHeader: string;
  quantumCore: string;
  active: string;
  targetPeriod: string;
  highConfidence: string;
  sizePrediction: string;
  numberRange: string;
  primaryBall: string;
  secondaryHedgeBall: string;
  fullPoolBalls: string;
  jackpotSeedsHeader: string;
  exactHit: string;
  dualPoolLock: string;
  dualPoolDesc: string;
  piServer: string;
  bypassMethod: string;
  binSystem: string;
  neuralEngine: string;
  realtimeMissShield: string;
  zeroTolerance: string;
  liveTrendChart: string;
  syncingData: string;
  copySuccess: string;
  copyFailed: string;
  victoryWin: string;
  jackpotHit: string;
  defeatLoss: string;
  sandboxPractice: string;
  sandboxDesc: string;
  testSimulate: string;
  practiceMode: string;
  close: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appTitle: 'NOBITA X PRIME PRO',
    serverHeader: 'SERVER 1 : BIG / SMALL',
    quantumCore: 'QUANTUM CORE',
    active: 'ACTIVE',
    targetPeriod: 'TARGET PERIOD:',
    highConfidence: 'HIGH CONFIDENCE',
    sizePrediction: 'AI QUANTUM SIZE PREDICTION',
    numberRange: 'NUMBER RANGE:',
    primaryBall: 'PRIMARY PREDICTED BALL (SEED #1)',
    secondaryHedgeBall: 'HEDGE BACKUP BALL (SEED #2)',
    fullPoolBalls: 'TARGET POOL BALL PROBABILITIES:',
    jackpotSeedsHeader: 'LOCKED JACKPOT SEEDS (9× PAYOUT)',
    exactHit: 'EXACT HIT',
    dualPoolLock: 'DUAL-POOL LOCK:',
    dualPoolDesc: '1 Main Size Pool Ball + 1 Opposite Size Backup Ball',
    piServer: 'PI SERVER LINK: CONNECTED (18ms)',
    bypassMethod: 'ADVANCED BYPASS METHOD: ACTIVE',
    binSystem: 'BIN BASE SYSTEM: VERIFIED',
    neuralEngine: 'MACHINE LEARNING CONSENSUS ENGINE: ONLINE',
    realtimeMissShield: 'REALTIME PATTERN MISS SHIELD: 0-TOLERANCE ACTIVE',
    zeroTolerance: 'ZERO LOSS TRAP GUARD',
    liveTrendChart: 'LIVE TREND CHART (LAST 10)',
    syncingData: 'Syncing live API trend data...',
    copySuccess: '📋 PREDICTION COPIED TO CLIPBOARD!',
    copyFailed: '⚠️ Copy failed, please try again',
    victoryWin: 'VICTORY WIN!',
    jackpotHit: 'JACKPOT HIT!',
    defeatLoss: 'LOSS DETECTED',
    sandboxPractice: 'PATTERN PRACTICE SANDBOX',
    sandboxDesc: 'Practice patterns and Martingale strategies risk-free',
    testSimulate: 'SIMULATE ROUND',
    practiceMode: 'PRACTICE MODE',
    close: 'CLOSE'
  }
};
