export interface ThemeDefinition {
  id: string;
  name: string;
  dotColor: string;
  bgGradient: string;
  panelColor: string;
  panelCardColor: string;
  borderColor: string;
  glowColor: string;
  accentText: string;
  description: string;
}

export const PRESET_THEMES: ThemeDefinition[] = [
  {
    id: 'blood-red',
    name: 'Blood Red (Crimson)',
    dotColor: '#ff2a4b',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(255, 42, 75, 0.35) 0%, rgba(25, 4, 10, 0.98) 50%, #060103 100%)',
    panelColor: '#120206',
    panelCardColor: 'rgba(26, 4, 11, 0.92)',
    borderColor: 'rgba(255, 42, 75, 0.45)',
    glowColor: 'rgba(255, 42, 75, 0.65)',
    accentText: 'text-red-400',
    description: 'High contrast crimson cyberpunk aesthetic'
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon (Aqua)',
    dotColor: '#00ffe7',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 231, 0.35) 0%, rgba(2, 28, 42, 0.98) 50%, #010d14 100%)',
    panelColor: '#031b2a',
    panelCardColor: 'rgba(4, 35, 54, 0.92)',
    borderColor: 'rgba(0, 255, 231, 0.45)',
    glowColor: 'rgba(0, 255, 231, 0.65)',
    accentText: 'text-cyan-400',
    description: 'Futuristic aqua neon glowing matrix'
  },
  {
    id: 'gold-elite',
    name: 'Gold Elite VIP',
    dotColor: '#ffd000',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(255, 208, 0, 0.35) 0%, rgba(32, 24, 3, 0.98) 50%, #0e0a01 100%)',
    panelColor: '#1f1604',
    panelCardColor: 'rgba(40, 30, 6, 0.92)',
    borderColor: 'rgba(255, 208, 0, 0.45)',
    glowColor: 'rgba(255, 208, 0, 0.65)',
    accentText: 'text-amber-400',
    description: 'Prestige royal gold luxury finish'
  },
  {
    id: 'amethyst',
    name: 'Amethyst Violet',
    dotColor: '#c742ff',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(199, 66, 255, 0.35) 0%, rgba(30, 4, 52, 0.98) 50%, #0e0218 100%)',
    panelColor: '#200538',
    panelCardColor: 'rgba(42, 8, 72, 0.92)',
    borderColor: 'rgba(199, 66, 255, 0.45)',
    glowColor: 'rgba(199, 66, 255, 0.65)',
    accentText: 'text-purple-400',
    description: 'Deep violet mystical quantum styling'
  },
  {
    id: 'emerald',
    name: 'Emerald Jade',
    dotColor: '#00ff88',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 136, 0.35) 0%, rgba(2, 38, 18, 0.98) 50%, #011208 100%)',
    panelColor: '#032612',
    panelCardColor: 'rgba(5, 48, 23, 0.92)',
    borderColor: 'rgba(0, 255, 136, 0.45)',
    glowColor: 'rgba(0, 255, 136, 0.65)',
    accentText: 'text-emerald-400',
    description: 'Vibrant jade profit glow matrix'
  },
  {
    id: 'ocean',
    name: 'Ocean Cobalt',
    dotColor: '#00a2ff',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(0, 162, 255, 0.35) 0%, rgba(2, 26, 62, 0.98) 50%, #010a1a 100%)',
    panelColor: '#031b3e',
    panelCardColor: 'rgba(5, 36, 80, 0.92)',
    borderColor: 'rgba(0, 162, 255, 0.45)',
    glowColor: 'rgba(0, 162, 255, 0.65)',
    accentText: 'text-blue-400',
    description: 'Deep ocean cobalt atmospheric matrix'
  },
  {
    id: 'matrix',
    name: 'Matrix Cyber Green',
    dotColor: '#00ff41',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 65, 0.35) 0%, rgba(3, 30, 8, 0.98) 50%, #010a02 100%)',
    panelColor: '#041f06',
    panelCardColor: 'rgba(6, 42, 10, 0.92)',
    borderColor: 'rgba(0, 255, 65, 0.45)',
    glowColor: 'rgba(0, 255, 65, 0.65)',
    accentText: 'text-green-400',
    description: 'Terminal hacker green cyber mode'
  },
  {
    id: 'cyber-pink',
    name: 'Neon Cyber Pink',
    dotColor: '#ff007f',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(255, 0, 127, 0.35) 0%, rgba(38, 2, 20, 0.98) 50%, #0e0108 100%)',
    panelColor: '#240214',
    panelCardColor: 'rgba(48, 4, 28, 0.92)',
    borderColor: 'rgba(255, 0, 127, 0.45)',
    glowColor: 'rgba(255, 0, 127, 0.65)',
    accentText: 'text-pink-400',
    description: 'Electrifying neon magenta hot glow'
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Plasma',
    dotColor: '#ff7700',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(255, 119, 0, 0.35) 0%, rgba(36, 16, 2, 0.98) 50%, #0e0601 100%)',
    panelColor: '#241002',
    panelCardColor: 'rgba(48, 20, 4, 0.92)',
    borderColor: 'rgba(255, 119, 0, 0.45)',
    glowColor: 'rgba(255, 119, 0, 0.65)',
    accentText: 'text-orange-400',
    description: 'Molten plasma kinetic orange wave'
  }
];

