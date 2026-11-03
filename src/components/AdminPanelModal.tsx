import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  X,
  Lock,
  ArrowRight,
  Loader2,
  Globe
} from 'lucide-react';
import { copyToClipboard } from '../utils/formatter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUnlockPredictor: () => void;
  onPasswordChanged: (newPassword: string) => void;
}

export const DEFAULT_PREDICTOR_PASSWORD = 'NOBITA-X-PRIME';
export const ADMIN_PASSWORD = 'NOBITA-X-ADMIN';

export const getStoredPredictorPassword = (): string => {
  return localStorage.getItem('nobita_predictor_password') || DEFAULT_PREDICTOR_PASSWORD;
};

export const setStoredPredictorPassword = (newPwd: string): void => {
  localStorage.setItem('nobita_predictor_password', newPwd.trim());
};

export const AdminPanelModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUnlockPredictor,
  onPasswordChanged
}) => {
  const [currentPassword, setCurrentPassword] = useState(getStoredPredictorPassword);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Synchronize with server on modal open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    fetch('/api/predictor-password')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.password) {
          setCurrentPassword(data.password);
          setStoredPredictorPassword(data.password);
        }
      })
      .catch(err => {
        console.warn('Could not fetch predictor password from server, using local:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCurrent = async () => {
    const success = await copyToClipboard(currentPassword);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPasswordInput.trim();

    if (!trimmed) {
      setFeedbackMsg({ text: '⚠️ New password cannot be empty!', type: 'error' });
      return;
    }

    if (trimmed === ADMIN_PASSWORD) {
      setFeedbackMsg({
        text: '⚠️ Cannot set predictor password to ADMIN password!',
        type: 'error'
      });
      return;
    }

    setIsSaving(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch('/api/predictor-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword: ADMIN_PASSWORD,
          newPassword: trimmed
        })
      });

      const data = await res.json();
      if (data.success && data.password) {
        setStoredPredictorPassword(data.password);
        setCurrentPassword(data.password);
        onPasswordChanged(data.password);
        setNewPasswordInput('');
        setFeedbackMsg({
          text: `✅ Permanent server password saved! All users worldwide must now use "${data.password}" to log in.`,
          type: 'success'
        });
      } else {
        throw new Error(data.message || data.error || 'Server rejected password update');
      }
    } catch (err: any) {
      // Local fallback with warning
      setStoredPredictorPassword(trimmed);
      setCurrentPassword(trimmed);
      onPasswordChanged(trimmed);
      setNewPasswordInput('');
      setFeedbackMsg({
        text: `⚠️ Saved locally ("${trimmed}"). Server error: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = async () => {
    setIsSaving(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch('/api/predictor-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword: ADMIN_PASSWORD
        })
      });

      const data = await res.json();
      if (data.success && data.password) {
        setStoredPredictorPassword(data.password);
        setCurrentPassword(data.password);
        onPasswordChanged(data.password);
        setFeedbackMsg({
          text: `🔄 Server reset successful! Default login password "${data.password}" is now active for all users.`,
          type: 'success'
        });
      } else {
        throw new Error(data.message || data.error || 'Reset failed');
      }
    } catch (err: any) {
      setStoredPredictorPassword(DEFAULT_PREDICTOR_PASSWORD);
      setCurrentPassword(DEFAULT_PREDICTOR_PASSWORD);
      onPasswordChanged(DEFAULT_PREDICTOR_PASSWORD);
      setFeedbackMsg({
        text: `🔄 Reset locally to "${DEFAULT_PREDICTOR_PASSWORD}". (${err.message})`,
        type: 'success'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="admin-panel-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-[#0c0207]/98 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-7 text-center shadow-[0_0_60px_rgba(255,208,0,0.35)] overflow-hidden">
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-red-600" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Admin Shield Icon */}
        <div className="relative mx-auto w-16 h-16 mb-2 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-amber-500/30 blur-lg" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1f1002] to-[#0d0206] border-2 border-amber-400 flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-7 h-7 text-amber-300" />
          </div>
        </div>

        {/* Title */}
        <h2 className="font-orbitron text-lg sm:text-xl font-black text-amber-300 tracking-wider">
          👑 NOBITA X ADMIN PANEL 👑
        </h2>
        <p className="font-orbitron text-[10px] tracking-[2px] text-gray-400 uppercase font-bold mt-0.5 mb-4">
          PREDICTOR SECURITY & ACCESS CONTROL
        </p>

        {/* Current Active Password Box */}
        <div className="bg-black/80 border border-amber-500/40 rounded-2xl p-4 text-left mb-4 shadow-inner">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-orbitron font-extrabold text-amber-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              CURRENT PREDICTOR PASSWORD:
            </span>
            <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" /> GLOBAL (ALL USERS)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 font-mono text-sm tracking-wider text-white">
              {showCurrentPassword ? (
                <span className="text-amber-300 font-bold">{currentPassword}</span>
              ) : (
                <span className="text-gray-500 tracking-widest">••••••••••••••</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-gray-300 transition-colors cursor-pointer"
              title={showCurrentPassword ? 'Hide Password' : 'View Password'}
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={handleCopyCurrent}
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-colors cursor-pointer"
              title="Copy Password"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-3 text-left mb-4">
          <div className="space-y-1">
            <label className="text-[10px] font-orbitron font-extrabold text-gray-300 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              CHANGE LOGIN PASSWORD FOR ALL USERS:
            </label>
            <input
              type="text"
              value={newPasswordInput}
              onChange={e => {
                setNewPasswordInput(e.target.value);
                if (feedbackMsg) setFeedbackMsg(null);
              }}
              placeholder="Enter new predictor password..."
              className="w-full px-4 py-2.5 bg-black/80 border border-amber-500/40 focus:border-amber-300 rounded-xl text-white font-mono text-xs tracking-wider outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:brightness-110 active:scale-98 text-black font-orbitron font-black text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,208,0,0.3)] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'UPDATING SERVER...' : 'SAVE & UPDATE LOGIN PASSWORD (ALL USERS)'}</span>
          </button>
        </form>

        {/* Feedback Message Alert */}
        {feedbackMsg && (
          <div
            className={`p-2.5 rounded-xl text-xs font-mono mb-4 text-left ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/15 border border-red-500/40 text-red-300'
            }`}
          >
            {feedbackMsg.text}
          </div>
        )}

        {/* Action Controls */}
        <div className="space-y-2 pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onUnlockPredictor}
            className="w-full py-3 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:brightness-110 active:scale-98 text-white font-orbitron font-black text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,42,75,0.4)]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>LAUNCH PREDICTOR (ENTER AS ADMIN)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefault}
              className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-400 hover:text-white font-orbitron text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET DEFAULT</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-400 hover:text-white font-orbitron text-[10px] font-bold transition-colors cursor-pointer"
            >
              CLOSE PANEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
