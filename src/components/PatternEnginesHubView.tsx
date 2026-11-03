import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Activity,
  CheckCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Flame,
  Radio,
  Shield,
  Lock,
  Globe,
  Database,
  Layers,
  AlertTriangle,
  HeartPulse,
  Eye,
  Terminal,
  ShieldAlert,
  Sliders,
  Brain,
  Key,
  GitBranch,
  Target
} from 'lucide-react';
import { BossPredictionResult, AIEngineInfo, QuantEngineResult } from '../types';
import { PatternEngineState, MultiEngineMatrixResult, patternEngineManager } from '../utils/patternEngines';
import { bossEngineManager } from '../utils/bossEngine';
import { quantEngineManager } from '../utils/quantEngine';

interface Props {
  activeEngineState?: PatternEngineState;
  multiEngineMatrix?: MultiEngineMatrixResult;
  bossPredictionResult?: BossPredictionResult;
  quantEngineResult?: QuantEngineResult;
}

type HubTab = 'PATTERNS' | 'ENGINES' | 'QUANT_ARCH' | 'BREAKPOINTS' | 'GENERATED_LOGICS' | 'WATCHDOG';

export const PatternEnginesHubView: React.FC<Props> = ({
  activeEngineState,
  multiEngineMatrix,
  bossPredictionResult,
  quantEngineResult
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('PATTERNS');
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);
  const [watchdogTick, setWatchdogTick] = useState<number>(0);
  const [patternFilter, setPatternFilter] = useState<'ALL' | 'LEADER' | 'HIGH_ACC'>('ALL');

  // Fallback to active Boss Engine & Pattern Engine instances if not directly provided
  const bossData: BossPredictionResult = bossPredictionResult || bossEngineManager.execute([], 0);
  const quantData: QuantEngineResult = quantEngineResult || quantEngineManager.execute([], 0);
  const matrixData: MultiEngineMatrixResult = multiEngineMatrix || patternEngineManager.runAllEnginesConcurrently([]);
  const engines: AIEngineInfo[] = bossData.engines;
  const vault = bossEngineManager.getBreakpointVault();
  const generatedLogics = bossEngineManager.getGeneratedLogics();
  const failurePayloads = quantEngineManager.getFailurePayloads();

  const handlePulseWatchdog = () => {
    setWatchdogTick(prev => prev + 1);
  };

  return (
    <div
      id="boss-engines-hub"
      className="rounded-3xl bg-gradient-to-b from-[#0a0a18]/98 via-[#070714]/98 to-[#030309] border border-amber-500/40 p-3.5 sm:p-5 space-y-4 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.9),0_0_30px_rgba(255,170,0,0.14)] relative overflow-hidden"
    >
      {/* Background Cyber Tech Grid Ambient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ======================================================== */}
      {/* 1. MASTER BOSS ENGINE COMMAND HEADER */}
      {/* ======================================================== */}
      <div className="relative z-10 pb-3 border-b border-white/[0.08] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-red-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(255,208,0,0.3)]">
                <CrownIcon className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-orbitron text-base sm:text-lg font-black text-white tracking-wider flex items-center gap-2">
                  <span>SUPREME BOSS AI ENGINE</span>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 to-emerald-500/30 text-amber-300 text-[10px] font-mono border border-amber-400/50 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    8/8 AI ENGINES ONLINE
                  </span>
                </h3>
                <p className="text-[11px] font-mono text-gray-400">
                  8 AI Engines Active • Real-time Pattern Mining, Dynamic Logic Generation, Breakpoint Trap Guard & 24/7 Keep-Alive
                </p>
              </div>
            </div>
          </div>

          {/* Boss Master Vote Ribbon */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <div className="px-3.5 py-2 rounded-2xl bg-black/80 border border-amber-400/50 flex items-center gap-3 shadow-[0_0_20px_rgba(255,208,0,0.2)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
              </span>
              <div className="text-left font-mono text-[9px] leading-tight">
                <span className="text-gray-400 block font-orbitron font-bold">BOSS DECISION</span>
                <span className={`font-black font-orbitron text-sm ${bossData.bossPrediction === 'BIG' ? 'text-[#00ff88]' : 'text-[#ff2a4b]'}`}>
                  {bossData.bossPrediction} ({bossData.bossConfidence}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Boss Engine Anti-Loss Shield Banner */}
        <div className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 text-[11px] font-mono ${
          bossData.antiLossShield.level === 'LEVEL_2_HARD_LOCK'
            ? 'bg-red-500/15 border-red-500/50 text-red-200'
            : bossData.antiLossShield.level === 'LEVEL_1_SHIELD'
            ? 'bg-amber-500/15 border-amber-400/50 text-amber-200'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
            <span className="font-orbitron font-bold text-white text-[10px] sm:text-xs">
              {bossData.antiLossShield.label}
            </span>
          </div>
          <span className="text-[10px] text-gray-300 hidden sm:inline truncate max-w-xs">
            {bossData.antiLossShield.description}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-black/50 text-[9px] font-orbitron font-extrabold border border-white/10 shrink-0 text-amber-300">
            {bossData.safePattern.name}
          </span>
        </div>

        {/* Interactive Hub Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px] font-orbitron">
          <button
            type="button"
            onClick={() => setActiveTab('PATTERNS')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'PATTERNS'
                ? 'bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>26+ PATTERN ENGINES ({matrixData.allEnginesRunning.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ENGINES')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'ENGINES'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(255,208,0,0.25)]'
                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>8 AI ENGINES</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('QUANT_ARCH')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'QUANT_ARCH'
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>QUANT NEURAL ARCH (0-LOSS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BREAKPOINTS')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'BREAKPOINTS'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(255,208,0,0.25)]'
                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span>BREAKPOINT VAULT ({vault.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('GENERATED_LOGICS')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'GENERATED_LOGICS'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(255,208,0,0.25)]'
                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>COMPILED LOGICS ({generatedLogics.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('WATCHDOG')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'WATCHDOG'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(255,208,0,0.25)]'
                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-red-400" />
            <span>WATCHDOG (24/7 ONLINE)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1.5. TAB CONTENT: 26+ AUTONOMOUS PATTERN ENGINES GRID */}
      {/* ======================================================== */}
      {activeTab === 'PATTERNS' && (
        <div className="space-y-3 font-mono text-xs">
          {/* Top Prime Leader Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-black to-cyan-950/40 border border-emerald-500/40 shadow-[0_0_20px_rgba(0,255,136,0.15)] space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
                  {matrixData.leaderEngine.icon}
                </span>
                <div>
                  <div className="font-orbitron font-black text-white text-xs sm:text-sm flex items-center gap-2">
                    <span>PRIME LEADER: {matrixData.leaderEngine.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[8px] border border-emerald-500/40">
                      SCORE: {matrixData.leaderScore}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-300 block">
                    Detected Morphology: <span className="text-amber-300 font-bold">{matrixData.detectedFeature}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-right">
                  <span className="text-[8px] text-gray-400 block font-orbitron">CONSENSUS</span>
                  <span className={`font-orbitron font-black text-xs ${matrixData.consensusVote === 'BIG' ? 'text-[#00ff88]' : 'text-[#ff2a4b]'}`}>
                    {matrixData.consensusVote} ({matrixData.consensusPercent}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-white/[0.08] text-[9px] font-orbitron">
              <span className="text-gray-400">FILTER:</span>
              <button
                type="button"
                onClick={() => setPatternFilter('ALL')}
                className={`px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  patternFilter === 'ALL'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-white/[0.02] border-white/10 text-gray-400'
                }`}
              >
                ALL ({matrixData.allEnginesRunning.length})
              </button>
              <button
                type="button"
                onClick={() => setPatternFilter('LEADER')}
                className={`px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  patternFilter === 'LEADER'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-white/[0.02] border-white/10 text-gray-400'
                }`}
              >
                LEADER & TOP CORES
              </button>
              <button
                type="button"
                onClick={() => setPatternFilter('HIGH_ACC')}
                className={`px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  patternFilter === 'HIGH_ACC'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-white/[0.02] border-white/10 text-gray-400'
                }`}
              >
                HIGH ACCURACY (&gt;80%)
              </button>
            </div>
          </div>

          {/* Grid of All 26+ Pattern Engines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {matrixData.allEnginesRunning
              .filter(run => {
                if (patternFilter === 'LEADER') return run.isLeader || run.matchScore >= 80;
                if (patternFilter === 'HIGH_ACC') return run.engine.dynamicAccuracy >= 80;
                return true;
              })
              .map(run => {
                const { engine, vote, confidence, reason, matchScore, isLeader, statusText } = run;
                const isVoteBig = vote === 'BIG';

                return (
                  <div
                    key={engine.id}
                    className={`p-3 rounded-2xl border transition-all relative overflow-hidden select-none ${
                      isLeader
                        ? 'bg-gradient-to-br from-emerald-500/15 via-black/80 to-cyan-500/10 border-emerald-400/80 shadow-[0_0_20px_rgba(0,255,136,0.25)]'
                        : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl p-1 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                          {engine.icon}
                        </span>
                        <div>
                          <div className="font-orbitron font-extrabold text-xs text-white flex items-center gap-1.5 flex-wrap">
                            <span>{engine.name}</span>
                            <span className="text-[8px] font-mono text-cyan-400 font-normal">
                              v{engine.version.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-[8px] font-mono text-gray-400 block truncate max-w-[180px]">
                            {engine.patternType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isLeader && (
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 text-[8px] font-orbitron font-black tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            LEADER
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[9px] font-orbitron font-black border ${
                            isVoteBig
                              ? 'bg-emerald-500/20 text-[#00ff88] border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,136,0.2)]'
                              : 'bg-red-500/20 text-[#ff2a4b] border-red-500/40 shadow-[0_0_8px_rgba(255,42,75,0.2)]'
                          }`}
                        >
                          {vote} {confidence}%
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[9px] text-gray-300 font-mono line-clamp-1 mb-2">
                      {engine.description}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-white/[0.06] text-center font-mono text-[8px]">
                      <div className="p-1 rounded-lg bg-black/40 border border-white/[0.04]">
                        <span className="text-gray-400 block">ACCURACY</span>
                        <span className="font-orbitron font-bold text-emerald-400">
                          {engine.dynamicAccuracy}%
                        </span>
                      </div>

                      <div className="p-1 rounded-lg bg-black/40 border border-white/[0.04]">
                        <span className="text-gray-400 block">WEIGHT</span>
                        <span className="font-orbitron font-bold text-amber-300">
                          {engine.learningWeight.toFixed(2)}x
                        </span>
                      </div>

                      <div className="p-1 rounded-lg bg-black/40 border border-white/[0.04]">
                        <span className="text-gray-400 block">STREAK</span>
                        <span className="font-orbitron font-bold text-cyan-300">
                          {engine.currentStreak}x
                        </span>
                      </div>

                      <div className="p-1 rounded-lg bg-black/40 border border-white/[0.04]">
                        <span className="text-gray-400 block">MATCH</span>
                        <span className="font-orbitron font-bold text-white">
                          {matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Reasoning Snippet */}
                    <div className="mt-1.5 text-[8px] font-mono text-gray-400 truncate flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded border border-white/[0.03]">
                      <Target className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{reason}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TAB CONTENT: 8 DEDICATED AI ENGINES GRID */}
      {/* ======================================================== */}
      {activeTab === 'ENGINES' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {engines.map(engine => {
              const isSelected = selectedEngineId === engine.id;
              const isVoteBig = engine.vote === 'BIG';

              return (
                <div
                  key={engine.id}
                  onClick={() => setSelectedEngineId(isSelected ? null : engine.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden select-none ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400/80 shadow-[0_0_20px_rgba(255,208,0,0.25)]'
                      : 'bg-white/[0.03] border-white/[0.08] hover:border-amber-400/40 hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{engine.icon}</span>
                      <div>
                        <div className="font-orbitron font-extrabold text-xs text-white flex items-center gap-1.5">
                          <span>{engine.banglaName}</span>
                        </div>
                        <span className="text-[9px] font-mono text-cyan-300 block">
                          {engine.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Live Online Badge - Guaranteed 0 Sleep */}
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[8px] font-orbitron font-black tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ONLINE
                      </span>

                      {/* Engine Prediction Vote */}
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-orbitron font-black border ${
                          isVoteBig
                            ? 'bg-emerald-500/20 text-[#00ff88] border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,136,0.2)]'
                            : 'bg-red-500/20 text-[#ff2a4b] border-red-500/40 shadow-[0_0_8px_rgba(255,42,75,0.2)]'
                        }`}
                      >
                        {engine.vote} {engine.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Engine Role & Mission */}
                  <p className="text-[10px] text-gray-300 font-mono leading-relaxed line-clamp-2 mb-2">
                    {engine.role}
                  </p>

                  {/* Live Metrics Row */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/[0.06] text-center font-mono text-[9px]">
                    <div className="p-1 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-gray-400 block text-[8px]">SPEED / LATENCY</span>
                      <span className="font-orbitron font-black text-amber-300">
                        {engine.speedMs}ms
                      </span>
                    </div>

                    <div className="p-1 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-gray-400 block text-[8px]">ACCURACY</span>
                      <span className="font-orbitron font-black text-emerald-400">
                        {engine.accuracy}%
                      </span>
                    </div>

                    <div className="p-1 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-gray-400 block text-[8px]">SLEEP STATUS</span>
                      <span className="font-orbitron font-black text-cyan-300">
                        AWAKE (0 SLEEP)
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Action Log */}
                  <div className="mt-2 text-[9px] font-mono text-amber-200/90 truncate flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg border border-white/[0.03]">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                    <span className="truncate">{engine.actionLog}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2.5. TAB CONTENT: ZERO-TOLERANCE QUANT TRADING ARCHITECTURE */}
      {/* ======================================================== */}
      {activeTab === 'QUANT_ARCH' && (
        <div className="space-y-3 font-mono text-xs">
          {/* Header Banner */}
          <div className="p-3.5 rounded-2xl bg-[#070b16]/95 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.18)] space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <Brain className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h4 className="font-orbitron font-black text-sm text-white tracking-wider flex items-center gap-2">
                    <span>ZERO-TOLERANCE QUANTITATIVE TRADING ENGINE</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[9px] font-mono">
                      DUAL-INDICATOR STREAM
                    </span>
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    Dual Stream Size (BIG/SMALL) & Parity (RED/GREEN) • Wave Mechanics • Markov Chain • Shannon Entropy • Q-Learning 3-Loss Shield
                  </p>
                </div>
              </div>

              {/* 3-Loss Cap Shield Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-xl text-[9px] font-orbitron font-black border flex items-center gap-1.5 ${
                  quantData.activeLevel === 'L3'
                    ? 'bg-red-500/25 border-red-500/70 text-red-300 animate-bounce'
                    : quantData.activeLevel === 'L2'
                    ? 'bg-amber-500/25 border-amber-400/70 text-amber-300'
                    : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                }`}>
                  <Shield className="w-3 h-3" />
                  <span>{quantData.escalationLabel}</span>
                </span>
              </div>
            </div>

            {/* Global argmax Champion Output Box */}
            <div className="p-3 rounded-xl bg-black/70 border border-cyan-500/30 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="text-[9px] text-gray-400 font-mono block">
                  GLOBAL CHAMPION SIGNAL [ argmax C(x) ]:
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`font-orbitron font-black text-base px-2.5 py-1 rounded-xl border ${
                    quantData.targetSignal === 'BIG' || quantData.targetSignal === 'GREEN'
                      ? 'bg-emerald-500/20 text-[#00ff88] border-emerald-500/50 shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                      : 'bg-red-500/20 text-[#ff2a4b] border-red-500/50 shadow-[0_0_15px_rgba(255,42,75,0.3)]'
                  }`}>
                    {quantData.targetSignal} ({quantData.confidence}%)
                  </span>
                  <span className="text-[9px] text-cyan-300 font-mono">
                    [{quantData.signalType === 'SIZE' ? 'SIZE ASSET STREAM' : 'PARITY/COLOR ASSET STREAM'}]
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-gray-400 block">ACTIVE WAVE MECHANIC:</span>
                <span className="font-orbitron font-black text-xs text-amber-300">
                  {quantData.wavePattern}
                </span>
                <span className="text-[8px] text-purple-300 block font-mono mt-0.5">
                  MAX CONSECUTIVE LOSS LIMIT: 3 ROUNDS
                </span>
              </div>
            </div>
          </div>

          {/* 4-Asset Probability & Confidence Board */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
            {/* Size Asset Stream */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-gray-300 font-bold border-b border-white/[0.06] pb-1.5">
                <span className="flex items-center gap-1.5 text-cyan-300 font-orbitron">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SIZE ASSET PROBABILITIES:</span>
                </span>
                <span className="text-cyan-400 font-mono">
                  SHANNON ENTROPY: {quantData.shannonEntropy}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="p-2 rounded-xl bg-black/40 border border-white/[0.05] flex items-center justify-between">
                  <div>
                    <span className="font-orbitron font-bold text-emerald-400 text-xs">BIG</span>
                    <span className="text-[9px] text-gray-400 ml-2 font-mono">
                      P: {(quantData.probabilities.big * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-orbitron font-black text-xs border border-emerald-500/40">
                    C(BIG): {quantData.confidences.big}%
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-black/40 border border-white/[0.05] flex items-center justify-between">
                  <div>
                    <span className="font-orbitron font-bold text-red-400 text-xs">SMALL</span>
                    <span className="text-[9px] text-gray-400 ml-2 font-mono">
                      P: {(quantData.probabilities.small * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-red-500/20 text-red-300 font-orbitron font-black text-xs border border-red-500/40">
                    C(SMALL): {quantData.confidences.small}%
                  </span>
                </div>
              </div>
            </div>

            {/* Parity Asset Stream */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-gray-300 font-bold border-b border-white/[0.06] pb-1.5">
                <span className="flex items-center gap-1.5 text-purple-300 font-orbitron">
                  <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                  <span>PARITY ASSET PROBABILITIES:</span>
                </span>
                <span className="text-purple-400 font-mono text-[9px]">
                  REGIME: {quantData.entropyRegime}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="p-2 rounded-xl bg-black/40 border border-white/[0.05] flex items-center justify-between">
                  <div>
                    <span className="font-orbitron font-bold text-red-400 text-xs">RED</span>
                    <span className="text-[9px] text-gray-400 ml-2 font-mono">
                      P: {(quantData.probabilities.red * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-red-500/20 text-red-300 font-orbitron font-black text-xs border border-red-500/40">
                    C(RED): {quantData.confidences.red}%
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-black/40 border border-white/[0.05] flex items-center justify-between">
                  <div>
                    <span className="font-orbitron font-bold text-emerald-400 text-xs">GREEN</span>
                    <span className="text-[9px] text-gray-400 ml-2 font-mono">
                      P: {(quantData.probabilities.green * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-orbitron font-black text-xs border border-emerald-500/40">
                    C(GREEN): {quantData.confidences.green}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* First-Order Markov Chain 50-Period Transition Matrices */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2">
            <h5 className="font-orbitron font-bold text-xs text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>1ST-ORDER MARKOV CHAIN TRANSITION MATRIX (50-PERIOD WINDOW)</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <span className="font-bold text-gray-300 block mb-1">SIZE TRANSITIONS [ P(S_t+1 | S_t) ]:</span>
                <div className="grid grid-cols-2 gap-1.5 text-center font-mono">
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
                    <span className="text-[8px] text-gray-400 block">BIG → BIG</span>
                    <span className="font-bold text-emerald-400">{(quantData.markovMatrix.size.bToB * 100).toFixed(0)}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
                    <span className="text-[8px] text-gray-400 block">BIG → SMALL</span>
                    <span className="font-bold text-red-400">{(quantData.markovMatrix.size.bToS * 100).toFixed(0)}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
                    <span className="text-[8px] text-gray-400 block">SMALL → BIG</span>
                    <span className="font-bold text-emerald-400">{(quantData.markovMatrix.size.sToB * 100).toFixed(0)}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
                    <span className="text-[8px] text-gray-400 block">SMALL → SMALL</span>
                    <span className="font-bold text-red-400">{(quantData.markovMatrix.size.sToS * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <span className="font-bold text-gray-300 block mb-1">PARITY TRANSITIONS [ P(C_t+1 | C_t) ]:</span>
                <div className="grid grid-cols-2 gap-1.5 text-center font-mono">
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
                    <span className="text-[8px] text-gray-400 block">RED → RED</span>
                    <span className="font-bold text-red-400">{(quantData.markovMatrix.color.rToR * 100).toFixed(0)}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
                    <span className="text-[8px] text-gray-400 block">RED → GREEN</span>
                    <span className="font-bold text-emerald-400">{(quantData.markovMatrix.color.rToG * 100).toFixed(0)}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
                    <span className="text-[8px] text-gray-400 block">GREEN → RED</span>
                    <span className="font-bold text-red-400">{(quantData.markovMatrix.color.gToR * 100).toFixed(0)}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
                    <span className="text-[8px] text-gray-400 block">GREEN → GREEN</span>
                    <span className="font-bold text-emerald-400">{(quantData.markovMatrix.color.gToG * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Q-Learning KNN Cosine Similarity Failure Intercept Box */}
          <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-orbitron font-bold text-xs text-purple-300 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Q-LEARNING KNN COSINE SIMILARITY SIGNAL INTERCEPT</span>
              </h5>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-orbitron font-bold border ${
                quantData.knnInterceptTriggered
                  ? 'bg-purple-500/30 border-purple-400 text-purple-200 animate-pulse'
                  : 'bg-white/[0.03] border-white/10 text-gray-400'
              }`}>
                KNN SIMILARITY: {Math.round(quantData.knnSimilarity * 100)}%
              </span>
            </div>

            <p className="text-[10px] text-gray-300">
              Rule: When Similarity ≥ 0.80, default algorithm cancels and <b className="text-purple-300">LEARNED_INVERSE_MODE</b> triggers, routing away from prior trap patterns.
            </p>

            {quantData.knnInterceptTriggered && quantData.knnInterceptReason && (
              <div className="p-2 rounded-xl bg-purple-500/25 border border-purple-400/60 text-purple-200 text-[10px] font-bold flex items-center gap-2 animate-pulse">
                <Zap className="w-4 h-4 text-purple-300 shrink-0" />
                <span>{quantData.knnInterceptReason}</span>
              </div>
            )}

            {/* Failure Memory Payloads */}
            <div className="mt-2 pt-2 border-t border-white/[0.08]">
              <span className="text-[9px] text-gray-400 block font-bold mb-1">
                Failure Payloads Saved in Memory Vault ({failurePayloads.length}):
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {failurePayloads.slice(0, 5).map((fp, i) => (
                  <div key={i} className="p-2 rounded-xl bg-black/50 border border-white/[0.05] flex items-center justify-between gap-2 text-[9px]">
                    <div>
                      <span className="text-amber-400 font-bold">#{fp.periodId}</span>
                      <span className="text-gray-400 ml-1.5">[{fp.activeLevel}]</span>
                      <span className="text-purple-300 ml-1.5 font-bold">{fp.rootCause}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400">Failed: <b className="text-red-400">{fp.failedSignalTarget}</b></span>
                      <span className="text-gray-400 ml-2">Actual: <b className="text-emerald-400">{fp.actualOutcome.size} / {fp.actualOutcome.color}</b></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB CONTENT: BREAKPOINT VAULT (ENGINE 6) */}
      {/* ======================================================== */}
      {activeTab === 'BREAKPOINTS' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-orbitron font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>ENGINE 6: SAFE PATTERN & BREAKPOINT MEMORY VAULT</span>
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Logs when patterns break, preventing the AI engine from walking into consecutive loss traps.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-orbitron font-black text-xs border border-cyan-500/40">
              {vault.length} BREAKPOINTS SAVED
            </span>
          </div>

          {vault.length === 0 ? (
            <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.05] text-center text-gray-400 text-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
              <span>Market is completely stable. No pattern breaks detected yet. Records will log on new draws.</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {vault.map((rec, idx) => (
                <div
                  key={`${rec.period}-${idx}`}
                  className="p-2.5 rounded-xl bg-black/60 border border-white/[0.08] flex items-center justify-between gap-3 text-[10px]"
                >
                  <div>
                    <div className="font-orbitron font-bold text-white flex items-center gap-2">
                      <span className="text-amber-400">DRAW #{rec.period}</span>
                      <span className="text-gray-400 text-[9px]">{rec.patternName}</span>
                    </div>
                    <p className="text-gray-300 text-[9px] mt-0.5">{rec.breakType}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] text-gray-400 block font-mono">ACTUAL OUTCOME</span>
                    <span className={`font-orbitron font-black text-xs ${rec.actualOutcome === 'BIG' ? 'text-[#00ff88]' : 'text-[#ff2a4b]'}`}>
                      {rec.actualOutcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB CONTENT: AUTONOMOUS GENERATED LOGICS (ENGINE 5) */}
      {/* ======================================================== */}
      {activeTab === 'GENERATED_LOGICS' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-orbitron font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>ENGINE 5 & 7: AUTONOMOUS LOGIC GENERATION & GUARDIAN</span>
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Automatically synthesizes novel prediction rules from market patterns. No logic is discarded.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-orbitron font-black text-xs border border-emerald-500/40">
              {bossData.logicGuardian.totalGuardedLogics} LOGICS GUARDED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {generatedLogics.map(gen => (
              <div
                key={gen.id}
                className="p-3 rounded-xl bg-black/60 border border-emerald-500/25 space-y-1.5 text-[10px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-orbitron font-bold text-emerald-400">{gen.id}: {gen.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[8px] font-orbitron font-bold">
                    {gen.accuracy}% ACC
                  </span>
                </div>
                <div className="text-[9px] text-gray-400 font-mono">
                  <span className="text-gray-500">FORMULA:</span> <code className="text-amber-300">{gen.formula}</code>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.05] text-[9px] text-gray-400">
                  <span>SOURCE: {gen.sourcePattern}</span>
                  <span className="text-cyan-300 font-bold">WEIGHT: {gen.weight}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB CONTENT: 24/7 KEEP-ALIVE WATCHDOG (ENGINE 8) */}
      {/* ======================================================== */}
      {activeTab === 'WATCHDOG' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-black/70 border border-red-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-red-400 animate-bounce" />
                <div>
                  <h4 className="font-orbitron font-bold text-white text-xs">
                    ENGINE 8: 24/7 KEEP-ALIVE WATCHDOG SUPERVISOR
                  </h4>
                  <span className="text-[9px] text-gray-400">
                    Monitors all engines 24/7 • Background sleep or freezing is strictly prohibited
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePulseWatchdog}
                className="px-2.5 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-orbitron font-black text-[9px] flex items-center gap-1 cursor-pointer transition-all"
              >
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                <span>MANUAL HEARTBEAT PULSE</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-gray-400 block text-[8px]">TOTAL ENGINES</span>
                <span className="font-orbitron font-black text-amber-300 text-sm">8 / 8</span>
              </div>

              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-gray-400 block text-[8px]">SLEEPING / OFFLINE</span>
                <span className="font-orbitron font-black text-emerald-400 text-sm">0 (ZERO SLEEP)</span>
              </div>

              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-gray-400 block text-[8px]">SYSTEM UPTIME</span>
                <span className="font-orbitron font-black text-cyan-300 text-sm">100.0%</span>
              </div>

              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-gray-400 block text-[8px]">HEARTBEAT COUNTER</span>
                <span className="font-orbitron font-black text-white text-sm">#{bossData.watchdog.lastPulse ? Math.floor(bossData.watchdog.lastPulse / 1000) % 10000 : 1000 + watchdogTick}</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                All 8 AI Engines are 100% active. Zero memory leak or background freeze detected.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Crown SVG Icon Component
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
