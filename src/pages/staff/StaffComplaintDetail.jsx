import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, PriorityBadge } from '../../components/shared/StatusBadge';
import StatusTimeline from '../../components/shared/StatusTimeline';
import Modal from '../../components/shared/Modal';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_FLOW = [
  { from:'assigned',    to:'in_progress', label:'Start Work',    icon:Loader2,       color:'bg-amber-600 hover:bg-amber-700' },
  { from:'in_progress', to:'resolved',    label:'Mark Resolved', icon:CheckCircle2,  color:'bg-emerald-600 hover:bg-emerald-700' },
];

export default function StaffComplaintDetail() {
  const { id } = useParams();
  const { getComplaintById, updateComplaintStatus, addNotification } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const c = getComplaintById(id);

  if (!c) return (
    <div className="text-center py-20">
      <p className="text-white/30">Complaint not found.</p>
      <button onClick={() => navigate('/staff/complaints')} className="btn-secondary mt-4 mx-auto border-white/10 text-white/50">← Back</button>
    </div>
  );

  if (c.assignedStaffId !== currentUser?.id) return (
    <div className="text-center py-20">
      <p className="text-white/30">This complaint is not assigned to you.</p>
      <button onClick={() => navigate('/staff/complaints')} className="btn-secondary mt-4 mx-auto border-white/10 text-white/50">← Back</button>
    </div>
  );

  const nextAction = STATUS_FLOW.find(s => s.from === c.status);

  function openUpdate(to) { setTargetStatus(to); setNotes(c.resolutionNotes||''); setModal(true); }

  async function handleUpdate(e) {
    e.preventDefault();
    if (targetStatus === 'resolved' && !notes.trim()) { toast.error('Please add resolution notes.'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    updateComplaintStatus(id, targetStatus, notes, currentUser.name);
    addNotification({ userId: c.studentId, title: targetStatus==='resolved' ? 'Complaint Resolved ✓' : 'Complaint Update',
      message: `Your complaint "${c.title}" is now ${targetStatus.replace('_',' ')}.`,
      type: targetStatus==='resolved' ? 'success' : 'info', complaintId: id });
    setSubmitting(false);
    setModal(false);
    toast.success(`Status updated to ${targetStatus.replace('_',' ')}!`);
  }

  const info = [
    { label:'Category', value:c.categoryName }, { label:'Department', value:c.departmentName },
    { label:'Location', value:c.location }, { label:'Student', value:c.studentName },
    { label:'Submitted', value:formatDateTime(c.createdAt) }, { label:'Last Updated', value:formatDateTime(c.updatedAt) },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-up">
      <button onClick={() => navigate('/staff/complaints')}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Assigned Complaints
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/[0.06]">
          {info.map(item => (
            <div key={item.label}>
              <p className="text-[10px] text-white/25 font-bold uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-sm text-white/70 font-medium">{item.value}</p>
            </div>
          ))}
        </div>

        {nextAction && c.status !== 'resolved' && (
          <div className="mt-5 pt-5 border-t border-white/[0.06] flex gap-3">
            <button onClick={() => openUpdate(nextAction.to)}
              className={`flex items-center gap-2 px-5 py-2.5 ${nextAction.color} text-white text-sm font-semibold rounded-xl transition-colors shadow-sm`}>
              <nextAction.icon className="w-4 h-4" /> {nextAction.label}
            </button>
          </div>
        )}
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
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-xl ${s<=c.feedback.rating?'text-amber-400':'text-white/10'}`}>★</span>
                ))}
                <span className="text-sm text-white/40 ml-1">{c.feedback.rating}/5</span>
              </div>
              {c.feedback.comment && <p className="text-sm text-white/40 italic">"{c.feedback.comment}"</p>}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={`Update → ${targetStatus.replace('_',' ')}`}>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="label-dark">
              {targetStatus==='resolved' ? 'Resolution Notes' : 'Progress Notes'}
              {targetStatus==='resolved' && <span className="text-red-400 ml-1">*</span>}
            </label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4}
              placeholder={targetStatus==='resolved' ? 'Describe what was done to resolve the issue...' : 'Describe current progress...'}
              className="input-field-dark resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center border-white/10 bg-transparent text-white/50">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-gradient flex-1 justify-center">
              {submitting ? 'Updating...' : <><Save className="w-4 h-4" /> Update Status</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
