import React from 'react';
import {
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Timer,
  Crown,
  Sparkles
} from 'lucide-react';

interface Props {
  customTitle?: string;
  customVersion?: string;
  remainingSeconds: number;
  voiceEnabled: boolean;
  animationsEnabled: boolean;
  onToggleVoice: () => void;
  onToggleAnimations: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<Props> = ({
  customTitle,
  customVersion,
  remainingSeconds,
  voiceEnabled,
  animationsEnabled,
  onToggleVoice,
  onToggleAnimations,
  onOpenAdmin
}) => {
  const isCritical = remainingSeconds <= 5;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 border-b backdrop-blur-2xl px-2.5 sm:px-3 py-2.5 shadow-2xl flex items-center justify-between transition-colors duration-400 bg-[#060105]/95 select-none"
      style={{
        borderColor: 'var(--border)'
      }}
    >
      {/* Brand Logo & Shimmering Jolmol Title */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div
          className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl border shrink-0 transition-all duration-400"
          style={{
            background: 'linear-gradient(135deg, var(--primary), #000)',
            borderColor: 'var(--primary)',
            boxShadow: '0 0 14px var(--glow)'
          }}
        >
          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <h1
            id="brand-header-title"
            className="font-orbitron text-xs sm:text-base font-black tracking-wider flex items-center gap-1.5 tks-brand-jolmol-color-shift"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{customTitle || 'TKS API PANEL'}</span>
          </h1>
          <span
            className="px-1.5 py-0.5 rounded-full text-[7px] sm:text-[8px] font-orbitron font-extrabold text-black bg-gradient-to-r from-emerald-400 via-yellow-300 to-green-400 shadow-[0_0_10px_rgba(0,255,136,0.5)] uppercase tracking-wider"
          >
            {customVersion || 'PRO'}
          </span>
        </div>
      </div>

      {/* Header Controls: Timer + Animation Switch + Voice + Lock */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Live Online API Status Badge */}
        <div
          id="header-online-api-badge"
          className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[9px]"
          title="Online API Connected: 1-3 Level 100% Win Guarantee"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-orbitron font-bold">ONLINE API: 1-3 LVL 100%</span>
        </div>

        {/* Live Prediction Countdown Timer Widget */}
        <div
          id="header-prediction-timer-badge"
          className={`px-2 sm:px-2.5 py-1 rounded-xl border font-mono font-black text-xs flex items-center gap-1 shadow-sm transition-all ${
            isCritical
              ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(255,0,50,0.5)]'
              : 'bg-amber-500/10 border-amber-400/40 text-amber-300 shadow-[0_0_10px_rgba(255,208,0,0.2)]'
          }`}
          title="Round Draw Countdown Timer"
        >
          <Timer className={`w-3.5 h-3.5 ${isCritical ? 'text-red-400 animate-spin' : 'text-amber-400'}`} />
          <span className="font-orbitron font-extrabold tracking-wider">
            00:{formattedSeconds}
          </span>
        </div>

        {/* Master Animation ON/OFF Toggle Button - Clearly labeled so user knows what it does */}
        <button
          type="button"
          id="header-animation-toggle-btn"
          onClick={onToggleAnimations}
          className={`px-2 py-1 rounded-xl border text-[9px] font-orbitron font-extrabold flex items-center gap-1 transition-all cursor-pointer select-none active:scale-95 ${
            animationsEnabled
              ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300 shadow-[0_0_10px_rgba(0,255,136,0.3)]'
              : 'bg-white/[0.04] border-white/[0.1] text-gray-500 hover:text-gray-400'
          }`}
          title={animationsEnabled ? 'Animations ON (Click to turn OFF all animations)' : 'Animations OFF (Click to turn ON all animations)'}
        >
          <Sparkles className={`w-3 h-3 ${animationsEnabled ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}`} />
          <span className="font-mono text-[9px] font-bold">
            {animationsEnabled ? 'ANIM ON' : 'ANIM OFF'}
          </span>
        </button>

        {/* Voice Announcer Toggle */}
        <button
          type="button"
          id="header-voice-btn"
          onClick={onToggleVoice}
          className={`p-1.5 rounded-xl border text-[9px] font-orbitron font-bold flex items-center gap-1 transition-all cursor-pointer ${
            voiceEnabled
              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-[0_0_10px_rgba(255,208,0,0.25)]'
              : 'bg-white/[0.04] border-white/[0.08] text-gray-500 hover:text-gray-300'
          }`}
          title={voiceEnabled ? 'Voice Announcer Active (Click to mute)' : 'Voice Announcer Muted (Click to enable)'}
        >
          {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
        </button>

        {/* Admin Settings & Controls Button */}
        {onOpenAdmin && (
          <button
            type="button"
            id="header-admin-btn"
            onClick={onOpenAdmin}
            className="p-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Admin Settings & Overrides"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
