export type PredictionSize = 'BIG' | 'SMALL';
export type PredictionColor = 'RED' | 'GREEN' | 'VIOLET';
export type ServerMode = 'BIG_SMALL';
export type RoundStatus = 'PENDING' | 'WIN' | 'LOSS' | 'JACKPOT';

export type StrategyType = 
  | 'AUTO_ADAPTIVE'
  | 'MARKOV' 
  | 'PATTERN' 
  | 'DRAGON' 
  | 'ZIGZAG' 
  | 'PAIR' 
  | 'TREND' 
  | 'MEAN' 
  | 'MOMENTUM'
  | 'QUANTUM_FUSION';

export type ThemeType = 
  | 'blood-red' 
  | 'cyber-neon' 
  | 'gold-elite' 
  | 'amethyst' 
  | 'emerald' 
  | 'ocean' 
  | 'matrix'
  | 'cyber-pink'
  | 'sunset-orange'
  | string;

export interface HistoryRecord {
  period: string;
  serverMode?: ServerMode;
  prediction: PredictionSize;
  colorPrediction?: 'RED' | 'GREEN';
  jackpotSeeds: [number, number];
  primaryBall?: number;
  secondaryBall?: number;
  topBallPool?: Array<{ num: number; prob: number; isPrimary: boolean; isSecondary: boolean }>;
  status: RoundStatus;
  confidence: number;
  pattern: string;
  strategy: StrategyType;
  actualNumber?: number;
  actualSize?: PredictionSize;
  actualColor?: PredictionColor;
  fastingLevel: number;
  timestamp: number;
}

export interface ApiGameItem {
  issueNumber: string;
  number: string | number;
  timestamp?: number;
}

export interface StatsData {
  wins: number;
  losses: number;
  jackpots: number;
  currentWinStreak: number;
  currentLossStreak: number;
  maxLossStreak: number;
  bestStreak: number;
  total: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  customTag: string;
  level: number;
  joinedDate: string;
}

export interface UserUIDAccess {
  uid: string;
  status: 'ACTIVE' | 'EXPIRED' | 'BLOCKED';
  hours?: number;
  durationLabel: string;
  activatedAt: string;
  expiresAt: string | null; // ISO string, null if lifetime
  note?: string;
}

export interface AccessKey {
  key: string;
  type: string;
  hours?: number;
  expires: string | null;
  used: boolean;
  usedAt: string | null;
  deviceId?: string | null;
}

export interface AppCustomization {
  title: string;
  subtitle: string;
  versionBadge: string;
  primaryColor: string; // Hex color for accents/borders
  accentColor: string;  // Hex color for glows/buttons
  bigColor: string;    // Custom color for BIG
  smallColor: string;  // Custom color for SMALL
  copyBannerTitle: string;
  copyShopLink: string;
}

export interface AdminSettings {
  modeOverride: 'AUTO' | 'BIG' | 'SMALL';
  announcement: {
    text: string;
    type: 'info' | 'warn' | 'success' | 'danger';
  };
  toggles: {
    maintenance: boolean;
    confetti: boolean;
    voiceAnnouncer: boolean;
    soundFx: boolean;
  };
  customization?: AppCustomization;
}

export type MoneyManagementPlanType = 'MARTINGALE_3X' | 'CONSERVATIVE_2X' | 'FIBONACCI' | 'DALEMBERT';

export interface MoneyManagementStage {
  stage: number;
  multiplier: number;
  betAmount: number;
  cumulativeInvested: number;
  grossWinReturn: number;
  netProfit: number;
  riskStatus: 'SAFE' | 'CAUTION' | 'HIGH_RISK' | 'CRITICAL';
}

export interface MoneyManagementSettings {
  enabled: boolean;
  plan: MoneyManagementPlanType;
  baseBet: number;
  initialCapital: number;
  currentStage: number;
  sessionProfit: number;
  totalBetsPlaced: number;
  totalWins: number;
  totalLosses: number;
  maxStageReached: number;
  takeProfitTarget: number;
  stopLossLimit: number;
  currencySymbol: string;
  autoSyncWithRounds: boolean;
}

export interface BreakpointVaultRecord {
  period: string;
  patternName: string;
  breakType: string;
  actualOutcome: PredictionSize;
  trapSignature: string;
  timestamp: number;
}

export interface GeneratedLogicRule {
  id: string;
  name: string;
  formula: string;
  sourcePattern: string;
  weight: number;
  wins: number;
  losses: number;
  accuracy: number;
  isActive: boolean;
  createdAt: number;
}

