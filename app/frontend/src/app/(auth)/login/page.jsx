'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import Link from 'next/link';
export default function page(){
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .required('Required'),
  });
  const handleSubmit = async (values) => {
    try {
      const data = {
        email: values.email,
        password: values.password,
      };

      console.log('data---',data)
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    }
  };
  return<>
    <div className="bg-ffffff px-40 py-20 border-radius-8" style={{width:'467px'}}>
      <h2 className="text-24 text-1F1F1F text-weight-500 mb-2">Login</h2>
      <p className="text-434343 text-16 text-weight-400 mb-4">Enter your credentials to login</p>
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
              <Field style={{ height: '46px' }} type="password" name="phoneNumber"
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              >
              </Field>
              <ErrorMessage name="name" component="div" />
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

    </div>
  </>
}

