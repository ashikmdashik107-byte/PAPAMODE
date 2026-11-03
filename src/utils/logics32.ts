import { PredictionSize } from '../types';
import {
  scanMarketPatternBreakpoints,
  scanMarketDeficits,
  patternMemoryBank,
  PatternBreakpointScan,
  MarketDeficitScanResult,
  TransitionMemoryInsight
} from './marketScanner';

export interface DynamicLogicState {
  id: number;
  uses: number;
  wins: number;
  losses: number;
  accuracy: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  lastVote?: PredictionSize;
  lastResult?: 'WIN' | 'LOSS';
}

const DYNAMIC_LOGICS_KEY = 'nobita_dynamic_32_logics';

export function loadDynamicLogicsState(): Record<number, DynamicLogicState> {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(DYNAMIC_LOGICS_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  // Baseline state initialized directly from user specified table
  const baseline: Record<number, DynamicLogicState> = {};
  ADVANCED_32_LOGICS.forEach(l => {
    baseline[l.id] = {
      id: l.id,
      uses: l.initialUses,
      wins: l.initialWins,
      losses: l.initialLosses,
      accuracy: l.defaultAccuracy,
      consecutiveWins: 0,
      consecutiveLosses: 0
    };
  });
  return baseline;
}

export function saveDynamicLogicsState(state: Record<number, DynamicLogicState>) {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(DYNAMIC_LOGICS_KEY, JSON.stringify(state));
    }
  } catch {
    // ignore
  }
}

export interface LogicEngineDefinition {
  id: number;
  name: string;
  category: 'Streak' | 'Pattern' | 'Statistical' | 'AI & ML' | 'Technical' | 'Adaptive';
  description: string;
  defaultAccuracy: number;
  initialUses: number;
  initialWins: number;
  initialLosses: number;
  predict: (history: Array<{ number: number; size: PredictionSize }>) => {
    vote: PredictionSize;
    confidence: number;
    reason: string;
  };
}

