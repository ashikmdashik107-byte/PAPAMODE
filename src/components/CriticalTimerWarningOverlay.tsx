import React from 'react';
import { AlertTriangle, Lock, ShieldAlert } from 'lucide-react';

interface Props {
  remainingSeconds: number;
  period: string;
}

export const CriticalTimerWarningOverlay: React.FC<Props> = ({
  remainingSeconds,
  period
}) => {
  // Only render when countdown is 5 seconds or less (5, 4, 3, 2, 1, 0)
  if (remainingSeconds > 5) return null;

  const isZero = remainingSeconds === 0;

  return (
    <div
      id="critical-timer-warning-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-none select-none"
    >
      {/* Crisp Solid Red Screen Perimeter - Lag-free, zero heavy CSS animations */}
      <div className="absolute inset-0 border-2 border-red-500/60 pointer-events-none" />

      {/* Main Center Warning HUD Card */}
      <div
        id="critical-warning-card"
        className="relative w-full max-w-sm rounded-3xl bg-[#0e0104] border-2 border-red-500/90 p-5 text-center shadow-[0_0_40px_rgba(255,20,50,0.45)] overflow-hidden"
      >
        {/* Top Warning Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

        {/* Warning Badge & Header */}
        <div className="mt-1 flex items-center justify-center gap-2 mb-2">
          <span className="p-1.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </span>
          <div className="text-left">
            <span className="font-orbitron font-black text-sm text-red-400 tracking-wider block">
              FINAL 5 SECONDS
            </span>
            <span className="text-[10px] font-mono text-red-300 font-bold block">
              BETTING WINDOW LOCKED
            </span>
          </div>
        </div>

        {/* Alert Notice Banner */}
        <div className="my-2 py-1.5 px-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 font-mono text-[11px] font-bold">
          ⚠️ BETTING CLOSED • PREPARING DRAW OUTCOME
        </div>

        {/* High-visibility Static Countdown (Zero Animation Lag) */}
        <div className="py-3 relative">
          <div
            className="font-orbitron text-7xl sm:text-8xl font-black text-red-500 tracking-widest relative z-10 select-none drop-shadow-[0_0_20px_rgba(255,0,50,0.8)]"
          >
            {isZero ? '00' : `0${remainingSeconds}`}
          </div>

          <div className="mt-1 font-orbitron font-bold text-xs tracking-[3px] text-red-300 uppercase flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>{isZero ? 'REVEALING RESULT...' : 'SECONDS LEFT'}</span>
          </div>
        </div>

        {/* Visual Progress Bar - Clean transition */}
        <div className="w-full bg-black/80 rounded-full h-2 p-0.5 border border-red-500/40 overflow-hidden my-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-600 to-amber-500"
            style={{ width: `${Math.max(8, (remainingSeconds / 5) * 100)}%` }}
          />
        </div>

        {/* Target Period & Lock State */}
        <div className="mt-2.5 pt-2 border-t border-red-500/30 flex items-center justify-between text-[11px] font-mono text-gray-300">
          <span className="flex items-center gap-1 text-red-300 font-semibold">
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>LOCKED</span>
          </span>
          <span className="font-orbitron font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            #{period.slice(-4) || period}
          </span>
        </div>

        {/* Bottom Warning Strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
      </div>
    </div>
  );
};