export interface AIEngineInfo {
  id: string;
  engineNum: number;
  name: string;
  banglaName: string;
  icon: string;
  role: string;
  status: string;
  isOnline: boolean;
  isSleeping: boolean; // Always false as per request
  speedMs: number;
  heartbeat: number;
  accuracy: number;
  vote: PredictionSize;
  confidence: number;
  metrics: Record<string, string | number>;
  actionLog: string;
}

export interface BossPredictionResult {
  bossPrediction: PredictionSize;
  bossConfidence: number;
  antiLossShield: {
    active: boolean;
    level: 'LEVEL_0_MONITOR' | 'LEVEL_1_SHIELD' | 'LEVEL_2_HARD_LOCK';
    label: string;
    description: string;
  };
  safePattern: {
    isSafe: boolean;
    name: string;
    winProbability: number;
    safetyReason: string;
  };
  breakpointTrap: {
    trapDetected: boolean;
    brokenPattern: string | null;
    trapDodgedText: string | null;
    totalVaultRecords: number;
  };
  logicGuardian: {
    totalGuardedLogics: number;
    removedLogics: 0; // Strictly 0 - none removed
    healedCount: number;
    healthRate: number;
  };
  watchdog: {
    all8EnginesActive: true;
    sleepingCount: 0; // None sleeping
    uptimePercent: 100;
    lastPulse: number;
  };
  engines: AIEngineInfo[];
  bossReasoning: string;
  banglaExplanation: string;
}

export type QuantAssetSignal = 'BIG' | 'SMALL' | 'RED' | 'GREEN';

export interface FailurePayload {
  periodId: string;
  activeLevel: 'L1' | 'L2' | 'L3';
  failedAlgorithmMode: string;
  failedSignalTarget: QuantAssetSignal;
  actualOutcome: {
    number: number;
    size: PredictionSize;
    color: PredictionColor;
  };
  vectorState: number[]; // 5-round normalized state vector
  rootCause: 'FALSE_DRAGON' | 'ZIGZAG_BREAKOUT' | 'PARITY_DESYNC' | 'ENTROPY_SPIKE';
  timestamp: number;
}

export interface QuantEngineResult {
  targetSignal: QuantAssetSignal;
  signalType: 'SIZE' | 'PARITY';
  sizePrediction: PredictionSize;
  colorPrediction: 'RED' | 'GREEN';
  confidence: number;
  probabilities: {
    big: number;
    small: number;
    red: number;
    green: number;
  };
  confidences: {
    big: number;
    small: number;
    red: number;
    green: number;
  };
  shannonEntropy: number;
  entropyRegime: 'LOW_CHAOS_TREND' | 'EQUILIBRIUM' | 'HIGH_CHAOS_REVERSION';
  wavePattern: 'ZIGZAG_WAVE' | 'DRAGON_STREAK' | 'MIRROR_PAIR' | 'SANDWICH_CONTAINMENT' | 'MARKOV_TRANSITION' | 'BAYESIAN_EQUILIBRIUM';
  activeLevel: 'L1' | 'L2' | 'L3';
  escalationLabel: string;
  knnInterceptTriggered: boolean;
  knnSimilarity: number;
  knnInterceptReason?: string;
  markovMatrix: {
    size: { bToB: number; bToS: number; sToB: number; sToS: number };
    color: { rToR: number; rToG: number; gToR: number; gToG: number };
  };
  guaranteedLossCapRemaining: number;
  maxConsecutiveLossLimit: 3;
}

export interface Engine1ColorResult {
  vote: 'RED' | 'GREEN';
  confidence: number;
  safetyScore: number;
  pattern: string;
  explanation: string;
  allDetectedPatterns: string[];
}

export interface Engine2SizeResult {
  vote: PredictionSize;
  confidence: number;
  safetyScore: number;
  pattern: string;
  explanation: string;
  allDetectedPatterns: string[];
}

export interface TriadEngineResult {
  engine1Color: Engine1ColorResult;
  engine2Size: Engine2SizeResult;
  engine3SafeArbiter: {
    chosenSafeEngine: 'ENGINE_1_COLOR' | 'ENGINE_2_SIZE';
    safeMainPrediction: string;
    safeAssetType: 'COLOR' | 'SIZE';
    safeConfidence: number;
    safetyRating: 'ULTRA_SAFE' | 'HIGH_STABILITY' | 'DEFENSIVE';
    selectionReason: string;
  };
}
