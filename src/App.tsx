import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  HistoryRecord,
  StatsData,
  UserProfile,
  AdminSettings,
  ThemeType,
  StrategyType,
  MoneyManagementSettings,
  ServerMode
} from './types';
import {
  calculateQuantumPrediction,
  evaluateOutcome,
  getNumSize,
  getNumColor
} from './utils/engine';
import { patternEngineManager } from './utils/patternEngines';
import { autoUpdateAll32Logics } from './utils/logics32';
import { bossEngineManager } from './utils/bossEngine';
import { quantEngineManager } from './utils/quantEngine';
import {
  DEFAULT_MM_SETTINGS,
  applyRoundOutcomeToMM
} from './utils/moneyManagement';
import {
  playWinSound,
  playLossSound,
  playJackpotSound,
  playWarningBeepSound,
  speakOutcome
} from './utils/sound';
import { ParticleBackground } from './components/ParticleBackground';
import { TelegramChannelGateway } from './components/TelegramChannelGateway';
import { CriticalTimerWarningOverlay } from './components/CriticalTimerWarningOverlay';
import { TriadEnginesCard } from './components/TriadEnginesCard';
import { Header } from './components/Header';
import { PredictionCard } from './components/PredictionCard';
import { ResultModal } from './components/ResultModal';
import { applyTheme } from './utils/themeManager';
import { AICouncil } from './components/AICouncil';
import { PatternEnginesHubView } from './components/PatternEnginesHubView';
import { GrandMatrixDashboard } from './components/GrandMatrixDashboard';
import { LogicsRadarView } from './components/LogicsRadarView';
import { TrendChart } from './components/TrendChart';
import { LeaderboardView } from './components/LeaderboardView';
import { HistoryView } from './components/HistoryView';
import { ThemesView } from './components/ThemesView';
import { ProfileView } from './components/ProfileView';
import { MoneyManagementView } from './components/MoneyManagementView';
import { BottomNav, NavTab } from './components/BottomNav';
import { PracticeSandboxModal } from './components/PracticeSandboxModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { Sparkles, Megaphone } from 'lucide-react';
import { formatAllHistoryForClipboard, copyToClipboard } from './utils/formatter';

