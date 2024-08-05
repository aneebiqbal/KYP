import {api} from '../../services/axios';
export const BaseApiService = {
  getProfessors: (data) => api.post('/auth/login'+data),
  getProfessor: (data) => api.post('/auth/signup',data),
  saveProfessor: (data) => api.post('/professors/saved',data),
  SavedProfessors: (data) => api.post(`/professors/saved`,data),
  postReview: (data) => api.post(`/auth/logout`,data),
  getReviews: (data) => api.post(`/auth/logout`,data),
  updateProfile: (data) => api.post(`/user/update-profile`,data),
  updatePassword: (data) => api.post(`/user/update-password`,data),
};
