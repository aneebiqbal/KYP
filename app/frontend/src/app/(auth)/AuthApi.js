import { AuthApiService } from './AuthApiService';
import {setToken, destroyToken, destroyUserInfo, setUserInfo} from '../../services/JwtService';


export const AuthApi = {

  login:async (loginData) => {
    try {
      await AuthApiService.login(loginData)
      .then((response)=>{
        setUserInfo(JSON.stringify(response.data.student));
        setToken(response.data.token);
      })
    } catch (e) {
      console.log('error', e);
      throw e ;
    }
  },
  signup: async(signUpData) => {
    try {
      return await AuthApiService.signup(signUpData)
        .then((response)=>{
          setUserInfo(JSON.stringify(response.data.student));
          setToken(response.data.token);
        })
    } catch (e) {
      console.log('error', e.response.data);
      throw e.response.data;
    }
  },
  forgetPassword: async(forgetPasswordData) => {
    try {
      return await AuthApiService.forgetPassword(forgetPasswordData);
    } catch (e) {
      console.log('error', e.response.data);
      throw e.response.data;
    }
  },
  resetPassword: async(resetPasswordKey,resetPasswordData) => {
    try {
      return await AuthApiService.resetPassword(resetPasswordKey,resetPasswordData);
    } catch (e) {
      console.log('error', e);
      throw e.response.data;
    }
  },
  logout: async() => {
    try {
      destroyToken();
      destroyUserInfo();
    } catch (e) {
      console.log('error', e);
    }
  },
};
