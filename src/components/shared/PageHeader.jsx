import React from 'react';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-extrabold text-white font-display">{title}</h2>
        {subtitle && <p className="text-white/40 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
