import React, { useState, useMemo } from 'react';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import ComplaintTable from '../../components/shared/ComplaintTable';
import SearchFilter from '../../components/shared/SearchFilter';
import EmptyState from '../../components/shared/EmptyState';
import PageHeader from '../../components/shared/PageHeader';

export default function AssignedComplaints() {
  const { currentUser } = useAuth();
  const { getComplaintsByStaff } = useData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

  const all = getComplaintsByStaff(currentUser?.id);
  const filtered = useMemo(() => all
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
    .filter(c => status === 'all' || c.status === status)
    .filter(c => priority === 'all' || c.priority === priority)
    .sort((a,b) => { const o={critical:0,high:1,medium:2,low:3}; return o[a.priority]-o[b.priority]; }),
  [all, search, status, priority]);

  const filters = [
    { key:'status', value:status, onChange:setStatus, options:[
      {value:'all',label:'All Status'},{value:'assigned',label:'Assigned'},
      {value:'in_progress',label:'In Progress'},{value:'resolved',label:'Resolved'},
    ]},
    { key:'priority', value:priority, onChange:setPriority, options:[
      {value:'all',label:'All Priority'},{value:'critical',label:'Critical'},
      {value:'high',label:'High'},{value:'medium',label:'Medium'},{value:'low',label:'Low'},
    ]},
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      <PageHeader title="Assigned Complaints" subtitle={`${all.length} complaint${all.length!==1?'s':''} assigned to you`} />
      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
        <SearchFilter search={search} onSearch={setSearch} filters={filters} className="mb-5" />
        {filtered.length === 0
          ? <EmptyState icon={ClipboardList} title="No complaints found" description="No complaints match your filters." />
          : <ComplaintTable complaints={filtered} basePath="/staff" />
        }
      </div>
    </div>
  );
}
