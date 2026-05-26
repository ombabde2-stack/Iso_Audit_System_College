import api from './axios';

export const getHODQueue      = (params)          => api.get('/reviews/queue', { params });
export const updateFormStatus = (id, data)        => api.patch(`/reviews/${id}/status`, data);
