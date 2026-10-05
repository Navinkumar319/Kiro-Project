import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, User, Menu, ChevronDown, CheckCheck, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/helpers';

const ROLE_CONFIG = {
  admin:   { gradient: 'from-violet-500 to-purple-600',  badge: 'bg-violet-500/10 text-violet-300 border border-violet-500/20' },
  staff:   { gradient: 'from-blue-500 to-cyan-600',      badge: 'bg-blue-500/10 text-blue-300 border border-blue-500/20' },
  student: { gradient: 'from-emerald-500 to-teal-600',   badge: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' },
};

const NOTIF_STYLES = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  error:   'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Navbar({ onMenuToggle, title }) {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationRead, markAllRead } = useData();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifsRef = useRef(null);
  const profileRef = useRef(null);
  const rc = ROLE_CONFIG[currentUser?.role] || ROLE_CONFIG.student;

  const userNotifs = notifications
    .filter(n => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const unread = userNotifs.filter(n => !n.read).length;

  useEffect(() => {
    function h(e) {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  function handleLogout() { logout(); navigate('/login'); }

  function profilePath() {
    if (currentUser?.role === 'admin') return '/admin/settings';
    if (currentUser?.role === 'staff') return '/staff/profile';
    return '/student/profile';
  }

  return (
    <header className="h-16 bg-surface-950/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle}
          className="p-2 rounded-xl hover:bg-white/[0.06] lg:hidden text-white/50 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-white font-display">{title}</h1>
          <p className="text-white/30 text-xs capitalize">{currentUser?.role} Portal</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            className="relative p-2.5 rounded-xl hover:bg-white/[0.06] text-white/40 hover:text-white transition-all duration-150"
          >
            <Bell className="w-4.5 h-4.5 w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-br from-brand-500 to-violet-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold shadow-glow-sm">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-premium overflow-hidden animate-scale-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="font-bold text-white text-sm font-display">Notifications</span>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button onClick={() => markAllRead(currentUser?.id)}
                      className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                  <button onClick={() => setShowNotifs(false)} className="text-white/30 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
                {userNotifs.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell className="w-8 h-8 text-white/10 mx-auto mb-2" />
                    <p className="text-white/30 text-sm">No notifications yet</p>
                  </div>
                ) : userNotifs.map(n => (
                  <div key={n.id} onClick={() => { markNotificationRead(n.id); setShowNotifs(false); }}
                    className={`px-4 py-3 cursor-pointer hover:bg-white/[0.04] transition-colors ${!n.read ? 'bg-brand-500/5' : ''}`}>
                    <div className="flex items-start gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${NOTIF_STYLES[n.type] || NOTIF_STYLES.info}`}>
                        {n.type}
                      </span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1 flex-shrink-0" />}
                    </div>
                    <p className="text-sm font-semibold text-white/80">{n.title}</p>
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-white/20 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-all duration-150"
          >
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${rc.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-white text-xs font-semibold leading-tight font-display">{currentUser?.name}</p>
              <span className={`text-[10px] px-1.5 py-px rounded-full font-semibold capitalize ${rc.badge}`}>
                {currentUser?.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/30 hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-premium overflow-hidden animate-scale-in z-50">
              <div className="p-2">
                <button onClick={() => { navigate(profilePath()); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors font-medium">
                  <User className="w-4 h-4" /> My Profile
                </button>
                <div className="border-t border-white/[0.06] my-1" />
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors font-medium">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
