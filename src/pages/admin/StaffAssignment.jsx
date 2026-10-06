import React, { useState, useMemo } from 'react';
import { UserCog, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { StatusBadge, PriorityBadge } from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import { timeAgo } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function StaffAssignment() {
  const { complaints, users, departments, assignComplaint, addNotification } = useData();
  const [selected, setSelected] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('unassigned');

  const staff = users.filter(u=>u.role==='staff'&&u.isActive);
  const filtered = useMemo(()=>complaints
    .filter(c=>{ if(filter==='unassigned') return c.status==='pending'; if(filter==='assigned') return c.status==='assigned'||c.status==='in_progress'; return true; })
    .sort((a,b)=>({critical:0,high:1,medium:2,low:3})[a.priority]-({critical:0,high:1,medium:2,low:3})[b.priority]),
  [complaints,filter]);

  const workload = staff.map(s=>({
    ...s,
    active: complaints.filter(c=>c.assignedStaffId===s.id&&c.status!=='resolved').length,
    total: complaints.filter(c=>c.assignedStaffId===s.id).length,
    deptName: departments.find(d=>d.id===s.departmentId)?.name||'—',
  }));

  async function handleAssign(e) {
    e.preventDefault();
    if (!selectedStaff) { toast.error('Select a staff member.'); return; }
    const s = staff.find(x=>x.id===selectedStaff);
    setSubmitting(true); await new Promise(r=>setTimeout(r,400));
    assignComplaint(selected.id, s.id, s.name);
    addNotification({ userId:s.id, title:'New Complaint Assigned', message:`Assigned: "${selected.title}"`, type:'info', complaintId:selected.id });
    addNotification({ userId:selected.studentId, title:'Complaint Assigned', message:`Assigned to ${s.name}.`, type:'info', complaintId:selected.id });
    setSubmitting(false); setSelected(null);
    toast.success(`Assigned to ${s.name}!`);
  }

  const unassignedCount = complaints.filter(c=>c.status==='pending').length;

  const TABS = [
    { key:'unassigned', label:'Unassigned', count:complaints.filter(c=>c.status==='pending').length },
    { key:'assigned', label:'Active', count:complaints.filter(c=>c.status==='assigned'||c.status==='in_progress').length },
    { key:'all', label:'All', count:complaints.length },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      <PageHeader title="Staff Assignment" subtitle="Assign and manage complaint allocation" />

      {unassignedCount > 0 && (
        <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0"/>
          <p className="text-sm text-amber-300"><span className="font-bold">{unassignedCount} complaint{unassignedCount>1?'s':''}</span> awaiting assignment.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Complaints */}
        <div className="lg:col-span-2 bg-surface-900 border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.06] flex gap-2">
            {TABS.map(tab=>(
              <button key={tab.key} onClick={()=>setFilter(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${filter===tab.key?'bg-brand-600 text-white':'text-white/40 hover:text-white hover:bg-white/[0.06]'}`}>
                {tab.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter===tab.key?'bg-white/20':'bg-white/[0.06] text-white/30'}`}>{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="divide-y divide-white/[0.04] max-h-[520px] overflow-y-auto">
            {filtered.length===0 ? (
              <div className="text-center py-12"><CheckCircle2 className="w-10 h-10 text-emerald-500/20 mx-auto mb-2"/><p className="text-white/30 text-sm">All complaints assigned!</p></div>
            ) : filtered.map(c=>(
              <div key={c.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-[10px] text-white/20">{c.id}</span>
                      <PriorityBadge priority={c.priority}/>
                      <StatusBadge status={c.status}/>
                    </div>
                    <p className="font-semibold text-white/80 text-sm">{c.title}</p>
                    <p className="text-xs text-white/25 mt-0.5">{c.studentName} · {c.location} · {timeAgo(c.createdAt)}</p>
                    {c.assignedStaffName && <p className="text-xs text-brand-400 mt-0.5">→ {c.assignedStaffName}</p>}
                  </div>
                  {c.status!=='resolved'&&(
                    <button onClick={()=>{setSelected(c);setSelectedStaff(c.assignedStaffId||'');}}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 btn-gradient flex-shrink-0">
                      <UserCog className="w-3.5 h-3.5"/>{c.assignedStaffId?'Re-assign':'Assign'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workload */}
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-4">Staff Workload</h3>
          <div className="space-y-3">
            {workload.map(s=>(
              <div key={s.id} className="p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xs font-bold flex items-center justify-center">{s.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-semibold text-white/80">{s.name}</p>
                      <p className="text-xs text-white/25">{s.designation}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${s.active===0?'bg-emerald-500/10 text-emerald-400 border-emerald-500/20':s.active<=2?'bg-amber-500/10 text-amber-400 border-amber-500/20':'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {s.active} active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full transition-all" style={{width:`${Math.min((s.active/5)*100,100)}%`}}/>
                  </div>
                  <span className="text-xs text-white/20">{s.total} total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={()=>setSelected(null)} title="Assign Complaint">
        {selected&&(
          <form onSubmit={handleAssign} className="space-y-4">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3">
              <p className="font-semibold text-white/80 text-sm">{selected.title}</p>
              <p className="text-white/30 text-xs mt-1">{selected.location}</p>
              <div className="flex gap-2 mt-2"><PriorityBadge priority={selected.priority}/><StatusBadge status={selected.status}/></div>
            </div>
            <div>
              <label className="label-dark">Select Staff Member</label>
              <select value={selectedStaff} onChange={e=>setSelectedStaff(e.target.value)} className="input-field-dark">
                <option value="" className="bg-surface-800">— Select Staff —</option>
                {workload.map(s=><option key={s.id} value={s.id} className="bg-surface-800">{s.name} ({s.designation}) — {s.active} active</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={()=>setSelected(null)} className="btn-secondary flex-1 justify-center border-white/10 bg-transparent text-white/50">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-gradient flex-1 justify-center">
                {submitting?'Assigning...':<><UserCog className="w-4 h-4"/>Assign</>}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
