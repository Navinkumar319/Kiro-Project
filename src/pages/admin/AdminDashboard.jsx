import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, Loader2, CheckCircle2, AlertTriangle, Users, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import StatCard from '../../components/shared/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/shared/StatusBadge';
import { StatusPieChart, CategoryBarChart } from '../../components/charts/ComplaintCharts';
import { timeAgo } from '../../utils/helpers';

export default function AdminDashboard() {
  const { complaints, users, getStats } = useData();
  const navigate = useNavigate();
  const s = getStats();

  const students = users.filter(u=>u.role==='student').length;
  const staff = users.filter(u=>u.role==='staff').length;
  const unassigned = complaints.filter(c=>c.status==='pending').length;
  const resRate = s.total > 0 ? Math.round((s.resolved/s.total)*100) : 0;

  const recent = [...complaints].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6);

  const statusData = [
    { name:'Pending', value:s.pending }, { name:'Assigned', value:s.assigned },
    { name:'In Progress', value:s.inProgress }, { name:'Resolved', value:s.resolved },
  ].filter(d=>d.value>0);

  const catCounts = {};
  complaints.forEach(c => { catCounts[c.categoryName] = (catCounts[c.categoryName]||0)+1; });
  const catData = Object.entries(catCounts)
    .map(([name,count])=>({ name:name.split('/')[0].trim().split(' ')[0], count }))
    .sort((a,b)=>b.count-a.count).slice(0,7);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-violet-950 via-brand-900/80 to-surface-900 border border-white/[0.08] p-6 lg:p-8">
        <div className="absolute inset-0 bg-hero-mesh opacity-40" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white font-display">Admin Dashboard</h2>
              <p className="text-white/40 text-sm mt-1">Smart Campus Complaint & Maintenance System</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label:'Resolution Rate', value:`${resRate}%`, color:'text-emerald-300' },
                { label:'Unassigned', value:unassigned, color:'text-amber-300' },
                { label:'Active Staff', value:staff, color:'text-blue-300' },
              ].map(chip=>(
                <div key={chip.label} className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-center">
                  <p className={`text-xl font-extrabold font-display ${chip.color}`}>{chip.value}</p>
                  <p className="text-white/30 text-xs mt-0.5">{chip.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Complaints" value={s.total} icon={ClipboardList} color="indigo" />
        <StatCard title="Pending" value={s.pending} icon={Clock} color="yellow" subtitle="Needs assignment" />
        <StatCard title="In Progress" value={s.inProgress+s.assigned} icon={Loader2} color="orange" />
        <StatCard title="Resolved" value={s.resolved} icon={CheckCircle2} color="green" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Critical" value={s.critical} icon={AlertTriangle} color="red" />
        <StatCard title="High Priority" value={s.high} icon={TrendingUp} color="orange" />
        <StatCard title="Students" value={students} icon={Users} color="purple" />
        <StatCard title="Staff Members" value={staff} icon={Users} color="blue" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-1">Status Distribution</h3>
          <p className="text-white/30 text-xs mb-4">Current status of all complaints</p>
          {statusData.length>0 ? <StatusPieChart data={statusData} /> : <div className="h-48 flex items-center justify-center text-white/20 text-sm">No data</div>}
        </div>
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-1">By Category</h3>
          <p className="text-white/30 text-xs mb-4">Most common complaint types</p>
          {catData.length>0 ? <CategoryBarChart data={catData} /> : <div className="h-48 flex items-center justify-center text-white/20 text-sm">No data</div>}
        </div>
      </div>

      {/* Recent */}
      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white font-display">Recent Complaints</h3>
            <p className="text-white/30 text-xs mt-0.5">Latest submissions across campus</p>
          </div>
          <button onClick={()=>navigate('/admin/complaints')} className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recent.map(c=>(
            <div key={c.id} onClick={()=>navigate(`/admin/complaints/${c.id}`)}
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:border-brand-500/30 hover:bg-brand-500/5 cursor-pointer transition-all group">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] text-white/20">{c.id}</span>
                  <p className="font-semibold text-white/70 text-sm line-clamp-1 group-hover:text-white transition-colors">{c.title}</p>
                </div>
                <p className="text-xs text-white/25 mt-0.5">{c.studentName} · {c.location} · {timeAgo(c.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
