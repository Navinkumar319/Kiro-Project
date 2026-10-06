import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCog, AlertTriangle, Save, Star } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { StatusBadge, PriorityBadge } from '../../components/shared/StatusBadge';
import StatusTimeline from '../../components/shared/StatusTimeline';
import Modal from '../../components/shared/Modal';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const PRIORITIES = ['low','medium','high','critical'];
const PRI_ACTIVE = { low:'bg-surface-700 border-surface-500 text-white', medium:'bg-amber-500/15 border-amber-500/50 text-amber-300', high:'bg-orange-500/15 border-orange-500/50 text-orange-300', critical:'bg-red-500/15 border-red-500/50 text-red-300' };
const PRI_BASE = 'border-white/[0.08] text-white/30 hover:border-white/20';

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const { getComplaintById, assignComplaint, updateComplaint, users, addNotification } = useData();
  const navigate = useNavigate();
  const [assignModal, setAssignModal] = useState(false);
  const [priorityModal, setPriorityModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const c = getComplaintById(id);
  const staffList = users.filter(u=>u.role==='staff'&&u.isActive);

  if (!c) return (
    <div className="text-center py-20">
      <p className="text-white/30">Complaint not found.</p>
      <button onClick={() => navigate('/admin/complaints')} className="btn-secondary mt-4 mx-auto border-white/10 text-white/50">← Back</button>
    </div>
  );

  async function handleAssign(e) {
    e.preventDefault();
    if (!selectedStaff) { toast.error('Select a staff member.'); return; }
    const staff = staffList.find(s=>s.id===selectedStaff);
    setSubmitting(true);
    await new Promise(r=>setTimeout(r,400));
    assignComplaint(id, staff.id, staff.name);
    addNotification({ userId:staff.id, title:'New Complaint Assigned', message:`Assigned: "${c.title}"`, type:'info', complaintId:id });
    addNotification({ userId:c.studentId, title:'Complaint Assigned', message:`Assigned to ${staff.name}.`, type:'info', complaintId:id });
    setSubmitting(false); setAssignModal(false);
    toast.success(`Assigned to ${staff.name}!`);
  }

  async function handlePriority(e) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r=>setTimeout(r,300));
    updateComplaint(id, { priority:selectedPriority });
    setSubmitting(false); setPriorityModal(false);
    toast.success(`Priority updated to ${selectedPriority}!`);
  }

  const info = [
    { label:'Complaint ID', value:c.id }, { label:'Student', value:c.studentName },
    { label:'Category', value:c.categoryName }, { label:'Department', value:c.departmentName },
    { label:'Location', value:c.location }, { label:'Submitted', value:formatDateTime(c.createdAt) },
    { label:'Assigned To', value:c.assignedStaffName||'Unassigned', highlight:!c.assignedStaffId },
    { label:'Last Updated', value:formatDateTime(c.updatedAt) },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-up">
      <button onClick={() => navigate('/admin/complaints')} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to All Complaints
      </button>

      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <span className="font-mono text-[10px] text-white/25 bg-white/[0.04] px-2 py-1 rounded-lg">{c.id}</span>
            <h2 className="text-xl font-extrabold text-white font-display mt-2">{c.title}</h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <PriorityBadge priority={c.priority} />
            <StatusBadge status={c.status} />
          </div>
        </div>
        <p className="text-white/50 text-sm leading-relaxed">{c.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-white/[0.06]">
          {info.map(item=>(
            <div key={item.label}>
              <p className="text-[10px] text-white/25 font-bold uppercase tracking-wider mb-1">{item.label}</p>
              <p className={`text-sm font-medium ${item.highlight?'text-red-400':'text-white/70'}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-white/[0.06]">
          <button onClick={() => { setSelectedStaff(c.assignedStaffId||''); setAssignModal(true); }}
            className="btn-gradient text-sm">
            <UserCog className="w-4 h-4" /> {c.assignedStaffId?'Re-assign':'Assign Staff'}
          </button>
          <button onClick={() => { setSelectedPriority(c.priority); setPriorityModal(true); }}
            className="btn-secondary border-white/10 bg-transparent text-white/60 hover:text-white text-sm">
            <AlertTriangle className="w-4 h-4" /> Change Priority
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-4">Status History</h3>
          <StatusTimeline history={c.statusHistory||[]} />
        </div>
        <div className="space-y-4">
          {c.resolutionNotes && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
              <h3 className="font-bold text-emerald-300 font-display mb-2">Resolution Notes</h3>
              <p className="text-emerald-400/70 text-sm">{c.resolutionNotes}</p>
            </div>
          )}
          {c.feedback && (
            <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
              <h3 className="font-bold text-white font-display mb-3">Student Feedback</h3>
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(s=><Star key={s} className={`w-5 h-5 ${s<=c.feedback.rating?'text-amber-400 fill-amber-400':'text-white/10'}`} />)}
                <span className="text-sm text-white/40 ml-1">{c.feedback.rating}/5</span>
              </div>
              {c.feedback.comment && <p className="text-sm text-white/40 italic">"{c.feedback.comment}"</p>}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title="Assign to Maintenance Staff">
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="label-dark">Select Staff Member</label>
            <select value={selectedStaff} onChange={e=>setSelectedStaff(e.target.value)} className="input-field-dark">
              <option value="" className="bg-surface-800">— Select Staff —</option>
              {staffList.map(s=><option key={s.id} value={s.id} className="bg-surface-800">{s.name} — {s.designation}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={()=>setAssignModal(false)} className="btn-secondary flex-1 justify-center border-white/10 bg-transparent text-white/50">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-gradient flex-1 justify-center">
              {submitting?'Assigning...':<><UserCog className="w-4 h-4"/>Assign</>}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={priorityModal} onClose={() => setPriorityModal(false)} title="Change Priority">
        <form onSubmit={handlePriority} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {PRIORITIES.map(p=>(
              <button key={p} type="button" onClick={()=>setSelectedPriority(p)}
                className={`py-3 px-4 rounded-xl border-2 text-sm capitalize font-semibold transition-all ${selectedPriority===p?PRI_ACTIVE[p]:PRI_BASE}`}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={()=>setPriorityModal(false)} className="btn-secondary flex-1 justify-center border-white/10 bg-transparent text-white/50">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-gradient flex-1 justify-center">
              {submitting?'Updating...':<><Save className="w-4 h-4"/>Update</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
