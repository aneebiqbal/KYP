'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
export default function page(){
  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Required'),
    confirmPassword: Yup.string()
      .required('Required'),
  });
  const handleSubmit = async (values) => {
    try {
      const data = {
        password: values.email,
        confirmPassword: values.password,
      };

      console.log('data---',data)
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    }
  };
  return<>
    <div className="bg-ffffff px-40 py-20 border-radius-8" style={{width:'467px'}}>
      <h2 className="text-24 text-1F1F1F text-weight-500 mb-2">Reset your password</h2>
      <p className="text-434343 text-16 text-weight-400 mb-4">Enter a new password to reset the password on your account. Password must be 6 to 20 character long.</p>
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
                <Field type="password" name="email"
                       style={{ height: '46px' }}
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
                />
                <ErrorMessage name="email" component="div" />
              </div>
              <div className="mb-2">
                <ul style={{paddingLeft:'16px',marginBottom:'0'}}>
                  <li className="text-weight-400 text-434343 text-12">At least one upper case, lower case, special character and numeric character is required</li>
                  <li className="text-weight-400 text-434343 text-12">Password should be from 6 to 20 character long</li>
                </ul>
              </div>
              <div className="col-12 pl-15 mb-32">
                <label className="text-141414 text-weight-400 text-14 mb-2">Confirm Password</label>
                <Field type="password" name="email"
                       style={{ height: '46px' }}
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
                />
                <ErrorMessage name="email" component="div" />
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

