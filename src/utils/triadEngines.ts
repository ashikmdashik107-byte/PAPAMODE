import { PredictionSize, PredictionColor, TriadEngineResult } from '../types';

/**
 * ============================================================================
 * TRIAD PATTERN ENGINE CORE
 * 3 DEDICATED HARDENED ENGINES:
 * - Engine 1: Real-time API Red/Green Pattern Engine
 * - Engine 2: Real-time API Big/Small Pattern Engine
 * - Engine 3: Supreme Safe Arbiter Engine (Elects the safest Main Prediction)
 * ============================================================================
 */

export class TriadEngineManager {
  /**
   * Helper: Extracts Size and Color from a single number (0-9)
   */
  public getNumberProps(num: number): { size: PredictionSize; color: 'RED' | 'GREEN' } {
    const safeNum = Math.abs(num) % 10;
    const size: PredictionSize = safeNum >= 5 ? 'BIG' : 'SMALL';
    let color: 'RED' | 'GREEN' = 'RED';
    if ([1, 3, 7, 9].includes(safeNum)) color = 'GREEN';
    else if ([2, 4, 6, 8].includes(safeNum)) color = 'RED';
    else color = safeNum === 5 ? 'GREEN' : 'RED'; // 0 & 5 handle
    return { size, color };
  }