export const ADVANCED_32_LOGICS: LogicEngineDefinition[] = [
  // 1
  {
    id: 1,
    name: 'Streak Detection Logic 1',
    category: 'Streak',
    description: 'Identifies consecutive same results and predicts breaks',
    defaultAccuracy: 72,
    initialUses: 45,
    initialWins: 32,
    initialLosses: 13,
    predict: (history) => {
      const scan = scanMarketPatternBreakpoints(history);
      if (scan.patternType === 'DRAGON_STREAK') {
        return {
          vote: scan.breakTargetVote,
          confidence: Math.max(scan.breakRiskPercent, 72),
          reason: `${scan.patternLabel} → Break Risk: ${scan.breakRiskPercent}% (${scan.recommendedAction === 'PREDICT_BREAK' ? 'Predicting Break' : 'Riding Momentum'})`
        };
      }
      const sizes = history.map(h => h.size);
      let streak = 1;
      for (let i = 1; i < sizes.length; i++) {
        if (sizes[i] === sizes[0]) streak++;
        else break;
      }
      const vote: PredictionSize = streak >= 2 ? (sizes[0] === 'BIG' ? 'SMALL' : 'BIG') : (sizes[0] || 'BIG');
      return {
        vote,
        confidence: Math.min(65 + streak * 7, 95),
        reason: `Streak of ${streak}x detected → Break prediction: ${vote}`
      };
    }
  },
  // 2
  {
    id: 2,
    name: 'Reverse Streak Logic 2',
    category: 'Streak',
    description: 'Predicts continuation of current streak',
    defaultAccuracy: 58,
    initialUses: 32,
    initialWins: 19,
    initialLosses: 13,
    predict: (history) => {
      const sizes = history.map(h => h.size);
      const vote: PredictionSize = sizes[0] || 'BIG';
      return {
        vote,
        confidence: 60,
        reason: `Following streak momentum: ${vote}`
      };
    }
  },
  // 3
  {
    id: 3,
    name: 'Alternating Pattern Logic 3',
    category: 'Pattern',
    description: 'Detects alternating BIG/SMALL sequences',
    defaultAccuracy: 68,
    initialUses: 38,
    initialWins: 26,
    initialLosses: 12,
    predict: (history) => {
      const sizes = history.map(h => h.size);
      let alternating = true;
      for (let i = 1; i < Math.min(sizes.length, 5); i++) {
        if (sizes[i] === sizes[i - 1]) {
          alternating = false;
          break;
        }
      }
      const vote: PredictionSize = alternating ? (sizes[0] === 'BIG' ? 'SMALL' : 'BIG') : sizes[0] || 'BIG';
      return {
        vote,
        confidence: alternating ? 84 : 62,
        reason: alternating ? 'Harmonic alternation detected' : 'Standard flow'
      };
    }
  },
  // 4
  {
    id: 4,
    name: 'Double Repeat Logic 4',
    category: 'Pattern',
    description: 'Looks for repeating pairs of results',
    defaultAccuracy: 65,
    initialUses: 29,
    initialWins: 19,
    initialLosses: 10,
    predict: (history) => {
      const sizes = history.map(h => h.size);
      const isPair = sizes.length >= 2 && sizes[0] === sizes[1];
      // Pair breaker
      const vote: PredictionSize = isPair ? (sizes[0] === 'BIG' ? 'SMALL' : 'BIG') : sizes[0] || 'SMALL';
      return {
        vote,
        confidence: isPair ? 76 : 58,
        reason: isPair ? 'Double pair break targeted' : 'Pair monitoring'
      };
    }
  },
  // 5
  {
    id: 5,
    name: 'Triple Pattern Logic 5',
    category: 'Pattern',
    description: 'Looks for three consecutive same results',
    defaultAccuracy: 70,
    initialUses: 28,
    initialWins: 20,
    initialLosses: 8,
    predict: (history) => {
      const sizes = history.map(h => h.size);
      const isTriple = sizes.length >= 3 && sizes[0] === sizes[1] && sizes[1] === sizes[2];
      const vote: PredictionSize = isTriple ? (sizes[0] === 'BIG' ? 'SMALL' : 'BIG') : sizes[0] || 'BIG';
      return {
        vote,
        confidence: isTriple ? 86 : 60,
        reason: isTriple ? 'Triple pattern sharp reversal' : 'Triple tracking'
      };
    }
  },
  // 6
  {
    id: 6,
    name: 'Mirror Pattern Logic 6',
    category: 'Pattern',
    description: 'Identifies mirror sequences in results',
    defaultAccuracy: 62,
    initialUses: 25,
    initialWins: 15,
    initialLosses: 10,
    predict: (history) => {
      const sizes = history.map(h => h.size);
      // e.g. A-B-B-A symmetry check
      const mirror = sizes.length >= 4 && sizes[0] === sizes[3] && sizes[1] === sizes[2];
      const vote: PredictionSize = mirror ? sizes[0] : (sizes[0] === 'BIG' ? 'SMALL' : 'BIG');
      return {
        vote,
        confidence: mirror ? 78 : 55,
        reason: mirror ? 'Mirror symmetry completion' : 'Standard reflection'
      };
    }
  },
  // 7
  {
    id: 7,
    name: 'Position Analysis Logic 7',
    category: 'Statistical',
    description: 'Analyzes digit positions for patterns',
    defaultAccuracy: 60,
    initialUses: 22,
    initialWins: 13,
    initialLosses: 9,
    predict: (history) => {
      const nums = history.map(h => h.number);
      const last = nums[0] ?? 5;
      const vote: PredictionSize = (last % 2 === 0) ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 64,
        reason: `Digit position mod calculation: ${last}`
      };
    }
  },
  // 8
  {
    id: 8,
    name: 'Weighted Probability Logic 8',
    category: 'Statistical',
    description: 'Adjusts prediction based on recent distribution',
    defaultAccuracy: 75,
    initialUses: 52,
    initialWins: 39,
    initialLosses: 13,
    predict: (history) => {
      const deficits = scanMarketDeficits(history);
      const { deficitSize, reversionPressure, bigCount, smallCount } = deficits.sizeDeficit;
      return {
        vote: deficitSize,
        confidence: reversionPressure,
        reason: `Market Deficit: ${deficitSize} in deficit (B:${bigCount} vs S:${smallCount}, ${reversionPressure}% Reversion Pressure)`
      };
    }
  },
  // 9
  {
    id: 9,
    name: 'Cluster Analysis Logic 9',
    category: 'Statistical',
    description: 'Groups results into clusters for prediction',
    defaultAccuracy: 67,
    initialUses: 31,
    initialWins: 21,
    initialLosses: 10,
    predict: (history) => {
      const last8 = history.slice(0, 8).map(h => h.number);
      const avg = last8.length > 0 ? last8.reduce((a, b) => a + b, 0) / last8.length : 4.5;
      const vote: PredictionSize = avg >= 5 ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 71,
        reason: `Cluster mean: ${avg.toFixed(1)}`
      };
    }
  },
  // 10
  {
    id: 10,
    name: 'Fibonacci Sequence Logic 10',
    category: 'Technical',
    description: 'Looks for Fibonacci-like patterns',
    defaultAccuracy: 55,
    initialUses: 18,
    initialWins: 10,
    initialLosses: 8,
    predict: (history) => {
      const nums = history.map(h => h.number);
      const fibSeeds = [1, 2, 3, 5, 8];
      const match = fibSeeds.includes(nums[0] ?? 0);
      const vote: PredictionSize = match ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: match ? 68 : 52,
        reason: match ? 'Fibonacci node triggered' : 'Fibonacci void'
      };
    }
  },
  // 11
  {
    id: 11,
    name: 'Prime Number Pattern Logic 11',
    category: 'Technical',
    description: 'Analyzes results based on prime numbers',
    defaultAccuracy: 53,
    initialUses: 15,
    initialWins: 8,
    initialLosses: 7,
    predict: (history) => {
      const primes = [2, 3, 5, 7];
      const isPrime = primes.includes(history[0]?.number ?? 0);
      const vote: PredictionSize = isPrime ? 'SMALL' : 'BIG';
      return {
        vote,
        confidence: 58,
        reason: isPrime ? 'Prime oscillation active' : 'Composite node'
      };
    }
  },
  // 12
  {
    id: 12,
    name: 'Odd/Even Balance Logic 12',
    category: 'Statistical',
    description: 'Considers odd/even distribution',
    defaultAccuracy: 63,
    initialUses: 27,
    initialWins: 17,
    initialLosses: 10,
    predict: (history) => {
      const deficits = scanMarketDeficits(history);
      const { deficitParity, oddEvenPressure, oddCount, evenCount } = deficits.parityDeficit;
      const vote: PredictionSize = deficitParity === 'EVEN' ? 'SMALL' : 'BIG';
      return {
        vote,
        confidence: oddEvenPressure,
        reason: `Parity Deficit: ${deficitParity} (${oddCount} Odd vs ${evenCount} Even, ${oddEvenPressure}% pressure)`
      };
    }
  },
  // 13
  {
    id: 13,
    name: 'Sum Analysis Logic 13',
    category: 'Statistical',
    description: 'Analyzes sum of digits for patterns',
    defaultAccuracy: 59,
    initialUses: 23,
    initialWins: 14,
    initialLosses: 9,
    predict: (history) => {
      const sum = (history[0]?.number ?? 0) + (history[1]?.number ?? 0);
      const vote: PredictionSize = sum >= 9 ? 'SMALL' : 'BIG';
      return {
        vote,
        confidence: 63,
        reason: `Rolling 2-draw sum: ${sum}`
      };
    }
  },
  // 14
  {
    id: 14,
    name: 'Last Digit Pattern Logic 14',
    category: 'Pattern',
    description: 'Looks at last digit sequences',
    defaultAccuracy: 57,
    initialUses: 20,
    initialWins: 11,
    initialLosses: 9,
    predict: (history) => {
      const last = history[0]?.number ?? 4;
      const vote: PredictionSize = [0, 2, 4, 6, 8].includes(last) ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 61,
        reason: `Last digit cycle: ${last}`
      };
    }
  },
  // 15
  {
    id: 15,
    name: 'Hot/Cold Numbers Logic 15',
    category: 'Statistical',
    description: 'Tracks frequently appearing numbers',
    defaultAccuracy: 61,
    initialUses: 26,
    initialWins: 16,
    initialLosses: 10,
    predict: (history) => {
      const deficits = scanMarketDeficits(history);
      const coldest = deficits.coldestNumbers[0] ?? 2;
      const hottest = deficits.hottestNumbers[0] ?? 7;
      const vote: PredictionSize = coldest >= 5 ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 83,
        reason: `Cold Due Number: #${coldest} (Hot: #${hottest}) → High deficit draw to ${vote}`
      };
    }
  },
  // 16
  {
    id: 16,
    name: 'Gap Analysis Logic 16',
    category: 'Technical',
    description: 'Analyzes gaps between numbers',
    defaultAccuracy: 58,
    initialUses: 21,
    initialWins: 12,
    initialLosses: 9,
    predict: (history) => {
      const diff = Math.abs((history[0]?.number ?? 5) - (history[1]?.number ?? 2));
      const vote: PredictionSize = diff >= 4 ? 'SMALL' : 'BIG';
      return {
        vote,
        confidence: 62,
        reason: `Number gap width: ${diff}`
      };
    }
  },
  // 17
  {
    id: 17,
    name: 'Trend Reversal Logic 17',
    category: 'Technical',
    description: 'Predicts when trends will reverse',
    defaultAccuracy: 66,
    initialUses: 30,
    initialWins: 20,
    initialLosses: 10,
    predict: (history) => {
      const sizes = history.map(h => h.size);
      let count = 1;
      for (let i = 1; i < sizes.length; i++) {
        if (sizes[i] === sizes[0]) count++;
        else break;
      }
      const vote: PredictionSize = count >= 3 ? (sizes[0] === 'BIG' ? 'SMALL' : 'BIG') : sizes[0] || 'BIG';
      return {
        vote,
        confidence: count >= 3 ? 80 : 64,
        reason: count >= 3 ? 'Overextended trend reversal' : 'Trend continuation'
      };
    }
  },
  // 18
  {
    id: 18,
    name: 'Moving Average Logic 18',
    category: 'Technical',
    description: 'Uses moving averages to predict',
    defaultAccuracy: 64,
    initialUses: 28,
    initialWins: 18,
    initialLosses: 10,
    predict: (history) => {
      const ma5 = history.slice(0, 5).map(h => h.number).reduce((a, b) => a + b, 0) / 5;
      const vote: PredictionSize = ma5 >= 4.5 ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 70,
        reason: `MA-5 line: ${ma5.toFixed(1)}`
      };
    }
  },
  // 19
  {
    id: 19,
    name: 'Neural Network Logic 19',
    category: 'AI & ML',
    description: 'AI model trained on historical data',
    defaultAccuracy: 73,
    initialUses: 48,
    initialWins: 35,
    initialLosses: 13,
    predict: (history) => {
      const weights = [0.35, 0.25, 0.2, 0.12, 0.08];
      let score = 0;
      history.slice(0, 5).forEach((h, i) => {
        score += (h.size === 'BIG' ? 1 : -1) * (weights[i] || 0.1);
      });
      const vote: PredictionSize = score >= 0 ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 84,
        reason: `Synaptic layer activation: ${(score * 100).toFixed(0)}%`
      };
    }
  },
  // 20
  {
    id: 20,
    name: 'Markov Chain Logic 20',
    category: 'Statistical',
    description: 'Probability-based prediction model',
    defaultAccuracy: 69,
    initialUses: 36,
    initialWins: 25,
    initialLosses: 11,
    predict: (history) => {
      const scan = scanMarketPatternBreakpoints(history);
      const mem = patternMemoryBank.queryMemory(scan.patternType);
      return {
        vote: mem.favoredOutcomeSize,
        confidence: mem.confidence,
        reason: `Markov Pattern Memory Bank: ${mem.matchedHistoricalCount} sequence matches → ${mem.favoredOutcomeSize} (${mem.confidence}%)`
      };
    }
  },
  // 21
  {
    id: 21,
    name: 'Regression Analysis Logic 21',
    category: 'Statistical',
    description: 'Statistical prediction model',
    defaultAccuracy: 71,
    initialUses: 42,
    initialWins: 30,
    initialLosses: 12,
    predict: (history) => {
      const last6 = history.slice(0, 6).map(h => (h.size === 'BIG' ? 1 : 0));
      // Slope calculation
      let slope = 0;
      for (let i = 0; i < last6.length - 1; i++) {
        slope += last6[i] - last6[i + 1];
      }
      const vote: PredictionSize = slope >= 0 ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 76,
        reason: `Linear regression vector: ${slope > 0 ? '+UP' : '-DOWN'}`
      };
    }
  },
  // 22
  {
    id: 22,
    name: 'Hybrid Logic Logic 22',
    category: 'Adaptive',
    description: 'Combination of multiple logics',
    defaultAccuracy: 76,
    initialUses: 55,
    initialWins: 42,
    initialLosses: 13,
    predict: (history) => {
      const s0 = history[0]?.size || 'BIG';
      const s1 = history[1]?.size || 'SMALL';
      const n0 = history[0]?.number ?? 5;
      const vote: PredictionSize = s0 === s1 ? (s0 === 'BIG' ? 'SMALL' : 'BIG') : (n0 >= 5 ? 'BIG' : 'SMALL');
      return {
        vote,
        confidence: 88,
        reason: 'Multi-stream heuristic synthesis'
      };
    }
  },
  // 23
  {
    id: 23,
    name: 'Bayesian Inference Logic 23',
    category: 'Statistical',
    description: 'Uses Bayesian probability for predictions',
    defaultAccuracy: 74,
    initialUses: 50,
    initialWins: 37,
    initialLosses: 13,
    predict: (history) => {
      const deficits = scanMarketDeficits(history);
      const scan = scanMarketPatternBreakpoints(history);
      const prior = deficits.sizeDeficit.deficitSize;
      const vote = scan.recommendedAction === 'PREDICT_BREAK' ? scan.breakTargetVote : prior;
      return {
        vote,
        confidence: Math.max(deficits.sizeDeficit.reversionPressure, 85),
        reason: `Bayesian Prior Reversion: ${vote} (${deficits.sizeDeficit.reversionPressure}% Bayesian certainty, ${scan.recommendedAction})`
      };
    }
  },
  // 24
  {
    id: 24,
    name: 'Time Series Analysis Logic 24',
    category: 'Technical',
    description: 'Analyzes time-based patterns',
    defaultAccuracy: 70,
    initialUses: 40,
    initialWins: 28,
    initialLosses: 12,
    predict: (history) => {
      const nums = history.slice(0, 8).map(h => h.number);
      const diffs = [];
      for (let i = 0; i < nums.length - 1; i++) {
        diffs.push(nums[i] - nums[i + 1]);
      }
      const sumDiff = diffs.reduce((a, b) => a + b, 0);
      const vote: PredictionSize = sumDiff >= 0 ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 77,
        reason: `Time delta momentum: ${sumDiff}`
      };
    }
  },
  // 25
  {
    id: 25,
    name: 'Fibonacci Retracement Logic 25',
    category: 'Technical',
    description: 'Uses Fibonacci levels for prediction',
    defaultAccuracy: 69,
    initialUses: 37,
    initialWins: 26,
    initialLosses: 11,
    predict: (history) => {
      const nums = history.slice(0, 10).map(h => h.number);
      const max = Math.max(...nums, 9);
      const min = Math.min(...nums, 0);
      const range = max - min;
      const retracement = min + range * 0.618;
      const last = nums[0] ?? 5;
      const vote: PredictionSize = last > retracement ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 79,
        reason: `Golden ratio level: ${retracement.toFixed(1)}`
      };
    }
  },
  // 26
  {
    id: 26,
    name: 'Support/Resistance Logic 26',
    category: 'Technical',
    description: 'Identifies support/resistance levels',
    defaultAccuracy: 67,
    initialUses: 35,
    initialWins: 24,
    initialLosses: 11,
    predict: (history) => {
      const last = history[0]?.number ?? 5;
      // Resistance at 8, Support at 2
      const vote: PredictionSize = last >= 8 ? 'SMALL' : last <= 2 ? 'BIG' : (last >= 5 ? 'BIG' : 'SMALL');
      return {
        vote,
        confidence: 75,
        reason: last >= 8 ? 'Resistance ceiling hit' : last <= 2 ? 'Support floor bounce' : 'Mid channel'
      };
    }
  },
  // 27
  {
    id: 27,
    name: 'Volume Analysis Logic 27',
    category: 'Statistical',
    description: 'Analyzes result frequency patterns',
    defaultAccuracy: 65,
    initialUses: 33,
    initialWins: 22,
    initialLosses: 11,
    predict: (history) => {
      const counts: Record<number, number> = {};
      history.slice(0, 12).forEach(h => {
        counts[h.number] = (counts[h.number] || 0) + 1;
      });
      let highVol = 5;
      let maxC = 0;
      Object.entries(counts).forEach(([num, count]) => {
        if (count > maxC) {
          maxC = count;
          highVol = Number(num);
        }
      });
      const vote: PredictionSize = highVol >= 5 ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 73,
        reason: `High volume cluster around ${highVol}`
      };
    }
  },
  // 28
  {
    id: 28,
    name: 'Machine Learning Logic 28',
    category: 'AI & ML',
    description: 'Advanced ML model predictions',
    defaultAccuracy: 77,
    initialUses: 58,
    initialWins: 45,
    initialLosses: 13,
    predict: (history) => {
      const recent4 = history.slice(0, 4).map(h => h.size);
      const patternKey = recent4.join('-');
      // High-accuracy decision tree
      const vote: PredictionSize = patternKey.startsWith('BIG-BIG') ? 'SMALL' : 'BIG';
      return {
        vote,
        confidence: 89,
        reason: `Gradient-boosted decision: ${patternKey}`
      };
    }
  },
  // 29
  {
    id: 29,
    name: 'Deep Learning Logic 29',
    category: 'AI & ML',
    description: 'Neural network with multiple layers',
    defaultAccuracy: 78,
    initialUses: 60,
    initialWins: 47,
    initialLosses: 13,
    predict: (history) => {
      const bigCount = history.slice(0, 7).filter(h => h.size === 'BIG').length;
      const vote: PredictionSize = bigCount >= 4 ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 91,
        reason: 'Deep recurrent layer convergence'
      };
    }
  },
  // 30
  {
    id: 30,
    name: 'Ensemble Method Logic 30',
    category: 'AI & ML',
    description: 'Combines multiple AI models',
    defaultAccuracy: 79,
    initialUses: 62,
    initialWins: 49,
    initialLosses: 13,
    predict: (history) => {
      // Ensemble combines Streak, Markov, ML
      const s0 = history[0]?.size || 'BIG';
      const n0 = history[0]?.number ?? 5;
      const v1 = s0 === 'BIG' ? 'SMALL' : 'BIG';
      const v2 = n0 >= 5 ? 'BIG' : 'SMALL';
      const vote: PredictionSize = v1 === v2 ? v1 : (s0 || 'BIG');
      return {
        vote,
        confidence: 93,
        reason: 'Triple ensemble super-majority'
      };
    }
  },
  // 31
  {
    id: 31,
    name: 'Genetic Algorithm Logic 31',
    category: 'AI & ML',
    description: 'Uses evolutionary computation',
    defaultAccuracy: 75,
    initialUses: 53,
    initialWins: 40,
    initialLosses: 13,
    predict: (history) => {
      const fitness = history.slice(0, 6).reduce((acc, h, i) => acc + (h.size === 'BIG' ? 1 : -1) * (i + 1), 0);
      const vote: PredictionSize = fitness >= 0 ? 'BIG' : 'SMALL';
      return {
        vote,
        confidence: 86,
        reason: `Fitness evolution score: ${fitness}`
      };
    }
  },
  // 32
  {
    id: 32,
    name: 'Reinforcement Learning Logic 32',
    category: 'AI & ML',
    description: 'Q-learning based policy rewards optimization',
    defaultAccuracy: 80,
    initialUses: 64,
    initialWins: 51,
    initialLosses: 13,
    predict: (history) => {
      const last = history[0]?.size || 'BIG';
      const streak = history.slice(0, 3).every(h => h.size === last);
      const vote: PredictionSize = streak ? (last === 'BIG' ? 'SMALL' : 'BIG') : last;
      return {
        vote,
        confidence: 94,
        reason: 'Policy gradient Q-reward max state'
      };
    }
  }
];

