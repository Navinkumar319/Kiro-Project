import React, { useState } from 'react';
import { Tag, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { generateUserId } from '../../utils/helpers';
import toast from 'react-hot-toast';

const COLORS = ['yellow','gray','blue','indigo','green','red','orange','cyan','purple'];
const DOT = { yellow:'bg-yellow-400',gray:'bg-surface-400',blue:'bg-blue-500',indigo:'bg-indigo-500',green:'bg-emerald-500',red:'bg-red-500',orange:'bg-orange-500',cyan:'bg-cyan-500',purple:'bg-purple-500' };
const BADGE_BG = { yellow:'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',gray:'bg-surface-700/40 text-surface-400 border-surface-600/30',blue:'bg-blue-500/10 text-blue-400 border-blue-500/20',indigo:'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',green:'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',red:'bg-red-500/10 text-red-400 border-red-500/20',orange:'bg-orange-500/10 text-orange-400 border-orange-500/20',cyan:'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',purple:'bg-purple-500/10 text-purple-400 border-purple-500/20' };

const EMPTY = { name:'', color:'blue', departmentId:'', description:'' };

export default function CategoriesPage() {
  const { categories, departments, addCategory, updateCategory, deleteCategory, complaints } = useData();
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  function handle(e) { setForm(p=>({...p,[e.target.name]:e.target.value})); }
  function openEdit(c) { setEditTarget(c); setForm({name:c.name,color:c.color,departmentId:c.departmentId,description:c.description||''}); setEditModal(true); }
  function handleDelete(c) {
    const n = complaints.filter(x=>x.categoryId===c.id).length;
    if (n>0) { toast.error(`Cannot delete: ${n} complaints linked.`); return; }
    deleteCategory(c.id); toast.success(`${c.name} deleted.`);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name||!form.departmentId) { toast.error('Name and department required.'); return; }
    setSubmitting(true); await new Promise(r=>setTimeout(r,300));
    addCategory({ id:generateUserId('cat'), icon:'HelpCircle', ...form });
    setSubmitting(false); setAddModal(false); setForm(EMPTY); toast.success('Category added!');
  }

  async function handleEdit(e) {
    e.preventDefault();
    setSubmitting(true); await new Promise(r=>setTimeout(r,300));
    updateCategory(editTarget.id, form);
    setSubmitting(false); setEditModal(false); toast.success('Category updated!');
  }

  const CForm = ({ onSubmit, label }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div><label className="label-dark">Name *</label><input name="name" value={form.name} onChange={handle} className="input-field-dark" placeholder="e.g. Electrical"/></div>
      <div><label className="label-dark">Department *</label>
        <select name="departmentId" value={form.departmentId} onChange={handle} className="input-field-dark">
          <option value="" className="bg-surface-800">— Select Department —</option>
          {departments.map(d=><option key={d.id} value={d.id} className="bg-surface-800">{d.name}</option>)}
        </select>
      </div>
      <div><label className="label-dark">Description</label><input name="description" value={form.description} onChange={handle} className="input-field-dark" placeholder="Brief description"/></div>
      <div>
        <label className="label-dark">Color</label>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {COLORS.map(c=>(
            <button key={c} type="button" onClick={()=>setForm(p=>({...p,color:c}))}
              className={`w-7 h-7 rounded-full ${DOT[c]} border-2 transition-all ${form.color===c?'border-white scale-110':'border-transparent'}`}/>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={()=>{setAddModal(false);setEditModal(false);}} className="btn-secondary flex-1 justify-center border-white/10 bg-transparent text-white/50">Cancel</button>
        <button type="submit" disabled={submitting} className="btn-gradient flex-1 justify-center">{submitting?'Saving...':<><Save className="w-4 h-4"/>{label}</>}</button>
      </div>
    </form>
  );

  return (
    <div className="space-y-5 animate-fade-up">
      <PageHeader title="Categories" subtitle={`${categories.length} categories`}
        action={<button onClick={()=>{setForm(EMPTY);setAddModal(true);}} className="btn-gradient text-sm"><Plus className="w-4 h-4"/>Add Category</button>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat=>{
          const dept = departments.find(d=>d.id===cat.departmentId);
          const count = complaints.filter(c=>c.categoryId===cat.id).length;
          const badge = BADGE_BG[cat.color]||BADGE_BG.blue;
          return (
            <div key={cat.id} className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.15] transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${badge.split(' ')[0]} border ${badge.split(' ')[2]}`}>
                    <Tag className={`w-4 h-4 ${badge.split(' ')[1]}`}/>
                  </div>
                  <div>
                    <p className="font-bold text-white/80 text-sm font-display">{cat.name}</p>
                    <p className="text-xs text-white/30">{dept?.name||'—'}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={()=>openEdit(cat)} className="p-1.5 hover:bg-white/[0.06] rounded-lg text-white/30 hover:text-brand-400"><Pencil className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>handleDelete(cat)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-400"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
              {cat.description && <p className="text-xs text-white/25 mb-3">{cat.description}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badge}`}>{cat.color}</span>
                <span className="text-xs text-white/25 font-medium">{count} complaint{count!==1?'s':''}</span>
              </div>
            </div>
          );
        })}
      </div>
      <Modal isOpen={addModal} onClose={()=>setAddModal(false)} title="Add Category"><CForm onSubmit={handleAdd} label="Add Category"/></Modal>
      <Modal isOpen={editModal} onClose={()=>setEditModal(false)} title="Edit Category"><CForm onSubmit={handleEdit} label="Save Changes"/></Modal>
    </div>
  );
}
