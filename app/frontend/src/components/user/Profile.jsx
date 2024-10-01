'use client';
import Image from 'next/image';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import {BaseApi} from '../../app/(base)/BaseApi';
import PopUp from '../PopUp';
import { getToken, getUserInfo ,setUserInfo} from '../../services/JwtService';
import aws from 'aws-sdk'
import { useRouter } from 'next/navigation';

export default function Profile({userInfo,setUserProfileInfo}) {
  let token = getToken();
  const router = useRouter
  const [popup, setPopup] = useState({show:false,type:'',message:'',timeout:0});
  const validationUserInfo = Yup.object({
    firstName: Yup.string()
      .required('Required'),
    lastName: Yup.string()
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    university: Yup.string()
      .required('Required'),
  });
  const validationPasswords = Yup.object({
    currentPassword: Yup.string()
      .required('Required'),
    newPassword: Yup.string()
      .required('Required'),
    confirmPassword: Yup.string()
      .required('Required'),
  });
  const [preview, setPreview] = useState(userInfo.image_url);
  '/student.png'
  // const [image, setImage] = useState(userInfo.image_url?userInfo.image_url:"/user/userImage.png");
  const [image, setImage] = useState(userInfo.image_url?userInfo.image_url:'/student.png');

  const [saveprofileLoader,setSaveProfileLoader]=useState(false);
  const [savePasswordLoader,setSavePasswordLoader]=useState(false);
  const [imageLoader,setImageLoader] =useState(false);

  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const handleSubmit = async (values) => {
    try{
      // const formData = new FormData();
      // formData.append('image', image);
      // formData.append('first_name', values.firstName);
      // formData.append('last_name', values.lastName);
      // formData.append('email', values.email);
      // formData.append('institute_name', values.university);
      // formData.append('id', userInfo.id);
      setSaveProfileLoader(true)
      await BaseApi.updateProfile({first_name:values.firstName,last_name:values.lastName,email:values.email,institute_name:values.university,image_url:image}
      //   , {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // }
      ).then(() => {
  //       let userInfoCookie = getCookie('user-info');
  // if (userInfoCookie) {
  //   let user = JSON.parse(decodeURIComponent(userInfoCookie));
  //   user.image_url = image;
  //   console.log("institute: ",values.university)
  //   user.institute=values.university;
  //   const updatedUserInfo = JSON.stringify(user);
  //   setCookie('user-info', encodeURIComponent(updatedUserInfo), 30);
  //   userInfoCookie = getCookie('user-info');
  //   user = JSON.parse(decodeURIComponent(userInfoCookie));
  setUserProfileInfo({first_name:values.firstName,last_name:values.lastName,email:values.email,institute:{name:values.university},image_url:image})
  setUserInfo(JSON.stringify({first_name:values.firstName,last_name:values.lastName,email:values.email,institute:{name:values.university},image_url:image}))
  setSaveProfileLoader(false)
  setPopup({show:true,type:'success',message:'Saved Successfully',timeout:3000});
  // } else {
  //   console.log('User info cookie not found.');
  // }
  //       setPopup({ show: true, type: 'success', message: 'Profile Updated Successfully', timeout: 3000 });
      });
    }catch (e){
      setSaveProfileLoader(false)
      if(e?.message?.includes("Network")){
      setPopup({show:true,type:'error',message:e.message,timeout:3000});
      } else {
        setPopup({show:true,type:'error',message:e.response.data.message,timeout:3000});
      }
    }
  };
  const handleChangePassword = async (values) => {
    if(values.newPassword !== values.confirmPassword){
      setPopup({show:true,type:'warning',message:'New Password and Confirm Password must be same',timeout:3000});
    }else{
      try{
        setSavePasswordLoader(true)
        await BaseApi.updatePassword({oldPassword:values.currentPassword,newPassword:values.newPassword,confirmPassword:values.confirmPassword , id:userInfo.id})
          .then(()=>{
            setSavePasswordLoader(false)
            setPopup({show:true,type:'success',message:'Password Updated Successfully',timeout:3000});
          })
      }catch (e){
        console.log("error--------",e)
        setSavePasswordLoader(false)
        if(e?.message?.includes("Network")){
          setPopup({show:true,type:'error',message:e.message,timeout:3000});
          } else {
            setPopup({show:true,type:'error',message:e.response.data.message,timeout:3000});
          }
      }
    }

  };

  // function getCookie(name) {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(';').shift();
  // }

  // function setCookie(name, value, days) {
  //   let expires = "";
  //   if (days) {
  //     const date = new Date();
  //     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  //     expires = `; expires=${date.toUTCString()}`;
  //   }
  //   document.cookie = `${name}=${value || ""}${expires}; path=/`;
  // }
    const handleImageUpload = async (event) => {
      setImageLoader(true)
      const file = event.target.files[0];
      // setFile(fileuploaded)
      // console.log("file: ",file)
      // if (file) {
      //    const src = await convertFileToSrc(file);
      //    console.log("file src : ",src);
      //    setImage(src)
      // }
      const s3 =  new AWS.S3({
        accessKeyId:"AKIA6ODU2336OH4TKAZM",
        secretAccessKey:"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",
        region: 'ap-south-1',
    });

    const params = {
        Bucket: 'reactkypprofilepics',
        Key: file.name,
        Body: file,
        ContentType: file.type,
    };

    const upload = s3.upload(params);
    const data = await upload.promise();
    console.log("DA?TA______",data)
    setImage(data.Location)
    setImageLoader(false)
  }
    // try{
    //   await BaseApi.updateProfilePic({image_url:image}
    //   ).then(() => {
    //     setPopup({ show: true, type: 'success', message: 'Profile Pic Updated Successfully', timeout: 3000 });
    //   });
    // }catch (e){
    //   setPopup({show:true,type:'error',message:error.message,timeout:3000});
    // }



    // async function convertFileToSrc(file) {
    //   if (!file || !file.type.match('image/*')) {
    //     throw new Error('Please select a valid image file.');
    //   }

    //   const reader = new FileReader();

    //   return new Promise((resolve, reject) => {
    //     reader.onload = () => resolve(reader.result);
    //     reader.onerror = () => reject('Error reading file.');  

    //     reader.readAsDataURL(file);
    //   });
    // }

    useEffect(()=>{
      if(!token){
        router.push('/')
      }
    },[])


  return<>
    <div className='mt-30'>
      {/* <p className="text-weight-600 text-24 text-1F1F1F mb-32  ">Account settings</p> */}
      <div className="flex mb-60 professor-profile-mobile-center">
        {/* <div className="border-color-D9D9D9 border-radius-8 pa-40 mr-80 img-input-field-width-mr-0 full-width-mobile-responsive" style={{ width: '368px',height:'450px' }}>
          {
            imageLoader
            ?
            <div style={{width:'100%',height:'100%',display: 'flex',alignItems: 'center',justifyContent: 'center'}} height={380} width={380}>
            <span className="loader"></span>
            </div>
            :
            <div>
            <div className="mb-20 position-relative">
            <Image style={{width:'100%'}} height={280} width={280} src={image} alt={'userInfo?.image_url'} />
            <input  ref={fileInputRef} style={{visibility:'hidden', left:'0',bottom:'0',width:'0',height:'0'}} className="position-absolute" type="file" accept="image/*" onChange={handleImageUpload} />
            <div onClick={()=>{fileInputRef.current.click();}} className="position-absolute flex items-center justify-center cursor-pointer " style={{bottom:'0',left:'0',width:'100%',height:'48px',background:'rgba(0, 0, 0, 0.5)'}}>
              <Image width={24} height={24} src="/uploadIcon.svg" alt="uploadIcon"/>
              <p className="ml-12 text-ffffff text-14 text-weight-500" >Upload Photo</p>
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p className="text-center text-weight-400 text-14 text-434343 px-20">Image size should be under 1MB and image
            ration needs to be 1:1</p>
          </div>
          }
        </div> */}
        <div className="mobile-mt-28 flex-1">
      <p className="text-weight-600 text-24 text-1F1F1F mb-32">Account settings</p>
          <Formik
            initialValues={{ firstName:userInfo?.first_name, lastName: userInfo?.last_name, email: userInfo?.email,university:userInfo?.institute?.name }}
            validationSchema={validationUserInfo}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex column justify-between ">
                <div  className="row full-width ">
                  <div className="mb-20 col-12 mobile-padding-right-0 ">
                    <label className="text-141414 text-weight-400 text-14 mb-2">Full Name</label>
                    <div className="row ">
                      <div className="col-md-12 col-lg-6  mobile-padding-right-0  ">
                        <Field type="text" name="firstName"
                               style={{ height: '46px' }}
                               className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8 first-name-mb-12"
                               placeholder="Enter First Name"
                        />
                          <ErrorMessage className="error-message" name="firstName" component="div" />
                      </div>
                      <div className="col-md-12 col-lg-6 mt-md-2 mt-lg-0 mobile-padding-right-0 ">
                        <Field type="text" name="lastName"
                               style={{ height: '46px' }}
                               className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                               placeholder="Enter Last Name"
                        />
                        <ErrorMessage className="error-message" name="lastName" component="div" />
                      </div>
                    </div>

                  </div>
                  <div className=" col-12 mobile-padding-right-0 ">
                    <div className="row ">
                    <div className="col-12 mb-20 mobile-padding-right-0 ">
                    <label className="text-141414 text-weight-400 text-14 mb-2">Email</label>
                    <Field style={{ height: '46px' }} type="text" name="email"
                           className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                           placeholder="Enter Email"
                    >
                    </Field>
                    <ErrorMessage className="error-message" name="email" component="div" />
                  </div>
                  <div className="col-12 mb-20 mobile-padding-right-0 ">
                    <label className="text-141414 text-weight-400 text-14 mb-2">University</label>
                    <Field style={{ height: '46px' }} type="text" name="university"
                           className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                           placeholder="Enter University"
                    >
                    </Field>
                    <ErrorMessage className="error-message" name="university" component="div" />
                  </div>
                    </div>
                  </div>

                </div>
                <div className="">
                  {
                    saveprofileLoader
                    ?
                    <button
                      style={{
                        height: '44px',
                        width: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#763FF9',
                        color: '#ffffff',
                        borderRadius: '4px',
                        fontWeight: 500,
                        fontSize: '16px',
                        border: 'none',
                        cursor: "not-allowed",
                      }}
                      disabled={true}
                    >
                      <span className="submitloader"></span>
                      {/* <span className="ms-2">Saving Changes</span> */}
                    </button>
                    :
                    <button
                    style={{ height: '44px', width: '180px' }}
                    className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                    type="submit">Save changes
                  </button>
                    // <button
                    //   style={{ height: '44px', width: '180px' }}
                    //   className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                    //   type="submit">Save changes
                    // </button>
                   }
                </div>
              </Form>
            )}
          </Formik>
        </div>


        <div style={{marginLeft:"120px"}}>
        <p className="text-weight-600 text-24 text-1F1F1F mb-32">Change Password</p>

        <Formik
        initialValues={{ currentPassword: '', newPassword: '',confirmPassword:'' }}
        validationSchema={validationPasswords}
        onSubmit={handleChangePassword}
      >
        {({ errors, touched }) => (
          <Form className=" flex column justify-between full-width-responsive " style={{width:'600px'}}>
            <div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">Current Password</label>
                <Field type="password" name="currentPassword"
                       style={{ height: '46px' }}
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                />
                  <ErrorMessage className="error-message" name="currentPassword" component="div" />
              </div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">New Password</label>
                <Field style={{ height: '46px' }} type="password" name="newPassword"
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                >
                </Field>
                <ErrorMessage className="error-message" name="newPassword" component="div" />
              </div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">Confirm Password</label>
                <Field style={{ height: '46px' }} type="password" name="confirmPassword"
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                >
                </Field>
                <ErrorMessage className="error-message" name="confirmPassword" component="div" />
              </div>
            </div>
            <div className="">
              {
                savePasswordLoader
                  ?
                    <button
                      style={{
                        height: '44px',
                        width: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#763FF9',
                        color: '#ffffff',
                        borderRadius: '4px',
                        fontWeight: 500,
                        fontSize: '16px',
                        border: 'none',
                        cursor: "not-allowed",
                      }}
                      disabled={true}
                    >
                      <span className="submitloader"></span>
                      {/* <span className="ms-2">Saving Changes</span> */}
                    </button>
                  :
              <button
                style={{ height: '44px', width: '180px' }}
                className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                type="submit">Change Password
              </button>
            }
            </div>
          </Form>
        )}
      </Formik>

        </div>


      </div>
      <div className="separator-x mb-60"></div>
      {/* <p className="text-weight-600 text-24 text-1F1F1F mb-32">Change Password</p> */}
      {/* <Formik
        initialValues={{ currentPassword: '', newPassword: '',confirmPassword:'' }}
        validationSchema={validationPasswords}
        onSubmit={handleChangePassword}
      >
        {({ errors, touched }) => (
          <Form className=" flex column justify-between full-width-responsive " style={{width:'600px'}}>
            <div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">Current Password</label>
                <Field type="password" name="currentPassword"
                       style={{ height: '46px' }}
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                />
                <ErrorMessage name="currentPassword" component="div" />
              </div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">New Password</label>
                <Field style={{ height: '46px' }} type="password" name="newPassword"
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                >
                </Field>
                <ErrorMessage name="newPassword" component="div" />
              </div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">Confirm Password</label>
                <Field style={{ height: '46px' }} type="password" name="confirmPassword"
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                >
                </Field>
                <ErrorMessage name="confirmPassword" component="div" />
              </div>
            </div>
            <div className="">
              {
                savePasswordLoader
                  ?
                    <button
                      style={{
                        height: '44px',
                        width: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#763FF9',
                        color: '#ffffff',
                        borderRadius: '4px',
                        fontWeight: 500,
                        fontSize: '16px',
                        border: 'none',
                        cursor: "not-allowed",
                      }}
                      disabled={true}
                    >
                      <span className="submitloader"></span>
                      {/* <span className="ms-2">Saving Changes</span> *}
                    </button>
                  :
              <button
                style={{ height: '44px', width: '180px' }}
                className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                type="submit">Change Password
              </button>
            }
            </div>
          </Form>
        )}
      </Formik> */}
    </div>
    <PopUp props={popup}/>
  </>
}
