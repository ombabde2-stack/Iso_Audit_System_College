import api from './axios';

export const getMyTemplates  = ()       => api.get('/form-templates/my');
export const getMyTemplate   = (formNo) => api.get(`/form-templates/my/${formNo}`);
export const getAllTemplates  = (params) => api.get('/form-templates', { params });
export const createTemplate  = (data)   => api.post('/form-templates', data);
export const updateTemplate  = (id, d)  => api.patch(`/form-templates/${id}`, d);
