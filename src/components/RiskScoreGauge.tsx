import React from 'react';
import { RiskLevel } from '../types';

interface RiskScoreGaugeProps {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  size?: number;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ score, riskLevel, size = 120 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap: Record<RiskLevel, { stroke: string; text: string; glow: string }> = {
    safe: { stroke: '#10b981', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    low: { stroke: '#06b6d4', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    suspicious: { stroke: '#f59e0b', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    dangerous: { stroke: '#f43f5e', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
    critical: { stroke: '#ef4444', text: 'text-red-500', glow: 'shadow-red-500/30' },
  };

  const style = colorMap[riskLevel] || colorMap.safe;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Score Bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={style.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-extrabold font-mono ${style.text}`}>{score}</span>
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">/ 100 Risk</span>
      </div>
    </div>
  );
};
