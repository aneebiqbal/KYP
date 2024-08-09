import {api} from '../../services/axios';
export const BaseApiService = {
  getProfessors: (data) => api.get('/professors/search'+data),
  getProfessor: (data) => api.post('/auth/signup',data),
  saveProfessor: (data) => api.post('/professors/saved',data),
  SavedProfessors: (data) => api.get('/student/saved-professors'+data),
  postReview: (data) => api.post(`/auth/logout`,data),
  getReviews: (data) => api.post(`/auth/logout`,data),
  updateProfile: (data) => api.post(`/user/update-profile`,data),
  updatePassword: (data) => api.post(`/user/update-password`,data),
};
