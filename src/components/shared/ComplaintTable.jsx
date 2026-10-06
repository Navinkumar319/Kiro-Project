import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, MapPin, Clock } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { formatDate } from '../../utils/helpers';

export default function ComplaintTable({ complaints, basePath = '/student', emptyMessage = 'No complaints found.' }) {
  const navigate = useNavigate();

  if (!complaints?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-6 h-6 text-white/20" />
        </div>
        <p className="text-white/30 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {['ID', 'Title', 'Category', 'Location', 'Priority', 'Status', 'Date', ''].map((h) => (
              <th key={h} className={`text-left text-[10px] font-bold text-white/25 uppercase tracking-widest pb-3 pr-4 ${h === 'Category' ? 'hidden md:table-cell' : ''} ${h === 'Location' || h === 'Date' ? 'hidden lg:table-cell' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group">
              <td className="py-3.5 pr-4">
                <span className="font-mono text-[10px] text-white/25 bg-white/[0.04] px-2 py-1 rounded-lg">{c.id}</span>
              </td>
              <td className="py-3.5 pr-4">
                <p className="font-semibold text-white/80 text-sm line-clamp-1 max-w-[180px] group-hover:text-white transition-colors">{c.title}</p>
                <p className="text-xs text-white/30 mt-0.5 md:hidden">{c.categoryName}</p>
              </td>
              <td className="py-3.5 pr-4 hidden md:table-cell">
                <span className="text-xs text-white/40 bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-lg">{c.categoryName}</span>
              </td>
              <td className="py-3.5 pr-4 hidden lg:table-cell">
                <div className="flex items-center gap-1.5 text-white/35 text-xs">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="line-clamp-1 max-w-[140px]">{c.location}</span>
                </div>
              </td>
              <td className="py-3.5 pr-4"><PriorityBadge priority={c.priority} /></td>
              <td className="py-3.5 pr-4"><StatusBadge status={c.status} /></td>
              <td className="py-3.5 pr-4 hidden lg:table-cell text-xs text-white/25">{formatDate(c.createdAt)}</td>
              <td className="py-3.5">
                <button
                  onClick={() => navigate(`${basePath}/complaints/${c.id}`)}
                  className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-brand-500/10 transition-all duration-150"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
