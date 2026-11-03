import React, { useState } from 'react';
import { Crown, Trophy, Clock, Send, Edit3, Check, Trash2, Lock } from 'lucide-react';
import { StatsData, UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  stats: StatsData;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onClearHistory?: () => void;
  onLockSystem?: () => void;
  onOpenAdmin?: () => void;
  onShowToast: (msg: string, color?: string) => void;
}

const AVATARS = ['👑', '🐯', '⚡', '🤖', '💀', '💎', '🔥', '🦅'];

export const ProfileView: React.FC<Props> = ({
  profile,
  stats,
  onUpdateProfile,
  onClearHistory,
  onLockSystem,
  onOpenAdmin,
  onShowToast
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [customTagInput, setCustomTagInput] = useState(profile.customTag);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSave = () => {
    onUpdateProfile({
      name: nameInput.trim() || 'VIP NOBITA PLAYER',
      customTag: customTagInput.trim() || 'QUANTUM MASTER'
    });
    setIsEditing(false);
    onShowToast('✅ Profile updated successfully!', '#00ff88');
  };

  const winRate = stats.total > 0 ? (((stats.wins + stats.jackpots) / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <div id="profile-view-container" className="space-y-4 pb-24 select-none">
      {/* Profile Card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#140c14] to-[#0a070e] border border-amber-500/30 p-5 text-center relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-3">
          <button
            type="button"
            id="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-amber-400 border border-amber-400/30 transition-colors cursor-pointer"
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>

        {/* Avatar */}
        <div className="relative mx-auto w-20 h-20 mb-3 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-red-500/20 to-black border-2 border-amber-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(255,208,0,0.3)]">
            {profile.avatar}
          </div>
          <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-black">
            <Crown className="w-3 h-3" />
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-3 max-w-xs mx-auto my-2">
            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-1">CHOOSE AVATAR</label>
              <div className="flex justify-center gap-1.5 flex-wrap">
                {AVATARS.map(av => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => onUpdateProfile({ avatar: av })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg border transition-all ${
                      profile.avatar === av
                        ? 'border-amber-400 bg-amber-500/20 scale-110'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-1">PLAYER NAME</label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full bg-white/[0.05] border border-amber-400/40 rounded-xl px-3 py-1.5 text-center text-sm font-orbitron font-bold text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-1">CUSTOM VIP TITLE</label>
              <input
                type="text"
                value={customTagInput}
                onChange={e => setCustomTagInput(e.target.value)}
                className="w-full bg-white/[0.05] border border-amber-400/40 rounded-xl px-3 py-1.5 text-center text-xs font-mono text-amber-300 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2 bg-gradient-to-r from-amber-600 to-red-600 text-white text-xs font-orbitron font-bold rounded-xl cursor-pointer"
            >
              SAVE PROFILE
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-orbitron text-xl font-black text-white tracking-wider">
              {profile.name}
            </h2>
            <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-orbitron font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 mt-1">
              ⚡ {profile.customTag} · LEVEL {profile.level}
            </div>

            <p className="text-[9px] font-mono text-gray-500 mt-2">
              NOBITA X PRIME VIP MEMBER SINCE {profile.joinedDate}
            </p>
          </>
        )}
      </div>

      {/* Lifetime Stats */}
      <div className="bg-[#0b0b14] border border-white/[0.08] rounded-2xl p-4">
        <h3 className="font-orbitron text-xs font-bold text-amber-400 tracking-wider flex items-center gap-1.5 mb-3">
          <Trophy className="w-3.5 h-3.5" /> OVERALL GAME PERFORMANCE
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
            <div className="text-[9px] font-mono text-gray-400">WIN ACCURACY</div>
            <div className="font-orbitron text-lg font-black text-amber-400">{winRate}%</div>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
            <div className="text-[9px] font-mono text-gray-400">TOTAL ROUNDS</div>
            <div className="font-orbitron text-lg font-black text-white">{stats.total}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
            <div className="text-[9px] font-mono text-gray-400">JACKPOT HITS (9×)</div>
            <div className="font-orbitron text-lg font-black text-purple-400">{stats.jackpots}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
            <div className="text-[9px] font-mono text-gray-400">BEST WIN STREAK</div>
            <div className="font-orbitron text-lg font-black text-emerald-400">{stats.bestStreak}</div>
          </div>
        </div>
      </div>

      {/* Best Playing Times Recommendation */}
      <div className="bg-[#0b0b14] border border-white/[0.08] rounded-2xl p-4">
        <h3 className="font-orbitron text-xs font-bold text-amber-400 tracking-wider flex items-center gap-1.5 mb-2.5">
          <Clock className="w-3.5 h-3.5" /> OPTIMAL TIMING WINDOWS
        </h3>

        <div className="space-y-1.5 text-xs font-mono text-gray-300">
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/[0.04]">
            <span className="flex items-center gap-1.5">🌅 MORNING SESSION</span>
            <span className="font-bold text-amber-400">08:30 AM – 11:45 AM</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/[0.04]">
            <span className="flex items-center gap-1.5">☀️ MID-DAY SESSION</span>
            <span className="font-bold text-amber-400">01:30 PM – 03:15 PM</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/[0.04]">
            <span className="flex items-center gap-1.5">🌆 EVENING SESSION</span>
            <span className="font-bold text-amber-400">05:00 PM – 07:30 PM</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/[0.04]">
            <span className="flex items-center gap-1.5">🌙 NIGHT VOLATILITY</span>
            <span className="font-bold text-amber-400">08:45 PM – 11:00 PM</span>
          </div>
        </div>
      </div>

      {/* Clear History & Data Management Card */}
      {onClearHistory && (
        <div className="bg-[#0b0b14] border border-red-500/30 rounded-2xl p-4 space-y-2.5 shadow-[0_0_20px_rgba(255,42,75,0.15)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <h3 className="font-orbitron font-bold text-xs text-white">DATA & HISTORY RESET</h3>
            </div>
            <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              RESET
            </span>
          </div>
          <p className="text-xs font-mono text-gray-400">
            Reset all previous game history and streak data to start fresh.
          </p>

          <button
            type="button"
            id="profile-clear-history-btn"
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 hover:border-red-400 text-red-300 hover:text-white font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,42,75,0.2)]"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400 animate-pulse" /> CLEAR ALL HISTORY RECORDS
          </button>

          {/* Confirmation Modal */}
          {showClearConfirm && (
            <div
              id="profile-clear-modal"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
            >
              <div className="bg-[#0e0e18] border-2 border-red-500/50 rounded-3xl p-5 max-w-xs w-full text-center shadow-[0_0_60px_rgba(255,42,75,0.45)] space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400 shadow-[0_0_25px_rgba(255,42,75,0.4)]">
                  <Trash2 className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-orbitron font-black text-white tracking-wide uppercase">
                    CONFIRM CLEAR HISTORY?
                  </h3>
                  <p className="text-xs font-mono text-gray-300 mt-1">
                    Are you sure? All previous rounds and stats will be permanently cleared.
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-gray-300 font-orbitron text-xs font-bold transition-colors cursor-pointer"
                  >
                    NO
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setShowClearConfirm(false);
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-orbitron text-xs font-black tracking-wider transition-all shadow-[0_4px_20px_rgba(255,42,75,0.5)] active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> YES, DELETE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Settings & Control Modal */}
      {onOpenAdmin && (
        <button
          type="button"
          onClick={onOpenAdmin}
          className="w-full py-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.18)]"
        >
          <Crown className="w-4 h-4 text-emerald-400" /> ADMIN SETTINGS & PREDICTOR CONTROLS
        </button>
      )}

      {/* Telegram Link */}
      <a
        href="https://t.me/mdashik107"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-[#0088cc] to-[#005f8a] text-white font-orbitron font-bold text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(0,136,204,0.35)] transition-transform active:scale-[0.98]"
      >
        <Send className="w-4 h-4" /> CONTACT @mdashik107 TELEGRAM
      </a>
    </div>
  );
};