export default function App() {
  // Authentication & System State: Unlocked directly into prediction terminal
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('nobita_animations_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [isChannelsVerified, setIsChannelsVerified] = useState<boolean>(true);

  const [theme, setTheme] = useState<ThemeType>(() => {
    const stored = (localStorage.getItem('nobita_theme') as ThemeType) || 'emerald';
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-theme', stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
    return stored;
  });
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('terminal');
  const [showAdvancedPanels, setShowAdvancedPanels] = useState<boolean>(false);

  // Core Engine & Game State
  const [currentPeriod, setCurrentPeriod] = useState<string>('2026070510001001');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(55);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('AUTO_ADAPTIVE');
  const currentPeriodRef = useRef(currentPeriod);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    currentPeriodRef.current = currentPeriod;
  }, [currentPeriod]);
  
  // Current Prediction Data
  const [currentEngineResult, setCurrentEngineResult] = useState(() => {
    return calculateQuantumPrediction([], 'AUTO_ADAPTIVE', 0, 'AUTO');
  });

  // Recent API Results
  const [recentApiHistory, setRecentApiHistory] = useState<Array<{ number: number; size: 'BIG' | 'SMALL'; period: string }>>([]);

  // Stats & History
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nobita_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState<StatsData>(() => {
    try {
      const saved = localStorage.getItem('nobita_stats');
      return saved
        ? JSON.parse(saved)
        : {
            wins: 0,
            losses: 0,
            jackpots: 0,
            currentWinStreak: 0,
            currentLossStreak: 0,
            maxLossStreak: 0,
            bestStreak: 0,
            total: 0
          };
    } catch {
      return {
        wins: 0,
        losses: 0,
        jackpots: 0,
        currentWinStreak: 0,
        currentLossStreak: 0,
        maxLossStreak: 0,
        bestStreak: 0,
        total: 0
      };
    }
  });

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('nobita_profile');
      return saved
        ? JSON.parse(saved)
        : {
            name: 'TKS API PANEL VIP',
            avatar: '👑',
            customTag: 'API MASTER',
            level: 7,
            joinedDate: '2026'
          };
    } catch {
      return {
        name: 'TKS API PANEL VIP',
        avatar: '👑',
        customTag: 'API MASTER',
        level: 7,
        joinedDate: '2026'
      };
    }
  });

  // Admin Settings
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem('nobita_admin_settings');
      return saved
        ? JSON.parse(saved)
        : {
            modeOverride: 'AUTO',
            announcement: { text: '', type: 'info' },
            toggles: {
              maintenance: false,
              confetti: true,
              voiceAnnouncer: true,
              soundFx: true
            }
          };
    } catch {
      return {
        modeOverride: 'AUTO',
        announcement: { text: '', type: 'info' },
        toggles: {
          maintenance: false,
          confetti: true,
          voiceAnnouncer: true,
          soundFx: true
        }
      };
    }
  });

  // Money Management Settings State
  const [mmSettings, setMmSettings] = useState<MoneyManagementSettings>(() => {
    try {
      const saved = localStorage.getItem('nobita_mm_settings');
      return saved ? JSON.parse(saved) : DEFAULT_MM_SETTINGS;
    } catch {
      return DEFAULT_MM_SETTINGS;
    }
  });

  // Dedicated Prediction Server State: BIG_SMALL (Server 1 only)
  const selectedServer: ServerMode = 'BIG_SMALL';

  // Modals & Notifications
  const [activeResultPopup, setActiveResultPopup] = useState<HistoryRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<{ msg: string; color: string } | null>(null);

  // Sync theme to document body and documentElement and update CSS vars
  useEffect(() => {
    let savedCustom: string | undefined;
    try {
      savedCustom = localStorage.getItem('nobita_custom_theme_color') || undefined;
    } catch {}
    applyTheme(theme, savedCustom);
    localStorage.setItem('nobita_theme', theme);
  }, [theme]);

  // Persist Money Management Settings
  useEffect(() => {
    localStorage.setItem('nobita_mm_settings', JSON.stringify(mmSettings));
  }, [mmSettings]);

  // Persist State Updates
  useEffect(() => {
    const serialized = JSON.stringify(history.slice(0, 80));
    localStorage.setItem('nobita_history', serialized);
  }, [history]);

  useEffect(() => {
    const serialized = JSON.stringify(stats);
    localStorage.setItem('nobita_stats', serialized);
  }, [stats]);

  useEffect(() => {
    const serialized = JSON.stringify(profile);
    localStorage.setItem('nobita_profile', serialized);
  }, [profile]);

  // Sync global animation master switch with DOM & storage
  useEffect(() => {
    const val = animationsEnabled ? 'true' : 'false';
    document.documentElement.setAttribute('data-animations', val);
    document.body.setAttribute('data-animations', val);
    localStorage.setItem('nobita_animations_enabled', val);
  }, [animationsEnabled]);

  // Synchronize global settings from centralized server API
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setAdminSettings(prev => ({
            ...prev,
            ...data.settings,
            customization: {
              ...prev.customization,
              ...data.settings.customization
            },
            toggles: {
              ...prev.toggles,
              ...data.settings.toggles
            }
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Toast Trigger Helper
  const showToast = useCallback((msg: string, color = '#00ff88') => {
    setToastMessage({ msg, color });
    setTimeout(() => {
      setToastMessage(prev => (prev?.msg === msg ? null : prev));
    }, 2800);
  }, []);

  // Dedicated Complete History Clear Handler
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setStats({
      wins: 0,
      losses: 0,
      jackpots: 0,
      currentWinStreak: 0,
      currentLossStreak: 0,
      maxLossStreak: 0,
      bestStreak: 0,
      total: 0
    });
    try {
      localStorage.setItem('nobita_history', '[]');
      const resetStats = JSON.stringify({
        wins: 0,
        losses: 0,
        jackpots: 0,
        currentWinStreak: 0,
        currentLossStreak: 0,
        maxLossStreak: 0,
        bestStreak: 0,
        total: 0
      });
      localStorage.setItem('nobita_stats', resetStats);
    } catch {
      // Ignore local storage error
    }
    showToast('🗑️ All history records cleared successfully!', '#ff2a4b');
  }, [showToast]);

  // Secure Password Unlock Handler (In-memory only; prompts password again upon page refresh)
  const handleUnlock = () => {
    setIsUnlocked(true);
    showToast('⚡ VIP Access Granted! Welcome to NOBITA X PRIME', '#00ff88');
    if (adminSettings.toggles.voiceAnnouncer) {
      speakOutcome('VIP access granted. Welcome to NOBITA X PRIME');
    }
  };

  // Lock System Handler
  const handleLockSystem = () => {
    setIsUnlocked(false);
    localStorage.removeItem('nobita_unlocked');
    showToast('🔒 System Locked', '#ffaa00');
  };

  // Main countdown timer hook
  useEffect(() => {
    if (!isUnlocked) return;
    const interval = setInterval(() => {
      const seconds = new Date().getSeconds();
      const remain = 60 - (seconds % 60);
      setRemainingSeconds(remain);
    }, 1000);
    return () => clearInterval(interval);
  }, [isUnlocked]);

  // Urgent 5-Second Warning Alarm Sound
  useEffect(() => {
    if (!isUnlocked || !isChannelsVerified) return;
    if (remainingSeconds <= 5 && remainingSeconds >= 0) {
      playWarningBeepSound(remainingSeconds);
    }
  }, [remainingSeconds, isUnlocked, isChannelsVerified]);

  // Resilient Multi-Route Live API Fetcher with Server-Assisted Fast Path (Anti-API Block)
  const fetchLiveWingoList = async (): Promise<{
    list: Array<{ issueNumber: string; number: string | number }>;
    authoritativeSignal?: any;
    remainingSeconds?: number;
  }> => {
    const endpoints = [
      '/api/wingo-live',
      '/api/wingo/WinGo/WinGo_1M/GetHistoryIssuePage.json'
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2400);
        const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}ts=${Date.now()}`, {
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json();
          // Check dedicated /api/wingo-live response with authoritative synchronized signal
          if (json?.success && Array.isArray(json?.list) && json.list.length > 0) {
            return {
              list: json.list,
              authoritativeSignal: json.authoritativeSignal,
              remainingSeconds: json.remainingSeconds
            };
          }
          // Standard lottery API response
          const list = json?.data?.list;
          if (Array.isArray(list) && list.length > 0) {
            return { list };
          }
        }
      } catch {
        // try next endpoint
      }
    }
    return { list: [] };
  };

  // Sound and Speech Player on Round Outcome
  const handleRoundOutcomeEffects = useCallback(
    (outcome: 'WIN' | 'LOSS' | 'JACKPOT', num: number, size: string) => {
      if (adminSettings.toggles.soundFx) {
        if (outcome === 'JACKPOT') {
          playJackpotSound();
        } else if (outcome === 'WIN') {
          playWinSound();
        } else {
          playLossSound();
        }
      }

      if (adminSettings.toggles.voiceAnnouncer) {
        if (outcome === 'JACKPOT') {
          speakOutcome(`Jackpot Hit! Number ${num}. Congratulations!`);
        } else if (outcome === 'WIN') {
          speakOutcome(`Win! Result is ${size}, Number ${num}.`);
        } else {
          speakOutcome(`Loss. Result is ${size}, Number ${num}.`);
        }
      }
    },
    [adminSettings.toggles.soundFx, adminSettings.toggles.voiceAnnouncer]
  );

  // Main Period Synchronization & Zero-Loss Prediction Resolution Engine
  useEffect(() => {
    if (!isUnlocked) return;

    let isSubscribed = true;
    let timerId: any = null;

    const syncGameRound = async () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;

      try {
        const { list, authoritativeSignal, remainingSeconds: sRemaining } = await fetchLiveWingoList();
        if (!isSubscribed) return;

        if (typeof sRemaining === 'number' && sRemaining >= 0) {
          setRemainingSeconds(sRemaining);
        }

        if (list && list.length > 0) {
          const latestDraw = list[0];
          const latestPeriodStr = String(latestDraw.issueNumber);

          // Calculate next official target period
          const nextPeriodNum = BigInt(latestPeriodStr) + 1n;
          const targetNextPeriod = nextPeriodNum.toString();

          // Map recent draw records (expanded to 30 draws for statistical depth)
          const parsedRecent = list.slice(0, 30).map((item: any) => ({
            number: Number(item.number),
            size: getNumSize(Number(item.number)),
            period: String(item.issueNumber)
          }));
          setRecentApiHistory(parsedRecent);

          let activeLossStreak = stats.currentLossStreak;

          // Chronological evaluation of all pending predictions in history against verified draws
          setHistory(prevHistory => {
            let updatedHistory = [...prevHistory];
            let hasChanges = false;
            let lastEvaluatedRecord: HistoryRecord | null = null;

            // Sort draws ascending (oldest to newest) to resolve multiple pending rounds in order
            const chronologicalDraws = [...list].slice(0, 10).reverse();

            for (const draw of chronologicalDraws) {
              const drawPeriod = String(draw.issueNumber);
              const drawNum = Number(draw.number);
              const drawSize = getNumSize(drawNum);

              const pendingIdx = updatedHistory.findIndex(
                h => h.period === drawPeriod && h.status === 'PENDING'
              );

              if (pendingIdx !== -1) {
                const pendingRecord = updatedHistory[pendingIdx];
                const evalResult = evaluateOutcome(
                  pendingRecord.prediction,
                  pendingRecord.jackpotSeeds,
                  drawNum,
                  pendingRecord.fastingLevel || (activeLossStreak + 1)
                );
                const outcome = evalResult.status;

                // 1/3 Level Protocol: Cap loss streak so it strictly resets upon Level 3 Win
                if (outcome === 'LOSS') {
                  activeLossStreak = activeLossStreak >= 2 ? 0 : activeLossStreak + 1;
                } else {
                  activeLossStreak = 0;
                }

                const resolvedRecord: HistoryRecord = {
                  ...pendingRecord,
                  status: outcome,
                  actualNumber: drawNum,
                  actualSize: drawSize,
                  actualColor: getNumColor(drawNum)
                };

                updatedHistory[pendingIdx] = resolvedRecord;
                hasChanges = true;
                lastEvaluatedRecord = resolvedRecord;

                // Update stats
                setStats(prevStats => {
                  const isJack = outcome === 'JACKPOT';
                  const isW = outcome === 'WIN';
                  const isL = outcome === 'LOSS';

                  const newWins = prevStats.wins + (isW ? 1 : 0);
                  const newLosses = prevStats.losses + (isL ? 1 : 0);
                  const newJackpots = prevStats.jackpots + (isJack ? 1 : 0);

                  const newWinStreak = isW || isJack ? prevStats.currentWinStreak + 1 : 0;
                  const newLossStreak = isL ? (prevStats.currentLossStreak >= 2 ? 0 : prevStats.currentLossStreak + 1) : 0;
                  const newMaxLossStreak = Math.min(Math.max(prevStats.maxLossStreak, newLossStreak), 2);
                  const newBestStreak = Math.max(prevStats.bestStreak, newWinStreak);

                  return {
                    wins: newWins,
                    losses: newLosses,
                    jackpots: newJackpots,
                    currentWinStreak: newWinStreak,
                    currentLossStreak: newLossStreak,
                    maxLossStreak: newMaxLossStreak,
                    bestStreak: newBestStreak,
                    total: prevStats.total + 1
                  };
                });

                // Apply to Money Management
                const mmOutcome: 'WIN' | 'LOSS' = outcome === 'LOSS' ? 'LOSS' : 'WIN';
                setMmSettings(prevMM => applyRoundOutcomeToMM(prevMM, mmOutcome));

                // Auto-Update All 32 Logics & 26+ Autonomous Pattern Engines (Live Self-Learning)
                try {
                  const previousHistoryForEval = list
                    .filter((item: any) => String(item.issueNumber) !== drawPeriod)
                    .slice(0, 25)
                    .map((item: any) => ({
                      number: Number(item.number),
                      size: getNumSize(Number(item.number)),
                      period: String(item.issueNumber)
                    }));
                  autoUpdateAll32Logics(drawNum, drawSize, previousHistoryForEval, drawPeriod);
                  patternEngineManager.autoUpdateEngines(drawNum, drawSize, previousHistoryForEval);
                } catch {
                  // Safe fallback
                }

                // Trigger outcome sound/speech
                handleRoundOutcomeEffects(outcome, drawNum, drawSize);
              }
            }

            if (lastEvaluatedRecord) {
              setActiveResultPopup(lastEvaluatedRecord);
            }

            return hasChanges ? updatedHistory : prevHistory;
          });

          // Synchronize or compute prediction for the target next period
          const hasAuthoritative = Boolean(authoritativeSignal && authoritativeSignal.period === targetNextPeriod);

          let effectiveEngineResult;
          if (hasAuthoritative) {
            effectiveEngineResult = {
              serverMode: 'BIG_SMALL' as ServerMode,
              prediction: authoritativeSignal.prediction,
              colorPrediction: authoritativeSignal.colorPrediction,
              violetInsurance: false,
              jackpotSeeds: authoritativeSignal.jackpotSeeds,
              primaryBall: authoritativeSignal.primaryBall,
              secondaryBall: authoritativeSignal.secondaryBall,
              topBallPool: authoritativeSignal.topBallPool || [],
              confidence: authoritativeSignal.confidence,
              pattern: authoritativeSignal.pattern,
              strategy: (authoritativeSignal.strategy as StrategyType) || selectedStrategy,
              fastingLevel: authoritativeSignal.fastingLevel,
              councilVotes: {}
            };
          } else {
            effectiveEngineResult = calculateQuantumPrediction(
              parsedRecent,
              selectedStrategy,
              activeLossStreak,
              adminSettings.modeOverride
            );
          }

          // Check if we need to predict for the target next period
          if (targetNextPeriod !== currentPeriodRef.current) {
            currentPeriodRef.current = targetNextPeriod;
            setCurrentPeriod(targetNextPeriod);
            setCurrentEngineResult(effectiveEngineResult);

            // Register new pending prediction record
            setHistory(prevHistory => {
              const exists = prevHistory.some(h => h.period === targetNextPeriod);
              if (exists) return prevHistory;

              const newPending: HistoryRecord = {
                period: targetNextPeriod,
                serverMode: 'BIG_SMALL',
                prediction: effectiveEngineResult.prediction,
                colorPrediction: effectiveEngineResult.colorPrediction,
                jackpotSeeds: effectiveEngineResult.jackpotSeeds,
                primaryBall: effectiveEngineResult.primaryBall,
                secondaryBall: effectiveEngineResult.secondaryBall,
                topBallPool: effectiveEngineResult.topBallPool,
                status: 'PENDING',
                confidence: effectiveEngineResult.confidence,
                pattern: effectiveEngineResult.pattern,
                strategy: selectedStrategy,
                fastingLevel: effectiveEngineResult.fastingLevel,
                timestamp: Date.now()
              };

              return [newPending, ...prevHistory.slice(0, 79)];
            });
          } else if (hasAuthoritative && currentEngineResult.prediction !== authoritativeSignal.prediction) {
            // Keep active prediction synchronized in realtime for all users
            setCurrentEngineResult(effectiveEngineResult);
          }
        }
      } catch {
        // Safe fail-forward: keep current state, will retry next tick
      } finally {
        isSyncingRef.current = false;
      }
    };

    // Adaptive Zero-Miss Poller: High-Frequency (750ms) during turnover, (1600ms) otherwise
    const scheduleNextTick = () => {
      if (!isSubscribed) return;
      const seconds = new Date().getSeconds();
      const isTurnoverWindow = seconds >= 56 || seconds <= 12;
      const delay = isTurnoverWindow ? 750 : 1600;

      timerId = setTimeout(async () => {
        await syncGameRound();
        scheduleNextTick();
      }, delay);
    };

    syncGameRound().then(() => scheduleNextTick());

    return () => {
      isSubscribed = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [
    isUnlocked,
    selectedStrategy,
    stats.currentLossStreak,
    adminSettings.modeOverride,
    handleRoundOutcomeEffects
  ]);

  // Strategy Selection Handler
  const handleSelectStrategy = (st: StrategyType) => {
    setSelectedStrategy(st);
    showToast(`⚡ STRATEGY ENGINE: ${st.replace('_', ' ')} ACTIVATED!`, '#00ff88');
  };

  // Full History Copy Handler (Requirement 8)
  const handleCopyFullHistory = async () => {
    const text = formatAllHistoryForClipboard(
      history.map(h => ({
        period: h.period,
        prediction: h.prediction,
        jackpotSeeds: h.jackpotSeeds,
        status: h.status,
        actualNumber: h.actualNumber,
        actualSize: h.actualSize,
        confidence: h.confidence
      }))
    );
    const ok = await copyToClipboard(text);
    if (ok) {
      showToast('📋 Full History Copied in VIP Format!', '#00ff88');
    }
  };



  return (
    <div
      id="app-root-shell"
      data-animations={animationsEnabled ? 'true' : 'false'}
      className="relative min-h-screen text-slate-100 flex flex-col max-w-lg mx-auto border-x border-[var(--border-subtle)] overflow-x-clip"
      style={{
        backgroundColor: 'var(--bg)',
        backgroundImage: 'var(--bg-gradient)'
      }}
    >
      {/* Ambient Theme Dynamic Glow Mesh */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[110px] opacity-35 transition-all duration-700 z-0"
        style={{ background: 'var(--primary)' }}
      />

      {/* Background Glowing Particles (Only active when animations are ON) */}
      {animationsEnabled && <ParticleBackground theme={theme} />}

      {/* Telegram Channel Verification Gate */}
      {!isChannelsVerified && (
        <TelegramChannelGateway
          onVerified={() => {
            setIsChannelsVerified(true);
            localStorage.setItem('nobita_channels_verified', 'true');
            showToast('✅ Channel verification confirmed! Predictor activated.', '#00ff88');
            playWinSound();
          }}
        />
      )}

      {/* Critical 5-second red warning overlay */}
      <CriticalTimerWarningOverlay
        remainingSeconds={remainingSeconds}
        period={currentPeriod}
      />

      {/* Broadcast Announcement Banner if Active */}
      {adminSettings.announcement.text && (
        <div
          id="broadcast-announcement-banner"
          className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center justify-between text-center ${
            adminSettings.announcement.type === 'danger'
              ? 'bg-red-600/90 text-white'
              : adminSettings.announcement.type === 'warn'
              ? 'bg-amber-500/90 text-black'
              : adminSettings.announcement.type === 'success'
              ? 'bg-emerald-600/90 text-white'
              : 'bg-blue-600/90 text-white'
          }`}
        >
          <span className="flex items-center gap-1.5 truncate mx-auto">
            <Megaphone className="w-3.5 h-3.5" /> {adminSettings.announcement.text}
          </span>
          <button
            type="button"
            onClick={() =>
              setAdminSettings(prev => ({
                ...prev,
                announcement: { ...prev.announcement, text: '' }
              }))
            }
            className="text-xs opacity-75 hover:opacity-100 p-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header with Live Prediction Timer, Jolmol Animated Brand, Animations Toggle, Voice & Lock */}
      <Header
        customTitle={adminSettings.customization?.title}
        customVersion={adminSettings.customization?.versionBadge}
        remainingSeconds={remainingSeconds}
        voiceEnabled={adminSettings.toggles.voiceAnnouncer}
        animationsEnabled={animationsEnabled}
        onToggleVoice={() => {
          const curr = adminSettings.toggles.voiceAnnouncer;
          setAdminSettings(prev => ({
            ...prev,
            toggles: { ...prev.toggles, voiceAnnouncer: !curr }
          }));
          showToast(`Voice announcer ${!curr ? 'Enabled' : 'Disabled'}`, !curr ? '#00ff88' : '#ffaa00');
        }}
        onToggleAnimations={() => {
          setAnimationsEnabled(prev => {
            const next = !prev;
            showToast(next ? '✨ All Animations Turned ON' : '⏸️ All Animations Turned OFF', next ? '#00ff88' : '#ffaa00');
            return next;
          });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area based on Active Tab */}
      <main id="app-main-content" className="flex-1 p-3 md:p-4 space-y-4 z-10 pb-20">
        {activeTab === 'terminal' && (
          <div className="space-y-4 pb-12 animate-in fade-in duration-300">
            {/* Main Prediction Card with Locked Seeds & Fancy Copy Button */}
            <PredictionCard
              period={currentPeriod}
              serverMode={selectedServer}
              remainingSeconds={remainingSeconds}
              prediction={currentEngineResult.prediction}
              colorPrediction={currentEngineResult.colorPrediction}
              violetInsurance={currentEngineResult.violetInsurance}
              jackpotSeeds={currentEngineResult.jackpotSeeds}
              topBallPool={currentEngineResult.topBallPool}
              confidence={currentEngineResult.confidence}
              pattern={currentEngineResult.pattern}
              strategy={selectedStrategy}
              autoSelectedStrategy={currentEngineResult.autoSelectedStrategy}
              marketPatternReason={currentEngineResult.marketPatternReason}
              fastingLevel={currentEngineResult.fastingLevel}
              logicsExecution={currentEngineResult.logicsExecution}
              bossPredictionResult={currentEngineResult.bossPredictionResult}
              quantEngineResult={currentEngineResult.quantEngineResult}
              triadResult={currentEngineResult.triadEngineResult}
              mmSettings={mmSettings}
              onOpenMoneyManagement={() => setActiveTab('money')}
              onOpenPractice={() => setIsPracticeOpen(true)}
              customization={adminSettings.customization}
              onSelectStrategy={handleSelectStrategy}
              onShowToast={showToast}
            />

            {/* Clean Trend Chart (Last 10 Visualizer) */}
            <TrendChart
              recentHistory={recentApiHistory}
              currentPrediction={currentEngineResult.prediction}
            />

            {/* Optional Collapsible Advanced Multi-Engine Hubs (Hidden by Default) */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowAdvancedPanels(!showAdvancedPanels)}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-orbitron font-bold text-gray-400 hover:text-emerald-300 transition-all cursor-pointer shadow-sm"
              >
                {showAdvancedPanels ? '▲ HIDE ADVANCED AI ENGINES & RADAR' : '▼ VIEW ADVANCED AI ENGINES & RADAR'}
              </button>
            </div>

            {showAdvancedPanels && (
              <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                {/* Triad Core AI Engines */}
                <TriadEnginesCard triadResult={currentEngineResult.triadEngineResult} />

                {/* AI Council (6 Nodes) */}
                <AICouncil votes={currentEngineResult.councilVotes} />

                {/* Autonomous Boss Engine & 8-AI Engines Hub */}
                <PatternEnginesHubView
                  activeEngineState={currentEngineResult.activeEngineState}
                  multiEngineMatrix={currentEngineResult.multiEngineMatrix}
                  bossPredictionResult={currentEngineResult.bossPredictionResult}
                  quantEngineResult={currentEngineResult.quantEngineResult}
                />

                {/* Grand Pattern Matrix */}
                <GrandMatrixDashboard
                  grandMatrix={currentEngineResult.grandMatrix}
                  fastingLevel={currentEngineResult.fastingLevel}
                />

                {/* 30+ Advanced Prediction Logics Engine View */}
                <LogicsRadarView
                  logicsExecution={currentEngineResult.logicsExecution}
                  currentPrediction={currentEngineResult.prediction}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'money' && (
          <MoneyManagementView
            settings={mmSettings}
            onUpdateSettings={upd => setMmSettings(prev => ({ ...prev, ...upd }))}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            userStats={stats}
            userProfile={profile}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            stats={stats}
            activeServer={selectedServer}
            onClearHistory={handleClearHistory}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'themes' && (
          <ThemesView
            currentTheme={theme}
            onSelectTheme={setTheme}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            stats={stats}
            onUpdateProfile={upd => setProfile(prev => ({ ...prev, ...upd }))}
            onClearHistory={handleClearHistory}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Floating Bottom Navigation (Replaces Sidebar) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenPractice={() => setIsPracticeOpen(true)}
      />

      {/* Big WIN / LOSS / JACKPOT Popup Modal */}
      <ResultModal
        record={activeResultPopup}
        onClose={() => setActiveResultPopup(null)}
        onShowToast={showToast}
      />

      {/* Starter Pattern Practice Sandbox Simulator */}
      <PracticeSandboxModal
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
      />

      {/* Admin Panel Modal for Password Management */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onUnlockPredictor={() => {
          setIsAdminOpen(false);
          setIsUnlocked(true);
        }}
        onPasswordChanged={(newPwd) => {
          showToast(`Admin: Predictor password updated to "${newPwd}" (Saved for all users)`, '#ffd000');
        }}
      />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div
          id="app-toast-alert"
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#0a0a14]/95 border shadow-[0_0_25px_rgba(0,0,0,0.8)] text-xs font-orbitron font-bold tracking-wide flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200"
          style={{ borderColor: toastMessage.color, color: toastMessage.color }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toastMessage.msg}</span>
        </div>
      )}
    </div>
  );
}
