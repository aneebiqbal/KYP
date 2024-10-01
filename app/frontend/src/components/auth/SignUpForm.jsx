'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useState, useEffect,useRef } from 'react';
import {AuthApi} from '../../app/(auth)/AuthApi';
import PopUp from '../PopUp';
import { useRouter } from 'next/navigation';
import {  GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { MdArrowDropDown } from "react-icons/md";

export default function SignUpForm(props) {
  const router = useRouter();
  const [loading,setLoading] = useState(false);
  const [institute,setInstitute] = useState(props.institute);
  const [department,setDeparment] = useState([])
  const [selectedDepartment,setSelectedDepartment] = useState({});
  const [selectedInstitute,setSelectedInstitute] = useState({});
  const [DropdownOpen, setDropdownOpen] = useState(false);
  const [checkInstituteSelected,setCheckInstituteSelected] = useState(false)
  const [departmentLoader,setDeparmentLoader] = useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [toggleCheck, setToggleCheck] = useState(false);
  const [popup, setPopup] = useState({show:false,type:'',message:'',timeout:0});
  const dropdownRef = useRef(null);
  const departmentdropdownRef = useRef(null);
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
    field: Yup.string()
      .required('Required'),
    password: Yup.string()
      .required('Required'),
  });

  console.log("institute ---- : ",institute)
  console.log("selected: ",selectedDepartment)

  const getDepartments = async () =>{
    try{
      setDeparmentLoader(true);
      let department = await AuthApi.getDepartment(selectedInstitute.label);
      console.log("department ",department);
      setDeparment(department.data)
      setDeparmentLoader(false);
    } catch (e){
      setDeparmentLoader(false);
      console.log("error: ",e)
      setDeparment([])
      setPopup({show:true,type:'error',message:error.message,timeout:3000});
    }
  }
  console.log("institute ---- : ",institute)
  useEffect(()=>{
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (departmentdropdownRef.current && !departmentdropdownRef.current.contains(event.target)) {
        setDepartmentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },[])

  useEffect(()=>{
    if(selectedInstitute?.label){
      setCheckInstituteSelected(false)
      getDepartments()
    }
  },[selectedInstitute])

  const handleSubmit = async (values) => {
    console.log("values---------: ",values)
    try {
      setLoading(true);
      await AuthApi.signup({
        first_name:values.firstName,
        last_name: values.lastName,
        instituteName: values.school,
        department:values.field,
        email: values.email,
        password: values.password
       })
        .then(()=>{
        setLoading(false)
          setPopup({show:true,type:'success',message:'Congratulations! you are registered.',timeout:3000});
          router.push('/');
        })
    } catch (error) {
      setLoading(false)
      setPopup({show:true,type:'error',message:error.message,timeout:3000});
    }
  };
  const handleToggleChange = (event) => {
    setToggleCheck(event.target.checked);
  };


  const handleGoogleLoginSuccess = async (res) => {
    console.log('Google Credential Response:', res);

    try {
      const decoded = jwtDecode(res.credential);
      console.log('Decoded:', decoded);
      const email = decoded.email;
      const first_name=decoded.given_name;
      const last_name=decoded.family_name;
      const image_url = decoded.picture;

      await AuthApi.signup({ email,first_name, last_name, image_url, isGmail:true  }).then(() => {
        setPopup({
          show: true,
          type: 'success',
          message: 'Congratulations! you are registered.',
          timeout: 3000,
        });
        router.push('/');
      });
    } catch (error) {
      setPopup({
        show: true,
        type: 'error',
        message: error.message,
        timeout: 3000,
      });
    }
  };

  const handleGoogleLoginError = () => {
    setPopup({
      show: true,
      type: 'error',
      message: 'Google login failed. Please try again.',
      timeout: 3000,
    });
  };

  return<>
    <Formik
      initialValues={{ firstName:'',lastName:'',school:'',field:'',email: '',password:'', field:'' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched,setFieldValue }) => (
        <Form>
          <div className="row  ">
            <div className="col-md-6 col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">First Name</label>
              <Field type="text" name="firstName"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage className="error-message" name="firstName" component="div" />
            </div>
            <div className="col-md-6 col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Last Name</label>
              <Field type="text" name="lastName"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage className="error-message" name="lastName" component="div" />
            </div>
            <div className="col-md-6 col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">School</label>
                <div
                  onClick={() => setDropdownOpen(!DropdownOpen)
                  }
                  style={{
                    height: '46px',
                    width: '270px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className="px-20 border-radius-4 bg-transparent text-394560 border-color-D9D9D9 full-width-responsive"
                >
                  <p className="text-14">
                    {institute.find((option) => option === selectedInstitute)?.label||
                      'Select School'}
                  </p>
                </div>
                {DropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  marginTop: '4px',
                  width: '270px',
                  borderRadius: '12px',
                  border: '1px solid #D9D9D9',
                  backgroundColor: '#ffffff',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflow:"auto",
                }}
                className="px-10 text-14 border-color-D9D9D9"
              >
                {institute.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setFieldValue('school', option.label);
                      setSelectedInstitute(option);
                      setDropdownOpen(false);
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                    className="px-10 py-12"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
              <ErrorMessage name="school" component="div" />
            </div>
            <div className="col-md-6 col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Field of study</label>
              {/* <Field type="text" name="field"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              /> */}
              {/* <label className="text-141414 text-weight-400 text-14 mb-2">School</label> */}
                <div
                  onClick={() => {
                    // setDepartmentDropdownOpen(!departmentDropdownOpen)
                    if(department.length<0){
                      setDepartmentDropdownOpen(false)
                    }
                    if(!selectedInstitute?.label){
                      setCheckInstituteSelected(true)
                    } else if (selectedInstitute?.label && department.length>0) {
                    setDepartmentDropdownOpen(!departmentDropdownOpen)
                    }
                  }
                  }
                  style={{
                    height: '46px',
                    width: '270px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className="px-20 border-radius-4 bg-transparent text-394560 border-color-D9D9D9 full-width-responsive"
                >
                  <div style={{display:"flex"}} className="text-14">
                   {department?.find((option) => option === selectedDepartment)?.label||
                      'Select Field of study'}
                      <div style={{display:"flex",justifyContent:"center", alignItems:"center", marginLeft:"70px"}} >
                      {
                        departmentLoader ? <span className='fieldloader' ></span> : <MdArrowDropDown  size={20} />
                      }
                      </div>
                  </div>
                </div>
                {departmentDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  marginTop: '4px',
                  width: '270px',
                  borderRadius: '12px',
                  border: '1px solid #D9D9D9',
                  backgroundColor: '#ffffff',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflow:"auto",
                }}
                className="px-10 text-14 border-color-D9D9D9"
              >
                {department?.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setFieldValue('field', option.label);
                      setSelectedDepartment(option);
                      setDepartmentDropdownOpen(false);
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                    className="px-10 py-12"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
            { checkInstituteSelected && <div className='text-warning text-12' style={{height:'0'}}>First, select a school.</div>}
              <ErrorMessage name="field" component="div" />
              {/* <ErrorMessage name="field" component="div" /> */}
            </div>
            <div className="col-md-6 col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Email</label>
              <Field type="text" name="email"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage className="error-message" name="email" component="div" />
            </div>
            <div className="col-md-6 col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Password</label>
              <Field style={{ height: '46px' }} type="password" name="password"
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              >
              </Field>
              <ErrorMessage className="error-message" name="password" component="div" />
            </div>

            <div className="flex col-12 mb-32">
              <input className="cursor-pointer" style={{ width: '16px', height: '16px' }} type="checkbox"
                     name="toggleCheck" checked={toggleCheck} onChange={handleToggleChange} />
              <label className="ml-8 text-weight-400 text-1F1F1F text-12">I agree to&nbsp;<span
                className="text-0378A6">Terms of Services</span>&nbsp;and&nbsp;<span className="text-0378A6">Privacy Policy</span>.</label>
            </div>
            <div className="col-12">
              <button
                disabled={!toggleCheck || loading}
                style={{ height: '44px' }}
                className={`full-width bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 ${loading ? "cursor-not-allowed " : "cursor-pointer"} ${toggleCheck ?'opacity-100 ':'opacity-75 cursor-not-allowed'}`}
                type="submit">
              {loading ? <span className='submitloader'></span> : "Sign up" }
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
    <div className="separator-x mt-3 mb-3"></div>
    <div className="flex column items-center">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />

      <p className="text-weight-400 text-14 text-262626 mt-3">Already have an account? &nbsp;
        <Link href="/login" className="mt-3 text-14 text-weight-400 text-0378A6 text-decoration-none">
         Sign In
        </Link>
      </p>
    </div>
    <PopUp props={popup}/>
    </>
}
