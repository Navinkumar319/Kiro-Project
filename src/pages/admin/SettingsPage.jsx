import React, { useState } from 'react';
import { Save, GraduationCap, Bell, Shield } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { currentUser, updateProfile } = useAuth();
  const [general, setGeneral] = useState({ collegeName:'Smart Campus University', address:'123 University Road, Chennai, TN 600001', email:'admin@campus.edu', phone:'044-2234-5600', website:'www.smartcampus.edu' });
  const [notifs, setNotifs] = useState({ emailOnNew:true, emailOnAssign:true, emailOnResolve:true, reminder:true, reminderDays:3 });
  const [profile, setProfile] = useState({ name:currentUser?.name||'', phone:currentUser?.phone||'', currentPassword:'', newPassword:'' });

  const Section = ({ icon:Icon, title, gradient, children }) => (
    <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white"/>
        </div>
        <h3 className="font-bold text-white font-display">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-up">
      <PageHeader title="Settings" subtitle="System configuration and preferences"/>

      <Section icon={GraduationCap} title="General Information" gradient="from-brand-500 to-violet-600">
        <form onSubmit={e=>{e.preventDefault();toast.success('Settings saved!');}} className="space-y-4">
          <div><label className="label-dark">College / University Name</label><input value={general.collegeName} onChange={e=>setGeneral(p=>({...p,collegeName:e.target.value}))} className="input-field-dark"/></div>
          <div><label className="label-dark">Address</label><textarea value={general.address} onChange={e=>setGeneral(p=>({...p,address:e.target.value}))} className="input-field-dark resize-none" rows={2}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-dark">Email</label><input type="email" value={general.email} onChange={e=>setGeneral(p=>({...p,email:e.target.value}))} className="input-field-dark"/></div>
            <div><label className="label-dark">Phone</label><input value={general.phone} onChange={e=>setGeneral(p=>({...p,phone:e.target.value}))} className="input-field-dark"/></div>
          </div>
          <button type="submit" className="btn-gradient text-sm"><Save className="w-4 h-4"/>Save Settings</button>
        </form>
      </Section>

      <Section icon={Bell} title="Notifications" gradient="from-amber-500 to-orange-600">
        <form onSubmit={e=>{e.preventDefault();toast.success('Preferences saved!');}} className="space-y-3">
          {[
            { key:'emailOnNew', label:'Notify on new complaint submission' },
            { key:'emailOnAssign', label:'Notify staff on assignment' },
            { key:'emailOnResolve', label:'Notify student on resolution' },
            { key:'reminder', label:'Send reminders for unresolved complaints' },
          ].map(item=>(
            <label key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:bg-white/[0.03] cursor-pointer transition-colors">
              <span className="text-sm text-white/60">{item.label}</span>
              <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${notifs[item.key]?'bg-brand-600':'bg-white/[0.08]'}`}
                onClick={()=>setNotifs(p=>({...p,[item.key]:!p[item.key]}))}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${notifs[item.key]?'left-5':'left-0.5'}`}/>
              </div>
            </label>
          ))}
          <button type="submit" className="btn-gradient text-sm"><Save className="w-4 h-4"/>Save Preferences</button>
        </form>
      </Section>

      <Section icon={Shield} title="Admin Profile" gradient="from-violet-500 to-purple-600">
        <form onSubmit={e=>{e.preventDefault();updateProfile({name:profile.name,phone:profile.phone});toast.success('Profile updated!');}} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-dark">Full Name</label><input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} className="input-field-dark"/></div>
            <div><label className="label-dark">Phone</label><input value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} className="input-field-dark"/></div>
          </div>
          <div className="border-t border-white/[0.06] pt-4">
            <p className="text-sm font-semibold text-white/50 mb-3">Change Password</p>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label-dark">Current Password</label><input type="password" value={profile.currentPassword} onChange={e=>setProfile(p=>({...p,currentPassword:e.target.value}))} className="input-field-dark" placeholder="Current password"/></div>
              <div><label className="label-dark">New Password</label><input type="password" value={profile.newPassword} onChange={e=>setProfile(p=>({...p,newPassword:e.target.value}))} className="input-field-dark" placeholder="Min 6 chars"/></div>
            </div>
          </div>
          <button type="submit" className="btn-gradient text-sm"><Save className="w-4 h-4"/>Update Profile</button>
        </form>
      </Section>

      <div className="bg-surface-900 border border-white/[0.06] rounded-2xl p-5">
        <h3 className="font-bold text-white/40 font-display text-sm mb-3">System Information</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[{ label:'Version',value:'v1.0.0'},{label:'Framework',value:'React 18'},{label:'UI',value:'Tailwind CSS'},{label:'Charts',value:'Recharts'}].map(item=>(
            <div key={item.label}>
              <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold">{item.label}</p>
              <p className="text-sm font-semibold text-white/50 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
