import React from 'react';

interface EagleWingProps {
  side: 'left' | 'right';
  className?: string;
}

export const EagleWing: React.FC<EagleWingProps> = ({ side, className = '' }) => {
  const isRight = side === 'right';

  return (
    <div
      className={`pointer-events-none select-none flex items-center justify-center ${className} ${
        isRight ? 'scale-x-[-1]' : ''
      }`}
      style={{
        filter: 'drop-shadow(0 0 16px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 30px rgba(255, 42, 75, 0.35))'
      }}
    >
      <svg
        viewBox="0 0 220 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full anim-eagle-wings"
      >
        <defs>
          {/* Cyber Metallic Gold-Red Gradients */}
          <linearGradient id={`goldGrad-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff2a1" />
            <stop offset="25%" stopColor="#ffd700" />
            <stop offset="65%" stopColor="#ff9900" />
            <stop offset="100%" stopColor="#ff2a4b" />
          </linearGradient>

          <linearGradient id={`wingFeather1-${side}`} x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#ffe066" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ff9900" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7a0018" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id={`wingFeather2-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffd700" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ff0055" stopOpacity="0.95" />
          </linearGradient>

          <filter id={`glow-${side}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Longest Primary Flight Feathers (Topmost Spread) */}
        <path
          d="M 210,130 C 180,60 120,10 10,2 C 40,25 90,65 145,115 C 100,65 50,35 25,25 C 55,60 110,105 160,140 C 115,100 70,75 45,68 C 80,110 130,150 175,170 Z"
          fill={`url(#goldGrad-${side})`}
          stroke="#fff5b8"
          strokeWidth="1.5"
          filter={`url(#glow-${side})`}
        />

        {/* Secondary Long Feathers (Mid Tier Wing Plumes) */}
        <path
          d="M 210,140 C 170,120 90,95 40,90 C 80,130 130,165 185,185 C 130,150 85,130 55,130 C 95,165 145,195 195,210 Z"
          fill={`url(#wingFeather1-${side})`}
          stroke="#ffd700"
          strokeWidth="1.2"
        />

        {/* Third Tier Downward Flight Feathers */}
        <path
          d="M 205,175 C 160,175 105,175 70,185 C 110,205 155,225 198,235 C 145,225 105,230 85,245 C 125,255 165,260 200,260 Z"
          fill={`url(#wingFeather2-${side})`}
          stroke="#00ffff"
          strokeWidth="1"
        />

        {/* Inner Covert Feathers (Base Wing Shoulder) */}
        <path
          d="M 215,110 C 190,130 175,170 185,210 C 195,240 215,260 220,270 C 215,240 210,190 215,110 Z"
          fill={`url(#goldGrad-${side})`}
          opacity="0.9"
        />

        {/* Glowing Cyber Accent Quill Lines */}
        <path
          d="M 210,130 Q 120,60 12,5"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          opacity="0.8"
        />
        <path
          d="M 205,145 Q 130,110 30,30"
          stroke="#ffd700"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <path
          d="M 200,165 Q 135,145 50,75"
          stroke="#00ffea"
          strokeWidth="1.2"
          opacity="0.75"
        />
        <path
          d="M 195,190 Q 140,185 60,135"
          stroke="#ff2a4b"
          strokeWidth="1.2"
          opacity="0.75"
        />

        {/* Decorative Golden Star Gems on Wing Joint */}
        <circle cx="205" cy="140" r="4" fill="#ffffff" filter={`url(#glow-${side})`} />
        <circle cx="195" cy="175" r="3" fill="#ffd700" />
        <circle cx="185" cy="210" r="3" fill="#00ffff" />
      </svg>
    </div>
  );
};
