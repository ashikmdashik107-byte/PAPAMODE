import React, { useState } from 'react';

/**
 * Official WinGo 3D Lottery Ball Asset Database
 */
export const BALL_IMAGES: Record<number, string> = {
  0: 'https://i.postimg.cc/Wzrp0gRV/ball-0-053d2b99.png',
  1: 'https://i.postimg.cc/Qt7ZzDfk/ball-1-12ea01b7.png',
  2: 'https://i.postimg.cc/zvSZJjZy/ball-2-7d433738.png',
  3: 'https://i.postimg.cc/7hyr8Rcv/ball-3-a91cceac.png',
  4: 'https://i.postimg.cc/WbTc5Qgg/ball-4-cad06388.png',
  5: 'https://i.postimg.cc/28GRM27J/ball-5-8e182f0c.png',
  6: 'https://i.postimg.cc/c1QNMsgd/ball-6-44a39882.png',
  7: 'https://i.postimg.cc/2S5RDhH5/ball-7-c8babe29.png',
  8: 'https://i.postimg.cc/R03k39x5/ball-8-9d781b7c.png',
  9: 'https://i.postimg.cc/cL5q4CjB/ball-9-19985870.png'
};

export function getBallImageUrl(num: number | string | undefined): string {
  const n = typeof num === 'string' ? parseInt(num, 10) : num;
  if (n !== undefined && !isNaN(n) && BALL_IMAGES[n]) {
    return BALL_IMAGES[n];
  }
  return BALL_IMAGES[0];
}

export function getBallColorType(num: number): 'RED' | 'GREEN' | 'VIOLET' | 'RED_VIOLET' | 'GREEN_VIOLET' {
  if (num === 0) return 'RED_VIOLET';
  if (num === 5) return 'GREEN_VIOLET';
  if ([1, 3, 7, 9].includes(num)) return 'GREEN';
  return 'RED';
}

export function isBallBig(num: number): boolean {
  return num >= 5;
}

interface BallDisplayProps {
  num: number | string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'huge';
  showLabel?: boolean;
  pulse?: boolean;
  glow?: boolean;
  shimmer?: boolean;
  levitate?: boolean;
  className?: string;
  badge?: string;
}

const SIZE_CLASSES = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-2xl',
  huge: 'w-24 h-24 md:w-28 md:h-28 text-3xl'
};

export const BallDisplay: React.FC<BallDisplayProps> = ({
  num,
  size = 'md',
  showLabel = false,
  pulse = false,
  glow = true,
  shimmer = false,
  levitate = false,
  className = '',
  badge
}) => {
  const [imgError, setImgError] = useState(false);
  const n = typeof num === 'string' ? parseInt(num, 10) : num;
  const validNum = isNaN(n) ? 0 : Math.min(Math.max(n, 0), 9);
  const imgUrl = BALL_IMAGES[validNum];
  const isBig = validNum >= 5;
  const colorType = getBallColorType(validNum);

  const getGlowShadow = () => {
    if (!glow) return '';
    if (colorType === 'GREEN' || colorType === 'GREEN_VIOLET') {
      return 'drop-shadow-[0_0_18px_rgba(0,255,136,0.7)]';
    }
    if (colorType === 'RED' || colorType === 'RED_VIOLET') {
      return 'drop-shadow-[0_0_18px_rgba(255,42,75,0.7)]';
    }
    return 'drop-shadow-[0_0_18px_rgba(168,85,247,0.7)]';
  };

  const getFallbackGradient = () => {
    if (colorType === 'RED_VIOLET') {
      return 'bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 text-white';
    }
    if (colorType === 'GREEN_VIOLET') {
      return 'bg-gradient-to-tr from-emerald-500 via-teal-600 to-purple-600 text-white';
    }
    if (colorType === 'GREEN') {
      return 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white';
    }
    return 'bg-gradient-to-tr from-rose-600 to-red-400 text-white';
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center shrink-0 ${levitate ? 'anim-norbe anim-ball-levitate' : ''} ${className}`}>
      {/* Glittering Sparkle Stars (Jolmol Effect) */}
      {shimmer && (
        <>
          <span className="absolute -top-2 -left-2 text-amber-300 text-sm anim-star-twinkle pointer-events-none select-none z-20">
            ✨
          </span>
          <span className="absolute -bottom-1.5 -right-2 text-cyan-300 text-sm anim-star-twinkle pointer-events-none select-none z-20" style={{ animationDelay: '0.4s' }}>
            ✨
          </span>
          <span className="absolute -top-2.5 right-1.5 text-emerald-300 text-xs anim-star-twinkle pointer-events-none select-none z-20" style={{ animationDelay: '0.8s' }}>
            ✦
          </span>
          <span className="absolute bottom-0 left-0 text-yellow-200 text-[10px] anim-star-twinkle pointer-events-none select-none z-20" style={{ animationDelay: '1.1s' }}>
            ❇
          </span>
          {/* Shimmer Radiant Aura (Jolmol Glow) */}
          <div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-amber-400/35 via-white/40 to-emerald-400/35 blur-md anim-jolmol anim-ball-shimmer pointer-events-none" />
        </>
      )}

      {/* 3D Ball Image / Render */}
      <div
        className={`relative flex items-center justify-center transition-transform duration-300 ${
          SIZE_CLASSES[size]
        } ${pulse ? 'animate-bounce' : ''} ${getGlowShadow()}`}
      >
        {!imgError ? (
          <img
            src={imgUrl}
            alt={`Ball ${validNum}`}
            className="w-full h-full object-contain filter select-none transition-transform hover:scale-110 active:scale-95 duration-200"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full rounded-full flex items-center justify-center font-orbitron font-black shadow-inner border border-white/30 ${getFallbackGradient()}`}
          >
            {validNum}
          </div>
        )}

        {/* Optional Badge */}
        {badge && (
          <span className="absolute -top-1 -right-1.5 px-1.5 py-0.2 rounded-full text-[8px] font-orbitron font-extrabold bg-amber-400 text-black border border-white shadow-md z-10">
            {badge}
          </span>
        )}
      </div>

      {/* Optional Under-ball Label */}
      {showLabel && (
        <span
          className={`mt-1 font-orbitron font-bold text-[9px] px-1.5 py-0.2 rounded ${
            isBig
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
              : 'text-red-400 bg-red-500/10 border border-red-500/30'
          }`}
        >
          {validNum} ({isBig ? 'BIG' : 'SMALL'})
        </span>
      )}
    </div>
  );
};
