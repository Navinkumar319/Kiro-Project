import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function SearchFilter({ search, onSearch, filters = [], className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 rounded-xl text-sm text-white placeholder-white/25 transition-all duration-200 focus:outline-none"
        />
      </div>
      {filters.map(f => (
        <div key={f.key} className="relative">
          <select
            value={f.value}
            onChange={e => f.onChange(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-brand-500/50 rounded-xl text-sm text-white/60 transition-all duration-200 focus:outline-none cursor-pointer"
          >
            {f.options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-surface-800 text-white">{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
