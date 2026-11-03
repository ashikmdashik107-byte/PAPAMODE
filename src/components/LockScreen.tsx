import React, { useState, useEffect } from 'react';
import {
  Lock,
  Shield,
  KeyRound,
  Send,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Cpu,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import {
  ADMIN_PASSWORD,
  getStoredPredictorPassword,
  setStoredPredictorPassword
} from './AdminPanelModal';

interface Props {
  onUnlock: () => void;
  onOpenAdmin: () => void;
}

export const LockScreen: React.FC<Props> = ({ onUnlock, onOpenAdmin }) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAdminDetected, setIsAdminDetected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Sync password from server on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/predictor-password')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.password) {
          setStoredPredictorPassword(data.password);
        }
      })
      .catch(() => {
        // Silently use cached/default
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();

    if (!trimmed) {
      setErrorMsg('⚠️ Please enter the VIP password.');
      return;
    }

    // Check if input is Secret Admin Password
    if (trimmed === ADMIN_PASSWORD) {
      setIsAdminDetected(true);
      setErrorMsg('');
      setTimeout(() => {
        setIsAdminDetected(false);
        setPassword('');
        onOpenAdmin();
      }, 250);
      return;
    }

    // Verify against centralized server database
    setIsVerifying(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed })
      });

      const data = await res.json();
      if (res.ok && data.success && data.isPredictor) {
        setIsSuccess(true);
        setErrorMsg('');
        setStoredPredictorPassword(trimmed);
        setTimeout(() => {
          onUnlock();
        }, 250);
      } else {
        setErrorMsg('❌ INCORRECT PASSWORD! Access strictly denied without valid VIP key.');
      }
    } catch (err) {
      // Offline fallback: check against cached/default password
      const local = getStoredPredictorPassword();
      if (trimmed === local) {
        setIsSuccess(true);
        setErrorMsg('');
        setTimeout(() => {
          onUnlock();
        }, 250);
      } else {
        setErrorMsg('❌ INCORRECT PASSWORD! Access strictly denied without valid VIP key.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      id="lock-screen-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030104] select-none"
    >
      {/* Static Background Cyber Accent Rings (Zero Animation) */}
      <div className="absolute w-96 h-96 rounded-full border border-red-500/10 pointer-events-none opacity-20" />
      <div className="absolute w-[500px] h-[500px] rounded-full border border-amber-500/10 pointer-events-none opacity-15" />

      <div
        id="lock-card"
        className="w-full max-w-md bg-[#0d0206] border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.95)] relative overflow-hidden"
      >
        {/* Top Accent Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-red-600" />

        {/* Lock Security Shield Icon (Static) */}
        <div className="relative mx-auto w-16 h-16 mb-3 flex items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#1a0309] to-[#0d0206] border-2 border-red-500/50 flex items-center justify-center shadow-inner">
            {isAdminDetected ? (
              <ShieldAlert className="w-8 h-8 text-amber-300" />
            ) : isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : (
              <Lock className="w-8 h-8 text-red-400" />
            )}
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-black" />
          </span>
        </div>

        {/* Title */}
        <h1 className="font-orbitron text-xl sm:text-2xl font-black tracking-wider text-amber-300 drop-shadow-md">
          👑 NOBITA X PRIME MODZ 👑
        </h1>
        <p className="font-orbitron text-[10px] tracking-[2px] text-amber-400/90 uppercase font-bold mt-1 mb-4 flex items-center justify-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-red-400" /> SECURE VIP ACCESS GATEWAY
        </p>

        {/* Encrypted Notice Banner */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-red-500/30 text-left space-y-1 mb-5">
          <div className="flex items-center justify-between">
            <span className="font-orbitron text-[10px] font-bold text-amber-300 flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-400" /> ENCRYPTED LOGIN GATEWAY
            </span>
            <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              PROTECTED
            </span>
          </div>
          <p className="text-[11px] font-mono text-gray-300 leading-relaxed">
            Enter the secret VIP password to access the terminal. All keys are encrypted and zero-leak protected.
          </p>
        </div>

        {/* Form with Secure Hidden Password Input */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-orbitron font-bold text-gray-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>ACCESS PASSWORD:</span>
            </label>

            {/* Completely hidden password field: type="password", zero-leak protection */}
            <div className="relative">
              <input
                id="vip-login-password-input"
                type="password"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-3 bg-black/80 border-2 border-red-500/40 focus:border-amber-400 rounded-2xl text-white font-mono text-base tracking-widest outline-none placeholder:text-gray-600 shadow-inner"
              />
            </div>
          </div>

          {/* Error Message Box (Static, No Animation) */}
          {errorMsg && (
            <div
              id="password-error-alert"
              className="p-3 rounded-xl bg-red-500/15 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {/* Success / Admin Detected Alert (Static) */}
          {isAdminDetected && (
            <div
              id="password-admin-alert"
              className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Admin credentials authorized! Opening Admin Panel...</span>
            </div>
          )}

          {isSuccess && (
            <div
              id="password-success-alert"
              className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Password verified! Launching VIP Dashboard...</span>
            </div>
          )}

          {/* Unlock Submit Button (Static, No Pulse Animation) */}
          <button
            type="submit"
            id="unlock-vip-submit-btn"
            disabled={isSuccess || isAdminDetected || isVerifying}
            className="w-full py-3.5 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:brightness-110 active:scale-98 text-white font-orbitron font-extrabold text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,42,75,0.35)] disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>VERIFYING CREDENTIALS...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>UNLOCK VIP TERMINAL</span>
              </>
            )}
          </button>
        </form>

        {/* Telegram Direct Support Link */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.08] space-y-2">
          <p className="text-[10px] font-mono text-gray-400">
            Need password? Contact admin on Telegram:
          </p>
          <a
            href="https://t.me/mdashik107"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-[#0088cc] hover:bg-[#0099e6] active:scale-98 text-white font-orbitron font-bold text-xs tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>@mdashik107 (TELEGRAM ADMIN)</span>
          </a>
        </div>

        {/* Footer Sentinel Status (Static) */}
        <div className="mt-3 text-[9px] font-mono text-gray-500 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>ZERO-LEAK MILITARY GRADE SECURITY ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
