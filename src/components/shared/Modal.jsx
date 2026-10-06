import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SIZE = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className={`relative bg-surface-900 border border-white/10 rounded-3xl shadow-premium w-full ${SIZE[size]} max-h-[90vh] flex flex-col animate-scale-in`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white font-display">{title}</h2>
          <button onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/[0.06] text-white/30 hover:text-white transition-all duration-150">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