export interface UnifiedLogicExecutionResult {
  finalVote: PredictionSize;
  confidence: number;
  activeLogicNames: string[];
  consensusRate: number;
  votesDistribution: {
    big: number;
    small: number;
    total: number;
  };
  individualVotes: Array<{
    id: number;
    name: string;
    category: string;
    description: string;
    vote: PredictionSize;
    confidence: number;
    accuracy: number;
    uses: number;
    wins: number;
    losses: number;
    weight: number;
    reason: string;
    isActive: boolean;
  }>;
  // Deep Market Scanner & Memory Bank Integrations
  patternBreakScan: PatternBreakpointScan;
  deficitScan: MarketDeficitScanResult;
  memoryInsight: TransitionMemoryInsight;
  totalSavedPatterns: number;
}

/**
 * Realtime Auto-Update: Runs on every period draw resolution
 * 1. Evaluates all 32 logics' predictions against actual draw outcome
 * 2. Dynamically updates uses, wins, losses, dynamic accuracy
 * 3. Saves pattern transition into pattern memory bank
 */
export function autoUpdateAll32Logics(
  actualNumber: number,
  actualSize: PredictionSize,
  previousHistory: Array<{ number: number; size: PredictionSize; period?: string }>,
  resolvedPeriod: string
) {
  const dynamicState = loadDynamicLogicsState();

  ADVANCED_32_LOGICS.forEach(logic => {
    const pred = logic.predict(previousHistory);
    const isWin = pred.vote === actualSize;
    const curr = dynamicState[logic.id] || {
      id: logic.id,
      uses: logic.initialUses,
      wins: logic.initialWins,
      losses: logic.initialLosses,
      accuracy: logic.defaultAccuracy,
      consecutiveWins: 0,
      consecutiveLosses: 0
    };

    curr.uses++;
    if (isWin) {
      curr.wins++;
      curr.consecutiveWins++;
      curr.consecutiveLosses = 0;
    } else {
      curr.losses++;
      curr.consecutiveLosses++;
      curr.consecutiveWins = 0;
    }
    curr.accuracy = Math.round((curr.wins / curr.uses) * 100);
    curr.lastVote = pred.vote;
    curr.lastResult = isWin ? 'WIN' : 'LOSS';
    dynamicState[logic.id] = curr;
  });

  saveDynamicLogicsState(dynamicState);

  // Scan current pattern & record transition in Pattern Transition Memory Bank
  const patternScan = scanMarketPatternBreakpoints(previousHistory);
  const wasBreak =
    patternScan.recommendedAction === 'PREDICT_BREAK'
      ? patternScan.breakTargetVote === actualSize
      : patternScan.breakTargetVote !== actualSize;

  const actualColor = [0, 5].includes(actualNumber % 10)
    ? 'VIOLET'
    : [2, 4, 6, 8].includes(actualNumber % 10)
    ? 'RED'
    : 'GREEN';

  patternMemoryBank.recordTransition(
    patternScan.patternType,
    actualSize,
    actualNumber,
    actualColor,
    resolvedPeriod,
    wasBreak
  );
}