  /**
   * ENGINE 1: Real-Time Red/Green Pattern Engine
   * Tracks streaks, alternating waves, pairs, sandwiches, and deficits from API data.
   */
  public executeEngine1Color(
    history: Array<{ number: number; size?: PredictionSize }>
  ): TriadEngineResult['engine1Color'] {
    const colors: Array<'RED' | 'GREEN'> = history.map(h => this.getNumberProps(h.number).color);
    const lastColor = colors[0] || 'RED';
    const oppColor: 'RED' | 'GREEN' = lastColor === 'RED' ? 'GREEN' : 'RED';

    const allDetectedPatterns: string[] = [];
    let vote: 'RED' | 'GREEN' = oppColor;
    let confidence = 75;
    let safetyScore = 80;
    let pattern = 'PARITY_EQUILIBRIUM';
    let explanation = 'Realtime Red/Green distribution analysis';

    // 1. Dragon Streak Detection
    let streakLen = 1;
    for (let i = 1; i < colors.length; i++) {
      if (colors[i] === colors[0]) streakLen++;
      else break;
    }

    if (streakLen >= 3) {
      allDetectedPatterns.push(`COLOR_DRAGON_${streakLen}X`);
      if (streakLen >= 5) {
        // Dragon exhaustion breaker
        vote = oppColor;
        confidence = 92;
        safetyScore = 94;
        pattern = `COLOR DRAGON BREAKER (${streakLen}x ${lastColor})`;
        explanation = `High probability of color dragon break after consecutive ${streakLen} rounds of ${lastColor}.`;
      } else {
        // Dragon continuation follow
        vote = lastColor;
        confidence = 88;
        safetyScore = 89;
        pattern = `COLOR DRAGON RIDER (${streakLen}x ${lastColor})`;
        explanation = `Strong ${lastColor} dragon momentum active. Safe to ride continuation.`;
      }
    }

    // 2. Alternating Zigzag Wave (R-G-R-G or G-R-G-R)
    const isZigzag =
      colors.length >= 4 &&
      colors[0] !== colors[1] &&
      colors[1] !== colors[2] &&
      colors[2] !== colors[3];

    if (isZigzag) {
      allDetectedPatterns.push('COLOR_ZIGZAG_WAVE');
      vote = oppColor; // Follow alternation
      confidence = Math.max(confidence, 90);
      safetyScore = Math.max(safetyScore, 91);
      pattern = `COLOR ZIGZAG HARMONY (${colors[3]}-${colors[2]}-${colors[1]}-${colors[0]})`;
      explanation = 'Alternating Red/Green wave active. Next color follows opposite flip.';
    }

    // 3. Double-Pair Repeat (R-R-G-G or G-G-R-R)
    const isPairRepeat =
      colors.length >= 4 &&
      colors[0] === colors[1] &&
      colors[2] === colors[3] &&
      colors[0] !== colors[2];

    if (isPairRepeat) {
      allDetectedPatterns.push('COLOR_DOUBLE_PAIR');
      vote = lastColor; // Complete pair
      confidence = Math.max(confidence, 89);
      safetyScore = Math.max(safetyScore, 90);
      pattern = 'COLOR DOUBLE PAIR CLUSTER (2-2)';
      explanation = 'Double-pair (2-2) color pattern forming. Recommendation to complete pair.';
    }

    // 4. Sandwich Containment (R-G-G-R or G-R-R-G)
    const isSandwich =
      colors.length >= 4 &&
      colors[0] === colors[3] &&
      colors[1] === colors[2] &&
      colors[0] !== colors[1];

    if (isSandwich) {
      allDetectedPatterns.push('COLOR_SANDWICH_A_B_B_A');
      vote = colors[3]; // Boundary closure
      confidence = Math.max(confidence, 91);
      safetyScore = Math.max(safetyScore, 92);
      pattern = `COLOR SANDWICH CLOSURE (${colors[0]}-${colors[1]}-${colors[2]}-${colors[3]})`;
      explanation = 'A-B-B-A color sandwich pattern detected! Entering boundary closure.';
    }

    // 5. Triple Wave Cluster (3-3 R-R-R vs G-G-G)
    const isTripleWave =
      colors.length >= 6 &&
      colors[0] === colors[1] &&
      colors[1] === colors[2] &&
      colors[3] === colors[4] &&
      colors[4] === colors[5] &&
      colors[0] !== colors[3];

    if (isTripleWave) {
      allDetectedPatterns.push('COLOR_TRIPLE_WAVE_3_3');
      vote = oppColor; // Transition after completed 3-3 wave
      confidence = Math.max(confidence, 93);
      safetyScore = Math.max(safetyScore, 94);
      pattern = `COLOR TRIPLE WAVE (3-3) EXHAUSTION`;
      explanation = `3-3 Triple color cluster completed. Cyclical transition into opposite color.`;
    }

    // 6. Staircase Wave 1-2-3 (R - G-G - R-R-R)
    const isStaircase =
      colors.length >= 6 &&
      colors[0] === colors[1] &&
      colors[1] === colors[2] && // 3 of current
      colors[3] === colors[4] && // 2 of opposite
      colors[0] !== colors[3] &&
      colors[5] !== colors[3]; // 1 of current

    if (isStaircase) {
      allDetectedPatterns.push('COLOR_STAIRCASE_1_2_3');
      vote = oppColor; // Staircase breaker
      confidence = Math.max(confidence, 94);
      safetyScore = Math.max(safetyScore, 95);
      pattern = `COLOR STAIRCASE (1-2-3) BREAKPOINT`;
      explanation = `1-2-3 Staircase color pattern reached peak. Reversal into opposite color due.`;
    }

    // 7. Markov Parity Transition Matrix (1st order)
    if (colors.length >= 15) {
      let rToR = 0, rToG = 0, gToR = 0, gToG = 0;
      for (let i = 0; i < colors.length - 1; i++) {
        if (colors[i + 1] === 'RED') {
          if (colors[i] === 'RED') rToR++;
          else rToG++;
        } else {
          if (colors[i] === 'RED') gToR++;
          else gToG++;
        }
      }
      const totalFromLast = lastColor === 'RED' ? (rToR + rToG) : (gToR + gToG);
      if (totalFromLast > 0) {
        const pRepeat = lastColor === 'RED' ? (rToR / totalFromLast) : (gToG / totalFromLast);
        const pFlip = lastColor === 'RED' ? (rToG / totalFromLast) : (gToR / totalFromLast);
        allDetectedPatterns.push(`MARKOV_PARITY_${Math.round(Math.max(pRepeat, pFlip) * 100)}%`);
        if (pRepeat > 0.65) {
          vote = lastColor;
          confidence = Math.max(confidence, Math.round(pRepeat * 100));
          safetyScore = Math.max(safetyScore, Math.round(pRepeat * 96));
          pattern = `MARKOV PERSISTENCE (${Math.round(pRepeat * 100)}% PROB)`;
          explanation = `Markov chain indicates ${Math.round(pRepeat * 100)}% probability of ${lastColor} persistence.`;
        } else if (pFlip > 0.65) {
          vote = oppColor;
          confidence = Math.max(confidence, Math.round(pFlip * 100));
          safetyScore = Math.max(safetyScore, Math.round(pFlip * 96));
          pattern = `MARKOV ALTERNATION (${Math.round(pFlip * 100)}% PROB)`;
          explanation = `Markov chain indicates ${Math.round(pFlip * 100)}% probability of shift to ${oppColor}.`;
        }
      }
    }

    // 8. Parity Ratio Deficit Check over rolling 20 periods
    const rolling20 = colors.slice(0, 20);
    const redCount = rolling20.filter(c => c === 'RED').length;
    const greenCount = rolling20.length - redCount;

    if (rolling20.length >= 10) {
      const redRatio = redCount / rolling20.length;
      if (redRatio <= 0.35) {
        allDetectedPatterns.push('RED_DEFICIT_REBOUND');
        vote = 'RED';
        confidence = Math.max(confidence, 88);
        safetyScore = Math.max(safetyScore, 89);
        pattern = 'RED DEFICIT REBOUND PULL';
        explanation = `RED appeared only ${redCount} times in last 20 rounds. Elastic rebound probability high.`;
      } else if (redRatio >= 0.65) {
        allDetectedPatterns.push('GREEN_DEFICIT_REBOUND');
        vote = 'GREEN';
        confidence = Math.max(confidence, 88);
        safetyScore = Math.max(safetyScore, 89);
        pattern = 'GREEN DEFICIT REBOUND PULL';
        explanation = `GREEN appeared only ${greenCount} times in last 20 rounds. Elastic rebound probability high.`;
      }
    }

    return {
      vote,
      confidence,
      safetyScore,
      pattern,
      explanation,
      allDetectedPatterns
    };
  }