export const VIVID_COLOR_SWATCHES = [
  { name: 'Crimson Red', hex: '#ff2a4b', themeId: 'blood-red' },
  { name: 'Cyber Neon', hex: '#00ffe7', themeId: 'cyber-neon' },
  { name: 'Imperial Gold', hex: '#ffd000', themeId: 'gold-elite' },
  { name: 'Amethyst Violet', hex: '#c742ff', themeId: 'amethyst' },
  { name: 'Emerald Jade', hex: '#00ff88', themeId: 'emerald' },
  { name: 'Cobalt Blue', hex: '#00a2ff', themeId: 'ocean' },
  { name: 'Matrix Green', hex: '#00ff41', themeId: 'matrix' },
  { name: 'Cyber Pink', hex: '#ff007f', themeId: 'cyber-pink' },
  { name: 'Plasma Orange', hex: '#ff7700', themeId: 'sunset-orange' },
  { name: 'Electric Violet', hex: '#7928ca', themeId: 'amethyst' }
];

/**
 * Converts a hex color to rgba string
 */
export function hexToRgba(hex: string, alpha: number): string {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return `rgba(255, 42, 75, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Applies a theme or custom color across the entire document
 */
export function applyTheme(themeId: string, customHexColor?: string) {
  if (typeof document === 'undefined') return;

  const foundPreset = PRESET_THEMES.find(t => t.id === themeId);
  const primaryHex = customHexColor || (foundPreset ? foundPreset.dotColor : '#ff2a4b');
  const glow = hexToRgba(primaryHex, 0.6);
  const border = hexToRgba(primaryHex, 0.45);
  const borderSubtle = hexToRgba(primaryHex, 0.18);
  const bgGlow = hexToRgba(primaryHex, 0.32);

  // Set data-theme attribute
  document.documentElement.setAttribute('data-theme', themeId);
  document.body.setAttribute('data-theme', themeId);

  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--primary', primaryHex);
  rootStyle.setProperty('--theme-accent', primaryHex);
  rootStyle.setProperty('--glow', glow);
  rootStyle.setProperty('--border', border);
  rootStyle.setProperty('--border-subtle', borderSubtle);

  if (foundPreset && !customHexColor) {
    rootStyle.setProperty('--bg-gradient', foundPreset.bgGradient);
    rootStyle.setProperty('--panel', foundPreset.panelColor);
    rootStyle.setProperty('--panel-card', foundPreset.panelCardColor);
  } else {
    // Generate custom dark tinted background gradient and panels
    const bgGrad = `radial-gradient(circle at 50% 0%, ${bgGlow} 0%, rgba(10, 10, 16, 0.98) 50%, #040408 100%)`;
    rootStyle.setProperty('--bg-gradient', bgGrad);
    rootStyle.setProperty('--panel', hexToRgba(primaryHex, 0.08));
    rootStyle.setProperty('--panel-card', hexToRgba(primaryHex, 0.12));
  }

  // Persist to localStorage
  try {
    localStorage.setItem('nobita_theme', themeId);
    if (customHexColor) {
      localStorage.setItem('nobita_custom_theme_color', customHexColor);
    } else {
      localStorage.removeItem('nobita_custom_theme_color');
    }
  } catch {
    // Local storage unavailable
  }

  // Dispatch custom event for canvas and other subscribers
  window.dispatchEvent(new CustomEvent('nobita-theme-changed', { detail: { themeId, primaryHex } }));
}

/**
 * Initializes theme from localStorage on initial load
 */
export function initTheme(): { themeId: string; customColor?: string } {
  if (typeof window === 'undefined') return { themeId: 'blood-red' };

  try {
    const savedTheme = localStorage.getItem('nobita_theme') || 'blood-red';
    const savedCustom = localStorage.getItem('nobita_custom_theme_color') || undefined;
    applyTheme(savedTheme, savedCustom);
    return { themeId: savedTheme, customColor: savedCustom };
  } catch {
    return { themeId: 'blood-red' };
  }
}
