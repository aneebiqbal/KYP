'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {AuthApi} from '../../app/(auth)/AuthApi';

export default function ForgetPasswordForm() {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
  });
  const handleSubmit = async (values) => {
    try {
      await AuthApi.forgetPassword({ email: values.email })
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    }
  };
  return<>
    <Formik
      initialValues={{ email: '' }}
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
            <div className="col-12">
              <button
                style={{height:'44px'}}
                className="full-width bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16"
                type="submit">Send Reset Instructions
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  </>
}
