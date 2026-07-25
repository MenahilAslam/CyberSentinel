import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, XCircle, AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, showIcon = true, size = 'md' }) => {
  const configs: Record<
    RiskLevel,
    { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    safe: {
      label: 'Safe',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: ShieldCheck,
    },
    low: {
      label: 'Low Risk',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      icon: ShieldCheck,
    },
    suspicious: {
      label: 'Suspicious',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: AlertTriangle,
    },
    dangerous: {
      label: 'Dangerous',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      icon: ShieldAlert,
    },
    critical: {
      label: 'Critical Threat',
      bg: 'bg-red-600/20',
      text: 'text-red-400',
      border: 'border-red-500/50',
      icon: AlertOctagon,
    },
  };

  const config = configs[level] || configs.safe;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono uppercase tracking-wider ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
};
