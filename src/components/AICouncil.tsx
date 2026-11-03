import React from 'react';
import { Brain, Cpu, Radio, Shield, Atom, Ghost } from 'lucide-react';
import { PredictionSize } from '../types';

interface Props {
  votes: Record<string, { vote: PredictionSize; weight: number }>;
}

const NODES = [
  { name: 'Titan', icon: Brain, label: 'Dragon Breaker' },
  { name: 'Zodiac', icon: Cpu, label: 'Zigzag Pattern' },
  { name: 'Orion', icon: Radio, label: 'Markov Matrix' },
  { name: 'Phantom', icon: Ghost, label: 'Momentum Vector' },
  { name: 'Vector', icon: Atom, label: 'Pair Splitter' },
  { name: 'Quantum', icon: Shield, label: 'Consensus Core' }
];

export const AICouncil: React.FC<Props> = ({ votes }) => {
  return (
    <div
      id="ai-council-section"
      className="rounded-2xl bg-black/40 border border-white/[0.06] p-3.5 backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-orbitron font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5" /> AI QUANTUM COUNCIL (6 NODES)
        </span>
        <span className="text-[9px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          ALL ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {NODES.map(node => {
          const voteData = votes[node.name] || { vote: 'BIG', weight: 88 };
          const isBig = voteData.vote === 'BIG';
          const Icon = node.icon;

          return (
            <div
              key={node.name}
              className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-amber-400/30 transition-all text-center group"
            >
              <div className="flex items-center justify-center mb-1 text-gray-400 group-hover:text-amber-400 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-[9px] font-orbitron font-bold text-gray-200">{node.name}</div>
              <div className="text-[7px] text-gray-400 truncate mb-1">{node.label}</div>
              <div
                className={`text-[10px] font-orbitron font-black px-1.5 py-0.5 rounded-md border ${
                  isBig
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-400'
                }`}
              >
                {voteData.vote} ({voteData.weight}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
