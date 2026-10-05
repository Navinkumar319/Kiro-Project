import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Landing page
import LandingPage from './pages/LandingPage';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student pages
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import CreateComplaint from './pages/student/CreateComplaint';
import MyComplaints from './pages/student/MyComplaints';
import StudentComplaintDetail from './pages/student/StudentComplaintDetail';
import StudentProfile from './pages/student/StudentProfile';

// Staff pages
import StaffLayout from './pages/staff/StaffLayout';
import StaffDashboard from './pages/staff/StaffDashboard';
import AssignedComplaints from './pages/staff/AssignedComplaints';
import StaffComplaintDetail from './pages/staff/StaffComplaintDetail';
import StaffProfile from './pages/staff/StaffProfile';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllComplaints from './pages/admin/AllComplaints';
import AdminComplaintDetail from './pages/admin/AdminComplaintDetail';
import UsersPage from './pages/admin/UsersPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import StaffAssignment from './pages/admin/StaffAssignment';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';

// ── Route Guards ──────────────────────────────────────────────
function RequireAuth({ children, role }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/unauthorized" replace />;
  return children;
}

function RedirectByRole() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
  if (currentUser.role === 'staff') return <Navigate to="/staff" replace />;
  return <Navigate to="/student" replace />;
}

function Unauthorized() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">403</h1>
        <p className="text-gray-500 mb-6">You don't have permission to access this page.</p>
        <button onClick={logout} className="btn-primary">Back to Login</button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/" element={<LandingPage />} />

        {/* Student */}
        <Route path="/student" element={<RequireAuth role="student"><StudentLayout /></RequireAuth>}>
          <Route index element={<StudentDashboard />} />
          <Route path="create-complaint" element={<CreateComplaint />} />
          <Route path="my-complaints" element={<MyComplaints />} />
          <Route path="complaints/:id" element={<StudentComplaintDetail />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Staff */}
        <Route path="/staff" element={<RequireAuth role="staff"><StaffLayout /></RequireAuth>}>
          <Route index element={<StaffDashboard />} />
          <Route path="complaints" element={<AssignedComplaints />} />
          <Route path="complaints/:id" element={<StaffComplaintDetail />} />
          <Route path="profile" element={<StaffProfile />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
          <Route index element={<AdminDashboard />} />
          <Route path="complaints" element={<AllComplaints />} />
          <Route path="complaints/:id" element={<AdminComplaintDetail />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="assign" element={<StaffAssignment />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </AuthProvider>
  );
}
