import api from './axios';

export const createForm = (payload) => {
  const formData = new FormData();
  formData.append('formType', payload.formType);
  if (payload.status) formData.append('status', payload.status);
  if (payload.remarks) formData.append('remarks', payload.remarks);
  if (payload.data) formData.append('data', JSON.stringify(payload.data));
  if (payload.submissionFile) formData.append('submissionFile', payload.submissionFile);
  
  return api.post('/forms', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const getMyForms    = (params)      => api.get('/forms/my', { params });
export const getAllForms    = (params)      => api.get('/forms', { params });
export const getSingleForm = (id)          => api.get(`/forms/${id}`);
export const getFormDownloadUrl = (id)    => `${import.meta.env.VITE_API_URL}/forms/${id}/download`;
