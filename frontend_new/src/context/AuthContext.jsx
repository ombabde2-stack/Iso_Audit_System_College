import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, logoutUser, getMe } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true on mount while restoring session

  // Restore session on app load
  const initAuth = useCallback(async () => {
    try {
      const res = await getMe();
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    // Listen for forced logout (token refresh failure)
    const handleForceLogout = () => {
      setUser(null);
      const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
      if (!authPaths.some(path => window.location.pathname.startsWith(path))) {
        window.location.href = '/login';
      }
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [initAuth]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const logout = async () => {
    try { await logoutUser(); } catch {}
    setUser(null);
  };

  // Role helpers
  const isAdmin  = user?.role === 'admin';
  const isHOD    = user?.role === 'hod';
  const isFaculty = user?.role === 'faculty';
  const hasRole  = (...roles) => roles.includes(user?.role);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, isAdmin, isHOD, isFaculty, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
