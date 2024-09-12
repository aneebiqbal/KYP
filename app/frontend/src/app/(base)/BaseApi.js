import {BaseApiService} from './BaseApiService';

export const BaseApi = {
  getProfessors:async (data) => {
    // let search = '?sortField='+data.sortField+'&sortOrder='+data.sortOrder+'&searchBy='+data.searchBy+'&text='+data.search;
    let search = '?searchBy='+data.searchBy+'&search='+data.search+'&page='+data.page+'&sortField='+data.sortField+'&sortOrder='+data.sortOrder;
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
    console.log(data);
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
    let search = '?searchBy='+data.searchBy+'&search='+data.search+'&page='+data.page;
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
  postRating:async (data) => {
    try { return await BaseApiService.postRating(data)
      .then((response)=>{
        console.log("response from rating professor: ",response)
        return response;
      })
    } catch (e) {
      console.log('error in post review : ', e);
      throw e;
    }
  },
  getReviews:async (data) => {
    let search = '?searchBy='+data.searchBy+'&search='+data.search+'&page='+data.page;
    try {
      return await BaseApiService.getReviews(search)
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
  // updateProfilePic:async (data) => {
  //   try {
  //     console.log("data---",data)
  //     await BaseApiService.updateProfilePic(data)
  //     .then((response)=>{
  //       console.log("response-------",response)
  //       return response;
  //     })
  //   } catch (e) {
  //     console.log('error', e.message);
  //     throw e.message;
  //   }
  // },
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
  reactRatings:async (data) => {
    try {
      return await BaseApiService.reactRatings(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error', e.message);
      throw e.message;
    }
  },
  getProfessorDetail: async(data) =>{
    try {
      const{id,courseCode} = data
      console.log("id: ",id)
      console.log("courseCode: ",courseCode);
      let params= courseCode? `${id}/${courseCode}` : `${id}`
      return await BaseApiService.getProfessorDetails(params)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error from getProfessorDetails', e);
      throw e.message;
    }
  },
  getProfessorCourses: async(data) =>{
    try {
      const{id} = data
      console.log("id for course : ",id)
      return await BaseApiService.getProfessorCourses(`${id}`)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error from getProfessorCourses', e);
      throw e.message;
    }
  },
  getSavedProfessor: async(data) =>{
    try {
      const{id} = data
      return await BaseApiService.getSavedProfessor(`${id}`)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      console.log('error from getProfessorSaved', e);
      throw e.message;
    }
  }

};
