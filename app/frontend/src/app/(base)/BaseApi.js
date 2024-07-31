import {BaseApiService} from './BaseApiService';

export const BaseApi = {
  getProfessors:async (data) => {
    let search = '?sortField='+data.sortField+'&sortOrder='+data.sortOrder+'&searchBy='+data.searchBy+'&name='+data.search;
    try {await BaseApiService.getProfessors(search)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  getProfessor:async (data) => {
    try {await BaseApiService.getProfessor(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  saveProfessor:async (data) => {
    try {await BaseApiService.saveProfessor(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  SavedProfessors:async (data) => {
    try {await BaseApiService.SavedProfessors(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  postReview:async (data) => {
    try {await BaseApiService.postReview(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  getReviews:async (data) => {
    try {await BaseApiService.getReviews(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  updateProfile:async (data) => {
    try {await BaseApiService.updateProfile(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  updatePassword:async (data) => {
    try {await BaseApiService.updatePassword(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
};
