import React from 'react';

const STATUS_CFG = {
  pending:     { label: 'Pending',     classes: 'bg-surface-700/60 text-surface-300 border-surface-600/50',     dot: 'bg-surface-400' },
  assigned:    { label: 'Assigned',    classes: 'bg-blue-500/10 text-blue-300 border-blue-500/20',              dot: 'bg-blue-400' },
  in_progress: { label: 'In Progress', classes: 'bg-amber-500/10 text-amber-300 border-amber-500/20',           dot: 'bg-amber-400' },
  resolved:    { label: 'Resolved',    classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',     dot: 'bg-emerald-400' },
};

const PRIORITY_CFG = {
  low:      { label: 'Low',      classes: 'bg-surface-700/40 text-surface-400 border-surface-600/30',  dot: 'bg-surface-400' },
  medium:   { label: 'Medium',   classes: 'bg-amber-500/10 text-amber-300 border-amber-500/20',        dot: 'bg-amber-400'   },
  high:     { label: 'High',     classes: 'bg-orange-500/10 text-orange-300 border-orange-500/20',     dot: 'bg-orange-400'  },
  critical: { label: 'Critical', classes: 'bg-red-500/10 text-red-300 border-red-500/20',              dot: 'bg-red-400 animate-pulse' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CFG[priority] || PRIORITY_CFG.low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
