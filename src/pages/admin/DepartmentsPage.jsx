import React, { useState } from 'react';
import { Building2, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { generateUserId } from '../../utils/helpers';
import toast from 'react-hot-toast';

const EMPTY = { name:'', code:'', head:'', email:'', phone:'' };

export default function DepartmentsPage() {
  const { departments, addDepartment, updateDepartment, deleteDepartment, complaints } = useData();
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  function handle(e) { setForm(p=>({...p,[e.target.name]:e.target.value})); }
  function openEdit(d) { setEditTarget(d); setForm({name:d.name,code:d.code,head:d.head,email:d.email,phone:d.phone}); setEditModal(true); }
  function handleDelete(d) {
    const n = complaints.filter(c=>c.departmentId===d.id).length;
    if (n>0) { toast.error(`Cannot delete: ${n} complaint(s) linked.`); return; }
    deleteDepartment(d.id); toast.success(`${d.name} deleted.`);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name||!form.code) { toast.error('Name and code required.'); return; }
    setSubmitting(true); await new Promise(r=>setTimeout(r,300));
    addDepartment({ id:generateUserId('dept'), ...form, staffCount:0 });
    setSubmitting(false); setAddModal(false); setForm(EMPTY); toast.success('Department added!');
  }

  async function handleEdit(e) {
    e.preventDefault();
    setSubmitting(true); await new Promise(r=>setTimeout(r,300));
    updateDepartment(editTarget.id, form);
    setSubmitting(false); setEditModal(false); toast.success('Department updated!');
  }

  const DForm = ({ onSubmit, label }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label-dark">Name *</label><input name="name" value={form.name} onChange={handle} className="input-field-dark" placeholder="Electrical Maintenance"/></div>
        <div><label className="label-dark">Code *</label><input name="code" value={form.code} onChange={e=>setForm(p=>({...p,code:e.target.value.toUpperCase()}))} className="input-field-dark" placeholder="ELEC" maxLength={8}/></div>
      </div>
      <div><label className="label-dark">Head / Supervisor</label><input name="head" value={form.head} onChange={handle} className="input-field-dark" placeholder="Department head name"/></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label-dark">Email</label><input type="email" name="email" value={form.email} onChange={handle} className="input-field-dark" placeholder="dept@campus.edu"/></div>
        <div><label className="label-dark">Phone</label><input name="phone" value={form.phone} onChange={handle} className="input-field-dark"/></div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={()=>{setAddModal(false);setEditModal(false);}} className="btn-secondary flex-1 justify-center border-white/10 bg-transparent text-white/50">Cancel</button>
        <button type="submit" disabled={submitting} className="btn-gradient flex-1 justify-center">{submitting?'Saving...':<><Save className="w-4 h-4"/>{label}</>}</button>
      </div>
    </form>
  );

  return (
    <div className="space-y-5 animate-fade-up">
      <PageHeader title="Departments" subtitle={`${departments.length} maintenance departments`}
        action={<button onClick={()=>{setForm(EMPTY);setAddModal(true);}} className="btn-gradient text-sm"><Plus className="w-4 h-4"/>Add Department</button>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(dept=>{
          const total = complaints.filter(c=>c.departmentId===dept.id).length;
          const res = complaints.filter(c=>c.departmentId===dept.id&&c.status==='resolved').length;
          return (
            <div key={dept.id} className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5 hover:border-brand-500/20 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-brand-400"/>
                  </div>
                  <div>
                    <p className="font-bold text-white/80 text-sm font-display">{dept.name}</p>
                    <span className="font-mono text-[10px] bg-white/[0.04] text-white/30 px-2 py-0.5 rounded-md">{dept.code}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={()=>openEdit(dept)} className="p-1.5 hover:bg-white/[0.06] rounded-lg text-white/30 hover:text-brand-400 transition-colors"><Pencil className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>handleDelete(dept)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
              <div className="space-y-1 text-xs text-white/30 mb-4">
                <p>👤 {dept.head||'—'}</p>
                <p>✉️ {dept.email||'—'}</p>
              </div>
              <div className="flex gap-4 pt-3 border-t border-white/[0.06]">
                <div className="text-center flex-1">
                  <p className="text-lg font-extrabold text-brand-400 font-display">{total}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">Total</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-lg font-extrabold text-emerald-400 font-display">{res}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">Resolved</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Modal isOpen={addModal} onClose={()=>setAddModal(false)} title="Add Department"><DForm onSubmit={handleAdd} label="Add Department"/></Modal>
      <Modal isOpen={editModal} onClose={()=>setEditModal(false)} title="Edit Department"><DForm onSubmit={handleEdit} label="Save Changes"/></Modal>
    </div>
  );
}
