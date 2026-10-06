import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      {Icon && (
        <div className="w-16 h-16 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Icon className="w-7 h-7 text-white/15" />
        </div>
      )}
      <h3 className="text-base font-bold text-white/60 font-display mb-1">{title}</h3>
      {description && <p className="text-sm text-white/30 max-w-sm mx-auto mt-1">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
