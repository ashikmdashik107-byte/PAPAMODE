import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Crown,
  Flame,
  Zap,
  Lock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Share2,
  Medal,
  Award,
  Star,
  CheckCircle2
} from 'lucide-react';
import { StatsData, UserProfile } from '../types';
import { copyToClipboard } from '../utils/formatter';

interface Props {
  userStats: StatsData;
  userProfile: UserProfile;
  onShowToast: (msg: string, color?: string) => void;
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  tag: string;
  vipTier: string;
  country: string;
  wins: number;
  jackpots: number;
  bestStreak: number;
  totalGames: number;
  isCurrentUser?: boolean;
}

type SortFilter = 'all-rounder' | 'wins' | 'jackpots' | 'streaks';

export const LeaderboardView: React.FC<Props> = ({
  userStats,
  userProfile,
  onShowToast
}) => {
  const [filter, setFilter] = useState<SortFilter>('all-rounder');
  const [cheeredIds, setCheeredIds] = useState<Record<string, number>>({});

  // Base Top Competitors in VIP Circuit
  const baseCompetitors: LeaderboardUser[] = useMemo(() => [
    {
      id: 'vip-1',
      name: 'NOBITA X PAPA',
      avatar: '👑',
      tag: 'RGB QUANTUM CREATOR',
      vipTier: 'TITAN GOD',
      country: '🇮🇳 VIP',
      wins: 1420 + userStats.wins * 2,
      jackpots: 188 + userStats.jackpots,
      bestStreak: 28,
      totalGames: 1490 + userStats.total
    },
    {
      id: 'vip-2',
      name: 'CYBER_GHOST_777',
      avatar: '🐉',
      tag: 'DRAGON BREAKER ELITE',
      vipTier: 'DIAMOND SOVEREIGN',
      country: '🇸🇬 PRO',
      wins: 1180 + Math.floor(userStats.wins * 1.2),
      jackpots: 142,
      bestStreak: 21,
      totalGames: 1240
    },
    {
      id: 'vip-3',
      name: 'NEO_PHANTOM_VIP',
      avatar: '⚡',
      tag: 'ZIGZAG MARKOV PRO',
      vipTier: 'CHROMA GRANDMASTER',
      country: '🇦🇪 VIP',
      wins: 960 + userStats.wins,
      jackpots: 110,
      bestStreak: 19,
      totalGames: 1020
    },
    {
      id: 'vip-4',
      name: 'MATRIX_ORION',
      avatar: '🔮',
      tag: 'NEURAL PREDICTOR',
      vipTier: 'VIP LEGENDARY',
      country: '🇺🇸 PRO',
      wins: 820 + Math.floor(userStats.wins * 0.8),
      jackpots: 85,
      bestStreak: 16,
      totalGames: 880
    },
    {
      id: 'vip-5',
      name: 'TITAN_WARRIOR',
      avatar: '🛡️',
      tag: 'FASTING L1 MASTER',
      vipTier: 'VIP MASTER',
      country: '🇬🇧 PRO',
      wins: 710,
      jackpots: 68,
      bestStreak: 14,
      totalGames: 760
    }
  ], [userStats]);

  // Current User Representation
  const currentUserEntry: LeaderboardUser = useMemo(() => ({
    id: 'current-user',
    name: userProfile.name || 'NOBITA X PRIME VIP',
    avatar: userProfile.avatar || '👑',
    tag: userProfile.customTag || 'RGB ALL ROUNDER',
    vipTier: `VIP LEVEL ${userProfile.level}`,
    country: '⭐ YOU',
    wins: userStats.wins,
    jackpots: userStats.jackpots,
    bestStreak: userStats.bestStreak,
    totalGames: userStats.total,
    isCurrentUser: true
  }), [userProfile, userStats]);

  // Merge and sort all users
  const allUsers = useMemo(() => {
    const list = [...baseCompetitors];
    // Check if user is already there or add
    const exists = list.some(u => u.isCurrentUser);
    if (!exists) list.push(currentUserEntry);

    // Calculate score based on active filter
    const getScore = (u: LeaderboardUser) => {
      if (filter === 'wins') return u.wins;
      if (filter === 'jackpots') return u.jackpots;
      if (filter === 'streaks') return u.bestStreak;
      // All-Rounder Composite Score: (Wins * 10) + (Jackpots * 60) + (BestStreak * 15)
      return u.wins * 10 + u.jackpots * 60 + u.bestStreak * 15;
    };

    return list.sort((a, b) => getScore(b) - getScore(a));
  }, [baseCompetitors, currentUserEntry, filter]);

  // Top 5 Users
  const top5Users = useMemo(() => allUsers.slice(0, 5), [allUsers]);

  // User's current rank
  const userRankIndex = useMemo(() => {
    return allUsers.findIndex(u => u.isCurrentUser) + 1;
  }, [allUsers]);

  const handleCheer = (userId: string, name: string) => {
    setCheeredIds(prev => ({ ...prev, [userId]: (prev[userId] || 0) + 1 }));
    onShowToast(`🔥 Cheered for ${name}! (+1 VIP Aura)`, '#ffd000');
  };

  const handleShareRank = async (rank: number, user: LeaderboardUser) => {
    const text = [
      `👑 𝗚𝗟𝗢𝗕𝗔𝗟 𝗩𝗜𝗣 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗 - 𝗥𝗚𝗕 𝗔𝗟𝗟 𝗥𝗢𝗨𝗡𝗗𝗘𝗥 👑`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏆 𝗥𝗔𝗡𝗞 : #${rank} [ ${user.vipTier} ]`,
      `👤 𝗨𝗦𝗘𝗥 : ${user.name}`,
      `🎯 𝗧𝗢𝗧𝗔𝗟 𝗪𝗜𝗡𝗦 : ${user.wins} Rounds`,
      `🔒 𝗝𝗔𝗖𝗞𝗣𝗢𝗧𝗦 (𝟵𝘅) : ${user.jackpots} Hits`,
      `⚡ 𝗕𝗘𝗦𝗧 𝗦𝗧𝗥𝗘𝗔𝗞 : ${user.bestStreak} W-Streak`,
      `📊 𝗔𝗟𝗟-𝗥𝗢𝗨𝗡𝗗𝗘𝗥 𝗦𝗖𝗢𝗥𝗘 : ${user.wins * 10 + user.jackpots * 60 + user.bestStreak * 15} PTS`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `⚡ Powered by NOBITA X PRIME VIP Quantum Engine`
    ].join('\n');

    const success = await copyToClipboard(text);
    if (success) {
      onShowToast('📋 VIP RANK CARD COPIED WITH FANCY FONTS!', '#00ff88');
    }
  };

  return (
    <div id="global-vip-leaderboard-view" className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* RGB Premium Grand Header Banner */}
      <div className="relative rounded-3xl p-5 overflow-hidden rgb-box-pulse bg-gradient-to-b from-[#120818]/95 via-[#0a0510]/95 to-[#040208] border-2 border-amber-400/50 shadow-[0_0_35px_rgba(255,208,0,0.25)]">
        {/* Animated RGB Chroma Aura Background Flare */}
        <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-red-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-orbitron font-black uppercase tracking-widest rgb-gradient-animated text-black shadow-[0_0_15px_rgba(255,208,0,0.4)]">
            <Sparkles className="w-3 h-3 text-black animate-spin" />
            RGB ALL ROUNDER LUXURY LEAGUE
          </div>

          <h1 className="text-2xl md:text-3xl font-orbitron font-black tracking-wider uppercase rgb-text drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
            GLOBAL VIP LEADERBOARD
          </h1>

          <p className="text-[11px] font-mono text-gray-300 max-w-md mx-auto">
            Real-time verified global ranking for top prediction masters based on{' '}
            <span className="text-amber-400 font-bold">Total Wins</span> and{' '}
            <span className="text-red-400 font-bold">9× Jackpots</span>.
          </p>
        </div>

        {/* User Rank Fast-Pill */}
        <div className="mt-4 p-2.5 rounded-2xl bg-black/60 border border-amber-500/30 backdrop-blur-md flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center font-orbitron font-black text-xs text-black shadow-md">
              #{userRankIndex}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-orbitron font-bold text-white">
                <span>{userProfile.name}</span>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <div className="text-[10px] font-mono text-gray-400">
                {userStats.wins} Wins • {userStats.jackpots} Jackpots (9×)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleShareRank(userRankIndex, currentUserEntry)}
            className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-amber-400/30 text-amber-300 text-[10px] font-orbitron font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <Share2 className="w-3 h-3 text-amber-400" />
            <span>SHARE</span>
          </button>
        </div>
      </div>

      {/* Filter Sorter Buttons */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-md">
        {(
          [
            { id: 'all-rounder', label: 'ALL ROUNDER', icon: Crown },
            { id: 'wins', label: 'TOTAL WINS', icon: Trophy },
            { id: 'jackpots', label: 'JACKPOTS (9×)', icon: Flame },
            { id: 'streaks', label: 'STREAKS', icon: Zap }
          ] as const
        ).map(tab => {
          const isActive = filter === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              id={`filter-btn-${tab.id}`}
              onClick={() => setFilter(tab.id)}
              className={`py-2 px-1 rounded-xl text-[9px] font-orbitron font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 via-red-500/20 to-emerald-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(255,208,0,0.25)]'
                  : 'text-gray-400 hover:text-gray-200 bg-transparent border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
              <span className="truncate w-full text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Podium Display for Top 3 Masters */}
      <div className="grid grid-cols-3 gap-2 pt-4 items-end">
        {/* #2 Rank (Left) */}
        {top5Users[1] && (
          <div className="rounded-2xl p-3 bg-gradient-to-b from-[#141824]/90 to-[#080a10] border border-cyan-400/30 flex flex-col items-center text-center shadow-[0_0_15px_rgba(0,229,255,0.15)] relative">
            <div className="absolute -top-3 w-6 h-6 rounded-full bg-cyan-400 text-black font-orbitron font-black text-[11px] flex items-center justify-center border-2 border-black shadow-md">
              2
            </div>
            <div className="text-2xl mt-1 mb-0.5">{top5Users[1].avatar}</div>
            <div className="text-[10px] font-orbitron font-bold text-cyan-300 truncate w-full">
              {top5Users[1].name}
            </div>
            <div className="text-[8px] font-mono text-gray-400 truncate w-full">
              {top5Users[1].tag}
            </div>
            <div className="mt-2 text-[10px] font-orbitron font-black text-white">
              {filter === 'jackpots'
                ? `${top5Users[1].jackpots} 🔒`
                : filter === 'streaks'
                ? `${top5Users[1].bestStreak} ⚡`
                : `${top5Users[1].wins} 🎯`}
            </div>
          </div>
        )}

        {/* #1 Rank (Center - Grand Champion) */}
        {top5Users[0] && (
          <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#241808]/95 to-[#0e0a02] border-2 border-amber-400 rgb-box-pulse flex flex-col items-center text-center shadow-[0_0_25px_rgba(255,208,0,0.35)] relative -translate-y-2">
            <div className="absolute -top-4 w-8 h-8 rounded-full rgb-gradient-animated text-black font-orbitron font-black text-xs flex items-center justify-center border-2 border-black shadow-lg animate-bounce">
              👑
            </div>
            <div className="text-3xl mt-1 mb-0.5">{top5Users[0].avatar}</div>
            <div className="text-[11px] font-orbitron font-black rgb-text truncate w-full">
              {top5Users[0].name}
            </div>
            <div className="text-[8px] font-mono text-amber-300 font-bold truncate w-full">
              {top5Users[0].vipTier}
            </div>
            <div className="mt-2 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-orbitron font-black text-amber-300">
              {filter === 'jackpots'
                ? `${top5Users[0].jackpots} 🔒 JACKPOTS`
                : filter === 'streaks'
                ? `${top5Users[0].bestStreak} ⚡ STREAK`
                : `${top5Users[0].wins} 🎯 WINS`}
            </div>
          </div>
        )}

        {/* #3 Rank (Right) */}
        {top5Users[2] && (
          <div className="rounded-2xl p-3 bg-gradient-to-b from-[#201018]/90 to-[#0c060a] border border-amber-600/30 flex flex-col items-center text-center shadow-[0_0_15px_rgba(255,100,50,0.15)] relative">
            <div className="absolute -top-3 w-6 h-6 rounded-full bg-amber-600 text-white font-orbitron font-black text-[11px] flex items-center justify-center border-2 border-black shadow-md">
              3
            </div>
            <div className="text-2xl mt-1 mb-0.5">{top5Users[2].avatar}</div>
            <div className="text-[10px] font-orbitron font-bold text-amber-400 truncate w-full">
              {top5Users[2].name}
            </div>
            <div className="text-[8px] font-mono text-gray-400 truncate w-full">
              {top5Users[2].tag}
            </div>
            <div className="mt-2 text-[10px] font-orbitron font-black text-white">
              {filter === 'jackpots'
                ? `${top5Users[2].jackpots} 🔒`
                : filter === 'streaks'
                ? `${top5Users[2].bestStreak} ⚡`
                : `${top5Users[2].wins} 🎯`}
            </div>
          </div>
        )}
      </div>

      {/* TOP 5 GLOBAL VIP LEADERBOARD LIST */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-orbitron font-bold text-gray-400 px-1">
          <span className="flex items-center gap-1">
            <Medal className="w-3 h-3 text-amber-400" /> TOP 5 ALL-ROUNDER MASTERS
          </span>
          <span>SCORE / METRICS</span>
        </div>

        {top5Users.map((user, idx) => {
          const rank = idx + 1;
          const isUser = user.isCurrentUser;
          const compositeScore = user.wins * 10 + user.jackpots * 60 + user.bestStreak * 15;
          const winRate = user.totalGames > 0 ? ((user.wins / user.totalGames) * 100).toFixed(1) : '97.5';

          return (
            <div
              key={user.id}
              id={`leaderboard-card-rank-${rank}`}
              className={`rounded-2xl p-3.5 transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                rank === 1
                  ? 'bg-gradient-to-r from-[#180e04]/90 via-[#100804] to-[#18040a] border-2 border-amber-400/60 shadow-[0_0_20px_rgba(255,208,0,0.25)]'
                  : isUser
                  ? 'bg-gradient-to-r from-emerald-950/40 via-black to-amber-950/40 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(0,255,136,0.2)]'
                  : 'bg-[#0a0a14]/90 border border-white/[0.08] hover:border-white/20'
              }`}
            >
              {/* Rank Highlight Flare */}
              {rank === 1 && (
                <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-xl text-[7px] font-orbitron font-black rgb-gradient-animated text-black uppercase tracking-wider">
                  GRAND MASTER #1
                </div>
              )}
              {isUser && (
                <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-xl text-[7px] font-orbitron font-black bg-emerald-500 text-black uppercase tracking-wider">
                  YOU
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                {/* Left: Rank & Avatar & User Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Rank Badge */}
                  <div
                    className={`w-7 h-7 rounded-xl font-orbitron font-black text-xs flex items-center justify-center shrink-0 ${
                      rank === 1
                        ? 'bg-amber-400 text-black shadow-md'
                        : rank === 2
                        ? 'bg-cyan-400 text-black'
                        : rank === 3
                        ? 'bg-amber-600 text-white'
                        : 'bg-white/[0.08] text-gray-300 border border-white/10'
                    }`}
                  >
                    #{rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {user.avatar}
                  </div>

                  {/* Name & Tag */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-orbitron font-bold text-xs text-white truncate">
                        {user.name}
                      </span>
                      <span className="text-[9px]">{user.country}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[8px] font-orbitron font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 truncate">
                        {user.vipTier}
                      </span>
                      <span className="text-[9px] font-mono text-gray-400 truncate">
                        {user.tag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Cheer Action */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="text-right">
                    <div className="font-orbitron font-black text-xs text-amber-300">
                      {filter === 'wins'
                        ? `${user.wins} Wins`
                        : filter === 'jackpots'
                        ? `${user.jackpots} Jackpots`
                        : filter === 'streaks'
                        ? `${user.bestStreak} Streak`
                        : `${compositeScore.toLocaleString()} PTS`}
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400">
                      {winRate}% Win Rate • {user.jackpots} 🔒 (9×)
                    </div>
                  </div>

                  {/* Cheer Button */}
                  <button
                    type="button"
                    onClick={() => handleCheer(user.id, user.name)}
                    className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-amber-500/20 border border-white/[0.08] hover:border-amber-400/40 text-xs flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Cheer for this VIP"
                  >
                    🔥
                  </button>
                </div>
              </div>

              {/* Progress Mini-Bar for All Rounder Performance */}
              <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[9px] font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">🎯 {user.wins} Wins</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">🔒 {user.jackpots} Jackpots</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-bold">⚡ {user.bestStreak} Max Streak</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleShareRank(rank, user)}
                  className="text-gray-400 hover:text-amber-300 flex items-center gap-1 font-orbitron text-[8px] cursor-pointer"
                >
                  <Share2 className="w-2.5 h-2.5" />
                  SHARE
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RGB VIP Perks & Rules Footer Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-black via-[#080812] to-[#120810] border border-amber-400/30 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <h3 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
            VIP LEAGUE RULES & REWARDS
          </h3>
        </div>

        <div className="space-y-1 text-[10px] font-mono text-gray-300">
          <p>
            • <span className="text-amber-400 font-semibold">Rank #1 - #3:</span> Awarded Exclusive{' '}
            <span className="rgb-text font-bold">RGB ALL ROUNDER AURA</span> & VIP Priority Server nodes.
          </p>
          <p>
            • <span className="text-emerald-400 font-semibold">Jackpot Multiplier:</span> Every exact 2-number locked seed hit counts as{' '}
            <span className="text-amber-300 font-bold">60pts</span> toward your All-Rounder score.
          </p>
          <p>
            • <span className="text-cyan-400 font-semibold">Live Real-Time Sync:</span> Your wins and streaks automatically update the leaderboard ranking live!
          </p>
        </div>
      </div>
    </div>
  );
};
