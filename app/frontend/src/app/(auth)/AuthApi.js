import { AuthApiService } from './AuthApiService';
import { NextResponse } from 'next/server';
import {setToken, destroyToken, destroyUserInfo, setUserInfo} from '../../services/JwtService';

export const AuthApi = {
  login:async (loginData) => {
    try {await AuthApiService.login(loginData)
      .then((response)=>{
        setUserInfo(response.data.userInfo);
        setToken(response.data.token);
        NextResponse.redirect(new URL('/'));
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  signup: async(signUpData) => {
    try {
      return await AuthApiService.signup(signUpData)
        .then((response)=>{
          setUserInfo(response.data.userInfo);
          setToken(response.data.token);
          NextResponse.redirect(new URL('/'));
        })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  forgetPassword: async(forgetPasswordData) => {
    try {
      return await AuthApiService.forgetPassword(forgetPasswordData);
    } catch (e) {
      console.log('error', e);
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
  logout: async(logoutData) => {
    try {
      await AuthApiService.logout(logoutData)
        .then(()=>{
          destroyToken();
          destroyUserInfo();
          NextResponse.redirect(new URL('/login'));
        })
    } catch (e) {
      console.log('error', e);
      throw e.response.data;
    }
  },
};
