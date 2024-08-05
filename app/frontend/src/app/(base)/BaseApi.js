import {BaseApiService} from './BaseApiService';

export const BaseApi = {
  getProfessors:async (data) => {
    // let search = '?sortField='+data.sortField+'&sortOrder='+data.sortOrder+'&searchBy='+data.searchBy+'&text='+data.search;
    let search = '?searchBy='+data.searchBy+'&text='+data.search;
    try {
      return await BaseApiService.getProfessors(search)
        .then((response)=>{
          return response.data;
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
    try {
      return await BaseApiService.saveProfessor(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  SavedProfessors:async (data) => {
    let search = '?searchBy='+data.searchBy+'&text='+data.search;
    try {
      return await BaseApiService.SavedProfessors(search)
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