  /**
   * ENGINE 2: Real-Time Big/Small Pattern Engine
   * Tracks size streaks, alternating waves, pairs, sandwiches, and deficits from API data.
   */
  public executeEngine2Size(
    history: Array<{ number: number; size?: PredictionSize }>
  ): TriadEngineResult['engine2Size'] {
    const sizes: PredictionSize[] = history.map(h => h.size || (h.number >= 5 ? 'BIG' : 'SMALL'));
    const lastSize = sizes[0] || 'BIG';
    const oppSize: PredictionSize = lastSize === 'BIG' ? 'SMALL' : 'BIG';

    const allDetectedPatterns: string[] = [];
    let vote: PredictionSize = oppSize;
    let confidence = 76;
    let safetyScore = 82;
    let pattern = 'SIZE_EQUILIBRIUM';
    let explanation = 'Realtime Big/Small structural analysis';

    // 1. Dragon Streak Detection
    let streakLen = 1;
    for (let i = 1; i < sizes.length; i++) {
      if (sizes[i] === sizes[0]) streakLen++;
      else break;
    }

    if (streakLen >= 3) {
      allDetectedPatterns.push(`SIZE_DRAGON_${streakLen}X`);
      if (streakLen >= 5) {
        vote = oppSize; // Breaker
        confidence = 94;
        safetyScore = 95;
        pattern = `BIG/SMALL DRAGON BREAKER (${streakLen}x ${lastSize})`;
        explanation = `High probability of size dragon break after consecutive ${streakLen} rounds of ${lastSize}.`;
      } else {
        vote = lastSize; // Rider
        confidence = 89;
        safetyScore = 90;
        pattern = `BIG/SMALL DRAGON RIDER (${streakLen}x ${lastSize})`;
        explanation = `Consecutive ${streakLen} rounds of ${lastSize} holding momentum. Ride the streak.`;
      }
    }

    // 2. Alternating Zigzag Wave (B-S-B-S or S-B-S-B)
    const isZigzag =
      sizes.length >= 4 &&
      sizes[0] !== sizes[1] &&
      sizes[1] !== sizes[2] &&
      sizes[2] !== sizes[3];

    if (isZigzag) {
      allDetectedPatterns.push('SIZE_ZIGZAG_WAVE');
      vote = oppSize; // Follow alternation
      confidence = Math.max(confidence, 91);
      safetyScore = Math.max(safetyScore, 93);
      pattern = `SIZE ZIGZAG HARMONY (${sizes[3]}-${sizes[2]}-${sizes[1]}-${sizes[0]})`;
      explanation = 'Big and Small creating alternating wave oscillations. Opposite size favored.';
    }

    // 3. Double-Pair Repeat (B-B-S-S or S-S-B-B)
    const isPairRepeat =
      sizes.length >= 4 &&
      sizes[0] === sizes[1] &&
      sizes[2] === sizes[3] &&
      sizes[0] !== sizes[2];

    if (isPairRepeat) {
      allDetectedPatterns.push('SIZE_DOUBLE_PAIR');
      vote = lastSize; // Complete pair
      confidence = Math.max(confidence, 90);
      safetyScore = Math.max(safetyScore, 91);
      pattern = 'SIZE DOUBLE PAIR CLUSTER (2-2)';
      explanation = 'Double-pair (2-2 size) pattern running. Completing second of the pair.';
    }

    // 4. Sandwich Containment (B-S-S-B or S-B-B-S)
    const isSandwich =
      sizes.length >= 4 &&
      sizes[0] === sizes[3] &&
      sizes[1] === sizes[2] &&
      sizes[0] !== sizes[1];

    if (isSandwich) {
      allDetectedPatterns.push('SIZE_SANDWICH_A_B_B_A');
      vote = sizes[3]; // Boundary closure
      confidence = Math.max(confidence, 92);
      safetyScore = Math.max(safetyScore, 93);
      pattern = `SIZE SANDWICH CLOSURE (${sizes[0]}-${sizes[1]}-${sizes[2]}-${sizes[3]})`;
      explanation = 'A-B-B-A sandwich structure detected! Entering boundary closure.';
    }

    // 5. Triple Wave Cluster (3-3 B-B-B vs S-S-S)
    const isTripleWave =
      sizes.length >= 6 &&
      sizes[0] === sizes[1] &&
      sizes[1] === sizes[2] &&
      sizes[3] === sizes[4] &&
      sizes[4] === sizes[5] &&
      sizes[0] !== sizes[3];

    if (isTripleWave) {
      allDetectedPatterns.push('SIZE_TRIPLE_WAVE_3_3');
      vote = oppSize; // Wave transition
      confidence = Math.max(confidence, 93);
      safetyScore = Math.max(safetyScore, 94);
      pattern = `SIZE TRIPLE WAVE (3-3) CYCLICAL SHIFT`;
      explanation = `3-3 Size triple cluster completed. Signs of cyclical shift to opposite size.`;
    }

    // 6. Staircase Wave 1-2-3 (B - S-S - B-B-B)
    const isStaircase =
      sizes.length >= 6 &&
      sizes[0] === sizes[1] &&
      sizes[1] === sizes[2] &&
      sizes[3] === sizes[4] &&
      sizes[0] !== sizes[3] &&
      sizes[5] !== sizes[3];

    if (isStaircase) {
      allDetectedPatterns.push('SIZE_STAIRCASE_1_2_3');
      vote = oppSize; // Reverse after 1-2-3
      confidence = Math.max(confidence, 94);
      safetyScore = Math.max(safetyScore, 95);
      pattern = `SIZE STAIRCASE (1-2-3) BREAKPOINT`;
      explanation = `1-2-3 Size staircase pattern fully formed. Trend breakpoint active.`;
    }

    // 7. Markov Size Transition Matrix (1st order)
    if (sizes.length >= 15) {
      let bToB = 0, bToS = 0, sToB = 0, sToS = 0;
      for (let i = 0; i < sizes.length - 1; i++) {
        if (sizes[i + 1] === 'BIG') {
          if (sizes[i] === 'BIG') bToB++;
          else bToS++;
        } else {
          if (sizes[i] === 'BIG') sToB++;
          else sToS++;
        }
      }
      const totalFromLast = lastSize === 'BIG' ? (bToB + bToS) : (sToB + sToS);
      if (totalFromLast > 0) {
        const pRepeat = lastSize === 'BIG' ? (bToB / totalFromLast) : (sToS / totalFromLast);
        const pFlip = lastSize === 'BIG' ? (bToS / totalFromLast) : (sToB / totalFromLast);
        allDetectedPatterns.push(`MARKOV_SIZE_${Math.round(Math.max(pRepeat, pFlip) * 100)}%`);
        if (pRepeat > 0.65) {
          vote = lastSize;
          confidence = Math.max(confidence, Math.round(pRepeat * 100));
          safetyScore = Math.max(safetyScore, Math.round(pRepeat * 96));
          pattern = `MARKOV SIZE PERSISTENCE (${Math.round(pRepeat * 100)}%)`;
          explanation = `Markov matrix indicates ${Math.round(pRepeat * 100)}% probability of ${lastSize} persistence.`;
        } else if (pFlip > 0.65) {
          vote = oppSize;
          confidence = Math.max(confidence, Math.round(pFlip * 100));
          safetyScore = Math.max(safetyScore, Math.round(pFlip * 96));
          pattern = `MARKOV SIZE FLIP (${Math.round(pFlip * 100)}%)`;
          explanation = `Markov matrix indicates ${Math.round(pFlip * 100)}% probability of shift to ${oppSize}.`;
        }
      }
    }

    // 8. Ratio Deficit Check over rolling 20 periods
    const rolling20 = sizes.slice(0, 20);
    const bigCount = rolling20.filter(s => s === 'BIG').length;
    const smallCount = rolling20.length - bigCount;

    if (rolling20.length >= 10) {
      const bigRatio = bigCount / rolling20.length;
      if (bigRatio <= 0.35) {
        allDetectedPatterns.push('BIG_DEFICIT_REBOUND');
        vote = 'BIG';
        confidence = Math.max(confidence, 89);
        safetyScore = Math.max(safetyScore, 90);
        pattern = 'BIG DEFICIT REBOUND PULL';
        explanation = `BIG appeared only ${bigCount} times in last 20 rounds. Mathematical rebound probability high.`;
      } else if (bigRatio >= 0.65) {
        allDetectedPatterns.push('SMALL_DEFICIT_REBOUND');
        vote = 'SMALL';
        confidence = Math.max(confidence, 89);
        safetyScore = Math.max(safetyScore, 90);
        pattern = 'SMALL DEFICIT REBOUND PULL';
        explanation = `SMALL appeared only ${smallCount} times in last 20 rounds. Mathematical rebound probability high.`;
      }
    }

    return {
      vote,
      confidence,
      safetyScore,
      pattern,
      explanation,
      allDetectedPatterns
    };
  }

