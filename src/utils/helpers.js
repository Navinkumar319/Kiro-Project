export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export function timeAgo(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const then = new Date(dateString);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function generateComplaintId() {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 900) + 100);
  return `CMP-${year}-${num}`;
}

export function generateUserId(prefix = 'user') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export const PRIORITY_CONFIG = {
  low:      { label: 'Low',      color: 'bg-surface-700/40 text-surface-300 border border-surface-600/30', dot: 'bg-surface-400'   },
  medium:   { label: 'Medium',   color: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',       dot: 'bg-amber-400'     },
  high:     { label: 'High',     color: 'bg-orange-500/10 text-orange-300 border border-orange-500/20',    dot: 'bg-orange-400'    },
  critical: { label: 'Critical', color: 'bg-red-500/10 text-red-300 border border-red-500/20',             dot: 'bg-red-400'       },
};

export const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: 'bg-surface-700/60 text-surface-300 border border-surface-600/50',   dot: 'bg-surface-400', step: 1 },
  assigned:    { label: 'Assigned',    color: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',             dot: 'bg-blue-400',    step: 2 },
  in_progress: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',          dot: 'bg-amber-400',   step: 3 },
  resolved:    { label: 'Resolved',    color: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',    dot: 'bg-emerald-400', step: 4 },
};

export const CATEGORY_COLORS = {
  yellow:  { bg: 'bg-yellow-100',  text: 'text-yellow-700',  icon: 'text-yellow-600'  },
  gray:    { bg: 'bg-gray-100',    text: 'text-gray-700',    icon: 'text-gray-600'    },
  blue:    { bg: 'bg-blue-100',    text: 'text-blue-700',    icon: 'text-blue-600'    },
  indigo:  { bg: 'bg-indigo-100',  text: 'text-indigo-700',  icon: 'text-indigo-600'  },
  green:   { bg: 'bg-green-100',   text: 'text-green-700',   icon: 'text-green-600'   },
  red:     { bg: 'bg-red-100',     text: 'text-red-700',     icon: 'text-red-600'     },
  orange:  { bg: 'bg-orange-100',  text: 'text-orange-700',  icon: 'text-orange-600'  },
  cyan:    { bg: 'bg-cyan-100',    text: 'text-cyan-700',    icon: 'text-cyan-600'    },
  purple:  { bg: 'bg-purple-100',  text: 'text-purple-700',  icon: 'text-purple-600'  },
};
