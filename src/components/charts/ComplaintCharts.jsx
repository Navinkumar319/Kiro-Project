import React from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts';

const STATUS_COLORS  = { Pending: '#64748b', Assigned: '#3b82f6', 'In Progress': '#f59e0b', Resolved: '#10b981' };
const CAT_COLORS     = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899','#14b8a6'];

/* Dark-themed tooltip */
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-800 border border-white/10 rounded-xl shadow-premium px-3 py-2 text-xs">
      {label && <p className="font-semibold text-white/80 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const AXIS_STYLE = { fontSize: 11, fill: '#475569' };
const GRID_STYLE = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.05)' };

export function StatusPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
          {data.map((e, i) => <Cell key={i} fill={STATUS_COLORS[e.name] || '#64748b'} />)}
        </Pie>
        <Tooltip content={<DarkTooltip />} />
        <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CategoryBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="name" tick={AXIS_STYLE} />
        <YAxis tick={AXIS_STYLE} allowDecimals={false} />
        <Tooltip content={<DarkTooltip />} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="month" tick={AXIS_STYLE} />
        <YAxis tick={AXIS_STYLE} allowDecimals={false} />
        <Tooltip content={<DarkTooltip />} />
        <Legend formatter={v => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v}</span>} />
        <Line type="monotone" dataKey="submitted" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} name="Submitted" />
        <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} name="Resolved" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PriorityBarChart({ data }) {
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#64748b'];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis type="number" tick={AXIS_STYLE} allowDecimals={false} />
        <YAxis type="category" dataKey="name" tick={{ ...AXIS_STYLE, fontSize: 12 }} width={60} />
        <Tooltip content={<DarkTooltip />} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
