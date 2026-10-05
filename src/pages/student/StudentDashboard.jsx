import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, Loader2, CheckCircle2, PlusCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import StatCard from '../../components/shared/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/shared/StatusBadge';
import { StatusPieChart } from '../../components/charts/ComplaintCharts';
import { timeAgo } from '../../utils/helpers';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { getComplaintsByStudent } = useData();
  const navigate = useNavigate();

  const all = getComplaintsByStudent(currentUser?.id);
  const pending = all.filter(c => c.status === 'pending').length;
  const inProgress = all.filter(c => c.status === 'in_progress' || c.status === 'assigned').length;
  const resolved = all.filter(c => c.status === 'resolved').length;
  const recent = [...all].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const chartData = [
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: inProgress },
    { name: 'Resolved', value: resolved },
  ].filter(d => d.value > 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-brand-900 via-violet-900/80 to-surface-900 border border-white/[0.08] p-6 lg:p-8">
        <div className="absolute inset-0 bg-hero-mesh opacity-40" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-white/40 text-sm font-medium">{greeting},</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white font-display mt-1">{currentUser?.name} 👋</h2>
          <p className="text-white/40 text-sm mt-1">{currentUser?.studentId} · {currentUser?.department} · Year {currentUser?.year}</p>
          <button onClick={() => navigate('/student/create-complaint')}
            className="mt-5 btn-gradient px-5 py-2.5 text-sm shadow-glow">
            <PlusCircle className="w-4 h-4" /> Submit a Complaint
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total" value={all.length} icon={ClipboardList} color="indigo" />
        <StatCard title="Pending" value={pending} icon={Clock} color="yellow" />
        <StatCard title="In Progress" value={inProgress} icon={Loader2} color="orange" />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle2} color="green" />
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-1">Complaint Status</h3>
          <p className="text-white/30 text-xs mb-4">Your complaint breakdown</p>
          {chartData.length > 0
            ? <StatusPieChart data={chartData} />
            : <div className="h-48 flex items-center justify-center text-white/20 text-sm">No complaints yet</div>
          }
        </div>

        {/* Recent */}
        <div className="lg:col-span-2 bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-white font-display">Recent Complaints</h3>
              <p className="text-white/30 text-xs mt-0.5">Your latest submissions</p>
            </div>
            <button onClick={() => navigate('/student/my-complaints')}
              className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-10">
              <ClipboardList className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No complaints submitted yet.</p>
              <button onClick={() => navigate('/student/create-complaint')}
                className="mt-3 text-brand-400 hover:text-brand-300 text-sm font-semibold transition-colors">
                Submit your first →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map(c => (
                <div key={c.id} onClick={() => navigate(`/student/complaints/${c.id}`)}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:border-brand-500/30 hover:bg-brand-500/5 cursor-pointer transition-all duration-200 group">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white/70 text-sm line-clamp-1 group-hover:text-white transition-colors">{c.title}</p>
                    <p className="text-xs text-white/25 mt-0.5">{c.categoryName} · {timeAgo(c.createdAt)}</p>
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
