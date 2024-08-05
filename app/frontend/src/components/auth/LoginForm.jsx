'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import {AuthApi} from '../../app/(auth)/AuthApi';
import PopUp from '../PopUp';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function LoginForm() {
  const router = useRouter();
  const [popup, setPopup] = useState({show:false,type:'',message:'',timeout:0});
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .required('Required'),
  });
  const handleSubmit = async (values) => {
    try {
      await AuthApi.login({ email: values.email,password: values.password })
        .then(()=>{
          setPopup({show:true,type:'success',message:'Logged in Successfully',timeout:3000});
          router.push('/');
        })
    } catch (error) {
      console.log(error);
      setPopup({show:true,type:'error',message:error.message,timeout:3000});
    }
  };
  return<>
    <Formik
      initialValues={{ email: '',password:'' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="row">
            <div className="col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Email</label>
              <Field  type="text" name="email"
                      style={{height: '46px'}}
                      className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage name="email" component="div"/>
            </div>
            <div className="col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Password</label>
              <Field style={{ height: '46px' }} type="password" name="password"
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              >
              </Field>
              <ErrorMessage name="password" component="div" />
            </div>
            <div className="col-12 pl-15 mb-4 flex justify-end">
              <Link href="/forget-password" className="text-14 text-weight-400 text-0378A6 text-decoration-none">Forgot password?</Link>
            </div>
            <div className="col-12">
              <button

                style={{height:'44px'}}
                className="full-width bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16"
                type="submit">Login
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
    <div className="separator-x mt-3 mb-3"></div>
    <div className="flex column items-center">
      <button
        style={{ height: '44px' }}
        className="full-width bg-F1ECFE border-none border-radius-4 text-262626 text-weight-500 text-16 mb-32">
        Continue with Google
      </button>
      <p className="text-weight-400 text-14 text-262626 ">Don't have an account? &nbsp;
        <Link href="/sign-up" className="text-14 text-weight-400 text-0378A6 text-decoration-none">
          Create Account
        </Link>
      </p>
    </div>
    <PopUp props={popup}/>

  </>
}
