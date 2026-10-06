import React, { useState, useMemo } from 'react';
import { UserPlus, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { formatDate, generateUserId } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ROLE_BADGE = {
  admin:   'bg-violet-500/10 text-violet-400 border-violet-500/20',
  staff:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  student: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default function UsersPage() {
  const { users, addUser, toggleUserStatus, departments } = useData();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student', phone:'', departmentId:'' });
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => users
    .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    .filter(u => roleFilter==='all' || u.role===roleFilter),
  [users, search, roleFilter]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name||!form.email||!form.password) { toast.error('Fill all required fields.'); return; }
    if (users.find(u=>u.email.toLowerCase()===form.email.toLowerCase())) { toast.error('Email already exists.'); return; }
    setSubmitting(true);
    await new Promise(r=>setTimeout(r,400));
    addUser({ id:generateUserId('user'), ...form, avatar:null, createdAt:new Date().toISOString(), isActive:true,
      ...(form.role==='staff'&&{ staffId:`STF${String(users.filter(u=>u.role==='staff').length+1).padStart(3,'0')}`, designation:'Technician', shift:'Morning' }) });
    setSubmitting(false); setAddModal(false);
    setForm({ name:'', email:'', password:'', role:'student', phone:'', departmentId:'' });
    toast.success('User added!');
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <PageHeader title="Users" subtitle={`${users.length} total users`}
        action={<button onClick={()=>setAddModal(true)} className="btn-gradient text-sm"><UserPlus className="w-4 h-4"/>Add User</button>}
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Students', value:users.filter(u=>u.role==='student').length, gradient:'from-emerald-400 to-teal-400' },
          { label:'Staff', value:users.filter(u=>u.role==='staff').length, gradient:'from-blue-400 to-cyan-400' },
          { label:'Active', value:users.filter(u=>u.isActive).length, gradient:'from-brand-400 to-violet-400' },
        ].map(s=>(
          <div key={s.label} className="bg-surface-900 border border-white/[0.08] rounded-2xl p-4 text-center">
            <p className={`text-2xl font-extrabold font-display bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-brand-500/50 rounded-xl text-sm text-white placeholder-white/25 transition-all focus:outline-none"/>
          </div>
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}
            className="pl-4 pr-8 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/60 focus:outline-none appearance-none">
            <option value="all" className="bg-surface-800">All Roles</option>
            <option value="student" className="bg-surface-800">Students</option>
            <option value="staff" className="bg-surface-800">Staff</option>
            <option value="admin" className="bg-surface-800">Admin</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name','Email','Role','Info','Joined','Status','Action'].map(h=>(
                  <th key={h} className="text-left text-[10px] font-bold text-white/25 uppercase tracking-widest pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u=>{
                const dept = departments.find(d=>d.id===u.departmentId);
                return (
                  <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-white/80 text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-white/35 text-xs">{u.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold capitalize ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-white/30">
                      {u.role==='student'&&`${u.department||'—'}, Yr ${u.year||'—'}`}
                      {u.role==='staff'&&(dept?.name||'—')}
                      {u.role==='admin'&&'Administrator'}
                    </td>
                    <td className="py-3 pr-4 text-xs text-white/25">{formatDate(u.createdAt)}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${u.isActive?'bg-emerald-500/10 text-emerald-400 border-emerald-500/20':'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {u.isActive?'Active':'Inactive'}
                      </span>
                    </td>
                    <td className="py-3">
                      {u.role!=='admin'&&(
                        <button onClick={()=>{ toggleUserStatus(u.id); toast.success(`${u.name} ${u.isActive?'deactivated':'activated'}.`); }}
                          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors ${u.isActive?'text-red-400 hover:bg-red-500/10':'text-emerald-400 hover:bg-emerald-500/10'}`}>
                          {u.isActive?<ToggleRight className="w-4 h-4"/>:<ToggleLeft className="w-4 h-4"/>}
                          {u.isActive?'Deactivate':'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={addModal} onClose={()=>setAddModal(false)} title="Add New User">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-dark">Full Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className="input-field-dark" placeholder="Full name"/></div>
            <div><label className="label-dark">Role *</label>
              <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} className="input-field-dark">
                <option value="student" className="bg-surface-800">Student</option>
                <option value="staff" className="bg-surface-800">Staff</option>
              </select>
            </div>
          </div>
          <div><label className="label-dark">Email *</label><input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} className="input-field-dark" placeholder="email@campus.edu"/></div>
          <div><label className="label-dark">Password *</label><input type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} className="input-field-dark" placeholder="Min 6 chars"/></div>
          <div><label className="label-dark">Phone</label><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} className="input-field-dark" placeholder="Phone"/></div>
          {form.role==='staff'&&(
            <div><label className="label-dark">Department</label>
              <select value={form.departmentId} onChange={e=>setForm(p=>({...p,departmentId:e.target.value}))} className="input-field-dark">
                <option value="" className="bg-surface-800">— Select —</option>
                {departments.map(d=><option key={d.id} value={d.id} className="bg-surface-800">{d.name}</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={()=>setAddModal(false)} className="btn-secondary flex-1 justify-center border-white/10 bg-transparent text-white/50">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-gradient flex-1 justify-center">
              {submitting?'Adding...':<><UserPlus className="w-4 h-4"/>Add User</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
