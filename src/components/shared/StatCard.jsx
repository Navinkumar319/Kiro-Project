import React from 'react';

const COLOR_MAP = {
  blue:   { gradient: 'from-blue-500 to-cyan-500',        bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20'   },
  green:  { gradient: 'from-emerald-500 to-teal-500',     bg: 'bg-emerald-500/10',text: 'text-emerald-400',border: 'border-emerald-500/20' },
  yellow: { gradient: 'from-amber-500 to-yellow-500',     bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20'   },
  orange: { gradient: 'from-orange-500 to-red-500',       bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20'  },
  red:    { gradient: 'from-red-500 to-rose-600',         bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20'     },
  purple: { gradient: 'from-violet-500 to-purple-600',    bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20'  },
  indigo: { gradient: 'from-brand-500 to-indigo-600',     bg: 'bg-brand-500/10',  text: 'text-brand-400',  border: 'border-brand-500/20'   },
  gray:   { gradient: 'from-surface-500 to-surface-600',  bg: 'bg-white/5',       text: 'text-white/50',   border: 'border-white/10'       },
};

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle, trend }) {
  const c = COLOR_MAP[color] || COLOR_MAP.blue;
  return (
    <div className={`relative bg-surface-900 border ${c.border} rounded-2xl p-5 overflow-hidden group hover:border-opacity-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}>
      {/* Subtle glow bg */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${c.bg} rounded-2xl`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider truncate">{title}</p>
          <p className={`text-3xl font-extrabold font-display mt-1.5 bg-gradient-to-br ${c.gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
          {subtitle && <p className="text-white/25 text-xs mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <p className={`text-xs mt-1.5 font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% this week
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0 ml-3 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
      </div>
    </div>
  );
}
