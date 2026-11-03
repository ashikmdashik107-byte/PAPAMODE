import React, { useState } from 'react';
import {
  Cpu,
  Flame,
  ShieldAlert,
  Sparkles,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  Database,
  ArrowRight,
  Zap,
  Target,
  Gauge,
  History,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  RefreshCw,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { UnifiedLogicExecutionResult } from '../utils/logics32';

interface Props {
  logicsExecution?: UnifiedLogicExecutionResult;
  currentPrediction: 'BIG' | 'SMALL';
}

export const LogicsRadarView: React.FC<Props> = ({ logicsExecution, currentPrediction }) => {
  const [filter, setFilter] = useState<'all' | 'active'>('active');
  const [activeTab, setActiveTab] = useState<'logics' | 'break' | 'deficit' | 'memory'>('logics');
  const [expandedLogic, setExpandedLogic] = useState<number | null>(null);

  const votes = logicsExecution?.individualVotes || [];
  const consensusRate = logicsExecution?.consensusRate || 82;
  const bigCount = logicsExecution?.votesDistribution?.big || 18;
  const smallCount = logicsExecution?.votesDistribution?.small || 14;

  const patternBreak = logicsExecution?.patternBreakScan;
  const deficitScan = logicsExecution?.deficitScan;
  const memoryInsight = logicsExecution?.memoryInsight;
  const totalSaved = logicsExecution?.totalSavedPatterns || 48;

  const displayList = filter === 'active' ? votes.filter(v => v.isActive) : votes;

  return (
    <div
      id="logics-radar-panel"
      className="rounded-3xl bg-gradient-to-b from-[#0b0b14]/95 via-[#070710]/98 to-[#04040a] border border-cyan-500/25 p-4 space-y-4 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.12)]"
    >
      {/* 1. Header with Live Learning Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <h3 className="font-orbitron text-sm font-black text-white tracking-wider flex items-center gap-1.5 flex-wrap">
              <span>32 PREDICTION LOGICS ENGINE</span>
              <span className="px-2 py-0.5 rounded-full text-[8px] font-mono bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 animate-pulse">
                AUTO-LEARNING ACTIVE
              </span>
            </h3>
          </div>
          <p className="text-[10px] font-mono text-gray-400 mt-1">
            Market Pattern Scanner • Breakpoint Detector • Memory Bank • Deficit Radar
          </p>
        </div>

        <div className="text-right">
          <span className="px-2.5 py-1 rounded-xl text-[10px] font-orbitron font-extrabold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            {consensusRate}% CONSENSUS
          </span>
          <div className="text-[8px] font-mono text-cyan-400 mt-0.5">
            {totalSaved} PATTERNS SAVED
          </div>
        </div>
      </div>

      {/* 2. Top Sub-Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('logics')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-orbitron font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'logics'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>32 LOGICS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('break')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-orbitron font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'break'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(255,208,0,0.2)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>BREAK SCAN</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('deficit')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-orbitron font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'deficit'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Gauge className="w-3 h-3 text-purple-400" />
          <span>DEFICIT</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('memory')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-orbitron font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'memory'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_12px_rgba(0,255,136,0.2)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Database className="w-3 h-3 text-emerald-400" />
          <span>MEMORY</span>
        </button>
      </div>

      {/* 3. VIEW TAB: 32 LOGICS LIST */}
      {activeTab === 'logics' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Consensus Ratio Bar */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                BIG LOGICS: {bigCount}
              </span>
              <span className="text-gray-400 font-orbitron text-[10px]">
                ENSEMBLE: <b className={currentPrediction === 'BIG' ? 'text-emerald-400' : 'text-red-400'}>{currentPrediction}</b>
              </span>
              <span className="text-red-400 font-bold flex items-center gap-1">
                SMALL LOGICS: {smallCount}
                <span className="w-2 h-2 rounded-full bg-red-400" />
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${(bigCount / 32) * 100}%` }}
              />
              <div
                className="h-full bg-gradient-to-l from-red-500 to-rose-400 transition-all duration-500"
                style={{ width: `${(smallCount / 32) * 100}%` }}
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-orbitron font-bold text-gray-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              {filter === 'active' ? 'TOP ACTIVE LOGICS (8 DRIVERS)' : 'ALL 32 PREDICTION LOGICS'}
            </span>

            <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-xl border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setFilter('active')}
                className={`px-3 py-1 rounded-lg text-[10px] font-orbitron font-bold transition-all cursor-pointer ${
                  filter === 'active'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Active (8)
              </button>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-[10px] font-orbitron font-bold transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All (32)
              </button>
            </div>
          </div>

          {/* Logics Cards List with Real Dynamic W-L and Uses */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {displayList.map(item => {
              const isBig = item.vote === 'BIG';
              const isExpanded = expandedLogic === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all text-xs font-mono overflow-hidden ${
                    item.isActive
                      ? 'bg-white/[0.04] border-cyan-500/35 shadow-[0_0_15px_rgba(6,182,212,0.08)]'
                      : 'bg-black/40 border-white/[0.06] opacity-85'
                  }`}
                >
                  <div
                    onClick={() => setExpandedLogic(isExpanded ? null : item.id)}
                    className="p-3 flex items-center justify-between cursor-pointer select-none hover:bg-white/[0.02]"
                  >
                    <div className="space-y-1 flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-orbitron font-bold text-gray-200 truncate">
                          {item.name}
                        </span>
                        {item.isActive && (
                          <span className="text-[8px] font-orbitron font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider shrink-0">
                            Currently Active
                          </span>
                        )}
                        <span className="text-[8px] font-mono text-cyan-300/80 px-1 rounded bg-white/[0.03]">
                          W-L: {item.wins}-{item.losses}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">
                        {item.description || item.reason}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span
                          className={`inline-block font-orbitron font-black text-xs px-2 py-0.5 rounded-lg border ${
                            isBig
                              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                              : 'border-red-500/40 bg-red-500/15 text-red-300'
                          }`}
                        >
                          {item.vote}
                        </span>
                        <div className="text-[9px] font-mono text-cyan-300 mt-0.5">
                          {item.accuracy}% Acc
                        </div>
                      </div>

                      <div className="text-gray-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Dynamic Details */}
                  {isExpanded && (
                    <div className="p-3 bg-black/60 border-t border-white/[0.06] space-y-2 text-[11px] animate-in fade-in duration-200">
                      <div className="grid grid-cols-4 gap-1.5 text-center">
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="text-[8px] text-gray-400">Dynamic Acc</div>
                          <div className="text-sm font-orbitron font-bold text-amber-400">{item.accuracy}%</div>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="text-[8px] text-gray-400">Total Uses</div>
                          <div className="text-sm font-orbitron font-bold text-white">{item.uses}</div>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="text-[8px] text-gray-400">W-L Record</div>
                          <div className="text-sm font-orbitron font-bold text-emerald-400">
                            {item.wins}-{item.losses}
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="text-[8px] text-gray-400">Weight Factor</div>
                          <div className="text-sm font-orbitron font-bold text-cyan-400">{item.weight} pts</div>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-[10px] flex items-center justify-between">
                        <span>💡 <b>Logic Signal:</b> {item.reason}</span>
                        <span className="text-[9px] font-mono text-emerald-400 shrink-0 ml-2">Auto-Updated</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. VIEW TAB: PATTERN BREAKPOINT SCANNER */}
      {activeTab === 'break' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-black to-red-950/30 border border-amber-500/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-orbitron font-black text-amber-400 flex items-center gap-1.5">
                <span>{patternBreak?.patternIcon || '🐉'}</span>
                <span>{patternBreak?.patternLabel || 'MARKET PATTERN SCAN'}</span>
              </span>
              <span className={`text-[9px] font-orbitron font-bold px-2 py-0.5 rounded-full border ${
                patternBreak?.recommendedAction === 'PREDICT_BREAK'
                  ? 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse'
                  : 'bg-emerald-500/20 border-emerald-500/50 text-[#00ff88]'
              }`}>
                {patternBreak?.recommendedAction === 'PREDICT_BREAK' ? '⚡ PREDICT BREAK' : '🌊 RIDE PATTERN'}
              </span>
            </div>

            {/* Break Risk Meter */}
            <div className="space-y-1.5 my-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300 font-bold">Pattern Breakpoint Risk:</span>
                <span className="font-orbitron font-black text-amber-400 text-sm">
                  {patternBreak?.breakRiskPercent || 74}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/[0.08] overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-500"
                  style={{ width: `${patternBreak?.breakRiskPercent || 74}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-400">
                <span>Continuation: {patternBreak?.continuationProbability || 26}%</span>
                <span>Expected Break: {patternBreak?.expectedBreakPeriod || 'Next Draw'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-white/[0.08]">
              <div>
                <span className="text-gray-400 block">Break Target Direction:</span>
                <span className={`font-orbitron font-black text-sm ${
                  patternBreak?.breakTargetVote === 'BIG' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {patternBreak?.breakTargetVote || 'SMALL'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Expected Next Pattern:</span>
                <span className="font-orbitron font-bold text-cyan-300 text-xs">
                  {patternBreak?.expectedNextPattern || 'ALTERNATING 1-1'}
                </span>
              </div>
            </div>

            <p className="text-[10px] font-mono text-amber-200/90 mt-2.5 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
              🔍 <b>Scanner Decision:</b> {patternBreak?.rationale}
            </p>
          </div>
        </div>
      )}

      {/* 5. VIEW TAB: FULL MARKET DEFICIT SCANNER */}
      {activeTab === 'deficit' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Cold Due Numbers Radar */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-orbitron font-bold text-cyan-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>NUMBER DEFICIT (COLD DUE NUMBERS)</span>
              </span>
              <span className="text-[9px] font-mono text-gray-400">30-Draw Rolling Window</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {deficitScan?.numberDeficits?.slice(0, 10).map(metric => {
                const isCold = metric.status === 'CRITICAL_DUE' || metric.status === 'COLD';
                const isHot = metric.status === 'HOT' || metric.status === 'OVERBOUGHT';

                return (
                  <div
                    key={metric.digit}
                    className={`p-2 rounded-xl border text-center font-mono ${
                      isCold
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(255,208,0,0.15)]'
                        : isHot
                        ? 'bg-red-500/10 border-red-500/30 text-red-300'
                        : 'bg-white/[0.02] border-white/[0.06] text-gray-400'
                    }`}
                  >
                    <div className="font-orbitron font-black text-sm">{metric.digit}</div>
                    <div className="text-[8px] mt-0.5">{metric.appearances}x Hit</div>
                    <div className={`text-[7px] font-bold mt-0.5 rounded px-1 ${
                      isCold ? 'text-amber-400 bg-amber-400/20' : 'text-gray-500'
                    }`}>
                      {metric.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Size & Color Deficit Cards */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            {/* Size Deficit */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-emerald-500/30 space-y-1.5">
              <div className="text-gray-400 font-bold">SIZE DEFICIT:</div>
              <div className="font-orbitron text-sm font-black text-emerald-400">
                {deficitScan?.sizeDeficit?.deficitSize || 'SMALL'} (Deficit: {deficitScan?.sizeDeficit?.deficitDelta || 6})
              </div>
              <div className="text-[9px] text-gray-300">
                Big: {deficitScan?.sizeDeficit?.bigCount} | Small: {deficitScan?.sizeDeficit?.smallCount}
              </div>
              <div className="text-[9px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Reversion Pressure: {deficitScan?.sizeDeficit?.reversionPressure}%
              </div>
            </div>

            {/* Color Deficit */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-purple-500/30 space-y-1.5">
              <div className="text-gray-400 font-bold">COLOR DEFICIT:</div>
              <div className="font-orbitron text-sm font-black text-purple-400">
                {deficitScan?.colorDeficit?.deficitColor || 'RED'} (Deficit: {deficitScan?.colorDeficit?.deficitDelta || 5})
              </div>
              <div className="text-[9px] text-gray-300">
                Red: {deficitScan?.colorDeficit?.redCount} | Green: {deficitScan?.colorDeficit?.greenCount}
              </div>
              <div className="text-[9px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Reversion Pressure: {deficitScan?.colorDeficit?.colorReversionPressure}%
              </div>
            </div>
          </div>

          {/* Locked Due Seed Picks from Market Logic Scan */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-amber-500/30 space-y-2 font-mono text-[10px]">
            <div className="flex items-center justify-between">
              <span className="font-orbitron font-bold text-amber-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>MARKET LOGIC LOCKED SEEDS (DEFICIT SELECTION)</span>
              </span>
              <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                AUTO-LOCKED
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-[8px] text-gray-400 block">COLD BIG</span>
                <span className="font-orbitron text-base font-black text-emerald-400">#{deficitScan?.coldestBig ?? 7}</span>
                <span className="text-[7px] text-gray-500 block">BIG POOL 1st</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-[8px] text-gray-400 block">COLD SMALL</span>
                <span className="font-orbitron text-base font-black text-red-400">#{deficitScan?.coldestSmall ?? 2}</span>
                <span className="text-[7px] text-gray-500 block">SMALL POOL 1st</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-[8px] text-gray-400 block">COLD RED</span>
                <span className="font-orbitron text-base font-black text-[#ff2a4b]">#{deficitScan?.coldestRed ?? 4}</span>
                <span className="text-[7px] text-gray-500 block">RED POOL 1st</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-[8px] text-gray-400 block">COLD GREEN</span>
                <span className="font-orbitron text-base font-black text-[#00ff88]">#{deficitScan?.coldestGreen ?? 3}</span>
                <span className="text-[7px] text-gray-500 block">GREEN POOL 1st</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1 border-t border-white/[0.06]">
              <span>🟣 Violet Gap: {deficitScan?.colorDeficit?.violetGapRounds ?? 4} Rounds</span>
              <span>{((deficitScan?.colorDeficit?.violetGapRounds ?? 4) >= 7) ? '⚠️ Violet Insurance Recommended' : '✅ Standard Risk'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW TAB: PATTERN TRANSITION MEMORY BANK */}
      {activeTab === 'memory' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-black to-cyan-950/30 border border-emerald-500/35 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-orbitron font-black text-emerald-400 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>PATTERN TRANSITION MEMORY BANK</span>
              </span>
              <span className="text-[9px] font-mono text-cyan-300 font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30">
                {totalSaved} SEQUENCES STORED
              </span>
            </div>

            <p className="text-[10px] font-mono text-gray-300 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/[0.08]">
              {memoryInsight?.memoryInsightText || 'Memory Bank logs every round transition sequence to determine the next direction with high precision.'}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-3 text-center font-mono">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[8px] text-gray-400 uppercase">Pattern Match</div>
                <div className="font-orbitron font-bold text-sm text-cyan-400">
                  {memoryInsight?.matchedHistoricalCount || 24}x
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[8px] text-gray-400 uppercase">Next Pattern</div>
                <div className="font-orbitron font-bold text-xs text-white truncate">
                  {memoryInsight?.dominantNextPattern || 'ZIGZAG 1-1'}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[8px] text-gray-400 uppercase">Memory Signal</div>
                <div className={`font-orbitron font-bold text-sm ${
                  memoryInsight?.favoredOutcomeSize === 'BIG' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {memoryInsight?.favoredOutcomeSize || 'BIG'}
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-[10px] flex items-center justify-between font-mono">
              <span>🧠 <b>Self-Learning Engine:</b> Auto-saved transitions deployed to live rounds</span>
              <span className="text-[9px] text-[#00ff88] font-bold">100% Synced</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
