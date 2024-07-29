'use client';
import Image from 'next/image';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRef, useState } from 'react';
export default function Profile({userInfo}) {
  const validationUserInfo = Yup.object({
    name: Yup.string()
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
  const [preview, setPreview] = useState(userInfo.image);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const handleSubmit = async (values) => {
    try {
      const data = {
        name: values.name,
        email: values.email,
        university: values.university,
      };

      console.log('data---',data)
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    }
  };
  const handleChangePassword = async (values) => {
    try {
      const data = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      console.log('data---',data)
    } catch (error) {
      alert('Something went wrong. Please try again later.');
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
      setError('');
      setPreview(URL.createObjectURL(file));
    }
  }
  return<>
    <div>
      <p className="text-weight-600 text-24 text-1F1F1F mb-32">Account settings</p>
      <div className="flex mb-60">
        <div className="border-color-D9D9D9 border-radius-8 pa-40 mr-80" style={{ width: '368px' }}>
          <div className="mb-20 position-relative">
            <Image style={{width:'100%'}} height={280} width={280} src={preview} alt={userInfo.image} />
            <input ref={fileInputRef} style={{visibility:'hidden'}} className=" position-absolute" type="file" accept="image/*" onChange={handleImageUpload} />
            <div onClick={()=>{fileInputRef.current.click();}} className="position-absolute flex items-center justify-center cursor-pointer" style={{bottom:'0',left:'0',width:'100%',height:'48px',background:'rgba(0, 0, 0, 0.5)'}}>
              <Image width={24} height={24} src="/uploadIcon.svg" alt="uploadIcon"/>
              <p className="ml-12 text-ffffff text-14 text-weight-500" >Upload Photo</p>
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p className="text-center text-weight-400 text-14 text-434343 px-20">Image size should be under 1MB and image
            ration needs to be 1:1</p>
        </div>
        <div className="flex-1">
          <Formik
            initialValues={{ name: '', email: '',university:'' }}
            validationSchema={validationUserInfo}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex column justify-between full-height">
                <div>
                  <div className="full-width mb-20">
                    <label className="text-141414 text-weight-400 text-14 mb-2">Full Name</label>
                    <Field type="text" name="name"
                           style={{ height: '46px' }}
                           className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
                           placeholder="Enter Full Name"
                    />
                    <ErrorMessage name="name" component="div" />
                  </div>
                  <div className="full-width mb-20">
                    <label className="text-141414 text-weight-400 text-14 mb-2">Email</label>
                    <Field style={{ height: '46px' }} type="text" name="email"
                           className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
                           placeholder="Enter Email"
                    >
                    </Field>
                    <ErrorMessage name="email" component="div" />
                  </div>
                  <div className="full-width mb-20">
                    <label className="text-141414 text-weight-400 text-14 mb-2">University</label>
                    <Field style={{ height: '46px' }} type="text" name="university"
                           className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
                           placeholder="Enter University"
                    >
                    </Field>
                    <ErrorMessage name="university" component="div" />
                  </div>
                </div>
                <div className="">
                  <button
                    style={{ height: '44px' }}
                    className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16"
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
          <Form className="flex column justify-between " style={{width:'600px'}}>
            <div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">Current Password</label>
                <Field type="password" name="currentPassword"
                       style={{ height: '46px' }}
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
                />
                <ErrorMessage name="currentPassword" component="div" />
              </div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">New Password</label>
                <Field style={{ height: '46px' }} type="password" name="newPassword"
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
                >
                </Field>
                <ErrorMessage name="newPassword" component="div" />
              </div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">Confirm Password</label>
                <Field style={{ height: '46px' }} type="password" name="confirmPassword"
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
                >
                </Field>
                <ErrorMessage name="confirmPassword" component="div" />
              </div>
            </div>
            <div className="">
              <button
                style={{ height: '44px' }}
                className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16"
                type="submit">Change Password
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  </>
}
