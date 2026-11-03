import React from 'react';
import { Zap, Trophy, History, Palette, User, DollarSign, BookOpen } from 'lucide-react';

export type NavTab = 'terminal' | 'money' | 'leaderboard' | 'history' | 'themes' | 'profile';

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenPractice?: () => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'terminal' as const, label: 'TERMINAL', icon: Zap },
    { id: 'money' as const, label: 'MONEY', icon: DollarSign, isMoney: true },
    { id: 'history' as const, label: 'HISTORY', icon: History },
    { id: 'leaderboard' as const, label: 'RANKS', icon: Trophy, isRgb: true },
    { id: 'themes' as const, label: 'THEMES', icon: Palette },
    { id: 'profile' as const, label: 'PROFILE', icon: User }
  ];

  return (
    <nav
      id="floating-bottom-nav"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[96%] max-w-lg z-40 rounded-3xl p-1.5 backdrop-blur-2xl flex items-center justify-around transition-all duration-300 border shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_20px_var(--glow)]"
      style={{
        backgroundColor: 'var(--panel)',
        borderColor: 'var(--border)'
      }}
    >
      {tabs.map(t => {
        const isActive = activeTab === t.id;
        const Icon = t.icon;

        return (
          <button
            key={t.id}
            type="button"
            id={`nav-btn-${t.id}`}
            onClick={() => onSelectTab(t.id)}
            className={`flex-1 py-1 px-1 rounded-2xl flex flex-col items-center gap-0.5 transition-all duration-200 cursor-pointer relative ${
              isActive
                ? t.isRgb
                  ? 'bg-gradient-to-r from-red-500/20 via-amber-500/20 to-emerald-500/20 border border-amber-400/40 -translate-y-1 shadow-[0_0_15px_rgba(255,208,0,0.25)]'
                  : '-translate-y-1 shadow-md border border-white/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            style={
              isActive && !t.isRgb
                ? {
                    color: 'var(--primary)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 0 15px var(--glow)'
                  }
                : undefined
            }
          >
            {t.isRgb && (
              <span className="absolute -top-1.5 right-1 px-1 py-0.2 rounded-full text-[6px] font-orbitron font-extrabold bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 text-black uppercase tracking-tighter shadow-sm animate-pulse">
                RGB
              </span>
            )}
            {t.isMoney && (
              <span className="absolute -top-1.5 right-1 px-1 py-0.2 rounded-full text-[6px] font-orbitron font-extrabold bg-emerald-500 text-black uppercase tracking-tighter shadow-sm animate-pulse">
                3X
              </span>
            )}
            <Icon
              className={`w-4 h-4 transition-transform duration-200 ${
                isActive
                  ? t.isMoney
                    ? 'scale-110 drop-shadow-md text-emerald-400'
                    : t.isRgb
                    ? 'scale-110 drop-shadow-md text-amber-300'
                    : 'scale-110 drop-shadow-md'
                  : t.isMoney
                  ? 'text-emerald-400/80'
                  : ''
              }`}
              style={isActive && !t.isMoney && !t.isRgb ? { color: 'var(--primary)' } : undefined}
            />
            <span
              className={`text-[8px] font-orbitron font-bold tracking-wider ${
                isActive && t.isRgb
                  ? 'text-amber-300 font-black'
                  : isActive && t.isMoney
                  ? 'text-emerald-400 font-black'
                  : ''
              }`}
              style={isActive && !t.isMoney && !t.isRgb ? { color: 'var(--primary)' } : undefined}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
