import React, { createContext, useContext, useState, useCallback } from 'react';
import { complaints as initialComplaints } from '../data/complaints';
import { users as initialUsers } from '../data/users';
import { notifications as initialNotifications } from '../data/notifications';
import { departments as initialDepts } from '../data/departments';
import { categories as initialCats } from '../data/categories';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [users, setUsers] = useState(initialUsers);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [departments, setDepartments] = useState(initialDepts);
  const [categories, setCategories] = useState(initialCats);

  // ── Complaints ──────────────────────────────────────────────
  const addComplaint = useCallback((complaint) => {
    setComplaints((prev) => [complaint, ...prev]);
  }, []);

  const updateComplaint = useCallback((id, updates) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const getComplaintById = useCallback(
    (id) => complaints.find((c) => c.id === id),
    [complaints]
  );

  const getComplaintsByStudent = useCallback(
    (studentId) => complaints.filter((c) => c.studentId === studentId),
    [complaints]
  );

  const getComplaintsByStaff = useCallback(
    (staffId) => complaints.filter((c) => c.assignedStaffId === staffId),
    [complaints]
  );

  const assignComplaint = useCallback((complaintId, staffId, staffName) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const historyEntry = {
          status: 'assigned',
          timestamp: new Date().toISOString(),
          note: `Assigned to ${staffName}`,
          updatedBy: 'Admin',
        };
        return {
          ...c,
          assignedStaffId: staffId,
          assignedStaffName: staffName,
          status: 'assigned',
          updatedAt: new Date().toISOString(),
          statusHistory: [...(c.statusHistory || []), historyEntry],
        };
      })
    );
  }, []);

  const updateComplaintStatus = useCallback((complaintId, status, note, updatedBy) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const historyEntry = {
          status,
          timestamp: new Date().toISOString(),
          note: note || '',
          updatedBy: updatedBy || 'System',
        };
        return {
          ...c,
          status,
          updatedAt: new Date().toISOString(),
          resolvedAt: status === 'resolved' ? new Date().toISOString() : c.resolvedAt,
          resolutionNotes: note || c.resolutionNotes,
          statusHistory: [...(c.statusHistory || []), historyEntry],
        };
      })
    );
  }, []);

  const submitFeedback = useCallback((complaintId, feedback) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? { ...c, feedback: { ...feedback, submittedAt: new Date().toISOString() } }
          : c
      )
    );
  }, []);

  // ── Users ────────────────────────────────────────────────────
  const addUser = useCallback((user) => {
    setUsers((prev) => [...prev, user]);
  }, []);

  const updateUser = useCallback((id, updates) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  }, []);

  const toggleUserStatus = useCallback((id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  }, []);

  // ── Notifications ────────────────────────────────────────────
  const addNotification = useCallback((notif) => {
    setNotifications((prev) => [{ ...notif, id: `notif-${Date.now()}`, createdAt: new Date().toISOString(), read: false }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback((userId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, read: true } : n))
    );
  }, []);

  // ── Departments ──────────────────────────────────────────────
  const addDepartment = useCallback((dept) => {
    setDepartments((prev) => [...prev, dept]);
  }, []);

  const updateDepartment = useCallback((id, updates) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  }, []);

  const deleteDepartment = useCallback((id) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // ── Categories ───────────────────────────────────────────────
  const addCategory = useCallback((cat) => {
    setCategories((prev) => [...prev, cat]);
  }, []);

  const updateCategory = useCallback((id, updates) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ── Stats ────────────────────────────────────────────────────
  const getStats = useCallback(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'pending').length;
    const assigned = complaints.filter((c) => c.status === 'assigned').length;
    const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;
    const critical = complaints.filter((c) => c.priority === 'critical').length;
    const high = complaints.filter((c) => c.priority === 'high').length;
    return { total, pending, assigned, inProgress, resolved, critical, high };
  }, [complaints]);

  return (
    <DataContext.Provider
      value={{
        complaints, addComplaint, updateComplaint, getComplaintById,
        getComplaintsByStudent, getComplaintsByStaff, assignComplaint,
        updateComplaintStatus, submitFeedback,
        users, addUser, updateUser, toggleUserStatus,
        notifications, addNotification, markNotificationRead, markAllRead,
        departments, addDepartment, updateDepartment, deleteDepartment,
        categories, addCategory, updateCategory, deleteCategory,
        getStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
