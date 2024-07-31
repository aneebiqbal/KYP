import {api} from '../../services/axios';
export const BaseApiService = {
  getProfessors: (data) => api.post('/auth/login'+data),
  getProfessor: (data) => api.post('/auth/signup',data),
  saveProfessor: (data) => api.post('/auth/forget-password',data),
  SavedProfessors: (data) => api.post(`/auth/reset-password`,data),
  postReview: (data) => api.post(`/auth/logout`,data),
  getReviews: (data) => api.post(`/auth/logout`,data),
  updateProfile: (data) => api.post(`/auth/logout`,data),
  updatePassword: (data) => api.post(`/auth/logout`,data),
};
