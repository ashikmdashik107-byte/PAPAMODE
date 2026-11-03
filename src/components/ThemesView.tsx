import React, { useState, useEffect } from 'react';
import { Palette, Check, Sparkles, RefreshCw, Sliders, Eye, Zap } from 'lucide-react';
import { ThemeType } from '../types';
import { PRESET_THEMES, VIVID_COLOR_SWATCHES, applyTheme } from '../utils/themeManager';

interface Props {
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
  onShowToast: (msg: string, color?: string) => void;
}

export const ThemesView: React.FC<Props> = ({
  currentTheme,
  onSelectTheme,
  onShowToast
}) => {
  const [customColor, setCustomColor] = useState<string>(() => {
    try {
      return localStorage.getItem('nobita_custom_theme_color') || '#ff2a4b';
    } catch {
      return '#ff2a4b';
    }
  });

  const [activeCustomColor, setActiveCustomColor] = useState<string | null>(() => {
    try {
      return localStorage.getItem('nobita_custom_theme_color');
    } catch {
      return null;
    }
  });

  // Find active preset theme info
  const activePreset = PRESET_THEMES.find(t => t.id === currentTheme) || PRESET_THEMES[0];
  const activeDisplayColor = activeCustomColor || activePreset.dotColor;

  const handleSelectPreset = (themeId: string) => {
    setActiveCustomColor(null);
    onSelectTheme(themeId);
    applyTheme(themeId);
    const found = PRESET_THEMES.find(t => t.id === themeId);
    if (found) {
      onShowToast(`🎨 Theme switched to ${found.name}`, found.dotColor);
    }
  };

  const handleSelectSwatch = (swatchHex: string, swatchThemeId: string, swatchName: string) => {
    setActiveCustomColor(swatchHex);
    setCustomColor(swatchHex);
    onSelectTheme(swatchThemeId);
    applyTheme(swatchThemeId, swatchHex);
    onShowToast(`🎨 Color switched to ${swatchName} (${swatchHex})`, swatchHex);
  };

  const handleApplyCustomColor = () => {
    if (!customColor) return;
    setActiveCustomColor(customColor);
    applyTheme(currentTheme, customColor);
    onShowToast(`🎨 Custom Color applied: ${customColor}`, customColor);
  };

  const handleResetToDefault = () => {
    setActiveCustomColor(null);
    setCustomColor('#ff2a4b');
    onSelectTheme('blood-red');
    applyTheme('blood-red');
    onShowToast('🔄 Theme reset to Blood Red default', '#ff2a4b');
  };

  return (
    <div id="themes-view-container" className="space-y-4 pb-24 animate-in fade-in duration-300 select-none">
      {/* 1. Header Banner */}
      <div
        className="rounded-3xl p-4 border transition-all duration-300"
        style={{
          backgroundColor: 'var(--panel-card)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-2xl border flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderColor: 'var(--border)',
                color: 'var(--primary)'
              }}
            >
              <Palette className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-orbitron text-sm font-black text-white tracking-wider flex items-center gap-2">
                <span>SYSTEM COLOR THEMES</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderColor: 'var(--border)',
                    color: 'var(--primary)'
                  }}
                >
                  LIVE REACTIVE
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Choose your favorite theme or pick a custom color — changes apply instantly across the entire app.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-gray-400 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Reset to default theme"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Live Preview Banner */}
      <div
        className="rounded-3xl p-4 border transition-all duration-300 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--panel-card)',
          borderColor: 'var(--border)',
          boxShadow: '0 0 25px var(--glow)'
        }}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border border-white/30 shrink-0 transition-all duration-300"
              style={{
                backgroundColor: activeDisplayColor,
                boxShadow: `0 0 20px ${activeDisplayColor}`
              }}
            >
              <Sparkles className="w-5 h-5 text-black font-black" />
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-emerald-400" />
                <span>ACTIVE THEME COLOR:</span>
              </div>
              <div className="font-orbitron text-base font-black text-white flex items-center gap-2 mt-0.5">
                <span>{activePreset.name}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${activeDisplayColor}25`,
                    color: activeDisplayColor,
                    border: `1px solid ${activeDisplayColor}60`
                  }}
                >
                  {activeCustomColor ? `HEX ${activeCustomColor}` : 'PRESET'}
                </span>
              </div>
            </div>
          </div>

          {/* Sample glowing preview pill */}
          <div className="flex items-center gap-2">
            <div
              className="px-3 py-1.5 rounded-xl font-orbitron text-xs font-bold flex items-center gap-1.5 transition-all duration-300"
              style={{
                backgroundColor: `${activeDisplayColor}25`,
                border: `1px solid ${activeDisplayColor}80`,
                color: activeDisplayColor,
                boxShadow: `0 0 15px ${activeDisplayColor}40`
              }}
            >
              <Zap className="w-3 h-3" />
              <span>LIVE GLOW</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ONE-TAP VIVID COLOR SWATCHES */}
      <div
        className="rounded-3xl p-4 border transition-all duration-300"
        style={{
          backgroundColor: 'var(--panel-card)',
          borderColor: 'var(--border-subtle)'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <h3 className="font-orbitron text-xs font-bold text-white tracking-wider">
              QUICK COLOR PALETTE (ONE-TAP THEME SHIFT)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-gray-400">10 VIBRANT COLORS</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
          {VIVID_COLOR_SWATCHES.map(swatch => {
            const isSwatchActive =
              activeCustomColor === swatch.hex ||
              (!activeCustomColor && currentTheme === swatch.themeId && activePreset.dotColor === swatch.hex);

            return (
              <button
                key={swatch.hex}
                type="button"
                id={`swatch-btn-${swatch.hex.replace('#', '')}`}
                onClick={() => handleSelectSwatch(swatch.hex, swatch.themeId, swatch.name)}
                title={`${swatch.name} (${swatch.hex})`}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-95 group ${
                  isSwatchActive
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                }`}
                style={
                  isSwatchActive
                    ? {
                        backgroundColor: `${swatch.hex}25`,
                        boxShadow: `0 0 18px ${swatch.hex}`
                      }
                    : undefined
                }
              >
                <div
                  className="w-7 h-7 rounded-xl border border-white/30 flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: swatch.hex,
                    boxShadow: isSwatchActive ? `0 0 12px ${swatch.hex}` : undefined
                  }}
                >
                  {isSwatchActive && <Check className="w-4 h-4 text-black font-black" />}
                </div>
                <span className="text-[8px] font-mono font-bold text-gray-300 mt-1 truncate max-w-full">
                  {swatch.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. CUSTOM HEX COLOR PICKER */}
      <div
        className="rounded-3xl p-4 border transition-all duration-300"
        style={{
          backgroundColor: 'var(--panel-card)',
          borderColor: 'var(--border-subtle)'
        }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <Palette className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          <h3 className="font-orbitron text-xs font-bold text-white tracking-wider">
            CUSTOM COLOR PICKER
          </h3>
        </div>
        <p className="text-[11px] font-mono text-gray-400 mb-3">
          Select any shade or hex code and apply it dynamically across the application.
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Native HTML Color Picker */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/15">
            <input
              type="color"
              id="custom-hex-color-picker"
              value={customColor}
              onChange={e => setCustomColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 outline-none p-0"
              title="Pick a custom color"
            />
            <input
              type="text"
              id="custom-hex-code-input"
              value={customColor.toUpperCase()}
              onChange={e => {
                const val = e.target.value;
                setCustomColor(val.startsWith('#') ? val : `#${val}`);
              }}
              placeholder="#FF0077"
              className="w-24 px-2 py-1 bg-transparent text-white font-mono text-xs font-bold outline-none uppercase"
            />
          </div>

          <button
            type="button"
            id="apply-custom-color-btn"
            onClick={handleApplyCustomColor}
            className="px-4 py-2.5 rounded-2xl font-orbitron text-xs font-black text-black flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg"
            style={{
              backgroundColor: customColor,
              boxShadow: `0 0 20px ${customColor}80`
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>APPLY CUSTOM COLOR</span>
          </button>
        </div>
      </div>

      {/* 5. PRESET THEME CARDS */}
      <div className="space-y-2.5">
        <div className="px-1 text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
          PRESET CYBERPUNK THEMES
        </div>

        {PRESET_THEMES.map(t => {
          const isSelected = !activeCustomColor && currentTheme === t.id;

          return (
            <button
              key={t.id}
              type="button"
              id={`theme-select-${t.id}`}
              onClick={() => handleSelectPreset(t.id)}
              style={
                isSelected
                  ? {
                      borderColor: `${t.dotColor}90`,
                      boxShadow: `0 0 25px ${t.dotColor}40`,
                      backgroundColor: `${t.dotColor}15`
                    }
                  : undefined
              }
              className={`w-full p-4 rounded-3xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                isSelected
                  ? 'border-white/50 shadow-lg'
                  : 'bg-black/50 border-white/[0.08] hover:border-white/25 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 shrink-0"
                  style={{
                    backgroundColor: t.dotColor,
                    boxShadow: `0 0 15px ${t.dotColor}80`
                  }}
                >
                  <Sparkles className="w-5 h-5 text-black font-black" />
                </div>

                <div>
                  <div className="font-orbitron text-sm font-bold text-white flex items-center gap-2">
                    <span>{t.name}</span>
                    {isSelected && (
                      <span
                        className="text-[9px] font-mono px-2 py-0.2 rounded-full font-bold border"
                        style={{
                          backgroundColor: `${t.dotColor}25`,
                          borderColor: `${t.dotColor}70`,
                          color: t.dotColor
                        }}
                      >
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                    {t.description}
                  </div>
                </div>
              </div>

              <div
                className="w-7 h-7 rounded-full border flex items-center justify-center transition-all shrink-0"
                style={
                  isSelected
                    ? {
                        borderColor: t.dotColor,
                        backgroundColor: `${t.dotColor}30`,
                        color: t.dotColor,
                        boxShadow: `0 0 10px ${t.dotColor}`
                      }
                    : {
                        borderColor: 'rgba(255,255,255,0.15)',
                        color: 'transparent'
                      }
                }
              >
                <Check className="w-4 h-4 font-black" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
