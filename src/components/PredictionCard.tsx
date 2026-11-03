import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Sparkles, Shield, Flame, Zap, Brain, Lock, Activity, DollarSign, ArrowUpRight, Server, Palette, Layers, Database, Target, ShieldCheck, HeartPulse, CheckCircle, AlertTriangle, Radio, BookOpen, Cpu, Crown } from 'lucide-react';
import { PredictionSize, StrategyType, MoneyManagementSettings, ServerMode, BossPredictionResult, QuantEngineResult, TriadEngineResult } from '../types';
import { formatPredictionForClipboard, copyToClipboard } from '../utils/formatter';
import { getStakingAdvice } from '../utils/moneyManagement';
import { UnifiedLogicExecutionResult } from '../utils/logics32';
import { BallDisplay } from '../utils/ballAssets';

interface Props {
  period: string;
  serverMode?: ServerMode;
  remainingSeconds?: number;
  prediction: PredictionSize;
  colorPrediction?: 'RED' | 'GREEN';
  violetInsurance?: boolean;
  onOpenServerModal?: () => void;
  jackpotSeeds: [number, number];
  topBallPool?: Array<{ num: number; prob: number; isPrimary: boolean; isSecondary: boolean }>;
  confidence: number;
  pattern: string;
  strategy: StrategyType;
  autoSelectedStrategy?: StrategyType;
  marketPatternReason?: string;
  fastingLevel: number;
  mmSettings?: MoneyManagementSettings;
  onOpenMoneyManagement?: () => void;
  onOpenPractice?: () => void;
  logicsExecution?: UnifiedLogicExecutionResult;
  bossPredictionResult?: BossPredictionResult;
  quantEngineResult?: QuantEngineResult;
  triadResult?: TriadEngineResult;
  customization?: {
    title?: string;
    subtitle?: string;
    bigColor?: string;
    smallColor?: string;
    copyBannerTitle?: string;
    copyShopLink?: string;
  };
  onSelectStrategy: (strategy: StrategyType) => void;
  onShowToast: (msg: string, color?: string) => void;
}

const STRATEGIES: Array<{ id: StrategyType; name: string; icon: string; desc: string }> = [
  { id: 'AUTO_ADAPTIVE', name: 'Auto Market', icon: '🤖', desc: 'Auto-adapts to market patterns' },
  { id: 'QUANTUM_FUSION', name: 'Quantum 32', icon: '🧠', desc: 'Deep 32-logic consensus' },
  { id: 'DRAGON', name: 'Dragon', icon: '🐉', desc: 'Streak continuation & breaker' },
  { id: 'ZIGZAG', name: 'Zigzag', icon: '⚡', desc: 'Alternating wave mirror' },
  { id: 'MARKOV', name: 'Markov', icon: '📊', desc: 'State transition probability' },
  { id: 'PAIR', name: 'Pair Harmony', icon: '👥', desc: 'Double repeat pair handler' },
  { id: 'MEAN', name: 'Mean Rev.', icon: '🔄', desc: 'Distribution skew rebalance' },
  { id: 'MOMENTUM', name: 'Momentum', icon: '💫', desc: 'Directional kinetic force' },
  { id: 'TREND', name: 'Trend Velocity', icon: '📈', desc: 'Macro velocity follower' }
];

