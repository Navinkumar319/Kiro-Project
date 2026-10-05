import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ClipboardList, User } from 'lucide-react';
import Sidebar from '../../components/shared/Sidebar';
import Navbar from '../../components/shared/Navbar';

const navItems = [
  { type: 'section', label: 'Main' },
  { path: '/student', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { type: 'section', label: 'Complaints' },
  { path: '/student/create-complaint', label: 'Submit Complaint', icon: PlusCircle },
  { path: '/student/my-complaints', label: 'My Complaints', icon: ClipboardList },
  { type: 'section', label: 'Account' },
  { path: '/student/profile', label: 'My Profile', icon: User },
];

export default function StudentLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      <Sidebar navItems={navItems} isOpen={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setOpen(true)} title="Student Portal" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-surface-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
