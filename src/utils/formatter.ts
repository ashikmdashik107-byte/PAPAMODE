/**
 * Fancy Unicode Typography Formatter for NOBITA X PRIME
 * Converts plain letters to bold math sans / serif / aesthetic unicode characters
 */

const FANCY_BOLD_SANS_MAP: Record<string, string> = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
  'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
  'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
  'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
  's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
};

// Mathematical Bold Serif Map for Prediction Copy (𝐀, 𝐁, 𝐂... 𝟎, 𝟏...)
const FANCY_BOLD_SERIF_MAP: Record<string, string> = {
  'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈',
  'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑',
  'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
  'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢',
  'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫',
  's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
  '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
};

export function toFancyBold(text: string): string {
  return text.split('').map(char => FANCY_BOLD_SANS_MAP[char] || char).join('');
}

export function toBoldSerif(text: string): string {
  return text.split('').map(char => FANCY_BOLD_SERIF_MAP[char] || char).join('');
}

export interface PredictionCopyPayload {
  period: string;
  prediction: string;
  jackpotSeeds: [number, number];
  confidence?: number;
  pattern?: string;
  strategy?: string;
  fastingLevel?: number;
  bannerTitle?: string;
  shopLink?: string;
}

/**
 * Requirement 9: Exact VIP Prediction Copy Format
 * 
 * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃      👑  𝐍𝐎𝐁𝐈𝐓𝐀  𝐗 𝐏𝐑𝐈𝐌𝐄 𝐌𝐎𝐃𝐙  👑 
 * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 * 
 * 🎯  𝐏𝐄𝐑𝐈𝐎𝐃    »  𝟎𝟒𝟑𝟗
 * 💎  𝐏𝐑𝐄𝐃𝐈𝐂𝐓     »  𝐒𝐌𝐀𝐋𝐋
 * 🔢  𝐍𝐔𝐌𝐁𝐄𝐑𝐒   »   𝟒   ⟷    𝟐
 * 🧠  𝐏𝐀𝐓𝐓𝐄𝐑𝐍   »  𝐒𝐒𝐁𝐒𝐒𝐁
 * 
 * ────────────────────────────────
 * 👑 𝐓𝐇𝐈𝐒 𝐌𝐎𝐃𝐙 𝐌𝐀𝐃𝐄 𝐁𝐘 𝐍𝐎𝐁𝐈𝐓𝐀 👑
 * ────────────────────────────────
 * ⏱️  25 Oct 2026, 13:18 (BD)
 * 💬  𝐌𝐄𝐍𝐓𝐎𝐑    »  @mdashik107
 * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 */
