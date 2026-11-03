import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { PredictionSize } from '../types';
import { BallDisplay } from '../utils/ballAssets';

interface Props {
  recentHistory: Array<{ number: number; size: PredictionSize }>;
  currentPrediction: PredictionSize;
}

export const TrendChart: React.FC<Props> = ({ recentHistory, currentPrediction }) => {
  const last10 = recentHistory.slice(0, 10).reverse();
  const bigCount = last10.filter(r => r.size === 'BIG').length;
  const smallCount = last10.length - bigCount;

  return (
    <div
      id="trend-chart-section"
      className="rounded-2xl bg-black/40 border border-white/[0.06] p-3.5 backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-orbitron font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5" /> LIVE TREND CHART (LAST 10)
        </span>
        <span className="text-[9px] font-mono text-gray-300 font-semibold px-2 py-0.5 rounded-md bg-white/[0.05]">
          B: <span className="text-emerald-400 font-bold">{bigCount}</span> / S: <span className="text-red-400 font-bold">{smallCount}</span>
        </span>
      </div>

      {/* Bars & 3D Balls */}
      <div className="h-20 flex items-end justify-between gap-1 px-2 pt-2 border-b border-white/[0.06]">
        {last10.length === 0 ? (
          <div className="w-full text-center text-xs text-gray-500 font-mono py-4">
            Syncing live API trend data...
          </div>
        ) : (
          last10.map((r, idx) => {
            const isBig = r.size === 'BIG';
            const barHeight = Math.max(12, (r.number + 1) * 3.8);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <BallDisplay num={r.number} size="sm" glow={false} />
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    isBig
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                      : 'bg-red-500 shadow-[0_0_8px_rgba(255,42,75,0.3)]'
                  }`}
                  style={{ height: `${barHeight}px` }}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Pattern Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3 overflow-x-auto py-1">
        {last10.map((r, idx) => {
          const isBig = r.size === 'BIG';
          return (
            <div
              key={idx}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-orbitron font-bold border ${
                isBig
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                  : 'border-red-500 bg-red-500/15 text-red-400'
              }`}
            >
              {isBig ? 'B' : 'S'}
            </div>
          );
        })}
        <span className="text-gray-500 text-xs">→</span>
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-orbitron font-black border-2 border-dashed animate-pulse ${
            currentPrediction === 'BIG'
              ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300'
              : 'border-red-400 bg-red-500/25 text-red-300'
          }`}
          title="Upcoming Prediction"
        >
          {currentPrediction === 'BIG' ? 'B' : 'S'}
        </div>
      </div>
    </div>
  );
};
