import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Star, Send, Building2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, PriorityBadge } from '../../components/shared/StatusBadge';
import StatusTimeline from '../../components/shared/StatusTimeline';
import Modal from '../../components/shared/Modal';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function StudentComplaintDetail() {
  const { id } = useParams();
  const { getComplaintById, submitFeedback } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const c = getComplaintById(id);

  if (!c) return (
    <div className="text-center py-20">
      <p className="text-white/30">Complaint not found.</p>
      <button onClick={() => navigate('/student/my-complaints')} className="btn-secondary mt-4 mx-auto border-white/10 text-white/50">← Back</button>
    </div>
  );

  if (c.studentId !== currentUser?.id) return (
    <div className="text-center py-20">
      <p className="text-white/30">You don't have access to this complaint.</p>
      <button onClick={() => navigate('/student/my-complaints')} className="btn-secondary mt-4 mx-auto border-white/10 text-white/50">← Back</button>
    </div>
  );

  async function handleFeedback(e) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    submitFeedback(id, { rating, comment });
    setSubmitting(false);
    setFeedbackModal(false);
    toast.success('Feedback submitted!');
  }

  const info = [
    { icon: Building2, label: 'Category', value: c.categoryName },
    { icon: Building2, label: 'Department', value: c.departmentName },
    { icon: MapPin, label: 'Location', value: c.location },
    { icon: Calendar, label: 'Submitted', value: formatDateTime(c.createdAt) },
    { icon: User, label: 'Assigned To', value: c.assignedStaffName || '—' },
    { icon: Calendar, label: 'Last Updated', value: formatDateTime(c.updatedAt) },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-up">
      <button onClick={() => navigate('/student/my-complaints')}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to My Complaints
      </button>

      {/* Header */}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Timeline */}
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
          <h3 className="font-bold text-white font-display mb-4">Status History</h3>
          <StatusTimeline history={c.statusHistory || []} />
        </div>

        <div className="space-y-4">
          {c.resolutionNotes && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
              <h3 className="font-bold text-emerald-300 font-display mb-2">Resolution Notes</h3>
              <p className="text-emerald-400/70 text-sm">{c.resolutionNotes}</p>
              {c.resolvedAt && <p className="text-emerald-500/40 text-xs mt-2">Resolved {formatDateTime(c.resolvedAt)}</p>}
            </div>
          )}

          {c.status === 'resolved' && (
            <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
              <h3 className="font-bold text-white font-display mb-3">Your Feedback</h3>
              {c.feedback ? (
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-5 h-5 ${s <= c.feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
                    ))}
                    <span className="text-sm text-white/40 ml-1">{c.feedback.rating}/5</span>
                  </div>
                  {c.feedback.comment && <p className="text-sm text-white/40 italic">"{c.feedback.comment}"</p>}
                </div>
              ) : (
                <div>
                  <p className="text-white/30 text-sm mb-3">Rate the resolution quality</p>
                  <button onClick={() => setFeedbackModal(true)} className="btn-gradient text-sm px-4 py-2">
                    <Star className="w-4 h-4" /> Give Feedback
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={feedbackModal} onClose={() => setFeedbackModal(false)} title="Rate the Resolution">
        <form onSubmit={handleFeedback} className="space-y-4">
          <div>
            <label className="label-dark">Rating</label>
            <div className="flex gap-2 mt-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setRating(s)}>
                  <Star className={`w-9 h-9 transition-colors ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/10 hover:text-amber-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-dark">Comment (optional)</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
              placeholder="Share your experience..." className="input-field-dark resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setFeedbackModal(false)} className="btn-secondary flex-1 justify-center border-white/10 bg-transparent text-white/50">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-gradient flex-1 justify-center">
              {submitting ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
