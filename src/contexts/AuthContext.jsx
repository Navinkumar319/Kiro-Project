import React, { createContext, useContext, useState, useCallback } from 'react';
import { users } from '../data/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('campus_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email, password) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { success: false, message: 'Invalid email or password.' };
    if (!user.isActive) return { success: false, message: 'Your account is inactive. Contact admin.' };

    // Strip password before storing
    const { password: _pw, ...safeUser } = user;
    setCurrentUser(safeUser);
    localStorage.setItem('campus_user', JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('campus_user');
  }, []);

  const updateProfile = useCallback((updates) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('campus_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isAdmin = currentUser?.role === 'admin';
  const isStaff = currentUser?.role === 'staff';
  const isStudent = currentUser?.role === 'student';

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateProfile, isAdmin, isStaff, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
