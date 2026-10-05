import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, X, AlertCircle, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { classifyComplaint } from '../../utils/aiClassifier';
import { generateComplaintId } from '../../utils/helpers';
import toast from 'react-hot-toast';

const LOCATIONS = ['Main Block','Engineering Block','Science Block','Library Building','Admin Block',
  'Hostel Block A','Hostel Block B','Hostel Block C','Hostel Block D','Main Canteen','Sports Complex',
  'Auditorium','Computer Lab','Workshop','Other'];
const PRIORITIES = ['low','medium','high','critical'];

const PRIORITY_STYLES = {
  low:      { active: 'bg-surface-700 border-surface-500 text-white',      base: 'border-surface-700/50 text-white/40 hover:border-surface-600' },
  medium:   { active: 'bg-amber-500/15 border-amber-500/50 text-amber-300', base: 'border-white/[0.08] text-white/40 hover:border-amber-500/30' },
  high:     { active: 'bg-orange-500/15 border-orange-500/50 text-orange-300', base: 'border-white/[0.08] text-white/40 hover:border-orange-500/30' },
  critical: { active: 'bg-red-500/15 border-red-500/50 text-red-300',      base: 'border-white/[0.08] text-white/40 hover:border-red-500/30' },
};

export default function CreateComplaint() {
  const { currentUser } = useAuth();
  const { categories, departments, addComplaint, addNotification } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title:'', description:'', categoryId:'', departmentId:'', location:'', customLocation:'', priority:'medium' });
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handle(e) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (name === 'categoryId') {
      const cat = categories.find(c => c.id === value);
      if (cat) setForm(p => ({ ...p, categoryId: cat.id, departmentId: cat.departmentId }));
    }
    if (name === 'description') setAiSuggestion(null);
  }

  async function handleAnalyze() {
    if (form.description.trim().length < 15) { toast.error('Write at least 15 characters to analyze.'); return; }
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setAiSuggestion(classifyComplaint(form.description));
    setAiLoading(false);
  }

  function applyAI() {
    if (!aiSuggestion) return;
    setForm(p => ({
      ...p,
      categoryId: aiSuggestion.categoryId,
      departmentId: aiSuggestion.departmentId,
      priority: aiSuggestion.priority,
      title: p.title || aiSuggestion.summary,
    }));
    setAiApplied(true);
    toast.success('AI suggestions applied!');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { toast.error('Title and description are required.'); return; }
    if (!form.categoryId) { toast.error('Please select a category.'); return; }
    const loc = form.location === 'Other' ? form.customLocation : form.location;
    if (!loc) { toast.error('Please specify a location.'); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));

    const cat = categories.find(c => c.id === form.categoryId);
    const dept = departments.find(d => d.id === form.departmentId);
    const id = generateComplaintId();

    addComplaint({
      id, title: form.title, description: form.description,
      categoryId: form.categoryId, categoryName: cat?.name || '',
      departmentId: form.departmentId, departmentName: dept?.name || '',
      location: loc, priority: form.priority, status: 'pending',
      studentId: currentUser.id, studentName: currentUser.name,
      assignedStaffId: null, assignedStaffName: null,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      resolvedAt: null, beforeImage: null, afterImage: null,
      resolutionNotes: '', feedback: null,
      statusHistory: [{ status: 'pending', timestamp: new Date().toISOString(), note: 'Complaint submitted', updatedBy: currentUser.name }],
    });
    addNotification({ userId: 'user-admin-1', title: `New Complaint`, message: `${currentUser.name} submitted: "${form.title}"`, type: form.priority === 'critical' ? 'warning' : 'info', complaintId: id });
    setSubmitting(false);
    toast.success(`Complaint ${id} submitted!`);
    navigate('/student/my-complaints');
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-white font-display">Submit a Complaint</h2>
        <p className="text-white/40 text-sm mt-1">Describe the issue and our team will address it promptly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1 — Description + AI */}
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center">1</div>
            <h3 className="font-bold text-white font-display text-sm">Describe the Problem</h3>
          </div>

          <div>
            <label className="label-dark">Description <span className="text-red-400">*</span></label>
            <textarea name="description" value={form.description} onChange={handle} rows={4}
              placeholder="e.g. The fan in Room 204 is not working and students are unable to sit comfortably..."
              className="input-field-dark resize-none" />
            <p className="text-white/20 text-xs mt-1">{form.description.length} characters</p>
          </div>

          <button type="button" onClick={handleAnalyze} disabled={aiLoading || form.description.length < 15}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-brand-600 hover:from-violet-700 hover:to-brand-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all shadow-glow-sm">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {aiLoading ? 'Analysing...' : 'AI Auto-Classify'}
          </button>

          {aiSuggestion && (
            <div className="border border-violet-500/20 bg-violet-500/5 rounded-xl p-4 animate-scale-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-bold text-violet-300 font-display">AI Suggestions</span>
                  <span className="text-[10px] bg-violet-500/15 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full font-semibold">{aiSuggestion.confidence}% confidence</span>
                </div>
                <button type="button" onClick={() => setAiSuggestion(null)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {[
                  { label: 'Category', value: aiSuggestion.categoryName },
                  { label: 'Department', value: aiSuggestion.departmentName },
                  { label: 'Priority', value: aiSuggestion.priority },
                  { label: 'Summary', value: aiSuggestion.summary },
                ].map(item => (
                  <div key={item.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
                    <p className="text-xs text-white/30 font-semibold">{item.label}</p>
                    <p className="text-sm text-white/80 font-semibold mt-0.5 capitalize line-clamp-2">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-violet-400/70 mb-3">
                <AlertCircle className="w-3.5 h-3.5" /> Suggestions are editable after applying.
              </div>
              <button type="button" onClick={applyAI}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" /> Apply Suggestions
              </button>
            </div>
          )}

          {aiApplied && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2">
              <CheckCircle2 className="w-4 h-4" /> AI suggestions applied — review and edit below.
            </div>
          )}
        </div>

        {/* Step 2 — Details */}
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center">2</div>
            <h3 className="font-bold text-white font-display text-sm">Complaint Details</h3>
          </div>

          <div>
            <label className="label-dark">Title <span className="text-red-400">*</span></label>
            <input name="title" value={form.title} onChange={handle} placeholder="Short title for the issue" className="input-field-dark" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Category <span className="text-red-400">*</span></label>
              <select name="categoryId" value={form.categoryId} onChange={handle} className="input-field-dark">
                <option value="" className="bg-surface-800">— Select Category —</option>
                {categories.map(c => <option key={c.id} value={c.id} className="bg-surface-800">{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-dark">Department</label>
              <select name="departmentId" value={form.departmentId} onChange={handle} className="input-field-dark">
                <option value="" className="bg-surface-800">— Select Department —</option>
                {departments.map(d => <option key={d.id} value={d.id} className="bg-surface-800">{d.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label-dark">Location <span className="text-red-400">*</span></label>
            <select name="location" value={form.location} onChange={handle} className="input-field-dark">
              <option value="" className="bg-surface-800">— Select Location —</option>
              {LOCATIONS.map(l => <option key={l} className="bg-surface-800">{l}</option>)}
            </select>
            {form.location === 'Other' && (
              <input name="customLocation" value={form.customLocation} onChange={handle}
                placeholder="Specify exact location" className="input-field-dark mt-2" />
            )}
          </div>

          <div>
            <label className="label-dark">Priority <span className="text-red-400">*</span></label>
            <div className="grid grid-cols-4 gap-2 mt-1.5">
              {PRIORITIES.map(p => (
                <button key={p} type="button" onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all duration-150 ${
                    form.priority === p ? PRIORITY_STYLES[p].active : PRIORITY_STYLES[p].base
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/student/my-complaints')} className="btn-secondary flex-1 sm:flex-none justify-center border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06] bg-transparent">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-gradient flex-1 sm:flex-none justify-center">
            {submitting
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
              : <><Send className="w-4 h-4" /> Submit Complaint</>}
          </button>
        </div>
      </form>
    </div>
  );
}
