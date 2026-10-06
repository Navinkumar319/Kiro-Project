import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Users, Building2, Tag, UserCog, BarChart3, Settings } from 'lucide-react';
import Sidebar from '../../components/shared/Sidebar';
import Navbar from '../../components/shared/Navbar';

const navItems = [
  { type:'section', label:'Overview' },
  { path:'/admin', end:true, label:'Dashboard', icon:LayoutDashboard },
  { type:'section', label:'Complaints' },
  { path:'/admin/complaints', label:'All Complaints', icon:ClipboardList },
  { path:'/admin/assign', label:'Staff Assignment', icon:UserCog },
  { type:'section', label:'Management' },
  { path:'/admin/users', label:'Users', icon:Users },
  { path:'/admin/departments', label:'Departments', icon:Building2 },
  { path:'/admin/categories', label:'Categories', icon:Tag },
  { type:'section', label:'Analytics' },
  { path:'/admin/reports', label:'Reports', icon:BarChart3 },
  { type:'section', label:'System' },
  { path:'/admin/settings', label:'Settings', icon:Settings },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      <Sidebar navItems={navItems} isOpen={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setOpen(true)} title="Admin Panel" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-surface-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
