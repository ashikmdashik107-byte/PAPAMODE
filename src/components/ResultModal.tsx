import React, { useState, useEffect, useRef } from 'react';
import { Target, Copy, Check, X, Shield, Crown } from 'lucide-react';
import { HistoryRecord } from '../types';
import { formatPredictionForClipboard, copyToClipboard } from '../utils/formatter';
import { triggerJackpotCelebration, triggerWinCelebration } from '../utils/confetti';
import { BallDisplay } from '../utils/ballAssets';
import { EagleWing } from './EagleWings';

interface Props {
  record: HistoryRecord | null;
  onClose: () => void;
  onShowToast: (msg: string, color?: string) => void;
}

export const ResultModal: React.FC<Props> = ({ record, onClose, onShowToast }) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!record) return;

    const timer = setTimeout(() => {
      if (record.status === 'JACKPOT') {
        triggerJackpotCelebration(canvasRef.current);
      } else if (record.status === 'WIN') {
        triggerWinCelebration(canvasRef.current);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [record]);

  if (!record) return null;

  const isJackpot = record.status === 'JACKPOT';
  const isWin = record.status === 'WIN';
  const isLoss = record.status === 'LOSS';

  const handleCopy = async () => {
    const text = formatPredictionForClipboard({
      period: record.period,
      prediction: record.prediction,
      jackpotSeeds: record.jackpotSeeds,
      confidence: record.confidence,
      pattern: record.pattern,
      strategy: record.strategy,
      fastingLevel: record.fastingLevel
    });

    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      onShowToast('📋 VIP Prediction Copied Successfully!', '#00ff88');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="result-popup-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Celebration Confetti Canvas */}
      <canvas
        ref={canvasRef}
        id="result-celebration-canvas"
        className="fixed inset-0 pointer-events-none w-full h-full z-10"
      />

      {/* Main Wrapper with Left & Right Majestic Eagle Wings */}
      <div className="relative w-full max-w-sm z-20 flex items-center justify-center">
        {/* Left Eagle Wing Flanking Popup */}
        <EagleWing
          side="left"
          className="absolute -left-12 sm:-left-24 top-1/2 -translate-y-1/2 w-20 sm:w-36 h-40 sm:h-72 z-10 opacity-90 sm:opacity-100"
        />

        {/* Right Eagle Wing Flanking Popup */}
        <EagleWing
          side="right"
          className="absolute -right-12 sm:-right-24 top-1/2 -translate-y-1/2 w-20 sm:w-36 h-40 sm:h-72 z-10 opacity-90 sm:opacity-100"
        />

        {/* Holographic Glowing Frame */}
        <div
          className={`w-full rounded-3xl p-1 relative overflow-hidden transition-all duration-300 shadow-2xl z-20 ${
            isJackpot
              ? 'bg-gradient-to-br from-amber-300 via-purple-500 to-amber-500 shadow-[0_0_60px_rgba(255,208,0,0.7),0_0_100px_rgba(168,85,247,0.4)]'
              : isWin
              ? 'bg-gradient-to-br from-emerald-400 via-cyan-400 to-emerald-600 shadow-[0_0_60px_rgba(0,255,136,0.6),0_0_90px_rgba(6,182,212,0.35)]'
              : 'bg-gradient-to-br from-red-500 via-rose-700 to-red-600 shadow-[0_0_55px_rgba(255,42,75,0.55)]'
          }`}
        >
          {/* Inner Card Container */}
          <div className="bg-[#090209]/98 rounded-[22px] p-4 sm:p-5 text-center relative overflow-hidden border border-white/[0.08]">
            {/* Top Close Button */}
            <button
              type="button"
              id="close-result-modal-btn"
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-white bg-white/[0.06] hover:bg-white/[0.15] transition-colors cursor-pointer z-30 active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Ambient Radial Flare */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full filter blur-3xl opacity-40 pointer-events-none ${
                isJackpot ? 'bg-amber-400' : isWin ? 'bg-emerald-400' : 'bg-red-500'
              }`}
            />

            {/* Animated Cyber Badge Icon */}
            <div className="relative mx-auto mb-2 flex items-center justify-center">
              {isJackpot ? (
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-amber-400/50 blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-[0_0_35px_rgba(255,208,0,0.6)] border-2 border-amber-200">
                    <Crown className="w-9 h-9 text-black" />
                  </div>
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-black text-amber-300 text-[8px] font-orbitron font-black border border-amber-400">
                    9X HIT
                  </span>
                </div>
              ) : isWin ? (
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-emerald-400/50 blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,136,0.5)] border-2 border-emerald-200">
                    <Target className="w-9 h-9 text-black" />
                  </div>
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-black text-[#00ff88] text-[8px] font-orbitron font-black border border-emerald-400">
                    WIN
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-red-500/40 blur-xl" />
                  <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-red-600 via-rose-700 to-red-900 flex items-center justify-center shadow-[0_0_30px_rgba(255,42,75,0.4)] border-2 border-red-300">
                    <Shield className="w-9 h-9 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-black text-red-400 text-[8px] font-orbitron font-black border border-red-500">
                    RECOVERY
                  </span>
                </div>
              )}
            </div>

            {/* Title & Status */}
            <h2
              id="result-modal-title"
              className={`font-orbitron text-xl sm:text-2xl font-black tracking-wider uppercase drop-shadow-md ${
                isJackpot
                  ? 'text-amber-300 text-glow-gold'
                  : isWin
                  ? 'text-[#00ff88] text-glow-green'
                  : 'text-[#ff2a4b] text-glow-red'
              }`}
            >
              {isJackpot ? '🎰 JACKPOT WIN! 🎰' : isWin ? '⚡ VICTORY WIN! ⚡' : '🛡️ LOSS RECOVERY 🛡️'}
            </h2>

            <div className="inline-block px-3 py-0.5 rounded-full bg-white/[0.05] border border-white/10 font-mono text-[10px] text-gray-300 mt-1 mb-2.5">
              PERIOD #{record.period.slice(-4)}
            </div>

            {/* VIP Copy Button: Positioned ABOVE the numbers / prediction section */}
            <button
              type="button"
              id="modal-copy-prediction-btn"
              onClick={handleCopy}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:brightness-110 active:scale-98 text-white font-orbitron font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(255,42,75,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer mb-3"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-amber-300" />}
              <span>{copied ? 'COPIED TO CLIPBOARD!' : '📋 COPY PREDICTION (VIP FONT)'}</span>
            </button>

            {/* Details Grid: Predicted vs Actual Result */}
            {/* Shows BOTH prediction numbers (2 tai dekhabe) */}
            <div className="grid grid-cols-2 gap-2 bg-black/75 border border-white/[0.08] rounded-2xl p-2.5 mb-3 shadow-inner">
              {/* Predicted Column (Shows BOTH prediction numbers) */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[8px] font-orbitron font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">
                  PREDICTED
                </span>
                <span
                  className={`font-orbitron text-base sm:text-lg font-black tracking-wider ${
                    record.prediction === 'BIG' ? 'text-[#00ff88]' : 'text-[#ff2a4b]'
                  }`}
                >
                  {record.prediction}
                </span>

                {/* BOTH PREDICTION NUMBERS SHOWCASE */}
                <div className="my-1 flex items-center justify-center gap-1.5">
                  <BallDisplay num={record.jackpotSeeds[0]} size="sm" glow levitate />
                  <span className="text-gray-500 font-mono text-xs">⟷</span>
                  <BallDisplay num={record.jackpotSeeds[1]} size="sm" glow levitate />
                </div>

                <span className="text-[9px] font-mono text-amber-300 font-bold">
                  NUMBERS: {record.jackpotSeeds[0]} ⟷ {record.jackpotSeeds[1]}
                </span>
              </div>

              {/* Actual Outcome Column */}
              <div className="flex flex-col items-center justify-center text-center border-l border-white/[0.08]">
                <span className="text-[8px] font-orbitron font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">
                  ACTUAL DRAW
                </span>
                <span className="font-orbitron text-base sm:text-lg font-black text-white">
                  {record.actualSize || '—'}
                </span>

                {record.actualNumber !== undefined ? (
                  <div className="my-1">
                    <BallDisplay
                      num={record.actualNumber}
                      size="sm"
                      glow={isWin || isJackpot}
                      pulse={isJackpot}
                    />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono my-1">
                    ?
                  </div>
                )}

                <span className={`text-[8px] sm:text-[9px] font-orbitron font-extrabold ${
                  isJackpot ? 'text-amber-300' : isWin ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {isJackpot ? '9× JACKPOT HIT' : isWin ? 'WINNER' : 'NEXT STAGE'}
                </span>
              </div>
            </div>

            {/* Tactical Advice & Notice */}
            {isJackpot ? (
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-400/50 text-amber-300 text-[10px] font-orbitron font-bold mb-3 shadow-[0_0_12px_rgba(255,208,0,0.2)]">
                🔥 EXACT SEED #{record.actualNumber} HIT! 9X JACKPOT MULTIPLIER UNLOCKED!
              </div>
            ) : isWin ? (
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-orbitron font-bold mb-3">
                ✅ AI QUANTUM PREDICTION WON! PROFIT SECURED!
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-[10px] font-orbitron font-bold mb-3">
                ⚠️ LOSS RECOVERY: STAGE 2 (3X MULTIPLIER) APPLIED FOR NEXT ROUND
              </div>
            )}

            {/* Continue Round Button */}
            <button
              type="button"
              id="modal-ack-btn"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-gray-300 font-orbitron text-xs tracking-wider uppercase transition-colors cursor-pointer active:scale-95"
            >
              CONTINUE NEXT ROUND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