export function formatPredictionForClipboard(payload: PredictionCopyPayload): string {
  // Extract last 4 digits of period and convert to bold serif numbers
  const rawPeriod = payload.period.trim();
  const prd4 = rawPeriod.length >= 4 ? rawPeriod.slice(-4) : rawPeriod.padStart(4, '0');
  const fancyPeriod = toBoldSerif(prd4);

  // Convert prediction (e.g. SMALL or BIG) to bold serif
  const predClean = payload.prediction.toUpperCase().includes('BIG') ? 'BIG' : 'SMALL';
  const fancyPredict = toBoldSerif(predClean);

  // Numbers in bold serif
  const n1 = toBoldSerif(String(payload.jackpotSeeds[0]));
  const n2 = toBoldSerif(String(payload.jackpotSeeds[1]));

  // Pattern converted to bold serif (e.g. SSBS or letters)
  let rawPat = payload.pattern || 'SSBSSB';
  rawPat = rawPat.replace(/[^A-Za-z0-9]/g, '');
  if (!rawPat) rawPat = predClean === 'BIG' ? 'BBSSBB' : 'SSBSSB';
  const fancyPattern = toBoldSerif(rawPat.toUpperCase());

  // Bangladesh Time (UTC+6) Formatted
  const now = new Date();
  // BD time offset: UTC + 6 hours
  const bdTime = new Date(now.getTime() + (6 * 60 + now.getTimezoneOffset()) * 60000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = bdTime.getDate();
  const month = months[bdTime.getMonth()];
  const year = bdTime.getFullYear();
  const hours = String(bdTime.getHours()).padStart(2, '0');
  const minutes = String(bdTime.getMinutes()).padStart(2, '0');
  const timeStr = `${day} ${month} ${year}, ${hours}:${minutes} (BD)`;

  return `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃        ⚡  𝗧𝗞𝗦 𝗔𝗣𝗜 𝗣𝗔𝗡𝗘𝗟  ⚡
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🎯  𝐏𝐄𝐑𝐈𝐎𝐃    »  ${fancyPeriod}
💎  𝐏𝐑𝐄𝐃𝐈𝐂𝐓     »  ${fancyPredict}
🔢  𝐍𝐔𝐌𝐁𝐄𝐑𝐒   »   ${n1}   ⟷    ${n2}
🧠  𝐏𝐀𝐓𝐓𝐄𝐑𝐍   »  ${fancyPattern}

────────────────────────────────
👑 𝐓𝐇𝐈𝐒 𝐌𝐎𝐃𝐙 𝐌𝐀𝐃𝐄 𝐁𝐘 𝐍𝐎𝐁𝐈𝗧𝐀 👑
────────────────────────────────
⏱️  ${timeStr}
💬  𝐌𝐄𝐍𝐓𝐎𝐑    »  @mdashik107
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;
}

/**
 * Requirement 8: Exact All History Copy Format
 * 
 * #0563 ━━►𝗦𝗠𝗔𝗟𝗟✅✅✅𝗪𝗜𝗡
 * #0564 ━━►𝗦𝗠𝗔𝗟𝗟✅✅✅𝗪𝗜𝗡
 * #0565 ━━►𝗦𝗠𝗔𝗟𝗟✅✅✅𝗪𝗜𝗡
 * #0566 ━━►𝗦𝗠𝗔𝗟𝗟✅✅✅𝗪𝗜𝗡
 * #0567 ━━►𝗦𝗠𝗔𝗟𝗟❌❌❌𝗟𝗢𝗦𝗦
 * #0568 ━━►𝗦𝗠𝗔𝗟𝗟🎰🎰🎰𝗝𝗔𝗖𝗞
 * #0569 ━━►𝗕𝗜𝗚𝗚𝗚❌❌❌𝗟𝗢𝗦𝗦
 * ...
 * ══════════════════════════════════
 * 𝗧𝗢𝗧𝗔𝗟 𝗪𝗜𝗡 = 12
 * 𝗧𝗢𝗧𝗔𝗟 𝗟𝗢𝗦𝗦 = 5
 * 𝗧𝗢𝗧𝗔𝗟 𝗝𝗔𝗖𝗞 = 3
 * 𝗪𝗜𝗡 𝗦𝗧𝗥𝗜𝗞𝗘 = 5
 * 𝗟𝗢𝗦𝗦 𝗦𝗧𝗥𝗜𝗞𝗘 = 1
 * ══════════════════════════════════
 * 𝗧𝗢𝗧𝗔𝗟 𝗦𝗜𝗚𝗡𝗔𝗟 = 20
 * 
 * 👑 𝗣𝗢𝗪𝗘𝗥 𝗢𝗙 𝗡𝗢𝗕𝗜𝗧𝗔 𝗩𝗜𝗣 𝗛𝗔𝗖𝗞 👑
 * 
 * 𝗜𝗡𝗩𝗢𝗫,
 * https://t.me/mdashik107
 */
export function formatAllHistoryForClipboard(
  history: Array<{
    period: string;
    prediction: string;
    jackpotSeeds?: [number, number];
    status: string;
    actualNumber?: number;
    actualSize?: string;
    confidence?: number;
  }>
): string {
  // Only include completed rounds (WIN, LOSS, JACKPOT)
  const completed = history.filter(
    h => h.status === 'WIN' || h.status === 'LOSS' || h.status === 'JACKPOT'
  );

  // If list is empty, return empty log notice
  if (completed.length === 0) {
    return 'No draw records found in history!';
  }

  // Sort chronologically ascending so that earliest rounds appear first, up to latest
  const sorted = [...completed].sort((a, b) => {
    const na = Number(a.period) || 0;
    const nb = Number(b.period) || 0;
    return na - nb;
  });

  // Take the most recent 20 rounds if there are many, or all available
  const items = sorted.length > 20 ? sorted.slice(-20) : sorted;

  let totalWin = 0;
  let totalLoss = 0;
  let totalJack = 0;

  let maxWinStreak = 0;
  let currentWinStreak = 0;
  let maxLossStreak = 0;
  let currentLossStreak = 0;

  const lines = items.map(item => {
    // Extract period last 4 digits
    const rawPeriod = item.period.trim();
    const prd = rawPeriod.length >= 4 ? rawPeriod.slice(-4) : rawPeriod.padStart(4, '0');

    // Check prediction size: Note user's requested text: 𝗕𝗜𝗚𝗚𝗚 or 𝗦𝗠𝗔𝗟𝗟
    const isBig = item.prediction.toUpperCase().includes('BIG');
    const predFancy = isBig ? '𝗕𝗜𝗚𝗚𝗚' : '𝗦𝗠𝗔𝗟𝗟';

    let resultTag = '✅✅✅𝗪𝗜𝗡';
    if (item.status === 'JACKPOT') {
      resultTag = '🎰🎰🎰𝗝𝗔𝗖𝗞';
      totalJack++;
      currentWinStreak++;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      currentLossStreak = 0;
    } else if (item.status === 'WIN') {
      resultTag = '✅✅✅𝗪𝗜𝗡';
      totalWin++;
      currentWinStreak++;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      currentLossStreak = 0;
    } else {
      resultTag = '❌❌❌𝗟𝗢𝗦𝗦';
      totalLoss++;
      currentLossStreak++;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      currentWinStreak = 0;
    }

    return `#${prd} ━━►${predFancy}${resultTag}`;
  });

  const totalSignal = totalWin + totalLoss + totalJack;
  const winStrike = maxWinStreak || (totalWin > 0 ? 1 : 0);
  const lossStrike = maxLossStreak || (totalLoss > 0 ? 1 : 0);

  return `${lines.join('\n')}
══════════════════════════════════
𝗧𝗢𝗧𝗔𝗟 𝗪𝗜𝗡 = ${totalWin}
𝗧𝗢𝗧𝗔𝗟 𝗟𝗢𝗦𝗦 = ${totalLoss}
𝗧𝗢𝗧𝗔𝗟 𝗝𝗔𝗖𝗞 = ${totalJack}
𝗪𝗜𝗡 𝗦𝗧𝗥𝗜𝗞𝗘 = ${winStrike}
𝗟𝗢𝗦𝗦 𝗦𝗧𝗥𝗜𝗞𝗘 = ${lossStrike}
══════════════════════════════════
𝗧𝗢𝗧𝗔𝗟 𝗦𝗜𝗚𝗡𝗔𝗟 = ${totalSignal}

👑 𝗣𝗢𝗪𝗘𝗥 𝗢𝗙 𝗡𝗢𝗕𝗜𝗧𝗔 𝗩𝗜𝗣 𝗛𝗔𝗖𝗞 👑

𝗜𝗡𝗩𝗢𝗫,
https://t.me/mdashik107`;
}

/**
 * Copy text with cross-platform fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
