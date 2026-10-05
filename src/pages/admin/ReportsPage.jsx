import React, { useMemo } from 'react';
import { TrendingUp, Clock, CheckCircle2, Star } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import PageHeader from '../../components/shared/PageHeader';
import { StatusPieChart, CategoryBarChart, MonthlyLineChart, PriorityBarChart } from '../../components/charts/ComplaintCharts';

export default function ReportsPage() {
  const { complaints, users } = useData();

  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c=>c.status==='resolved').length;
    const pending = complaints.filter(c=>c.status==='pending').length;
    const inProgress = complaints.filter(c=>c.status==='in_progress').length;
    const assigned = complaints.filter(c=>c.status==='assigned').length;
    const resRate = total>0?Math.round((resolved/total)*100):0;
    const resolvedC = complaints.filter(c=>c.resolvedAt&&c.createdAt);
    const avgH = resolvedC.length>0?Math.round(resolvedC.reduce((s,c)=>(s+(new Date(c.resolvedAt)-new Date(c.createdAt))/(3600000)),0)/resolvedC.length):0;
    const withFb = complaints.filter(c=>c.feedback);
    const avgR = withFb.length>0?(withFb.reduce((s,c)=>s+c.feedback.rating,0)/withFb.length).toFixed(1):'—';
    return { total, resolved, pending, inProgress, assigned, resRate, avgH, avgR };
  }, [complaints]);

  const statusData = [
    { name:'Pending', value:stats.pending }, { name:'Assigned', value:stats.assigned },
    { name:'In Progress', value:stats.inProgress }, { name:'Resolved', value:stats.resolved },
  ].filter(d=>d.value>0);

  const catCounts = {};
  complaints.forEach(c=>{ catCounts[c.categoryName]=(catCounts[c.categoryName]||0)+1; });
  const catData = Object.entries(catCounts).map(([name,count])=>({ name:name.split('/')[0].trim().split(' ')[0], count })).sort((a,b)=>b.count-a.count);

  const monthlyData = useMemo(()=>{
    const months=[];
    for(let i=5;i>=0;i--){
      const d=new Date(); d.setMonth(d.getMonth()-i);
      const label=d.toLocaleString('en',{month:'short'}); const y=d.getFullYear(); const m=d.getMonth();
      months.push({ month:label,
        submitted:complaints.filter(c=>{ const cd=new Date(c.createdAt); return cd.getFullYear()===y&&cd.getMonth()===m; }).length,
        resolved:complaints.filter(c=>{ if(!c.resolvedAt)return false; const rd=new Date(c.resolvedAt); return rd.getFullYear()===y&&rd.getMonth()===m; }).length,
      });
    }
    return months;
  },[complaints]);

  const priorityData = [
    { name:'Critical', count:complaints.filter(c=>c.priority==='critical').length },
    { name:'High', count:complaints.filter(c=>c.priority==='high').length },
    { name:'Medium', count:complaints.filter(c=>c.priority==='medium').length },
    { name:'Low', count:complaints.filter(c=>c.priority==='low').length },
  ];

  const deptData = useMemo(()=>{
    const dc={};
    complaints.forEach(c=>{ dc[c.departmentName]=(dc[c.departmentName]||{total:0,resolved:0}); dc[c.departmentName].total++; if(c.status==='resolved')dc[c.departmentName].resolved++; });
    return Object.entries(dc).map(([name,v])=>({ name, ...v, rate:v.total>0?Math.round((v.resolved/v.total)*100):0 })).sort((a,b)=>b.total-a.total);
  },[complaints]);

  const staffStats = users.filter(u=>u.role==='staff').map(s=>{
    const mine=complaints.filter(c=>c.assignedStaffId===s.id);
    const res=mine.filter(c=>c.status==='resolved').length;
    return { name:s.name, designation:s.designation, total:mine.length, resolved:res };
  }).sort((a,b)=>b.resolved-a.resolved);

  const KPI = [
    { icon:TrendingUp, label:'Resolution Rate', value:`${stats.resRate}%`, gradient:'from-emerald-400 to-teal-400', bg:'bg-emerald-500/10 border-emerald-500/20' },
    { icon:Clock, label:'Avg Resolution Time', value:`${stats.avgH}h`, gradient:'from-blue-400 to-cyan-400', bg:'bg-blue-500/10 border-blue-500/20' },
    { icon:Star, label:'Avg Satisfaction', value:`${stats.avgR}/5`, gradient:'from-amber-400 to-yellow-400', bg:'bg-amber-500/10 border-amber-500/20' },
    { icon:CheckCircle2, label:'Total Resolved', value:stats.resolved, gradient:'from-brand-400 to-violet-400', bg:'bg-brand-500/10 border-brand-500/20' },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader title="Reports & Analytics" subtitle="Campus maintenance performance overview" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map(k=>(
          <div key={k.label} className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
            <div className={`w-10 h-10 ${k.bg} border rounded-xl flex items-center justify-center mb-4`}>
              <k.icon className={`w-5 h-5 bg-gradient-to-br ${k.gradient} bg-clip-text text-transparent`} style={{color:'transparent',background:`linear-gradient(to right, var(--tw-gradient-stops))`}} />
            </div>
            <p className={`text-2xl font-extrabold font-display bg-gradient-to-r ${k.gradient} bg-clip-text text-transparent`}>{k.value}</p>
            <p className="text-white/30 text-xs mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-1">Status Distribution</h3>
          <p className="text-white/30 text-xs mb-4">Current breakdown across all complaints</p>
          <StatusPieChart data={statusData}/>
        </div>
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-1">By Category</h3>
          <p className="text-white/30 text-xs mb-4">Most reported complaint types</p>
          <CategoryBarChart data={catData}/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-1">Monthly Trend</h3>
          <p className="text-white/30 text-xs mb-4">Submitted vs Resolved over 6 months</p>
          <MonthlyLineChart data={monthlyData}/>
        </div>
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-1">Priority Distribution</h3>
          <p className="text-white/30 text-xs mb-4">Breakdown by severity level</p>
          <PriorityBarChart data={priorityData}/>
        </div>
      </div>

      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
        <h3 className="font-bold text-white font-display mb-4">Department Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Department','Total','Resolved','Pending','Rate'].map(h=>(
                  <th key={h} className="text-left text-[10px] font-bold text-white/25 uppercase tracking-widest pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deptData.map(d=>(
                <tr key={d.name} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 font-semibold text-white/70 text-sm">{d.name}</td>
                  <td className="py-3 pr-4 text-white/50">{d.total}</td>
                  <td className="py-3 pr-4 text-emerald-400 font-semibold">{d.resolved}</td>
                  <td className="py-3 pr-4 text-amber-400">{d.total-d.resolved}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{width:`${d.rate}%`}}/>
                      </div>
                      <span className="text-xs text-white/40 font-semibold">{d.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
        <h3 className="font-bold text-white font-display mb-4">Staff Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {staffStats.map(s=>(
            <div key={s.name} className="border border-white/[0.06] rounded-xl p-4 hover:border-brand-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold text-sm flex items-center justify-center">{s.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-white/80 text-sm">{s.name}</p>
                  <p className="text-xs text-white/25">{s.designation}</p>
                </div>
              </div>
              <div className="flex gap-3 text-center">
                <div className="flex-1">
                  <p className="text-lg font-extrabold text-brand-400 font-display">{s.total}</p>
                  <p className="text-xs text-white/25">Assigned</p>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-extrabold text-emerald-400 font-display">{s.resolved}</p>
                  <p className="text-xs text-white/25">Resolved</p>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-extrabold text-white/50 font-display">{s.total>0?Math.round((s.resolved/s.total)*100):0}%</p>
                  <p className="text-xs text-white/25">Rate</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
