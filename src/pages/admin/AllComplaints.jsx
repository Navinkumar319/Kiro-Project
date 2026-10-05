import React, { useState, useMemo } from 'react';
import { ClipboardList } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import ComplaintTable from '../../components/shared/ComplaintTable';
import SearchFilter from '../../components/shared/SearchFilter';
import EmptyState from '../../components/shared/EmptyState';
import PageHeader from '../../components/shared/PageHeader';

export default function AllComplaints() {
  const { complaints } = useData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [category, setCategory] = useState('all');

  const categories = [...new Set(complaints.map(c=>c.categoryName))].sort();

  const filtered = useMemo(() => complaints
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.studentName.toLowerCase().includes(search.toLowerCase()))
    .filter(c => status==='all' || c.status===status)
    .filter(c => priority==='all' || c.priority===priority)
    .filter(c => category==='all' || c.categoryName===category)
    .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)),
  [complaints, search, status, priority, category]);

  const chips = [
    { label:'Pending', count:complaints.filter(c=>c.status==='pending').length, color:'bg-white/[0.04] border-white/[0.08] text-white/40' },
    { label:'Assigned', count:complaints.filter(c=>c.status==='assigned').length, color:'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    { label:'In Progress', count:complaints.filter(c=>c.status==='in_progress').length, color:'bg-amber-500/10 border-amber-500/20 text-amber-400' },
    { label:'Resolved', count:complaints.filter(c=>c.status==='resolved').length, color:'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  ];

  const filters = [
    { key:'status', value:status, onChange:setStatus, options:[
      {value:'all',label:'All Status'},{value:'pending',label:'Pending'},
      {value:'assigned',label:'Assigned'},{value:'in_progress',label:'In Progress'},{value:'resolved',label:'Resolved'},
    ]},
    { key:'priority', value:priority, onChange:setPriority, options:[
      {value:'all',label:'All Priority'},{value:'critical',label:'Critical'},
      {value:'high',label:'High'},{value:'medium',label:'Medium'},{value:'low',label:'Low'},
    ]},
    { key:'category', value:category, onChange:setCategory, options:[
      {value:'all',label:'All Categories'},...categories.map(c=>({value:c,label:c})),
    ]},
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      <PageHeader title="All Complaints" subtitle={`${filtered.length} of ${complaints.length} complaints`} />
      <div className="flex flex-wrap gap-2">
        {chips.map(chip => (
          <span key={chip.label} className={`text-xs px-3 py-1 rounded-full border font-semibold ${chip.color}`}>
            {chip.label}: {chip.count}
          </span>
        ))}
      </div>
      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-5">
        <SearchFilter search={search} onSearch={setSearch} filters={filters} className="mb-5" />
        {filtered.length===0
          ? <EmptyState icon={ClipboardList} title="No complaints found" description="Try adjusting your filters." />
          : <ComplaintTable complaints={filtered} basePath="/admin" />
        }
      </div>
    </div>
  );
}
