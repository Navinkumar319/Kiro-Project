import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

const STATUS_CFG = {
  pending:     { label: 'Pending',     color: 'bg-surface-700/60 text-surface-300 border-surface-600/40' },
  assigned:    { label: 'Assigned',    color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  in_progress: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  resolved:    { label: 'Resolved',    color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
};

export default function StatusTimeline({ history = [] }) {
  if (!history.length) return null;
  return (
    <div className="space-y-0">
      {history.map((entry, idx) => {
        const isLast = idx === history.length - 1;
        const cfg = STATUS_CFG[entry.status] || STATUS_CFG.pending;
        return (
          <div key={idx} className="flex gap-4">
            {/* Icon column */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isLast ? 'bg-brand-500/15 border border-brand-500/20' : 'bg-white/[0.04] border border-white/[0.08]'}`}>
                {isLast
                  ? <Clock className="w-4 h-4 text-brand-400" />
                  : <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                }
              </div>
              {!isLast && <div className="w-px flex-1 bg-white/[0.06] my-1" />}
            </div>
            {/* Content */}
            <div className={`pb-5 flex-1 min-w-0`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
                  {cfg.label}
                </span>
                <span className="text-xs text-white/25">{formatDateTime(entry.timestamp)}</span>
              </div>
              {entry.note && <p className="text-sm text-white/50 mt-1.5 leading-relaxed">{entry.note}</p>}
              <p className="text-xs text-white/25 mt-1">by {entry.updatedBy}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
