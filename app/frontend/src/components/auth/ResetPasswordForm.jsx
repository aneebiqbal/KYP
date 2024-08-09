'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {AuthApi} from '../../app/(auth)/AuthApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PopUp from '../PopUp';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [popup, setPopup] = useState({show:false,type:'',message:'',timeout:0});
  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Required'),
    confirmPassword: Yup.string()
      .required('Required'),
  });
  const handleSubmit = async (values) => {
    if(values.password !== values.confirmPassword){
      setPopup({show:true,type:'warning',message:'New Password and Confirm Password must be same',timeout:3000});
    }else{
      try {
        await AuthApi.resetPassword({newPassword: values.password, token: values.slug})
          .then(()=>{
            setPopup({show:true,type:'success',message:'Reset Password Link is been sent to your mail ',timeout:3000});
            router.push('/login')
          })
      } catch (error) {
        setPopup({show:true,type:'error',message:error.message,timeout:3000});
      }
    }
  };
  return<>
    <Formik
      initialValues={{ password:'',confirmPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="row">
            <div className="col-12 pl-15 mb-2">
              <label className="text-141414 text-weight-400 text-14 mb-2">Password</label>
              <Field type="password" name="password"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage name="password" component="div" />
            </div>
            <div className="mb-2">
              <ul style={{paddingLeft:'16px',marginBottom:'0'}}>
                <li className="text-weight-400 text-434343 text-12">At least one upper case, lower case, special character and numeric character is required</li>
                <li className="text-weight-400 text-434343 text-12">Password should be from 6 to 20 character long</li>
              </ul>
            </div>
            <div className="col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Confirm Password</label>
              <Field type="password" name="confirmPassword"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage name="confirmPassword" component="div" />
            </div>
            <div className="col-12">
              <button
                style={{ height: '44px' }}
                className="full-width bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16"
                type="submit">Reset
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
    <PopUp props={popup}/>
  </>
}
