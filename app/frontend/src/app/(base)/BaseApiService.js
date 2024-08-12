import {api} from '../../services/axios';
export const BaseApiService = {
  getProfessors: (data) => api.get('/professors/search'+data),
  getProfessor: (data) => api.post('/auth/signup',data),
  saveProfessor: (data) => api.post('/professors/saved',data),
  SavedProfessors: (data) => api.get('/student/saved-professors'+data),
  postReview: (data) => api.post(`/auth/logout`,data),
  getReviews: (data) => api.get('/student/my-ratings'+data),
  updateProfile: (data) => api.post(`/student/update-profile`,data),
  updatePassword: (data) => api.post(`/student/update-password`,data),
};
