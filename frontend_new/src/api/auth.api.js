import api from './axios';

export const loginUser     = (data)        => api.post('/users/login', data);
export const registerUser  = (data)        => api.post('/users/register', data);
export const logoutUser    = ()            => api.post('/users/logout');
export const refreshToken  = ()            => api.post('/users/refresh-token');
export const getMe         = ()            => api.get('/users/me');
export const forgotPassword = (email)     => api.post('/users/forgot-password', { email });
export const resetPassword  = (token, password) => api.post(`/users/reset-password/${token}`, { password });
export const updateProfile   = (formData)    => api.patch('/users/update-profile', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
