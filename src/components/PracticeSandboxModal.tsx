import React, { useState } from 'react';
import { X, Play, RotateCcw, Award, Sparkles, TrendingUp, ShieldCheck, Flame, BookOpen } from 'lucide-react';
import { BallDisplay } from '../utils/ballAssets';
import { PredictionSize } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PracticeSandboxModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [practiceBalance, setPracticeBalance] = useState<number>(1000);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [chosenSize, setChosenSize] = useState<PredictionSize>('BIG');
  const [chosenPattern, setChosenPattern] = useState<string>('DRAGON_CONTINUATION');
  const [lastDrawnNumber, setLastDrawnNumber] = useState<number | null>(7);
  const [lastResultStatus, setLastResultStatus] = useState<'WIN' | 'LOSS' | null>(null);
  const [simulationLog, setSimulationLog] = useState<Array<{ round: number; bet: number; choice: PredictionSize; drawn: number; isWin: boolean }>>([]);

  if (!isOpen) return null;

  const handleSimulate = () => {
    // Generate deterministic outcome based on selected pattern practice scenario
    let drawn = Math.floor(Math.random() * 10);
    const isBig = drawn >= 5;
    const isWin = (chosenSize === 'BIG' && isBig) || (chosenSize === 'SMALL' && !isBig);

    const payout = isWin ? betAmount * 1.96 : -betAmount;
    setPracticeBalance(prev => Math.round(prev + payout));
    setLastDrawnNumber(drawn);
    setLastResultStatus(isWin ? 'WIN' : 'LOSS');

    setSimulationLog(prev => [
      {
        round: prev.length + 1,
        bet: betAmount,
        choice: chosenSize,
        drawn,
        isWin
      },
      ...prev.slice(0, 9)
    ]);
  };

  const handleReset = () => {
    setPracticeBalance(1000);
    setBetAmount(10);
    setSimulationLog([]);
    setLastResultStatus(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#070b14] border-2 border-cyan-500/50 rounded-3xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden anim-modal-holo anim-neon-border">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-orbitron font-black text-sm text-white tracking-wider">
                STARTER PATTERN PRACTICE SANDBOX
              </h3>
              <p className="text-[10px] text-cyan-300/80 font-mono">
                Risk-Free Simulation & Strategy Training
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Practice Stats Bar */}
        <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs font-mono">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-[9px] text-gray-400 block">DEMO BALANCE</span>
            <span className="font-orbitron font-black text-emerald-400 text-sm">
              ₹{practiceBalance}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-[9px] text-gray-400 block">CURRENT BET</span>
            <span className="font-orbitron font-black text-amber-400 text-sm">
              ₹{betAmount}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-[9px] text-gray-400 block">LAST RESULT</span>
            <span className={`font-orbitron font-black text-sm ${
              lastResultStatus === 'WIN' ? 'text-emerald-400' : lastResultStatus === 'LOSS' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {lastResultStatus || 'WAITING'}
            </span>
          </div>
        </div>

        {/* Drawn Ball Display in 3D */}
        {lastDrawnNumber !== null && (
          <div className="my-3 p-3 rounded-2xl bg-black/60 border border-white/10 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] font-orbitron font-bold text-gray-400 uppercase mb-2">
              SIMULATED DRAWN BALL
            </span>
            <BallDisplay num={lastDrawnNumber} size="xl" glow pulse={lastResultStatus === 'WIN'} showLabel />
          </div>
        )}

        {/* Pattern & Bet Selector */}
        <div className="space-y-3 my-3">
          <div>
            <label className="text-[10px] font-mono text-gray-400 block mb-1">
              SELECT SIZE BET:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChosenSize('BIG')}
                className={`py-2 px-3 rounded-xl font-orbitron font-black text-xs border transition-all ${
                  chosenSize === 'BIG'
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                BIG (5, 6, 7, 8, 9)
              </button>
              <button
                type="button"
                onClick={() => setChosenSize('SMALL')}
                className={`py-2 px-3 rounded-xl font-orbitron font-black text-xs border transition-all ${
                  chosenSize === 'SMALL'
                    ? 'bg-red-500/25 border-red-400 text-red-300 shadow-[0_0_15px_rgba(255,42,75,0.3)]'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                SMALL (0, 1, 2, 3, 4)
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-gray-400 block mb-1">
              MARTINGALE STEP MULTIPLIER:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[10, 30, 80, 240].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBetAmount(val)}
                  className={`py-1.5 rounded-lg font-mono font-bold text-xs border ${
                    betAmount === val
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleSimulate}
            className="flex-1 py-3 px-4 rounded-xl font-orbitron font-black text-xs uppercase bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-black" /> SIMULATE ROUND
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white"
            title="Reset Balance"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Log */}
        {simulationLog.length > 0 && (
          <div className="mt-3 pt-2 border-t border-white/10 max-h-28 overflow-y-auto font-mono text-[9px] space-y-1">
            {simulationLog.map(log => (
              <div key={log.round} className="flex items-center justify-between px-2 py-0.5 rounded bg-white/[0.02]">
                <span className="text-gray-400">Round #{log.round}</span>
                <span>Bet: {log.choice} (₹{log.bet})</span>
                <span>Drawn: {log.drawn}</span>
                <span className={log.isWin ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {log.isWin ? '+WIN' : '-LOSS'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
