import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  TrendingUp,
  Cpu,
  RefreshCw,
  AlertTriangle,
  Lock,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Flame,
  ShieldCheck,
  Eye,
  Sliders
} from 'lucide-react';
import { GrandMatrixScanResult } from '../utils/grandMatrix';

interface Props {
  grandMatrix?: GrandMatrixScanResult;
  fastingLevel: number;
}

export const GrandMatrixDashboard: React.FC<Props> = ({ grandMatrix, fastingLevel }) => {
  const [activeTab, setActiveTab] = useState<'3step' | 'patterns' | 'antiHouse'>('3step');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!grandMatrix) return null;

  const { detectedPatterns, topPattern, threeStepStrategy, activeShields, houseTrapWarning, violetInsurance } = grandMatrix;

  const categories = ['ALL', 'Streak & Flow', 'Symmetry & Waves', 'Colors & Pivots', 'Digits & Math', 'Structural Breaks'];

  const filteredPatterns = selectedCategory === 'ALL'
    ? detectedPatterns
    : detectedPatterns.filter(p => p.category === selectedCategory);

  return (
    <div
      id="grand-matrix-dashboard"
      className="rounded-3xl bg-gradient-to-b from-[#0c0c1a]/95 via-[#080814]/98 to-[#04040a] border border-amber-500/30 p-4 space-y-4 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.15)]"
    >
      {/* Top Banner: House Trap Warning if active */}
      {houseTrapWarning && (
        <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/50 flex items-center justify-between text-xs font-mono text-red-200 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-bold">{houseTrapWarning}</span>
          </div>
          <span className="text-[9px] font-orbitron font-black px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 shrink-0 ml-2">
            SHIELD ENGAGED
          </span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-orbitron text-sm font-black text-white tracking-wider">
              GRAND PATTERN MATRIX & 3-STEP WIN SYSTEM
            </h3>
          </div>
          <p className="text-[10px] font-mono text-gray-400 mt-0.5">
            36+ Market Pattern Scanner • 3-Step Bet Sizing (1X→3X→8X) • Anti-House Manipulation Defense
          </p>
        </div>

        {/* Live Active Pattern Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
          <span className="text-gray-400">DOMINANT:</span>
          <span className="font-orbitron font-bold text-amber-300">
            {topPattern.icon} {topPattern.name}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-black/50 p-1 rounded-2xl border border-white/[0.06]">
        <button
          type="button"
          onClick={() => setActiveTab('3step')}
          className={`py-2 px-2 rounded-xl text-[10px] font-orbitron font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === '3step'
              ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/25 border border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>3-STEP WIN SYSTEM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('patterns')}
          className={`py-2 px-2 rounded-xl text-[10px] font-orbitron font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'patterns'
              ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>36+ PATTERNS ({detectedPatterns.filter(p => p.matched).length} ACTIVE)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('antiHouse')}
          className={`py-2 px-2 rounded-xl text-[10px] font-orbitron font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'antiHouse'
              ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/25 border border-emerald-400/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ANTI-HOUSE SHIELDS</span>
        </button>
      </div>

      {/* TAB 1: 3-STEP WIN LOGIC & STRATEGY SYSTEM */}
      {activeTab === '3step' && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-black to-black border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{threeStepStrategy.icon}</span>
                <div>
                  <h4 className="font-orbitron font-black text-sm text-white">
                    {threeStepStrategy.name}
                  </h4>
                  <p className="text-[10px] font-mono text-gray-400">
                    {threeStepStrategy.description}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-mono text-gray-400">TARGET STEP:</span>
                <div className="font-orbitron font-black text-base text-amber-300 flex items-center gap-1">
                  <span>STEP {threeStepStrategy.currentStep}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-200">
                    {threeStepStrategy.multiplier}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Step Visual Progression */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div
                className={`p-2.5 rounded-xl border transition-all ${
                  threeStepStrategy.currentStep === 1
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                    : 'bg-white/[0.02] border-white/[0.06] text-gray-400 opacity-60'
                }`}
              >
                <div className="font-orbitron font-bold text-[10px] text-gray-300">STEP 1</div>
                <div className="text-base font-orbitron font-black my-0.5">1X</div>
                <div className="text-[8px] truncate">{threeStepStrategy.step1}</div>
              </div>

              <div
                className={`p-2.5 rounded-xl border transition-all ${
                  threeStepStrategy.currentStep === 2
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                    : 'bg-white/[0.02] border-white/[0.06] text-gray-400 opacity-60'
                }`}
              >
                <div className="font-orbitron font-bold text-[10px] text-gray-300">STEP 2</div>
                <div className="text-base font-orbitron font-black my-0.5">3X</div>
                <div className="text-[8px] truncate">{threeStepStrategy.step2}</div>
              </div>

              <div
                className={`p-2.5 rounded-xl border transition-all ${
                  threeStepStrategy.currentStep === 3
                    ? 'bg-red-500/20 border-red-400 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)] ring-1 ring-red-400'
                    : 'bg-white/[0.02] border-white/[0.06] text-gray-400 opacity-60'
                }`}
              >
                <div className="font-orbitron font-bold text-[10px] text-gray-300">STEP 3</div>
                <div className="text-base font-orbitron font-black my-0.5">8X</div>
                <div className="text-[8px] truncate">{threeStepStrategy.step3}</div>
              </div>
            </div>

            {/* Active Execution Instruction */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs font-mono">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <b>Current Execution:</b> {threeStepStrategy.activeInstruction}
              </span>
              <span className="text-[10px] font-orbitron font-extrabold text-amber-400">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Violet Insurance Box */}
          <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-xl">🟣</span>
              <div>
                <div className="font-orbitron font-bold text-purple-200 text-xs">
                  VIOLET INSURANCE COVERAGE ({violetInsurance.coverage})
                </div>
                <p className="text-[10px] text-purple-300/80">
                  {violetInsurance.reason} • Multiplier Bonus: <b className="text-amber-400">{violetInsurance.multiplierBonus}</b>
                </p>
              </div>
            </div>

            <span className="text-[9px] font-orbitron font-bold px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300">
              {violetInsurance.recommended ? 'RECOMMENDED' : 'STANDBY'}
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: 28 ADVANCED MARKET PATTERNS SCANNER */}
      {activeTab === 'patterns' && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[9px] font-orbitron font-semibold">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-300 shadow-sm'
                    : 'bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Patterns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
            {filteredPatterns.map(pat => {
              return (
                <div
                  key={pat.name}
                  className={`p-2.5 rounded-2xl border transition-all text-xs font-mono flex items-center justify-between ${
                    pat.matched
                      ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'bg-white/[0.015] border-white/[0.05] opacity-65'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="text-xl shrink-0">{pat.icon}</span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-orbitron font-bold text-gray-200 text-xs truncate">
                          {pat.name}
                        </span>
                        {pat.matched && (
                          <span className="text-[7px] font-orbitron font-black px-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            MATCH
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-gray-400 truncate mt-0.5">
                        {pat.feature}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-orbitron font-black px-2 py-0.5 rounded-md border ${
                        pat.recommendedVote === 'BIG'
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                          : 'border-red-500/40 bg-red-500/15 text-red-300'
                      }`}
                    >
                      {pat.recommendedVote}
                    </span>
                    <div className="text-[8px] font-mono text-cyan-300 mt-0.5">
                      {pat.score}% Match
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: 24 SERVER ANTI-ALGORITHM & LEAST-PAYOUT SHIELDS */}
      {activeTab === 'antiHouse' && (
        <div className="space-y-2.5 animate-in fade-in duration-300">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-gray-300">
            🛡️ <b>House Algorithm Defense Matrix:</b> Automatically neutralizes Least-Payout Manipulation, High-Roller Elimination, Zero/Five Pivot Boundary Traps, and Churn Controls.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
            {activeShields.map(shield => {
              const isDefending = shield.status === 'DEFENDING';

              return (
                <div
                  key={shield.id}
                  className={`p-3 rounded-2xl border transition-all text-xs font-mono space-y-1.5 ${
                    isDefending
                      ? 'bg-amber-500/10 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : 'bg-emerald-500/5 border-emerald-500/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-orbitron font-bold text-gray-200">
                      <span>{shield.icon}</span>
                      <span className="truncate">{shield.name}</span>
                    </div>

                    <span
                      className={`text-[8px] font-orbitron font-black px-1.5 py-0.5 rounded border ${
                        isDefending
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      {shield.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-gray-400">
                    <b className="text-red-400/90">House Trap:</b> {shield.houseTrap}
                  </div>
                  <div className="text-[10px] text-emerald-300/90">
                    <b className="text-emerald-400">Active Shield:</b> {shield.shieldDefense}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
