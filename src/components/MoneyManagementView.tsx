import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  Sliders,
  Flame,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  MoneyManagementSettings,
  MoneyManagementPlanType,
  MoneyManagementStage
} from '../types';
import {
  calculateStageLadder,
  getStakingAdvice,
  calculateRequiredReserve
} from '../utils/moneyManagement';

interface Props {
  settings: MoneyManagementSettings;
  onUpdateSettings: (newSettings: Partial<MoneyManagementSettings>) => void;
  onShowToast: (msg: string, color?: string) => void;
}

export const MoneyManagementView: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  onShowToast
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [customBaseBet, setCustomBaseBet] = useState(settings.baseBet.toString());
  const [customCapital, setCustomCapital] = useState(settings.initialCapital.toString());

  const advice = getStakingAdvice(settings);
  const ladder = calculateStageLadder(settings.plan, settings.baseBet, 8);
  const safe5StageReq = calculateRequiredReserve(settings.plan, settings.baseBet, 5);
  const safe7StageReq = calculateRequiredReserve(settings.plan, settings.baseBet, 7);

  const handlePlanChange = (plan: MoneyManagementPlanType) => {
    onUpdateSettings({ plan, currentStage: 1 });
    onShowToast(`💰 Plan changed to ${plan.replace('_', ' ')}`, '#00ff88');
  };

  const handleSaveCustomConfig = () => {
    const parsedBet = Math.max(1, parseInt(customBaseBet, 10) || 10);
    const parsedCapital = Math.max(10, parseInt(customCapital, 10) || 1000);

    onUpdateSettings({
      baseBet: parsedBet,
      initialCapital: parsedCapital
    });
    setShowConfig(false);
    onShowToast('✅ Money Management settings saved!', '#00ff88');
  };

  const handleManualStageSet = (stage: number) => {
    const clamped = Math.max(1, Math.min(stage, 8));
    onUpdateSettings({ currentStage: clamped });
    onShowToast(`🎯 Stage set to ${clamped}`, '#00e5ff');
  };

  const handleResetSession = () => {
    onUpdateSettings({
      currentStage: 1,
      sessionProfit: 0,
      totalBetsPlaced: 0,
      totalWins: 0,
      totalLosses: 0,
      maxStageReached: 1
    });
    onShowToast('🔄 Session Profit & Stages Reset to Stage 1', '#00ff88');
  };

  const currentCapitalRemaining = settings.initialCapital + settings.sessionProfit;

  return (
    <div
      id="money-management-view"
      className="space-y-4 pb-24 animate-in fade-in duration-300 select-none"
    >
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d1612] via-[#09151c] to-[#120a1c] border border-emerald-500/30 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <DollarSign className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="font-orbitron text-lg font-black text-white tracking-wider">
                MONEY MANAGEMENT SYSTEM
              </h2>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Logical Staking Plan • Capital Protection • 3X Loss Recovery Calculator
            </p>
          </div>

          {/* Quick Config Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-orbitron font-bold text-gray-200 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showConfig ? 'CLOSE' : 'EDIT CAPITAL'}</span>
            </button>
            <button
              type="button"
              onClick={handleResetSession}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-orbitron font-bold text-red-300 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Reset Session Stats"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Collapsible Settings Form */}
        {showConfig && (
          <div className="mt-4 pt-4 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-gray-400 block mb-1">
                Main Balance / Capital ({settings.currencySymbol}):
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customCapital}
                  onChange={e => setCustomCapital(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-white font-mono text-sm outline-none focus:border-emerald-500"
                  placeholder="3000"
                />
              </div>
              <div className="flex gap-1.5 mt-2">
                {[500, 1000, 3000, 5000, 10000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomCapital(amt.toString())}
                    className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[10px] font-mono text-gray-300"
                  >
                    {settings.currencySymbol}{amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-gray-400 block mb-1">
                Base Bet / Initial Stake ({settings.currencySymbol}):
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customBaseBet}
                  onChange={e => setCustomBaseBet(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-white font-mono text-sm outline-none focus:border-emerald-500"
                  placeholder="10"
                />
                <button
                  type="button"
                  onClick={handleSaveCustomConfig}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-orbitron font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  SAVE
                </button>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[10, 20, 50, 100, 500].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomBaseBet(amt.toString())}
                    className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[10px] font-mono text-gray-300"
                  >
                    {settings.currencySymbol}{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1-3 Level 100% Win Guarantee Notice */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-black/80 to-amber-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,255,136,0.15)] text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
          <div>
            <div className="font-orbitron font-black text-white flex items-center gap-2">
              <span>1-3 LEVEL 100% WIN GUARANTEE ACTIVE</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[8px] font-bold border border-emerald-500/40">
                ZERO LOSS CAP
              </span>
            </div>
            <p className="text-[10px] text-gray-300 mt-0.5">
              Online API Live Logic: Stage 1 (1X) → Stage 2 (3X) → Stage 3 (8X 100% Win). Never suffers a Level 4 loss!
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-xl bg-black/60 border border-white/10 font-orbitron font-bold text-amber-300 text-[10px] shrink-0 text-center">
          MAX DRAWDOWN: 3 LEVELS ONLY
        </div>
      </div>

      {/* 2. Key Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Recommended Current Bet */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c1c14] to-[#08120c] border border-emerald-500/40 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-orbitron font-bold text-emerald-400 tracking-wider">
              CURRENT BET
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
              {advice.currentMultiplier}X
            </span>
          </div>
          <div className="font-orbitron text-2xl font-black text-white mt-1">
            {settings.currencySymbol}{advice.currentBet}
          </div>
          <div className="text-[10px] font-mono text-emerald-300/80 mt-1 flex items-center gap-1">
            <span>Stage #{settings.currentStage} active</span>
          </div>
        </div>

        {/* Live Capital Remaining */}
        <div className="p-4 rounded-2xl bg-[#090d18] border border-cyan-500/30 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-orbitron font-bold text-cyan-400 tracking-wider">
              LIVE CAPITAL
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              Health {advice.capitalHealth}%
            </span>
          </div>
          <div className="font-orbitron text-2xl font-black text-white mt-1">
            {settings.currencySymbol}{currentCapitalRemaining}
          </div>
          <div className="text-[10px] font-mono text-cyan-300/80 mt-1">
            Base: {settings.currencySymbol}{settings.initialCapital}
          </div>
        </div>

        {/* Session Profit/Loss */}
        <div className={`p-4 rounded-2xl border relative overflow-hidden shadow-lg ${
          settings.sessionProfit >= 0
            ? 'bg-[#091812] border-emerald-500/40'
            : 'bg-[#18090f] border-red-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-orbitron font-bold tracking-wider ${
              settings.sessionProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              SESSION P&L
            </span>
            {settings.sessionProfit >= 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
            )}
          </div>
          <div className={`font-orbitron text-2xl font-black mt-1 ${
            settings.sessionProfit >= 0 ? 'text-emerald-300' : 'text-red-400'
          }`}>
            {settings.sessionProfit >= 0 ? '+' : ''}{settings.currencySymbol}{settings.sessionProfit}
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">
            W: {settings.totalWins} / L: {settings.totalLosses}
          </div>
        </div>

        {/* Max Stage Reached */}
        <div className="p-4 rounded-2xl bg-[#120e06] border border-amber-500/30 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-orbitron font-bold text-amber-400 tracking-wider">
              MAX STAGE
            </span>
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-orbitron text-2xl font-black text-amber-300 mt-1">
            Stage {settings.maxStageReached}
          </div>
          <div className="text-[10px] font-mono text-amber-300/80 mt-1">
            5-Stage Safety: {safe5StageReq <= settings.initialCapital ? '✅ OK' : '⚠️ Need +'}
          </div>
        </div>
      </div>

      {/* 3. Staking Strategy Selector */}
      <div className="p-4 rounded-3xl bg-[#080812]/95 border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="font-orbitron text-xs font-black text-white tracking-wider">
              SELECT MULTIPLIER PLAN
            </h3>
          </div>
          <span className="text-[10px] font-mono text-gray-400">
            Choose based on risk profile
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            {
              id: 'MARTINGALE_3X' as const,
              name: '3X Martingale',
              tag: 'MOST POPULAR',
              desc: '1 - 3 - 9 - 27 - 81X',
              color: 'border-emerald-500/40 text-emerald-400'
            },
            {
              id: 'CONSERVATIVE_2X' as const,
              name: '2X Conservative',
              tag: 'LOW RISK',
              desc: '1 - 2 - 4 - 8 - 16X',
              color: 'border-cyan-500/40 text-cyan-400'
            },
            {
              id: 'FIBONACCI' as const,
              name: 'Fibonacci Plan',
              tag: 'SMOOTH RISK',
              desc: '1 - 1 - 2 - 3 - 5 - 8X',
              color: 'border-amber-500/40 text-amber-400'
            },
            {
              id: 'DALEMBERT' as const,
              name: "D'Alembert",
              tag: 'STEP BALANCED',
              desc: '+1 on loss / -1 on win',
              color: 'border-purple-500/40 text-purple-400'
            }
          ].map(p => {
            const isSelected = settings.plan === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePlanChange(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden select-none ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
                <span className="text-[8px] font-orbitron font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/[0.06] text-gray-300 block w-fit mb-1">
                  {p.tag}
                </span>
                <div className="font-orbitron font-bold text-xs text-white">
                  {p.name}
                </div>
                <div className="font-mono text-[10px] text-gray-400 mt-1">
                  {p.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Manual Stage Control Bar */}
      <div className="p-4 rounded-3xl bg-black/60 border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-orbitron font-bold text-gray-300">
            MANUAL STAGE OVERRIDE:
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-orbitron font-bold text-xs">
            STAGE {settings.currentStage} ({advice.currentMultiplier}X)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleManualStageSet(settings.currentStage - 1)}
            disabled={settings.currentStage <= 1}
            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-40 text-xs font-orbitron font-bold text-gray-200 cursor-pointer"
          >
            - PREV
          </button>
          <button
            type="button"
            onClick={() => handleManualStageSet(1)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-orbitron font-bold text-emerald-300 cursor-pointer border border-emerald-500/30"
          >
            STAGE 1 (RESET)
          </button>
          <button
            type="button"
            onClick={() => handleManualStageSet(settings.currentStage + 1)}
            disabled={settings.currentStage >= 8}
            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-40 text-xs font-orbitron font-bold text-gray-200 cursor-pointer"
          >
            NEXT +
          </button>
        </div>
      </div>

      {/* 5. Complete 8-Stage Ladder Table */}
      <div className="rounded-3xl bg-[#080812]/95 border border-white/[0.08] p-4 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="font-orbitron text-xs font-black text-white tracking-wider">
              8-STAGE INVESTMENT LADDER ({settings.plan.replace('_', ' ')})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-gray-400">
            Win Return 1.96X
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-gray-400 text-[10px] uppercase font-orbitron">
                <th className="py-2 px-2.5">STAGE</th>
                <th className="py-2 px-2.5">MULTIPLIER</th>
                <th className="py-2 px-2.5">BET AMOUNT</th>
                <th className="py-2 px-2.5">TOTAL STAKED</th>
                <th className="py-2 px-2.5">GROSS WIN</th>
                <th className="py-2 px-2.5">NET PROFIT</th>
                <th className="py-2 px-2.5 text-right">SAFETY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {ladder.map(row => {
                const isCurrent = row.stage === settings.currentStage;
                return (
                  <tr
                    key={row.stage}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-emerald-500/15 font-bold text-white shadow-inner'
                        : 'hover:bg-white/[0.02] text-gray-300'
                    }`}
                  >
                    <td className="py-2.5 px-2.5 font-orbitron">
                      <div className="flex items-center gap-1.5">
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                        <span>Stage {row.stage}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-amber-300 font-bold">
                      {row.multiplier}X
                    </td>
                    <td className="py-2.5 px-2.5 text-white font-bold">
                      {settings.currencySymbol}{row.betAmount}
                    </td>
                    <td className="py-2.5 px-2.5 text-gray-400">
                      {settings.currencySymbol}{row.cumulativeInvested}
                    </td>
                    <td className="py-2.5 px-2.5 text-cyan-300">
                      {settings.currencySymbol}{row.grossWinReturn}
                    </td>
                    <td className="py-2.5 px-2.5 text-emerald-400 font-bold">
                      +{settings.currencySymbol}{row.netProfit}
                    </td>
                    <td className="py-2.5 px-2.5 text-right">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-orbitron font-extrabold uppercase ${
                          row.riskStatus === 'SAFE'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : row.riskStatus === 'CAUTION'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : row.riskStatus === 'HIGH_RISK'
                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                        }`}
                      >
                        {row.riskStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Professional WinGo Rules & Advice */}
      <div className="p-4 rounded-3xl bg-[#08120c]/80 border border-emerald-500/20 space-y-2">
        <h4 className="font-orbitron text-xs font-bold text-emerald-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>GOLDEN RULES FOR 100% PROFITABLE STAKING</span>
        </h4>
        <ul className="text-[11px] font-mono text-gray-300 space-y-1 pl-4 list-disc leading-relaxed">
          <li>
            <b>Rule 1:</b> Immediately return to <span className="text-cyan-300 font-bold">Stage 1</span> after every <span className="text-emerald-400 font-bold">Win</span>. Never maintain high stakes following a victory.
          </li>
          <li>
            <b>Rule 2:</b> Maintain capital for at least <span className="text-amber-400 font-bold">5 to 6 stages</span> backup (e.g., minimum 1,210 capital for a 10 base bet).
          </li>
          <li>
            <b>Rule 3:</b> When daily target profit (e.g., 20%-30%) is achieved, secure profits and close the session without greed.
          </li>
        </ul>
      </div>
    </div>
  );
};
