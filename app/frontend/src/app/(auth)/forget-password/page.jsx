'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
export default function page(){
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
  });
  const handleSubmit = async (values) => {
    try {
      const data = {
        email: values.email,
      };

      console.log('data---',data)
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    }
  };
  return<>
    <div className="bg-ffffff px-40 py-20 border-radius-8" style={{width:'467px'}}>
      <h2 className="text-24 text-1F1F1F text-weight-500 mb-2">Forgot Password?</h2>
      <p className="text-434343 text-16 text-weight-400 mb-4">Enter your registered email address to receive password reset instructions.</p>
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
      <div className="flex column items-center">
        <p className="text-weight-400 text-14 text-262626 mt-3">Keep your Password? &nbsp;
          <Link href="/login" className="text-14 text-weight-400 text-0378A6 text-decoration-none">
            Login
          </Link>
        </p>
      </div>

    </div>
  </>
}

