import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';
import { TriadEngineResult } from '../types';

interface Props {
  triadResult?: TriadEngineResult;
}

export const TriadEnginesCard: React.FC<Props> = ({ triadResult }) => {
  if (!triadResult) return null;

  const { engine1Color, engine2Size, engine3SafeArbiter } = triadResult;
  const isColorSafe = engine3SafeArbiter.chosenSafeEngine === 'ENGINE_1_COLOR';

  return (
    <div
      id="triad-engines-card"
      className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#0a0f1d]/98 via-[#060a14]/98 to-[#02050b] border-2 border-cyan-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.18)] space-y-4 relative overflow-hidden select-none"
    >
      {/* Background Accent Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-md">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-orbitron text-base sm:text-lg font-black text-white tracking-wider flex items-center gap-2">
              <span>TRIAD CORE AI ENGINES</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[10px] font-mono">
                3 DEDICATED ENGINES
              </span>
            </h3>
            <p className="text-[11px] font-mono text-gray-400">
              Engine 1 (Color) • Engine 2 (Size) • Engine 3 (Supreme Safe Arbiter)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-orbitron font-extrabold text-[10px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>3/3 ONLINE</span>
          </span>
        </div>
      </div>

      {/* Engine 1 & Engine 2 Side-by-Side Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* ENGINE 1: RED/GREEN PATTERN TRACKER */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isColorSafe
              ? 'bg-[#150a1a]/90 border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
              : 'bg-white/[0.02] border-white/[0.08]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-red-500/20 text-red-300 text-[10px] font-orbitron font-bold">
                E-1
              </span>
              <span className="font-orbitron font-bold text-xs text-white">
                COLOR ENGINE
              </span>
            </div>

            <span className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-[9px] font-mono font-bold text-cyan-300">
              SAFETY: {engine1Color.safetyScore}%
            </span>
          </div>

          <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-xl border border-white/[0.06] mb-2">
            <div>
              <span className="text-[9px] font-mono text-gray-400 block uppercase">Prediction:</span>
              <span
                className={`font-orbitron font-black text-lg ${
                  engine1Color.vote === 'GREEN' ? 'text-[#00ff88]' : 'text-[#ff2a4b]'
                }`}
              >
                {engine1Color.vote}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-gray-400 block uppercase">Confidence:</span>
              <span className="font-orbitron font-black text-sm text-amber-300">
                {engine1Color.confidence}%
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono space-y-1">
            <span className="text-purple-300 font-bold block truncate">
              🎯 {engine1Color.pattern}
            </span>
            <p className="text-gray-400 line-clamp-2 leading-relaxed">
              {engine1Color.explanation}
            </p>
          </div>
        </div>

        {/* ENGINE 2: BIG/SMALL PATTERN TRACKER */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            !isColorSafe
              ? 'bg-[#0a151b]/90 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
              : 'bg-white/[0.02] border-white/[0.08]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-orbitron font-bold">
                E-2
              </span>
              <span className="font-orbitron font-bold text-xs text-white">
                SIZE ENGINE
              </span>
            </div>

            <span className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-[9px] font-mono font-bold text-cyan-300">
              SAFETY: {engine2Size.safetyScore}%
            </span>
          </div>

          <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-xl border border-white/[0.06] mb-2">
            <div>
              <span className="text-[9px] font-mono text-gray-400 block uppercase">Prediction:</span>
              <span
                className={`font-orbitron font-black text-lg ${
                  engine2Size.vote === 'BIG' ? 'text-[#00ff88]' : 'text-[#ff2a4b]'
                }`}
              >
                {engine2Size.vote}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-gray-400 block uppercase">Confidence:</span>
              <span className="font-orbitron font-black text-sm text-amber-300">
                {engine2Size.confidence}%
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono space-y-1">
            <span className="text-cyan-300 font-bold block truncate">
              🎯 {engine2Size.pattern}
            </span>
            <p className="text-gray-400 line-clamp-2 leading-relaxed">
              {engine2Size.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* ENGINE 3: SUPREME SAFE ARBITER */}
      <div
        id="engine-3-safe-arbiter"
        className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#0e1626]/95 to-emerald-500/15 border-2 border-amber-400/50 shadow-[0_0_30px_rgba(255,208,0,0.2)] relative overflow-hidden space-y-2.5"
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <h4 className="font-orbitron font-black text-sm text-white tracking-wider">
                ENGINE 3: SUPREME SAFE ARBITER
              </h4>
              <span className="text-[10px] font-mono text-amber-300 block">
                {isColorSafe
                  ? 'Engine 1 (Color) identified as highest statistical stability'
                  : 'Engine 2 (Size) identified as highest statistical stability'}
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-orbitron font-black text-xs">
            {engine3SafeArbiter.safetyRating}
          </span>
        </div>

        {/* Selected Main Safe Prediction Highlight Banner */}
        <div className="p-3 rounded-xl bg-black/80 border border-amber-400/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-left font-mono">
              <span className="text-[10px] text-gray-400 block font-orbitron">
                🏆 CHOSEN SAFE PREDICTION:
              </span>
              <span
                className={`font-orbitron font-black text-2xl drop-shadow-md ${
                  engine3SafeArbiter.safeMainPrediction === 'BIG' || engine3SafeArbiter.safeMainPrediction === 'GREEN'
                    ? 'text-[#00ff88]'
                    : 'text-[#ff2a4b]'
                }`}
              >
                {engine3SafeArbiter.safeMainPrediction}
              </span>
            </div>

            <span className="text-xs font-mono text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-400/30">
              {engine3SafeArbiter.safeAssetType === 'COLOR' ? 'COLOR / PARITY' : 'SIZE (BIG/SMALL)'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono text-gray-400 block">ACCURACY:</span>
            <span className="font-orbitron font-black text-base text-amber-300">
              {engine3SafeArbiter.safeConfidence}%
            </span>
          </div>
        </div>

        <p className="text-[11px] font-mono text-gray-300 leading-relaxed bg-white/[0.02] p-2 rounded-xl border border-white/[0.05]">
          💡 <b>Arbiter Rationale:</b> {engine3SafeArbiter.selectionReason}
        </p>
      </div>
    </div>
  );
};