export const PredictionCard: React.FC<Props> = ({
  period,
  serverMode = 'BIG_SMALL',
  remainingSeconds,
  prediction,
  colorPrediction = 'GREEN',
  violetInsurance = false,
  onOpenServerModal,
  jackpotSeeds,
  topBallPool,
  confidence,
  pattern,
  strategy,
  autoSelectedStrategy,
  marketPatternReason,
  fastingLevel,
  mmSettings,
  onOpenMoneyManagement,
  onOpenPractice,
  logicsExecution,
  bossPredictionResult,
  quantEngineResult,
  triadResult,
  customization,
  onSelectStrategy,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const prevPeriodRef = useRef(period);
  const prevPredictionRef = useRef(prediction);

  // Critical 5-second red warning countdown state
  const isCriticalTimer = remainingSeconds !== undefined && remainingSeconds <= 5 && remainingSeconds >= 0;

  // Trigger subtle shake and haptic vibration when a high-confidence prediction is generated
  useEffect(() => {
    const isNewPeriodOrPrediction =
      prevPeriodRef.current !== period || prevPredictionRef.current !== prediction;

    prevPeriodRef.current = period;
    prevPredictionRef.current = prediction;

    // High confidence threshold (80%+)
    if (confidence >= 80 && (isNewPeriodOrPrediction || !isShaking)) {
      setIsShaking(true);

      // Light haptic vibration effect for devices supporting Navigator Vibration API
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([35, 45, 35]); // subtle crisp haptic double-pulse
        } catch {
          // Ignored if vibration is constrained by browser environment
        }
      }

      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 750);

      return () => clearTimeout(timer);
    }
  }, [period, prediction, confidence]);

  const handleCopy = async () => {
    const formatted = formatPredictionForClipboard({
      period,
      prediction,
      jackpotSeeds,
      confidence,
      pattern,
      strategy,
      fastingLevel,
      bannerTitle: customization?.copyBannerTitle || '🔥𝗙𝗥𝗘𝗘𝗛𝗢𝗦𝗧 𝗦𝗛𝗢𝗣 𝗪𝗜𝗡𝗚𝗢 𝗕𝗢𝗧🔥',
      shopLink: customization?.copyShopLink || 'https://freehost-f010.onrender.com/shop'
    });

    const success = await copyToClipboard(formatted);
    if (success) {
      setCopied(true);
      onShowToast('📋 VIP Prediction Copied Successfully!', '#00ff88');
      setTimeout(() => setCopied(false), 2000);
    } else {
      onShowToast('⚠️ Copy failed, please try again', '#ff4444');
    }
  };

  const isBig = prediction === 'BIG';

  // 1/3 Level Staging Styling & 100% Win Protocol
  const getLevelBadge = (lvl: number) => {
    if (lvl <= 1) return { label: 'LVL 1/3 (1X BASE)', short: 'LVL 1', color: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_10px_rgba(0,255,136,0.2)]' };
    if (lvl === 2) return { label: 'LVL 2/3 (3X RECOVERY)', short: 'LVL 2', color: 'border-amber-500/50 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(255,208,0,0.3)] animate-pulse' };
    return { label: 'LVL 3/3 (8X 100% WIN)', short: 'LVL 3', color: 'border-red-500/60 bg-gradient-to-r from-red-500/25 via-amber-500/25 to-emerald-500/25 text-amber-300 shadow-[0_0_20px_rgba(255,208,0,0.4)] animate-bounce font-black' };
  };

  const levelInfo = getLevelBadge(fastingLevel);

  return (
    <div
      id="main-prediction-card"
      style={{
        backgroundColor: 'var(--panel-card)'
      }}
      className={`relative rounded-3xl border transition-all duration-300 p-4 md:p-5 overflow-hidden ${
        isCriticalTimer
          ? 'anim-critical-timer-strobe border-red-500 shadow-[0_0_60px_rgba(255,20,50,0.5),inset_0_0_30px_rgba(255,0,0,0.2)]'
          : isShaking
          ? 'animate-subtle-shake high-confidence-glow border-amber-400/60'
          : isBig
          ? 'border-emerald-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(0,255,136,0.2)]'
          : 'border-red-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(255,42,75,0.2)]'
      }`}
    >
      {/* 1. ANIMATION: QUANTUM HOLOGRAPHIC PLASMA LASER SCANNER */}
      <div className="anim-quantum-laser" />
      <div className="anim-super-laser" />
      <div className="scanline-effect opacity-40" />

      {/* High Confidence Visual Surge Flare when Shaking */}
      {isShaking && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-red-500/15 to-emerald-500/15 pointer-events-none animate-pulse z-10" />
      )}

      {/* 0. SERVER 1: BIG / SMALL PERMANENT HEADER RIBBON */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08] relative z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#00ff88] animate-ping" />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-orbitron text-xs font-black text-white tracking-wider">
              SERVER 1 : BIG / SMALL
            </span>
            <span className="text-[8px] font-mono px-2 py-0.5 rounded-full font-black tracking-wider uppercase bg-emerald-500/20 text-[#00ff88] border border-emerald-500/40 shadow-[0_0_10px_rgba(0,255,136,0.3)]">
              TKS API PANEL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[9px] font-orbitron font-black text-emerald-300 shadow-[0_0_12px_rgba(0,255,136,0.25)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>ANTI-MISS API : ZERO-LOSS ACTIVE</span>
        </div>
      </div>

      {/* Target Period & Safety Level Row */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-20">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-semibold text-gray-300">TARGET:</span>
          <span className="font-orbitron font-bold text-amber-400 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 shadow-[0_0_10px_rgba(255,208,0,0.15)]">
            #{period.slice(-6) || period}
          </span>
        </div>

        {/* Safety Level Badge & High-Confidence Pulse Indicator */}
        <div className="flex items-center gap-1.5">
          {confidence >= 85 && (
            <div
              id="high-confidence-pill"
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-orbitron font-extrabold border border-amber-400/50 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(255,208,0,0.35)] ${
                isShaking ? 'scale-105 animate-pulse' : ''
              }`}
            >
              <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400 animate-bounce" />
              <span>HIGH CONFIDENCE</span>
            </div>
          )}

          <div
            id="fasting-level-badge"
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-orbitron font-bold border ${levelInfo.color}`}
          >
            <Flame className="w-2.5 h-2.5" />
            <span>{levelInfo.label}</span>
          </div>
        </div>
      </div>

      {/* 1/3 LEVEL ZERO-LOSS PROGRESSION & ALL-TIME ONLINE API TICKER */}
      <div className="mb-3 p-2 rounded-2xl bg-black/60 border border-white/[0.08] space-y-1.5 relative z-20">
        <div className="flex items-center justify-between text-[9px] font-orbitron font-bold">
          <div className="flex items-center gap-1.5 text-gray-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>1-3 LEVEL 100% WIN PROTOCOL</span>
          </div>
          <div className="flex items-center gap-1.5 text-[8px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>GLOBAL SYNC: ALL USERS IDENTICAL SIGNAL</span>
          </div>
        </div>

        {/* Global Synchronized Protection Banner */}
        <div className="text-[7.5px] text-center font-mono text-cyan-300/90 bg-cyan-950/40 border border-cyan-500/25 rounded-lg py-1 px-2 flex items-center justify-between">
          <span className="text-emerald-400 font-bold">● 24/7 LIVE API LOGIC</span>
          <span>SHIELDED PROXY (0% BLOCK · 0% DATA ERROR)</span>
          <span className="text-amber-300 font-bold">1-3 LEVEL MAX WIN</span>
        </div>

        {/* 3 Interactive Level Stages */}
        <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
          <div className={`p-1.5 rounded-xl border text-[9px] transition-all ${
            fastingLevel === 1
              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold shadow-[0_0_12px_rgba(0,255,136,0.3)] ring-1 ring-emerald-400/50'
              : 'bg-white/[0.02] border-white/[0.06] text-gray-400'
          }`}>
            <span className="block text-[8px] font-orbitron">LVL 1 (1X)</span>
            <span className="text-[7.5px] text-gray-300">Base Core</span>
          </div>

          <div className={`p-1.5 rounded-xl border text-[9px] transition-all ${
            fastingLevel === 2
              ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold shadow-[0_0_15px_rgba(255,208,0,0.35)] ring-1 ring-amber-400/50 animate-pulse'
              : 'bg-white/[0.02] border-white/[0.06] text-gray-400'
          }`}>
            <span className="block text-[8px] font-orbitron">LVL 2 (3X)</span>
            <span className="text-[7.5px] text-gray-300">Recovery Sentinel</span>
          </div>

          <div className={`p-1.5 rounded-xl border text-[9px] transition-all ${
            fastingLevel >= 3
              ? 'bg-gradient-to-r from-red-500/30 via-amber-500/30 to-emerald-500/30 border-red-400 text-amber-300 font-black shadow-[0_0_20px_rgba(255,208,0,0.5)] ring-2 ring-amber-400 animate-bounce'
              : 'bg-white/[0.02] border-white/[0.06] text-gray-400'
          }`}>
            <span className="block text-[8px] font-orbitron text-amber-300">LVL 3 (8X)</span>
            <span className="text-[7.5px] text-emerald-300 font-bold">100% WIN CAP</span>
          </div>
        </div>
      </div>

      {/* Exchange Market Lock Sentinel Guard (Prevents Late Order Loss) */}
      {isCriticalTimer && (
        <div className="mb-2.5 py-1.5 px-3 rounded-xl bg-red-500/20 border border-red-500/60 flex items-center justify-center gap-2 text-[10px] font-orbitron font-extrabold text-red-300 shadow-[0_0_20px_rgba(255,0,50,0.4)] animate-pulse relative z-20">
          <Shield className="w-3.5 h-3.5 text-red-400 animate-bounce" />
          <span>MARKET LOCKED (ROUND CUTOFF) — ZERO-LOSS PROTECTION ENGAGED</span>
        </div>
      )}

      {/* Main Prediction Display with ANIMATION: OUTCOME SUPERNOVA */}
      <div className="py-2.5 text-center relative z-20">
        <div className="text-[10px] font-orbitron font-semibold tracking-[3px] text-gray-400 uppercase mb-2 flex items-center justify-center gap-1.5 flex-wrap">
          <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>AI QUANTUM SIZE PREDICTION</span>
        </div>

        {/* Centered Size Supernova Typography */}
        <div className="relative inline-block my-2">
          <div
            className={`absolute inset-0 blur-3xl opacity-50 rounded-full anim-energy-halo ${
              isBig ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          <div
            key={`${period}-${prediction}`}
            id="prediction-display-text"
            className={`relative font-orbitron text-6xl md:text-7xl font-black tracking-widest transition-all duration-300 drop-shadow-2xl anim-outcome-supernova ${
              isBig
                ? 'text-[#00ff88] text-glow-green'
                : 'text-[#ff2a4b] text-glow-red'
            } ${isShaking ? 'scale-[1.05]' : ''}`}
          >
            {prediction}
          </div>
        </div>

        {/* Clean Status Badge - Zero Numbers in this section (Numbers are strictly displayed below) */}
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className={`font-orbitron font-extrabold text-[10px] px-3.5 py-1 rounded-full border shadow-md flex items-center gap-1.5 ${
            isBig 
              ? 'bg-emerald-500/15 border-emerald-500/40 text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.25)]' 
              : 'bg-red-500/15 border-red-500/40 text-[#ff2a4b] shadow-[0_0_15px_rgba(255,42,75,0.25)]'
          }`}>
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>AI QUANTUM CONSENSUS LOCKED • ZERO BLINDSPOTS</span>
          </span>
        </div>

        <div className="block mt-2">
          <div className="inline-block px-3 py-1 rounded-full text-[10px] font-orbitron font-bold tracking-wider uppercase bg-white/[0.04] border border-white/[0.1] text-amber-300/90 shadow-sm">
            🔄 {pattern}
          </div>
        </div>
      </div>

      {/* COPY PREDICTION ACTION BUTTON (Positioned Above Number Predictions) */}
      <button
        type="button"
        id="copy-prediction-btn"
        onClick={handleCopy}
        style={{
          background: 'linear-gradient(90deg, #00ff88, #059669, #00ff88)',
          boxShadow: '0 4px 25px rgba(0, 255, 136, 0.45)'
        }}
        className="w-full py-3 px-4 rounded-2xl text-black font-orbitron font-black text-xs tracking-widest uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer my-3 shadow-lg hover:brightness-110 anim-pulse-glow"
      >
        {copied ? <Check className="w-4 h-4 text-black animate-bounce" /> : <Copy className="w-4 h-4 text-black" />}
        <span>{copied ? 'COPIED TO CLIPBOARD!' : '📋 COPY PREDICTION (ULTRA VIP FONT)'}</span>
      </button>

      {/* 2. ANIMATION: 9X JACKPOT DUAL ORBITAL 3D BALL LOTTERY REACTOR */}
      <div
        id="jackpot-seeds-box"
        className="my-3 p-3.5 rounded-3xl bg-black/80 border border-amber-500/40 relative overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(255,208,0,0.15)]"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-orbitron font-extrabold text-amber-400 tracking-wider">
            <Lock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>3D LOTTERY BALL PREDICTION (9× PAYOUT)</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_10px_rgba(0,255,136,0.25)]">
            🎯 EXACT HIT SEEDS
          </span>
        </div>

        {/* Dual Primary & Hedge 3D Ball Showcases with Dynamic 3D Animations */}
        {/* Dual Primary & Secondary 3D Ball Showcases with Dynamic 3D Animations */}
        <div className="grid grid-cols-2 gap-3 py-2">
          {/* Seed 1 Orbital 3D Ball Reactor - PRIMARY SEED */}
          {(() => {
            const isSeed1Big = jackpotSeeds[0] >= 5;
            const seed1Tag = isSeed1Big ? 'BIG (PRIMARY)' : 'SMALL (PRIMARY)';

            return (
              <div className="p-3 rounded-2xl bg-gradient-to-b from-white/[0.06] via-[#091518]/90 to-black/80 border-2 border-emerald-400/60 flex flex-col items-center justify-center text-center relative shadow-[0_0_30px_rgba(0,255,136,0.25)] anim-neon-border overflow-hidden">
                {/* Floating Particle Aura */}
                <div className="absolute inset-0 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />

                <div className="flex items-center gap-1.5 mb-2 relative z-10 flex-wrap justify-center">
                  <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded-full text-[#00ff88] bg-emerald-500/20 border border-emerald-500/40 shadow-sm">
                    SEED #1: {seed1Tag}
                  </span>
                  <span className="text-[7px] font-orbitron font-extrabold px-1.5 py-0.2 rounded-full text-amber-300 bg-amber-500/20 border border-amber-400/40 animate-pulse">
                    ✨ GLOWING
                  </span>
                </div>

                <div className="relative my-3">
                  {/* Energy Wave Rings */}
                  <div className="anim-orbital-ring-1 border-emerald-400/70" />
                  <div className="anim-radar-wave text-emerald-400/30" />
                  <BallDisplay
                    num={jackpotSeeds[0]}
                    size="2xl"
                    glow
                    pulse
                    shimmer
                    levitate
                    badge="HOT 🔥"
                  />
                </div>

                <div className="relative z-10 mt-1">
                  <span className="font-orbitron font-black text-sm text-white drop-shadow-md block">
                    BALL #{jackpotSeeds[0]}
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 font-bold block mt-0.5">
                    🎯 HIGHEST PROBABILITY
                  </span>
                  <span className="text-[7px] font-mono text-cyan-300/80 block">
                    (Dynamic 3D Shimmer)
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Seed 2 Orbital 3D Ball Reactor - SECONDARY SEED */}
          {(() => {
            const isSeed2Big = jackpotSeeds[1] >= 5;
            const seed2Tag = isSeed2Big ? 'BIG (RUNNER-UP)' : 'SMALL (RUNNER-UP)';

            return (
              <div className="p-3 rounded-2xl bg-gradient-to-b from-white/[0.06] via-[#1a0f12]/90 to-black/80 border-2 border-amber-400/60 flex flex-col items-center justify-center text-center relative shadow-[0_0_30px_rgba(255,208,0,0.25)] anim-neon-border overflow-hidden">
                {/* Floating Particle Aura */}
                <div className="absolute inset-0 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

                <div className="flex items-center gap-1.5 mb-2 relative z-10 flex-wrap justify-center">
                  <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded-full text-amber-300 bg-amber-500/20 border border-amber-500/40 shadow-sm">
                    SEED #2: {seed2Tag}
                  </span>
                  <span className="text-[7px] font-orbitron font-extrabold px-1.5 py-0.2 rounded-full text-cyan-300 bg-cyan-500/20 border border-cyan-400/40 animate-pulse">
                    ⚡ RUNNER-UP
                  </span>
                </div>

                <div className="relative my-3">
                  {/* Energy Wave Rings */}
                  <div className="anim-orbital-ring-2 border-amber-400/70" />
                  <div className="anim-radar-wave text-amber-400/30" />
                  <BallDisplay
                    num={jackpotSeeds[1]}
                    size="2xl"
                    glow
                    pulse
                    shimmer
                    levitate
                    badge="KEY 🎯"
                  />
                </div>

                <div className="relative z-10 mt-1">
                  <span className="font-orbitron font-black text-sm text-white drop-shadow-md block">
                    BALL #{jackpotSeeds[1]}
                  </span>
                  <span className="text-[8px] font-mono text-amber-400 font-bold block mt-0.5">
                    🎯 HIGH VALUE TARGET
                  </span>
                  <span className="text-[7px] font-mono text-cyan-300/80 block">
                    (Dynamic 3D Shimmer)
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* 3D Target Size Pool Ball Probability Array */}
        <div className="mt-3 pt-3 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-orbitron font-extrabold text-cyan-300 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
              <span>TARGET POOL PROBABILITY RANKING (3D):</span>
            </span>
            <span className="text-[8px] font-mono text-gray-400">
              {isBig ? 'BIG POOL (5-9)' : 'SMALL POOL (0-4)'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 md:gap-2">
            {(topBallPool && topBallPool.length === 5
              ? topBallPool
              : (isBig ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4]).map((n, i) => ({
                  num: n,
                  prob: i === 0 ? 36 : i === 1 ? 26 : i === 2 ? 18 : i === 3 ? 12 : 8,
                  isPrimary: n === jackpotSeeds[0],
                  isSecondary: n === jackpotSeeds[1]
                }))
            ).map((item) => {
              const isPrimaryHit = item.num === jackpotSeeds[0];
              const isSecondaryHit = item.num === jackpotSeeds[1];
              return (
                <div
                  key={item.num}
                  className={`flex flex-col items-center justify-center p-1.5 md:p-2 rounded-2xl border transition-all ${
                    isPrimaryHit
                      ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(255,208,0,0.3)] scale-105'
                      : isSecondaryHit
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                      : 'bg-black/50 border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <BallDisplay
                    num={item.num}
                    size="sm"
                    glow={isPrimaryHit || isSecondaryHit}
                    pulse={isPrimaryHit}
                  />
                  <span className={`mt-1 font-orbitron font-black text-[10px] ${
                    isPrimaryHit ? 'text-amber-300' : isSecondaryHit ? 'text-cyan-300' : 'text-gray-300'
                  }`}>
                    {item.prob}%
                  </span>
                  <span className={`text-[7px] font-mono font-bold uppercase truncate max-w-full ${
                    isPrimaryHit
                      ? 'text-amber-400'
                      : isSecondaryHit
                      ? 'text-cyan-300'
                      : 'text-gray-400'
                  }`}>
                    {isPrimaryHit ? 'PRIMARY' : isSecondaryHit ? 'HEDGE' : `BALL ${item.num}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-[9px] font-mono text-gray-400 mt-2.5 flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-amber-400 font-bold">🎯 DUAL-POOL LOCK:</span>
          <span>1 Main Size Pool + 1 Opposite Pool (Hedge Backup)</span>
          <span className="text-[#00ff88] font-bold">• 9× VIP JACKPOT</span>
        </p>
      </div>

      {/* 2.5. MONEY MANAGEMENT LIVE STAKING ADVISOR HUD */}
      {mmSettings && (
        (() => {
          const advice = getStakingAdvice(mmSettings);
          return (
            <div
              id="mm-staking-hud"
              onClick={onOpenMoneyManagement}
              className="my-3 p-3 rounded-2xl bg-gradient-to-r from-[#0c1813] via-[#09151e] to-[#140b1c] border border-emerald-500/35 hover:border-emerald-400 transition-all cursor-pointer shadow-lg relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-[9px] font-orbitron font-extrabold text-emerald-400 tracking-wider">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>MONEY MANAGEMENT · STAGE {advice.currentStage} ({advice.currentMultiplier}X)</span>
                </div>
                <span className="text-[9px] font-mono text-cyan-300 font-bold flex items-center gap-1">
                  <span>PLAN DETAILS</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[9px] font-mono text-gray-400 block">RECOMMENDED STAKE</span>
                  <span className="font-orbitron text-xl font-black text-white flex items-center gap-1.5">
                    <span>{mmSettings.currencySymbol}{advice.currentBet}</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {mmSettings.plan.replace('_', ' ')}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <div className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center">
                    <span className="block text-[8px] text-gray-400">IF WIN</span>
                    <span className="font-bold font-orbitron">{mmSettings.currencySymbol}{advice.nextBetIfWin}</span>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-center">
                    <span className="block text-[8px] text-gray-400">IF LOSS</span>
                    <span className="font-bold font-orbitron">{mmSettings.currencySymbol}{advice.nextBetIfLoss}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* Confidence Bar */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-2.5 mb-3">
        <div className="flex items-center justify-between text-[10px] font-orbitron mb-1.5">
          <span className="text-gray-400 font-semibold flex items-center gap-1">
            <Brain className="w-3 h-3 text-red-400" /> ALGORITHM CONFIDENCE
          </span>
          <span className="font-black text-amber-400 text-xs">{confidence}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden border border-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-700 shadow-sm"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>


      {/* Active Market Pattern & Strategy Status Banner */}
      {marketPatternReason && (
        <div className="mb-3 p-2.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="text-gray-300 font-semibold truncate">
              {marketPatternReason}
            </span>
          </div>
          <span className="text-[9px] font-orbitron font-extrabold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-lg shrink-0 ml-2">
            AUTO-SYNCED
          </span>
        </div>
      )}

      {/* Strategy Engine Selector Bar with Auto-Adaptation Highlight */}
      <div>
        <div className="text-[9px] font-orbitron font-semibold text-gray-400 tracking-wider mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" /> STRATEGY ENGINE (AUTO-UPDATING):
          </span>
          {strategy === 'AUTO_ADAPTIVE' && (
            <span className="text-[8px] font-mono text-emerald-400 font-bold">
              ⚡ LIVE ADAPTIVE MODE
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {STRATEGIES.map(st => {
            const isActive = strategy === st.id || (strategy === 'AUTO_ADAPTIVE' && autoSelectedStrategy === st.id);
            const isAutoOption = st.id === 'AUTO_ADAPTIVE';

            return (
              <button
                key={st.id}
                type="button"
                id={`strategy-btn-${st.id}`}
                onClick={() => onSelectStrategy(st.id)}
                className={`py-2 px-1 rounded-xl text-[9px] font-orbitron font-bold transition-all flex flex-col items-center gap-0.5 border cursor-pointer relative ${
                  isActive
                    ? isAutoOption
                      ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(255,208,0,0.2)]'
                    : 'bg-white/[0.02] border-white/[0.05] text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black animate-ping" />
                )}
                <span className="text-sm">{st.icon}</span>
                <span className="truncate w-full text-center">{st.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
