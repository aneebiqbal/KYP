'use client';
import Image from 'next/image';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import {BaseApi} from '../../app/(base)/BaseApi';
import PopUp from '../PopUp';
import { getToken, getUserInfo } from '../../services/JwtService';
export default function Profile({userInfo}) {
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
  const [image, setImage] = useState(null);
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
      await BaseApi.updateProfile({first_name:values.firstName,last_name:values.lastName,email:values.email,institute_name:values.university}
      //   , {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // }
      ).then(() => {
        setPopup({ show: true, type: 'success', message: 'Profile Updated Successfully', timeout: 3000 });
      });
    }catch (e){
      setPopup({show:true,type:'error',message:error.message,timeout:3000});
    }
  };
  const handleChangePassword = async (values) => {
    if(values.newPassword !== values.confirmPassword){
      setPopup({show:true,type:'warning',message:'New Password and Confirm Password must be same',timeout:3000});
    }else{
      try{
        await BaseApi.updatePassword({oldPassword:values.currentPassword,newPassword:values.newPassword,confirmPassword:values.confirmPassword , id:userInfo.id})
          .then(()=>{
            setPopup({show:true,type:'success',message:'Password Updated Successfully',timeout:3000});
          })
      }catch (e){
        setPopup({show:true,type:'error',message:error.message,timeout:3000});
      }
    }

  };
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        setPreview(null);
        return;
      }
      setImage(file)
      setError('');
      setPreview(URL.createObjectURL(file));
    }
  }
  return<>
    <div>
      <p className="text-weight-600 text-24 text-1F1F1F mb-32 ">Account settings</p>
      <div className="flex mb-60 professor-profile-mobile-center">
        <div className="border-color-D9D9D9 border-radius-8 pa-40 mr-80 img-input-field-width-mr-0" style={{ width: '368px' }}>
          <div className="mb-20 position-relative">
            <Image style={{width:'100%'}} height={280} width={280} src="/user/userImage.png" alt={'userInfo?.image_url'} />
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
        <div className="mobile-mt-28 flex-1">
          <Formik
            initialValues={{ firstName:userInfo?.first_name, lastName: userInfo?.last_name, email: userInfo?.email,university:userInfo?.institute }}
            validationSchema={validationUserInfo}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex column justify-between full-height">
                <div  className="row full-width  ">
                  <div className=" mb-20 col-12 mobile-padding-right-0 ">
                    <label className="text-141414 text-weight-400 text-14 mb-2">Full Name</label>
                    <div className="row ">
                      <div className="col-md-12 col-lg-6  mobile-padding-right-0  ">
                        <Field type="text" name="firstName"
                               style={{ height: '46px' }}
                               className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8 first-name-mb-12"
                               placeholder="Enter First Name"
                        />
                        <ErrorMessage name="firstName" component="div" />
                      </div>
                      <div className="col-md-12 col-lg-6 mt-md-2 mobile-padding-right-0 ">
                        <Field type="text" name="lastName"
                               style={{ height: '46px' }}
                               className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                               placeholder="Enter Last Name"
                        />
                        <ErrorMessage name="lastName" component="div" />
                      </div>
                    </div>

                  </div>
                  <div className="col-12 mb-20 mobile-padding-right-0 ">
                    <label className="text-141414 text-weight-400 text-14 mb-2">Email</label>
                    <Field style={{ height: '46px' }} type="text" name="email"
                           className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                           placeholder="Enter Email"
                    >
                    </Field>
                    <ErrorMessage name="email" component="div" />
                  </div>
                  <div className="col-12 mb-20 mobile-padding-right-0 ">
                    <label className="text-141414 text-weight-400 text-14 mb-2">University</label>
                    <Field style={{ height: '46px' }} type="text" name="university"
                           className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                           placeholder="Enter University"
                    >
                    </Field>
                    <ErrorMessage name="university" component="div" />
                  </div>
                </div>
                <div className="">
                  <button
                    style={{ height: '44px' }}
                    className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                    type="submit">Save changes
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="separator-x mb-60"></div>
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
              <button
                style={{ height: '44px' }}
                className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                type="submit">Change Password
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    <PopUp props={popup}/>
  </>
}
