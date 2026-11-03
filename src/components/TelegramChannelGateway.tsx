import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Lock, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  onVerified: () => void;
  onOpenAdmin?: () => void;
}

export const TelegramChannelGateway: React.FC<Props> = ({ onVerified, onOpenAdmin }) => {
  const [joinedChannel1, setJoinedChannel1] = useState(false);
  const [joinedChannel2, setJoinedChannel2] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const channel1Url = 'https://t.me/+ERxRWjTD_HYyNmVl';
  const channel2Url = 'https://t.me/+d-S6E1EUrBUwOTY1';

  const handleOpenChannel1 = () => {
    window.open(channel1Url, '_blank', 'noopener,noreferrer');
    setJoinedChannel1(true);
    setErrorMsg(null);
  };

  const handleOpenChannel2 = () => {
    window.open(channel2Url, '_blank', 'noopener,noreferrer');
    setJoinedChannel2(true);
    setErrorMsg(null);
  };

  const handleActivate = () => {
    if (!joinedChannel1 || !joinedChannel2) {
      setErrorMsg('Please join both Telegram Channel 1 & Channel 2 to activate live predictions.');
      return;
    }

    try {
      localStorage.setItem('nobita_channels_verified', 'true');
    } catch {
      // ignore
    }
    onVerified();
  };

  return (
    <div
      id="telegram-channel-gateway"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none"
    >
      {/* Background Ambient Glows */}
      <div className="absolute w-96 h-96 rounded-full bg-[#0088cc]/20 blur-[120px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

      <div
        id="gateway-card"
        className="w-full max-w-md bg-[#070e17]/98 border-2 border-[#0088cc]/50 rounded-3xl p-6 sm:p-7 text-center shadow-[0_0_60px_rgba(0,136,204,0.35)] relative overflow-hidden"
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#0088cc] to-transparent" />

        {/* Telegram Icon Header */}
        <div className="relative mx-auto w-16 h-16 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-[#0088cc]/30 blur-lg" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0088cc] to-[#005f8a] border border-cyan-400/50 flex items-center justify-center shadow-lg">
            <Send className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="font-orbitron text-xl sm:text-2xl font-black text-white tracking-wider">
          TELEGRAM VERIFICATION
        </h2>
        <p className="font-mono text-xs text-cyan-300 font-semibold mt-1 mb-4 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" /> JOIN BOTH CHANNELS TO ACTIVATE PREDICTOR
        </p>

        {/* Info Notice Box */}
        <div className="p-3 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/30 text-left text-[11px] font-mono text-gray-200 mb-4 space-y-1">
          <span className="font-orbitron font-bold text-cyan-300 block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Verification Instructions:
          </span>
          <p className="leading-relaxed">
            To unlock 100% active live predictions, you must be a member of both official VIP channels.
          </p>
        </div>

        {/* Channel 1 Card */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-[#0088cc]/30 text-left space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#0088cc]/20 text-cyan-300 font-orbitron font-black text-xs">
                CH-1
              </span>
              <div>
                <span className="font-orbitron font-bold text-white text-xs block">
                  VIP Official Community
                </span>
                <span className="text-[10px] font-mono text-gray-400 block">
                  Nobita X Prime VIP Channel
                </span>
              </div>
            </div>

            {joinedChannel1 ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-orbitron text-[9px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>JOINED</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-orbitron text-[9px] font-bold">
                PENDING
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenChannel1}
            className="w-full py-2 bg-gradient-to-r from-[#0088cc] to-[#006699] hover:brightness-110 active:scale-98 text-white font-orbitron font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>JOIN CHANNEL 1</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
          </button>
        </div>

        {/* Channel 2 Card */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-[#0088cc]/30 text-left space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#0088cc]/20 text-cyan-300 font-orbitron font-black text-xs">
                CH-2
              </span>
              <div>
                <span className="font-orbitron font-bold text-white text-xs block">
                  Signals & Results Hub
                </span>
                <span className="text-[10px] font-mono text-gray-400 block">
                  Live Results & Quantum Feeds
                </span>
              </div>
            </div>

            {joinedChannel2 ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-orbitron text-[9px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>JOINED</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-orbitron text-[9px] font-bold">
                PENDING
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenChannel2}
            className="w-full py-2 bg-gradient-to-r from-[#0088cc] to-[#006699] hover:brightness-110 active:scale-98 text-white font-orbitron font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>JOIN CHANNEL 2</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
          </button>
        </div>

        {/* Error Alert if User Tries to Skip */}
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-[11px] font-mono flex items-center gap-2 mb-3 text-left animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Final Activation Button */}
        <button
          type="button"
          onClick={handleActivate}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 hover:brightness-110 active:scale-98 text-white font-orbitron font-black text-xs tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer transition-all"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>I HAVE JOINED BOTH CHANNELS — UNLOCK NOW</span>
        </button>

        <p className="mt-3 text-[10px] font-mono text-gray-500">
          * Click activate after confirming your membership in both channels
        </p>
      </div>
    </div>
  );
};
