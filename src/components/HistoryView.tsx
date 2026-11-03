import React, { useState } from 'react';
import {
  History,
  Copy,
  Trash2,
  Check,
  ChevronRight
} from 'lucide-react';
import { HistoryRecord, StatsData, ServerMode } from '../types';
import { StreakD3Chart } from './StreakD3Chart';
import {
  formatAllHistoryForClipboard,
  formatPredictionForClipboard,
  copyToClipboard
} from '../utils/formatter';
import { BallDisplay } from '../utils/ballAssets';

interface Props {
  history: HistoryRecord[];
  stats: StatsData;
  activeServer?: ServerMode;
  onClearHistory: () => void;
  onShowToast: (msg: string, color?: string) => void;
  onSwitchServer?: (server: ServerMode) => void;
}

export const HistoryView: React.FC<Props> = ({
  history,
  stats,
  onClearHistory,
  onShowToast
}) => {
  const [filter, setFilter] = useState<'ALL' | 'WIN' | 'LOSS' | 'JACKPOT'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Strictly filter history for BIG_SMALL server records
  const serverHistory = history.filter(item => {
    return !item.serverMode || item.serverMode === 'BIG_SMALL';
  });

  const filtered = serverHistory.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'WIN') return item.status === 'WIN';
    if (filter === 'LOSS') return item.status === 'LOSS';
    if (filter === 'JACKPOT') return item.status === 'JACKPOT';
    return true;
  });

  // Calculate stats specifically for the active server
  const serverWins = serverHistory.filter(h => h.status === 'WIN').length;
  const serverLosses = serverHistory.filter(h => h.status === 'LOSS').length;
  const serverJackpots = serverHistory.filter(h => h.status === 'JACKPOT').length;
  const serverTotal = serverWins + serverLosses + serverJackpots;
  const serverWinRate = serverTotal > 0 ? (((serverWins + serverJackpots) / serverTotal) * 100).toFixed(1) : '0.0';

  let serverCurrentWinStreak = 0;
  for (const h of serverHistory) {
    if (h.status === 'PENDING') continue;
    if (h.status === 'WIN' || h.status === 'JACKPOT') serverCurrentWinStreak++;
    else break;
  }

  let serverMaxLossStreak = 0;
  let tempLoss = 0;
  for (const h of serverHistory) {
    if (h.status === 'PENDING') continue;
    if (h.status === 'LOSS') {
      tempLoss++;
      serverMaxLossStreak = Math.max(serverMaxLossStreak, tempLoss);
    } else {
      tempLoss = 0;
    }
  }

  const handleCopyAll = async () => {
    if (serverHistory.length === 0) {
      onShowToast('No history records available to copy on this server!', '#ffaa00');
      return;
    }
    const text = formatAllHistoryForClipboard(
      serverHistory.map(h => ({
        period: h.period,
        prediction: h.prediction,
        jackpotSeeds: h.jackpotSeeds,
        status: h.status,
        actualNumber: h.actualNumber,
        actualSize: h.actualSize,
        confidence: h.confidence
      }))
    );

    const ok = await copyToClipboard(text);
    if (ok) {
      onShowToast('📋 Full history copied to clipboard!', '#00ff88');
    }
  };

  const handleConfirmClear = () => {
    onClearHistory();
    setShowClearConfirm(false);
    onShowToast('🗑️ All history records successfully cleared!', '#ff2a4b');
  };

  const handleCopyItem = async (record: HistoryRecord) => {
    const text = formatPredictionForClipboard({
      period: record.period,
      prediction: record.prediction,
      jackpotSeeds: record.jackpotSeeds,
      confidence: record.confidence,
      pattern: record.pattern,
      strategy: record.strategy,
      fastingLevel: record.fastingLevel
    });

    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(record.period);
      onShowToast(`📋 #${record.period.slice(-4)} prediction copied!`, '#00ff88');
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  return (
    <div id="history-view-container" className="space-y-3.5 pb-24 select-none animate-in fade-in duration-300">
      {/* 0. ACTIVE SERVER INDICATOR & LOCK BANNER */}
      <div className="p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-md backdrop-blur-xl bg-gradient-to-r from-[#061814] via-[#05141c] to-[#07131b] border-emerald-500/40">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full animate-ping shrink-0 bg-emerald-400" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-gray-300 font-bold uppercase tracking-wider">
              SERVER:
            </span>
            <span className="px-2 py-0.5 rounded-full font-orbitron text-[10px] font-black border bg-emerald-500/20 border-emerald-500/50 text-[#00ff88]">
              SERVER 1 · BIG / SMALL
            </span>
            <span className="text-[9px] font-mono text-cyan-300">
              ({serverHistory.length} ROUNDS)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
          className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300 font-orbitron text-[9px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-sm"
        >
          <Copy className="w-3 h-3 text-amber-300" />
          <span>COPY LOGS</span>
        </button>
      </div>

      {/* 1. TOP PERFORMANCE METRICS */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0c131d] via-[#080d14] to-[#120815] border border-cyan-500/25 p-3.5 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/35 text-cyan-400">
              <History className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="font-orbitron text-xs font-black text-white tracking-wider">
                PREDICTION RADAR LOGS
              </h2>
              <p className="text-[9px] font-mono text-gray-400">
                Live Draw Results & Accuracy Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="copy-all-history-btn"
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-400/25 to-amber-500/25 hover:from-amber-500/40 border-2 border-amber-400/90 text-[10px] font-orbitron font-black text-amber-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,208,0,0.35)] active:scale-95"
            >
              <Copy className="w-3.5 h-3.5 text-amber-300" />
              <span>COPY ALL (VIP)</span>
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all cursor-pointer active:scale-95"
              title="Clear History"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Metric Tiles Grid */}
        <div className="grid grid-cols-4 gap-2 pt-2.5">
          {/* Wins */}
          <div className="p-2 rounded-xl bg-[#091a13] border border-emerald-500/30 text-center">
            <span className="text-emerald-400 text-[8px] font-orbitron font-bold block">WINS</span>
            <span className="font-orbitron text-lg font-black text-[#00ff88]">{serverWins}</span>
          </div>

          {/* Losses */}
          <div className="p-2 rounded-xl bg-[#1c0a11] border border-red-500/30 text-center">
            <span className="text-red-400 text-[8px] font-orbitron font-bold block">LOSSES</span>
            <span className="font-orbitron text-lg font-black text-[#ff2a4b]">{serverLosses}</span>
          </div>

          {/* Jackpots */}
          <div className="p-2 rounded-xl bg-[#140b20] border border-purple-500/30 text-center">
            <span className="text-purple-300 text-[8px] font-orbitron font-bold block">JACKPOT</span>
            <span className="font-orbitron text-lg font-black text-purple-300">{serverJackpots}</span>
          </div>

          {/* Win Rate */}
          <div className="p-2 rounded-xl bg-[#1a1409] border border-amber-500/30 text-center">
            <span className="text-amber-400 text-[8px] font-orbitron font-bold block">WIN RATE</span>
            <span className="font-orbitron text-lg font-black text-amber-300">{serverWinRate}%</span>
          </div>
        </div>
      </div>

      {/* 2. D3 WIN/LOSS STREAK VISUAL TIMELINE */}
      <StreakD3Chart history={serverHistory} />

      {/* 3. FILTER TABS BAR */}
      <div className="p-1 rounded-2xl bg-black/60 border border-white/[0.08] backdrop-blur-xl flex items-center justify-between gap-1 shadow-md">
        {[
          { id: 'ALL' as const, label: 'ALL', count: serverHistory.length },
          { id: 'WIN' as const, label: '🏆 WIN', count: serverWins },
          { id: 'LOSS' as const, label: '❌ LOSS', count: serverLosses },
          { id: 'JACKPOT' as const, label: '👑 JACKPOT', count: serverJackpots }
        ].map(tab => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-1.5 px-1.5 rounded-xl text-center transition-all cursor-pointer font-orbitron text-[9px] font-extrabold flex items-center justify-center gap-1 ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[7px] font-mono px-1 py-0.2 rounded-full ${
                isActive ? 'bg-black/40 text-amber-300' : 'bg-white/[0.06] text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. COMPACT & BEAUTIFUL PERIOD HISTORY BOXES */}
      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-black/40 border border-white/[0.06] rounded-2xl space-y-2">
            <History className="w-8 h-8 text-amber-400/60 mx-auto" />
            <h4 className="font-orbitron font-bold text-xs text-white">
              NO HISTORY RECORDS FOUND
            </h4>
            <p className="text-[10px] font-mono text-gray-400">
              Completed rounds will automatically appear here.
            </p>
          </div>
        ) : (
          filtered.map(item => {
            const isJackpot = item.status === 'JACKPOT';
            const isWin = item.status === 'WIN';
            const isLoss = item.status === 'LOSS';
            const isCopied = copiedId === item.period;
            const isPredBig = item.prediction.toUpperCase().includes('BIG');

            return (
              <div
                key={item.period}
                className={`px-3 py-2 rounded-2xl border transition-all duration-200 relative overflow-hidden backdrop-blur-md flex items-center justify-between gap-2.5 ${
                  isJackpot
                    ? 'bg-[#150d22]/90 border-amber-400/50 shadow-[0_2px_15px_rgba(255,208,0,0.12)]'
                    : isWin
                    ? 'bg-[#08150f]/90 border-emerald-500/35 shadow-[0_2px_12px_rgba(16,185,129,0.1)]'
                    : isLoss
                    ? 'bg-[#17060a]/90 border-red-500/30 shadow-[0_2px_12px_rgba(239,68,68,0.1)]'
                    : 'bg-black/50 border-white/[0.08]'
                }`}
              >
                {/* Left: Period # and Confidence */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="font-orbitron text-xs font-black text-white tracking-wider">
                      #{item.period.slice(-4)}
                    </span>
                    <span className="text-[8px] font-mono text-cyan-300">
                      {item.confidence}%
                    </span>
                  </div>

                  {/* Prediction Pill */}
                  <div className="flex items-center gap-1 pl-2 border-l border-white/[0.08]">
                    <span className="text-[8px] font-mono text-gray-400 uppercase">PRED:</span>
                    <span
                      className={`font-orbitron text-xs font-black ${
                        isPredBig ? 'text-[#00ff88]' : 'text-[#ff2a4b]'
                      }`}
                    >
                      {item.prediction}
                    </span>
                  </div>
                </div>

                {/* Middle: Seeds & Actual Ball */}
                <div className="flex items-center gap-2">
                  {/* Seeds */}
                  <div className="hidden sm:flex items-center gap-1 text-[9px] font-mono text-amber-300">
                    <span className="text-gray-500 text-[8px]">SEEDS:</span>
                    <span>{item.jackpotSeeds[0]} / {item.jackpotSeeds[1]}</span>
                  </div>

                  <ChevronRight className="w-3 h-3 text-gray-600 hidden sm:block" />

                  {/* Actual Draw Result Ball & Size */}
                  <div className="flex items-center gap-1.5">
                    {item.actualNumber !== undefined ? (
                      <BallDisplay
                        num={item.actualNumber}
                        size="sm"
                        glow={isWin || isJackpot}
                      />
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-orbitron text-[9px] text-gray-400">
                        ?
                      </span>
                    )}
                    <span className="font-orbitron text-xs font-bold text-gray-200">
                      {item.actualSize || '—'}
                    </span>
                  </div>
                </div>

                {/* Right: Status Badge (ONLY "WIN", "LOSS", or "JACKPOT") + Quick Copy */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isJackpot ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-black font-orbitron text-[9px] font-black uppercase tracking-wider shadow-[0_0_8px_rgba(255,208,0,0.4)]">
                      JACKPOT
                    </span>
                  ) : isWin ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-[#00ff88] font-orbitron text-[9px] font-black uppercase tracking-wider shadow-sm">
                      WIN
                    </span>
                  ) : isLoss ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/50 text-[#ff2a4b] font-orbitron text-[9px] font-black uppercase tracking-wider shadow-sm">
                      LOSS
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-gray-400 font-orbitron text-[8px] font-bold">
                      PENDING
                    </span>
                  )}

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyItem(item)}
                    title="Copy this round prediction"
                    className="p-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-gray-400 hover:text-amber-300 transition-colors cursor-pointer active:scale-90"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div
          id="clear-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-[#0e0e18] border-2 border-red-500/50 rounded-3xl p-5 max-w-xs w-full text-center shadow-[0_0_60px_rgba(255,42,75,0.45)] space-y-3.5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
              <Trash2 className="w-7 h-7 animate-bounce" />
            </div>

            <div>
              <h3 className="text-sm font-orbitron font-black text-white tracking-wide uppercase">
                CLEAR ALL HISTORY?
              </h3>
              <p className="text-[11px] font-mono text-gray-300 mt-1">
                Are you sure? All {serverHistory.length} round records will be cleared.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-gray-300 font-orbitron text-xs font-bold transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-orbitron text-xs font-black tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
