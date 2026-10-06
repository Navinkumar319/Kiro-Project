import React, { useState } from 'react';
import { Hash, Building2, Briefcase, Clock, Mail, Phone, Save, Edit3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import PageHeader from '../../components/shared/PageHeader';
import toast from 'react-hot-toast';

export default function StaffProfile() {
  const { currentUser, updateProfile } = useAuth();
  const { getComplaintsByStaff, departments } = useData();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name:currentUser?.name||'', phone:currentUser?.phone||'' });

  const all = getComplaintsByStaff(currentUser?.id);
  const resolved = all.filter(c=>c.status==='resolved').length;
  const inProgress = all.filter(c=>c.status==='in_progress').length;
  const dept = departments.find(d=>d.id===currentUser?.departmentId);

  const fields = [
    { icon:Hash, label:'Staff ID', value:currentUser?.staffId },
    { icon:Building2, label:'Department', value:dept?.name||'—' },
    { icon:Briefcase, label:'Designation', value:currentUser?.designation },
    { icon:Clock, label:'Shift', value:currentUser?.shift },
    { icon:Mail, label:'Email', value:currentUser?.email },
    { icon:Phone, label:'Phone', value:currentUser?.phone||'—' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-up">
      <PageHeader title="My Profile" subtitle="Your staff account" />

      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-3xl font-extrabold font-display flex-shrink-0 shadow-lg">
            {currentUser?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-display">{currentUser?.name}</h2>
            <p className="text-white/40 text-sm">{currentUser?.email}</p>
            <span className="inline-block mt-1.5 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-semibold">Maintenance Staff</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/[0.06]">
          {[
            { label:'Total', value:all.length, gradient:'from-blue-400 to-cyan-400' },
            { label:'In Progress', value:inProgress, gradient:'from-amber-400 to-orange-400' },
            { label:'Resolved', value:resolved, gradient:'from-emerald-400 to-teal-400' },
          ].map(s=>(
            <div key={s.label} className="text-center">
              <p className={`text-2xl font-extrabold font-display bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>{s.value}</p>
              <p className="text-xs text-white/30 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white font-display">Work Information</h3>
          {!editing && (
            <button onClick={()=>setEditing(true)} className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map(f=>(
            <div key={f.label} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/[0.04] border border-white/[0.08] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <f.icon className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div>
                <p className="text-[10px] text-white/25 font-bold uppercase tracking-wider">{f.label}</p>
                <p className="text-sm text-white/70 font-medium mt-0.5">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="bg-surface-900 border border-brand-500/20 rounded-2xl p-6 animate-scale-in">
          <h3 className="font-bold text-white font-display mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="label-dark">Full Name</label>
              <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className="input-field-dark" />
            </div>
            <div>
              <label className="label-dark">Phone</label>
              <input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} className="input-field-dark" />
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setEditing(false)} className="btn-secondary flex-1 justify-center border-white/10 bg-transparent text-white/50">Cancel</button>
              <button onClick={()=>{updateProfile(form);setEditing(false);toast.success('Profile updated!');}} className="btn-gradient flex-1 justify-center">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
