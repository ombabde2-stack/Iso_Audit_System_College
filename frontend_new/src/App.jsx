import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Dashboard from './pages/dashboard/Dashboard';
import MyForms from './pages/forms/MyForms';
import AssignedForms from './pages/forms/AssignedForms';
import FillForm from './pages/forms/FillForm';
import FormDetails from './pages/forms/FormDetails';

import HODQueue from './pages/hod/HODQueue';
import HODApproval from './pages/hod/HODApproval';
import HODResearchDashboard from './pages/hod/HODResearchDashboard';

import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';

import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--surface-tooltip)',
            color: 'var(--text-tooltip)',
            border: '1px solid var(--border-tooltip)',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />

      <Routes>
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        
        {/* Public auth routes */}
        <Route path="/login"          element={<Login/>} />
        <Route path="/register"       element={<Register/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />

        {/* Protected app routes */}
        <Route element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
          <Route index element={<Dashboard/>} />
          <Route path="/my-forms"       element={<MyForms/>} />
          <Route path="/assigned-forms" element={<AssignedForms/>} />
          <Route path="/fill-form"      element={<FillForm/>} />
          <Route path="/fill-form/:formNo" element={<FillForm/>} />
          <Route path="/forms/:id"      element={<FormDetails/>} />
          <Route path="/profile"        element={<Profile/>} />
          <Route path="/settings"       element={<Settings/>} />

          {/* HOD routes */}
          <Route path="/hod-queue"           element={<RoleRoute roles={['hod']}><HODQueue/></RoleRoute>} />
          <Route path="/hod-approval/:id"    element={<RoleRoute roles={['hod','admin']}><HODApproval/></RoleRoute>} />
          <Route path="/hod-approval"        element={<RoleRoute roles={['hod','admin']}><HODQueue/></RoleRoute>} />
          <Route path="/hod-research-dashboard" element={<RoleRoute roles={['hod']}><HODResearchDashboard/></RoleRoute>} />

          {/* Admin routes */}
          <Route path="/admin/users"   element={<RoleRoute roles={['admin']}><AdminUsers/></RoleRoute>} />
          <Route path="/admin/reports" element={<RoleRoute roles={['admin']}><AdminReports/></RoleRoute>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
