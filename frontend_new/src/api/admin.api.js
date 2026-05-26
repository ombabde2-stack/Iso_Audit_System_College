import api from './axios';

export const getAllUsers       = (params)       => api.get('/admin/users', { params });
export const updateUserRole    = (id, role)     => api.patch(`/admin/users/${id}/role`, { role });
export const toggleUserStatus  = (id)           => api.patch(`/admin/users/${id}/toggle-status`);
export const deleteUser        = (id)           => api.delete(`/admin/users/${id}`);
export const adminResetPassword = (id, pass)   => api.patch(`/admin/users/${id}/reset-password`, { newPassword: pass });
export const getAuditLogs      = (params)       => api.get('/admin/audit-logs', { params });
export const getAdminFormStats = (params)       => api.get('/admin/form-stats', { params });
