import api from './axios';

export const getDashboard = () => api.get('/dashboard');

export const getResearchAnalytics = () => api.get('/dashboard/research-analytics');