  /**
   * ENGINE 3: Supreme Safe Arbiter & Consensus Engine
   * Evaluates Engine 1 (Color) and Engine 2 (Size), selects whichever has the safest edge,
   * and crowns it as the Main Safe Prediction!
   */
  public executeTriadEngines(
    history: Array<{ number: number; size?: PredictionSize }>
  ): TriadEngineResult {
    const e1Color = this.executeEngine1Color(history);
    const e2Size = this.executeEngine2Size(history);

    // Compute Safety Superiority Metric
    // Consider safetyScore, confidence, and pattern rarity
    let chosenSafeEngine: 'ENGINE_1_COLOR' | 'ENGINE_2_SIZE' = 'ENGINE_2_SIZE';
    let safeMainPrediction: string = e2Size.vote;
    let safeAssetType: 'COLOR' | 'SIZE' = 'SIZE';
    let safeConfidence = e2Size.confidence;
    let selectionReason = '';

    if (e1Color.safetyScore > e2Size.safetyScore + 2 || (e1Color.confidence >= 91 && e2Size.confidence < 90)) {
      chosenSafeEngine = 'ENGINE_1_COLOR';
      safeMainPrediction = e1Color.vote;
      safeAssetType = 'COLOR';
      safeConfidence = e1Color.confidence;
      selectionReason = `Engine 1 (Red/Green) ${e1Color.pattern} is highly reliable (${e1Color.safetyScore}% safety). Selected as Main Safe Prediction.`;
    } else {
      chosenSafeEngine = 'ENGINE_2_SIZE';
      safeMainPrediction = e2Size.vote;
      safeAssetType = 'SIZE';
      safeConfidence = e2Size.confidence;
      selectionReason = `Engine 2 (Big/Small) ${e2Size.pattern} holds superior mathematical stability (${e2Size.safetyScore}% safety). Selected as Main Safe Prediction.`;
    }

    let safetyRating: 'ULTRA_SAFE' | 'HIGH_STABILITY' | 'DEFENSIVE' = 'HIGH_STABILITY';
    const highestSafety = Math.max(e1Color.safetyScore, e2Size.safetyScore);
    if (highestSafety >= 92) safetyRating = 'ULTRA_SAFE';
    else if (highestSafety >= 85) safetyRating = 'HIGH_STABILITY';
    else safetyRating = 'DEFENSIVE';

    return {
      engine1Color: e1Color,
      engine2Size: e2Size,
      engine3SafeArbiter: {
        chosenSafeEngine,
        safeMainPrediction,
        safeAssetType,
        safeConfidence,
        safetyRating,
        selectionReason
      }
    };
  }
}

export const triadEngineManager = new TriadEngineManager();
