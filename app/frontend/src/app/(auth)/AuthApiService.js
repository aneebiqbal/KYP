import {unAuthorizedApi} from '../../services/axios';
export const AuthApiService = {
  login: (data) => unAuthorizedApi.post('/auth/login',data),
  signup: (data) => unAuthorizedApi.post('/auth/signup',data),
  forgetPassword: (data) => unAuthorizedApi.post('/auth/forget-password',data),
  resetPassword: (key,data) => unAuthorizedApi.post(`/auth/reset-password/${key}`,data),
  logout: (data) => unAuthorizedApi.post(`/auth/logout`,data),
};
