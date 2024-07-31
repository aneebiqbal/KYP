'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useState } from 'react';
import {AuthApi} from '../../app/(auth)/AuthApi';

export default function SignUpForm() {
  const [toggleCheck, setToggleCheck] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    school: Yup.string()
      .required('Required'),
    field: Yup.string()
      .required('Required'),
    password: Yup.string()
      .required('Required'),
  });
  const handleSubmit = async (values) => {
    try {
      await AuthApi.signup({firstName:values.firstName,lastName:values.lastName, school:values.school, field:values.field,email: values.email, password: values.password })
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    }
  };
  const handleToggleChange = (event) => {
    setToggleCheck(event.target.checked);
  };
  return<>
    <Formik
      initialValues={{ firstName:'',lastName:'',school:'',field:'',email: '',password:'' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="row">
            <div className="col-6 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">First Name</label>
              <Field type="text" name="firstName"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage name="firstName" component="div" />
            </div>
            <div className="col-6 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Last Name</label>
              <Field type="text" name="lastName"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage name="lastName" component="div" />
            </div>
            <div className="col-6 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Institute</label>
              <Field type="text" name="school"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage name="school" component="div" />
            </div>
            <div className="col-6 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Field of study</label>
              <Field type="text" name="field"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage name="field" component="div" />
            </div>
            <div className="col-6 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Email</label>
              <Field type="text" name="email"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage name="email" component="div" />
            </div>
            <div className="col-6 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Password</label>
              <Field style={{ height: '46px' }} type="password" name="password"
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              >
              </Field>
              <ErrorMessage name="password" component="div" />
            </div>

            <div className="flex col-12 mb-32">
              <input className="cursor-pointer" style={{ width: '16px', height: '16px' }} type="checkbox"
                     name="toggleCheck" checked={toggleCheck} onChange={handleToggleChange} />
              <label className="ml-8 text-weight-400 text-1F1F1F text-12">I agree to&nbsp;<span
                className="text-0378A6">Terms of Services</span>&nbsp;and&nbsp;<span className="text-0378A6">Privacy Policy</span>.</label>
            </div>
            <div className="col-12">
              <button
                disabled={!toggleCheck}
                style={{ height: '44px' }}
                className={`full-width bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 ${toggleCheck ?'opacity-100':'opacity-75'}`}
                type="submit">Sign up
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
      <p className="text-weight-400 text-14 text-262626 ">Already have an account? &nbsp;
        <Link href="/login" className="text-14 text-weight-400 text-0378A6 text-decoration-none">
          Sign In
        </Link>
      </p>
    </div>
  </>
}
