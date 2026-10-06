import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import ComplaintTable from '../../components/shared/ComplaintTable';
import SearchFilter from '../../components/shared/SearchFilter';
import EmptyState from '../../components/shared/EmptyState';
import PageHeader from '../../components/shared/PageHeader';

export default function MyComplaints() {
  const { currentUser } = useAuth();
  const { getComplaintsByStudent } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

  const all = getComplaintsByStudent(currentUser?.id);
  const filtered = useMemo(() => all
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
    .filter(c => status === 'all' || c.status === status)
    .filter(c => priority === 'all' || c.priority === priority)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  [all, search, status, priority]);

  const filters = [
    { key: 'status', value: status, onChange: setStatus, options: [
      { value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' },
      { value: 'assigned', label: 'Assigned' }, { value: 'in_progress', label: 'In Progress' },
      { value: 'resolved', label: 'Resolved' },
    ]},
    { key: 'priority', value: priority, onChange: setPriority, options: [
      { value: 'all', label: 'All Priority' }, { value: 'critical', label: 'Critical' },
      { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' },
    ]},
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      <PageHeader title="My Complaints" subtitle={`${all.length} total submissions`}
        action={<button onClick={() => navigate('/student/create-complaint')} className="btn-gradient text-sm"><PlusCircle className="w-4 h-4" /> New Complaint</button>}
      />

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Pending', count: all.filter(c=>c.status==='pending').length, color: 'bg-white/[0.04] border-white/[0.08] text-white/40' },
          { label: 'In Progress', count: all.filter(c=>c.status==='in_progress'||c.status==='assigned').length, color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
          { label: 'Resolved', count: all.filter(c=>c.status==='resolved').length, color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
        ].map(chip => (
          <span key={chip.label} className={`text-xs px-3 py-1 rounded-full border font-semibold ${chip.color}`}>
            {chip.label}: {chip.count}
          </span>
        ))}
      </div>

      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
        <SearchFilter search={search} onSearch={setSearch} filters={filters} className="mb-5" />
        {filtered.length === 0
          ? <EmptyState icon={ClipboardList} title="No complaints found"
              description={search || status !== 'all' || priority !== 'all' ? 'Try adjusting your filters.' : "You haven't submitted any complaints yet."}
              action={<button onClick={() => navigate('/student/create-complaint')} className="btn-gradient text-sm"><PlusCircle className="w-4 h-4" /> Submit Complaint</button>}
            />
          : <ComplaintTable complaints={filtered} basePath="/student" />
        }
      </div>
    </div>
  );
}