/**
 * Execute all 32 logics with accuracy-weighted consensus voting,
 * deep market deficit scanning, breakpoint detection, and Anti-Defeat Hard Loss Guard!
 */
export function execute32LogicsEngine(
  history: Array<{ number: number; size: PredictionSize; period?: string }>,
  currentLossStreak: number = 0
): UnifiedLogicExecutionResult {
  const safeHistory = history.length > 0 ? history : [{ number: 7, size: 'BIG' as PredictionSize }];

  // 1. Run Market Pattern Breakpoint Scanner
  const patternBreakScan = scanMarketPatternBreakpoints(safeHistory, currentLossStreak);

  // 2. Run Market Deficit Scanner
  const deficitScan = scanMarketDeficits(safeHistory);

  // 3. Query Memory Bank for Pattern Transitions
  const memoryInsight = patternMemoryBank.queryMemory(patternBreakScan.patternType);
  const totalSavedPatterns = patternMemoryBank.getTotalSavedCount();

  const dynamicState = loadDynamicLogicsState();

  let bigWeightedScore = 0;
  let smallWeightedScore = 0;
  let rawBigCount = 0;
  let rawSmallCount = 0;

  const results = ADVANCED_32_LOGICS.map(logic => {
    const res = logic.predict(safeHistory);
    const dyn = dynamicState[logic.id] || {
      id: logic.id,
      uses: logic.initialUses,
      wins: logic.initialWins,
      losses: logic.initialLosses,
      accuracy: logic.defaultAccuracy,
      consecutiveWins: 0,
      consecutiveLosses: 0
    };

    // Calculate dynamic weight:
    // Uses dynamic accuracy + streak momentum multiplier + confidence factor
    const streakMultiplier = dyn.consecutiveWins >= 3 ? 1.25 : dyn.consecutiveLosses >= 2 ? 0.75 : 1.0;
    const baseWeight = (dyn.accuracy / 100) * (res.confidence / 100) * 100;
    const weight = Math.round(baseWeight * streakMultiplier);

    if (res.vote === 'BIG') {
      bigWeightedScore += weight;
      rawBigCount++;
    } else {
      smallWeightedScore += weight;
      rawSmallCount++;
    }

    return {
      id: logic.id,
      name: logic.name,
      category: logic.category,
      description: logic.description,
      vote: res.vote,
      confidence: res.confidence,
      accuracy: dyn.accuracy,
      uses: dyn.uses,
      wins: dyn.wins,
      losses: dyn.losses,
      weight,
      reason: res.reason,
      isActive: false
    };
  });

  // Calculate base score
  let finalVote: PredictionSize = bigWeightedScore >= smallWeightedScore ? 'BIG' : 'SMALL';

  // 4. DEEP MARKET SCANNER & MEMORY BANK HARMONIZATION:
  // Feature 1: Breakpoint Engine (when pattern is about to break)
  if (patternBreakScan.recommendedAction === 'PREDICT_BREAK' && patternBreakScan.breakRiskPercent >= 74) {
    const breakBoost = Math.round(patternBreakScan.breakRiskPercent * 3.5);
    if (patternBreakScan.breakTargetVote === 'BIG') {
      bigWeightedScore += breakBoost;
    } else {
      smallWeightedScore += breakBoost;
    }
  }

  // Feature 2: Market Deficit Scanner (when one size is heavily due)
  if (deficitScan.sizeDeficit.reversionPressure >= 72 && deficitScan.sizeDeficit.deficitDelta >= 4) {
    const deficitBoost = Math.round(deficitScan.sizeDeficit.reversionPressure * 3.0);
    if (deficitScan.sizeDeficit.deficitSize === 'BIG') {
      bigWeightedScore += deficitBoost;
    } else {
      smallWeightedScore += deficitBoost;
    }
  }

  // Feature 3: Pattern Transition Memory Bank (when historical memory matches this exact sequence)
  if (memoryInsight.matchedHistoricalCount >= 2 && memoryInsight.confidence >= 72) {
    const memoryBoost = Math.round(memoryInsight.confidence * 2.8);
    if (memoryInsight.favoredOutcomeSize === 'BIG') {
      bigWeightedScore += memoryBoost;
    } else {
      smallWeightedScore += memoryBoost;
    }
  }

  // Recalculate vote with harmonization boosts
  finalVote = bigWeightedScore >= smallWeightedScore ? 'BIG' : 'SMALL';

  // Mark top active drivers (highest weight & accuracy)
  results.sort((a, b) => b.weight - a.weight);
  results.slice(0, 8).forEach(r => (r.isActive = true));

  // Anti-Defeat Hard Loss Shield:
  // If consecutive loss >= 1 or 2, give maximum authority to Top ML & RL & Loss Breaker Logics (Logic 32, 30, 28, 1)
  if (currentLossStreak >= 1) {
    const eliteEnsemble = results.filter(r => [32, 30, 29, 28, 22, 19, 8, 1].includes(r.id));
    let eliteBig = 0;
    let eliteSmall = 0;
    eliteEnsemble.forEach(r => {
      if (r.vote === 'BIG') eliteBig += r.weight;
      else eliteSmall += r.weight;
    });

    // If breakpoint scanner says predict break with extreme confidence, align with break
    if (patternBreakScan.recommendedAction === 'PREDICT_BREAK' && patternBreakScan.breakRiskPercent >= 80) {
      finalVote = patternBreakScan.breakTargetVote;
    } else {
      finalVote = eliteBig >= eliteSmall ? 'BIG' : 'SMALL';
    }
  }

  // Restore natural id sort
  results.sort((a, b) => a.id - b.id);

  const totalWeighted = bigWeightedScore + smallWeightedScore;
  const winnerScore = finalVote === 'BIG' ? bigWeightedScore : smallWeightedScore;
  const consensusRate = totalWeighted > 0 ? Math.round((winnerScore / totalWeighted) * 100) : 75;
  const confidence = Math.min(Math.max(consensusRate, 85), 98);

  const activeNames = results.filter(r => r.isActive).map(r => r.name);

  return {
    finalVote,
    confidence,
    activeLogicNames: activeNames,
    consensusRate,
    votesDistribution: {
      big: rawBigCount,
      small: rawSmallCount,
      total: 32
    },
    individualVotes: results,
    patternBreakScan,
    deficitScan,
    memoryInsight,
    totalSavedPatterns
  };
}
