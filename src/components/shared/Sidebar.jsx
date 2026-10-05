import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, GraduationCap, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ROLE_CONFIG = {
  admin:   { gradient: 'from-violet-500 to-purple-600',  accent: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
  staff:   { gradient: 'from-blue-500 to-cyan-600',      accent: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  student: { gradient: 'from-emerald-500 to-teal-600',   accent: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
};

export default function Sidebar({ navItems, isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const rc = ROLE_CONFIG[currentUser?.role] || ROLE_CONFIG.student;

  function handleLogout() { logout(); navigate('/login'); }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-surface-950 border-r border-white/[0.06]
        flex flex-col z-50 transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${rc.gradient} flex items-center justify-center shadow-glow-sm flex-shrink-0`}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm font-display leading-tight">Smart Campus</p>
              <p className="text-white/30 text-xs">v1.0</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white lg:hidden p-1 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${rc.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate font-display">{currentUser?.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${rc.accent}`}>
                {currentUser?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {navItems.map((item, idx) => {
            if (item.type === 'section') {
              return (
                <p key={idx} className="text-white/20 text-[10px] font-bold uppercase tracking-widest px-3 pt-5 pb-2 first:pt-2">
                  {item.label}
                </p>
              );
            }
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 group ${
                    isActive
                      ? `bg-gradient-to-r ${rc.gradient} text-white shadow-sm`
                      : 'text-white/40 hover:text-white hover:bg-white/[0.06]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 ${isActive ? '' : 'group-hover:scale-110'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
