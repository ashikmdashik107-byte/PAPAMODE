import { MoneyManagementPlanType, MoneyManagementSettings, MoneyManagementStage } from '../types';

export const WIN_ODDS_MULTIPLIER = 1.96; // 2X minus 2% standard platform fee

export const DEFAULT_MM_SETTINGS: MoneyManagementSettings = {
  enabled: true,
  plan: 'MARTINGALE_3X',
  baseBet: 10,
  initialCapital: 3000,
  currentStage: 1,
  sessionProfit: 0,
  totalBetsPlaced: 0,
  totalWins: 0,
  totalLosses: 0,
  maxStageReached: 1,
  takeProfitTarget: 1500,
  stopLossLimit: 2000,
  currencySymbol: '₹',
  autoSyncWithRounds: true
};

export const FIBONACCI_MULTIPLIERS = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
export const MARTINGALE_3X_MULTIPLIERS = [1, 3, 9, 27, 81, 243, 729, 2187];
export const CONSERVATIVE_2X_MULTIPLIERS = [1, 2, 4, 8, 16, 32, 64, 128];
export const DALEMBERT_MULTIPLIERS = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Calculates the complete 8-stage breakdown table for the given plan and base bet
 */
export function calculateStageLadder(
  plan: MoneyManagementPlanType,
  baseBet: number,
  maxStages = 8
): MoneyManagementStage[] {
  const ladder: MoneyManagementStage[] = [];
  let cumulative = 0;

  for (let s = 1; s <= maxStages; s++) {
    let mult = 1;
    if (plan === 'MARTINGALE_3X') {
      mult = MARTINGALE_3X_MULTIPLIERS[s - 1] ?? Math.pow(3, s - 1);
    } else if (plan === 'CONSERVATIVE_2X') {
      mult = CONSERVATIVE_2X_MULTIPLIERS[s - 1] ?? Math.pow(2, s - 1);
    } else if (plan === 'FIBONACCI') {
      mult = FIBONACCI_MULTIPLIERS[s - 1] ?? 1;
    } else if (plan === 'DALEMBERT') {
      mult = s;
    }

    const betAmount = Math.round(baseBet * mult);
    cumulative += betAmount;
    const grossReturn = Math.round(betAmount * WIN_ODDS_MULTIPLIER);
    const netProfit = grossReturn - cumulative;

    let riskStatus: 'SAFE' | 'CAUTION' | 'HIGH_RISK' | 'CRITICAL' = 'SAFE';
    if (s >= 6) riskStatus = 'CRITICAL';
    else if (s >= 4) riskStatus = 'HIGH_RISK';
    else if (s >= 3) riskStatus = 'CAUTION';

    ladder.push({
      stage: s,
      multiplier: mult,
      betAmount,
      cumulativeInvested: cumulative,
      grossWinReturn: grossReturn,
      netProfit,
      riskStatus
    });
  }

  return ladder;
}

/**
 * Calculates total capital required to safely withstand N loss stages
 */
export function calculateRequiredReserve(plan: MoneyManagementPlanType, baseBet: number, stages = 6): number {
  const ladder = calculateStageLadder(plan, baseBet, stages);
  return ladder[ladder.length - 1]?.cumulativeInvested || baseBet * 50;
}

/**
 * Computes live Staking Advice based on current settings and stage
 */
export function getStakingAdvice(settings: MoneyManagementSettings) {
  const ladder = calculateStageLadder(settings.plan, settings.baseBet, 8);
  const currentStageIdx = Math.max(1, Math.min(settings.currentStage, ladder.length)) - 1;
  const currentStageData = ladder[currentStageIdx] || ladder[0];

  const nextWinStage = ladder[0]; // Reset to Stage 1 on Win
  const nextLossStageIdx = Math.min(currentStageIdx + 1, ladder.length - 1);
  const nextLossStage = ladder[nextLossStageIdx];

  const requiredSafeCapital = calculateRequiredReserve(settings.plan, settings.baseBet, 5);
  const capitalHealth = Math.min(
    100,
    Math.round((settings.initialCapital / Math.max(1, requiredSafeCapital)) * 100)
  );

  return {
    currentStage: settings.currentStage,
    currentBet: currentStageData.betAmount,
    currentMultiplier: currentStageData.multiplier,
    cumulativeRisk: currentStageData.cumulativeInvested,
    potentialNetProfit: currentStageData.netProfit,
    riskStatus: currentStageData.riskStatus,
    nextBetIfWin: nextWinStage.betAmount,
    nextBetIfLoss: nextLossStage.betAmount,
    nextStageIfLoss: nextLossStage.stage,
    requiredSafeCapital,
    capitalHealth,
    isStopLossReached: settings.sessionProfit <= -settings.stopLossLimit,
    isTakeProfitReached: settings.sessionProfit >= settings.takeProfitTarget
  };
}

/**
 * Applies game result (WIN / LOSS) to Money Management state
 */
export function applyRoundOutcomeToMM(
  prevSettings: MoneyManagementSettings,
  outcome: 'WIN' | 'LOSS'
): MoneyManagementSettings {
  if (!prevSettings.enabled) return prevSettings;

  const ladder = calculateStageLadder(prevSettings.plan, prevSettings.baseBet, 8);
  const currentStageIdx = Math.max(1, Math.min(prevSettings.currentStage, ladder.length)) - 1;
  const currentStageData = ladder[currentStageIdx] || ladder[0];

  const betStaked = currentStageData.betAmount;

  if (outcome === 'WIN') {
    const grossWon = Math.round(betStaked * WIN_ODDS_MULTIPLIER);
    const roundNetProfit = grossWon - betStaked;

    return {
      ...prevSettings,
      currentStage: 1, // Reset to stage 1 upon winning!
      sessionProfit: prevSettings.sessionProfit + roundNetProfit,
      totalBetsPlaced: prevSettings.totalBetsPlaced + 1,
      totalWins: prevSettings.totalWins + 1
    };
  } else {
    // LOSS
    const nextStage = Math.min(prevSettings.currentStage + 1, ladder.length);
    return {
      ...prevSettings,
      currentStage: nextStage,
      maxStageReached: Math.max(prevSettings.maxStageReached, nextStage),
      sessionProfit: prevSettings.sessionProfit - betStaked,
      totalBetsPlaced: prevSettings.totalBetsPlaced + 1,
      totalLosses: prevSettings.totalLosses + 1
    };
  }
}
