import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import StatCard from '../../components/shared/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/shared/StatusBadge';
import { StatusPieChart } from '../../components/charts/ComplaintCharts';
import { timeAgo } from '../../utils/helpers';

export default function StaffDashboard() {
  const { currentUser } = useAuth();
  const { getComplaintsByStaff } = useData();
  const navigate = useNavigate();

  const all = getComplaintsByStaff(currentUser?.id);
  const waiting = all.filter(c => c.status === 'assigned').length;
  const inProg = all.filter(c => c.status === 'in_progress').length;
  const resolved = all.filter(c => c.status === 'resolved').length;
  const urgent = all.filter(c => (c.priority==='critical'||c.priority==='high') && c.status !== 'resolved').length;

  const active = [...all].filter(c => c.status !== 'resolved')
    .sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,5);

  const chartData = [
    { name: 'Assigned', value: waiting },
    { name: 'In Progress', value: inProg },
    { name: 'Resolved', value: resolved },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900 via-cyan-900/60 to-surface-900 border border-white/[0.08] p-6 lg:p-8">
        <div className="absolute inset-0 bg-hero-mesh opacity-30" />
        <div className="absolute top-0 right-0 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-white/40 text-sm font-medium">Welcome back,</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white font-display mt-1">{currentUser?.name}</h2>
          <p className="text-white/40 text-sm mt-1">{currentUser?.designation} · {currentUser?.staffId}</p>
          {urgent > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              {urgent} urgent complaint{urgent > 1 ? 's' : ''} need attention
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assigned" value={all.length} icon={ClipboardList} color="blue" />
        <StatCard title="Waiting" value={waiting} icon={Clock} color="yellow" />
        <StatCard title="In Progress" value={inProg} icon={Loader2} color="orange" />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle2} color="green" />
      </div>

      {/* Chart + Active */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-1">My Status</h3>
          <p className="text-white/30 text-xs mb-4">Work distribution</p>
          {chartData.length > 0
            ? <StatusPieChart data={chartData} />
            : <div className="h-48 flex items-center justify-center text-white/20 text-sm">No data yet</div>
          }
        </div>

        <div className="lg:col-span-2 bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-white font-display">Active Complaints</h3>
              <p className="text-white/30 text-xs mt-0.5">Sorted by last update</p>
            </div>
            <button onClick={() => navigate('/staff/complaints')}
              className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {active.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-10 h-10 text-emerald-500/20 mx-auto mb-3" />
              <p className="text-white/30 text-sm">All caught up! No active complaints.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {active.map(c => (
                <div key={c.id} onClick={() => navigate(`/staff/complaints/${c.id}`)}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:border-blue-500/30 hover:bg-blue-500/5 cursor-pointer transition-all duration-200 group">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white/70 text-sm line-clamp-1 group-hover:text-white transition-colors">{c.title}</p>
                    <p className="text-xs text-white/25 mt-0.5">{c.location} · {timeAgo(c.updatedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
