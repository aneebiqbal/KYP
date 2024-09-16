'use client';
import * as Yup from 'yup';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {Filter} from 'bad-words';
import PopUp from '../../../../../components/PopUp';
import {BaseApi} from '../../../BaseApi';
import { useParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {getToken} from '../../../../../services/JwtService';
import { useRouter } from 'next/navigation';
import { getUserInfo } from '../../../../../services/JwtService';

export default function page(string) {
  let token = getToken();
  const router = useRouter();
  const [popup, setPopup] = useState({
    show: false,
    type: '',
    message: '',
    timeout: 0,
  });
  const {slug} = useParams();
  const userInfo = useState(JSON.parse(getUserInfo()));
  console.log("userInfo: ",userInfo[0].id);
  const filter = new Filter();
  filter.addWords('some', 'bad', 'word')
  // const validationSchema = yup.object().shape({
  //   course: yup.string().required('Course is required'),
  //   courseDifficulty: yup.string().required('Course Difficulty is required'),
  //   clarity: yup.string().required('Clarity is required'),
  //   collaboration: yup.string().required('Collaboration is required'),
  //   knowledgeable: yup.string().required('Knowledgeable is required'),
  //   helpful: yup.string().required('Helpful is required'),
  //   textbookUse: yup.string().required('TextBook Use is required'),
  //   examDifficulty: yup.string().required('Exam Difficulty is required'),
  //   loveTeachingStyle: yup.string().required('Love Teaching Style is required'),
  //   takeAgain: yup
  //     .string()
  //     .required('Would you take this professor again? is required'),
  //   forCredit: yup
  //     .string()
  //     .required('Was this class taken for credit? is required'),
  //   attendanceMandatory: yup
  //     .string()
  //     .required('Was attendance mandatory? is required'),
  //   gradeReceived: yup.string().required('Grade Received is required'),
  //   review: yup.string().required('Review is required'),
  // });

  const validationSchema = Yup.object({
    ratings: Yup.array()
    .of(
      Yup.object({
        label: Yup.string(),
        value: Yup.number()
          .min(1, function (param) {
            console.log("params : ",param)
            const index = param.path.split('[')[1].split(']')[0];
            const label = ratings[index].label || 'Rating';
            return `${label} is required`;
          })
      })
    )
    .required('Ratings are required'),
      review: Yup.string()
    .test('no-offensive-language', 'Please refrain from using offensive language.', (value) => {
      return !filter.isProfane(value); // Assuming `filter.isProfane` is a function that checks profanity
    })
    .required('Review is required'),
    selectedTags: Yup.array()
    .min(1, 'Please select at least one tag.')
    .max(3, 'You can select up to 3 tags only.'),
    course: Yup.object()
    .shape({
      value: Yup.string().required('Course must be selected'),
    })
    .nullable()
    .required('Course must be selected'),
    gradeReceived:Yup.object()
    .shape({
      value: Yup.string().required('Grade must be selected'),
    })
    .nullable()
    .required('Grade must be selected'),
  });

  const [isOnline, setIsOnline] = useState(false);
  const [course, setCourse] = useState('');
  const [submitLoader,setSubmitLoader] =useState(false);
  const [gradeReceived, setGradeReceived] = useState();
  const [selectedTags,setSelectedTags] = useState([])
  const [ratings, setRatings] = useState([
    {
      label: 'Course Difficulty',
      value: 0,
    },
    {
      label: 'Clarity',
      value: 0,
    },
    {
      label: 'Collaboration',
      value: 0,
    },
    {
      label: 'Knowledgeable',
      value: 0,
    },
    {
      label: 'Helpful',
      value: 0,
    },
    {
      label: 'TextBook Use',
      value: 0,
    },
    {
      label: 'Exam Difficulty',
      value: 0,
    },
    {
      label: 'Love Teaching Style',
      value: 0,
    },
  ]);
  const [questions, setQuestions] = useState([
    {
      label: 'Would you take this professor again?*',
      value: 0,
    },
    {
      label: 'Was this class taken for credit?',
      value: 0,
    },
    {
      label: 'Was attendance mandatory?',
      value: 0,
    },
  ]);

  const [review, setReview] = useState('');
  const [DropdownOpen, setDropdownOpen] = useState(false);
  const [DropdownOpenGrade, setDropdownOpenGrade] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRefGrade = useRef(null);
  const [options,setOption] = useState([]);
  const [Loading,setLoading]=useState(true);
  // const [tags,setTags]=useState([])
  const [professor,setProfessor]=useState(null)

  const getProfessor = async () => {
    try{
      setLoading(true)
      let response =  await BaseApi.getProfessorCourses({id:slug});
      console.log("response----: ",response)
      if (response?.data?.message?.includes("not found")) {
        router.push(`/`);
      }
      setProfessor(response.data)
      response.data?.courses?.map((course,index)=>{
        setOption((prev)=>[...prev,{
          value:index,
          label:course.course_code,
          id:course.course_id
        }])
      })
      setLoading(false)
    } catch(e){
      console.log("error: ",e)
      setLoading(false)
    }
    
    // setTags(response.data?.tags)


  }

  useEffect(() => {
    if(!token){
      router.push(`/`);
    }
    getProfessor();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (dropdownRefGrade.current && !dropdownRefGrade.current.contains(event.target)) {
        setDropdownOpenGrade(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const grade = [
    { value: '0', label: 'A' },
    { value: '1', label: 'B' },
    { value: '2', label: 'C' },
    { value: '3', label: 'D' },
    { value: '4', label: 'E' },
    { value: '5', label: 'F' },
  ];

  const maxChars = 500;

  const tags = [
    "Engaging",
    "Challenging",
    "detailed explanations",
  ];

  const tagExists = (checkTag) =>{
   let check= selectedTags.includes(checkTag)
   return check
  }

  const updateQuestionValue = (index, value) => {
    let tempQuestions = [...questions];
    tempQuestions[index].value = value;
    console.log(value);
    setQuestions(tempQuestions);
  };

  // const handleTextChange = (e) => {
  //   let inputText = e.target.value;
  //   if (filter.isProfane(inputText)) {
  //     setPopup({
  //       show: true,
  //       type: 'warning',
  //       message: 'Please refrain from using offensive language.',
  //       timeout: 3000,
  //     });
  //     inputText = inputText
  //       .split(/\s+/)
  //       .map((word) => (filter.isProfane(word) ? '' : word))
  //       .join(' ')
  //       .trim();
  //   }
  //   if (inputText.length <= maxChars) {
  //     setReview(inputText);
  //   }
  // };
  const submitRating = async () => {
    if(!token){
      router.push(`/`);
    }
    try{
      setSubmitLoader(true);
      const professorID=Number(slug)
      let response =  await BaseApi.postRating({
        studentId: userInfo[0].id,
        professorId:professorID,
        courseId:course.id,
        course_difficulty:ratings[0].value,
        clarity:ratings[1].value,
        collaboration:ratings[2].value,
        knowledgeable:ratings[3].value,
        helpful:ratings[4].value,
        textbook_use:ratings[5].value,
        exam_difficulty:ratings[6].value,
        love_teaching_style:ratings[7].value,
        take_again:questions[0].value=="on"?true:false,
        mandatory_attendance:questions[2].value=="on"?true:false,
        for_credit:questions[1].value=="on"?true:false,
        grade_received:gradeReceived?.label,
        comment:review,
        tags:selectedTags});
      console.log("response------: ",response)
      setSubmitLoader(false);
      if (response?.data?.message=="Rating created successfully") {
        setPopup({
          show: true,
          type: 'info',
          message: 'Rating created successfully',
          timeout: 3000,
        });
      }
    } catch (e) {
      setSubmitLoader(false);
      if (e.response?.data?.message=="You have already rated this professor for this course.") {
        //   console.error('Error message:', e.response.data.message);
        // console.error('Error status:', error.response.status);
        setPopup({
          show: true,
          type: 'info',
          message: 'You have already rated this professor for this course',
          timeout: 3000,
        });

      }else {
        console.error('Error', e.message);
      }
      
    }
    
   
  }
  return (
  <>{ Loading 
     ?
     <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"30%", margin:"30%"}}><span className="loader"></span> </div> 
     :
     <Formik
     initialValues={{ ratings, review: '', selectedTags: [], course: null, gradeReceived: null }}
     validationSchema={validationSchema}
    //  validate={(values) => {
    //   // Pass the ratings as context
    //   const schema = validationSchema;
    //   try {
    //     schema.validateSync(values, { context: { ratings } });
    //   } catch (err) {
    //     return err.inner.reduce((acc, curr) => {
    //       acc[curr.path] = curr.message;
    //       return acc;
    //     }, {});
    //   }
    // }
    context={{ ratings }}

     onSubmit={()=>submitRating()}
   >
     {({ values, setFieldValue }) => (
       <Form>
      <main>
        <section>
          <div className="px-120 py-60 tablet-px-90 tablet-px-50 mobile-px-20">
            <p className="text-14 text-weight-400 text-8C8C8C mb-40">
              Professors / {professor?.first_name} {professor?.last_name}  /{' '}
              <span className="text-1F1F1F">Write a review</span>
            </p>
            <h1 className="text-1F1F1F text-weight-600 text-24 mb-8">
              Rate {professor?.first_name} {professor?.last_name} 
            </h1>
            <p className="text-14 text-weight-400 text-434343 mb-32">
              Professor in the{' '}
              <span className="text-1F1F1F text-weight-500">
                {professor?.department_name} department
              </span>{' '}
              <span className="text-14 text-weight-400 text-434343"> at</span>{' '}
              <span className="text-1F1F1F text-weight-500">
               {professor?.institute}
              </span>
            </p>
            <div className="separator-x mb-60"></div>
            <div className="flex items-center mb-32 professor-mobile-results-selection  ">
              <div style={{height:"60px"}}  className="relative sort-dropdown  full-width-responsive" ref={dropdownRef}>
                <div
                  onClick={() => setDropdownOpen(!DropdownOpen)
                  }
                  style={{
                    height: '48px',
                    width: '430px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className="px-20 border-radius-8 border-color-D9D9D9 full-width-responsive"
                >
                  <p className="text-18">
                    {options.find((option) => option.value === course?.value)?.label ||
                      'Select Course'}
                  </p>
                  <Image
                    style={{ marginLeft: '24px' }}
                    height={10}
                    width={10}
                    src="/arrowicon.svg"
                    alt="searchIcon"
                  />
                </div>
                {/* {DropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      marginTop:"4px",
                      width: '200px',
                      borderRadius: '12px',
                      border: '1px solid #D9D9D9',
                      backgroundColor: '#ffffff',
                      zIndex: 10,
                      maxHeight: '200px',
                    }}
                    className="px-10 border-color-D9D9D9"
                  >
                    {options.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setCourse(option);
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
                )} */}
                {DropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  marginTop: '4px',
                  width: '200px',
                  borderRadius: '12px',
                  border: '1px solid #D9D9D9',
                  backgroundColor: '#ffffff',
                  zIndex: 10,
                  maxHeight: '200px',
                }}
                className="px-10 border-color-D9D9D9"
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setFieldValue('course', option);
                      setCourse(option);
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
            <ErrorMessage
              name="course"
              component="div"
              className="error-message"
              style={{ color: 'red' }}
            />
              </div>

    

              <label className="flex items-center rating-is-online-checkbox">
                <input
                  className="ml-18"
                  type="checkbox"
                  checked={isOnline}
                  onChange={(event) => {
                    setIsOnline(event.target.checked);
                  }}
                />
                <span className="text-weight-400 text-1F1F1F text-14 ml-8">
                  This is an online course
                </span>
              </label>
            </div>
            {/* <div className="full-width border-color-D9D9D9 border-radius-8 pa-16 mb-24 ">
              {ratings.map((item, index) => (
                <div
                  key={'ratings-rates-' + index}
                  className={`full-width flex justify-between items-center professor-mobile-results-selection mobile-mb-20 ${
                    index < ratings.length - 1 ? 'mb-36' : ''
                  }`}
                >
                  <p className="text-weight-600 text-18 text-1F1F1F mobile-mb-8">
                    {item.label}
                  </p>
                  <div className="flex items-center ">
                    {[1, 2, 3, 4, 5].map((number, count) => (
                      <div
                        onClick={() => {
                          let tempRating = [...ratings];
                          tempRating[index].value = number;
                          setRatings(tempRating);
                        }}
                        key={index + '-rate-' + count}
                        className={`flex items-center cursor-pointer justify-center border-radius-4 ${
                          count < 4 ? 'mr-6' : ''
                        } ${
                          item.value >= number
                            ? 'bg-763FF9 text-ffffff'
                            : 'bg-F0F0F0 text-8C8C8C'
                        }`}
                        style={{ width: '42px', height: '42px' }}
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                  {/* <ErrorMessage name={`ratings.${item.label}`} component="div" className="error-message" /> *}
                </div>
              ))}
            </div> */}
            <div className="full-width border-color-D9D9D9 border-radius-8 pa-24 mb-24">
            {values.ratings.map((item, index) => (
              <div
                key={'ratings-rates-' + index}
                style={{height:"50px"}}
                className={`full-width flex justify-between items-center professor-mobile-results-selection mobile-mb-20 ${
                  index < values.ratings.length - 1 ? 'mb-36' : ''
                }`}
              >
                <p style={{height:"50px"}} className="text-weight-600 text-20 text-1F1F1F mobile-mb-8">
                  {item.label}
                </p>
                <div style={{height:"50px"}} >
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((number, count) => (
                    <div
                      onClick={() => {
                        setFieldValue(`ratings[${index}].value`, number);
                          let tempRating = [...ratings];
                          tempRating[index].value = number;
                          setRatings(tempRating);
                      }}
                      key={index + '-rate-' + count}
                      className={`flex items-center cursor-pointer justify-center border-radius-4 ${
                        count < 4 ? 'mr-6' : ''
                      } ${
                        item.value >= number
                          ? 'bg-763FF9 text-ffffff'
                          : 'bg-F0F0F0 text-8C8C8C'
                      }`}
                      style={{ width: '42px', height: '42px' }}
                    >
                      {number}
                    </div>
                  ))}
                </div>
                <ErrorMessage
                  name={`ratings[${index}].value`}
                  component="div"
                  className="error-message"
                  style={{ color: 'red' }}
                />
                </div>
              </div>
            ))}
          </div>
            {/* Yes or No Questions */}
            <div className="full-width border-color-D9D9D9 border-radius-8 pa-16 mb-24">
              {questions.map((item, index) => (
                <div
                  key={'ratings-rates-' + index}
                  className={`full-width flex justify-between items-center mb-36 mobile-mb-20 professor-mobile-results-selection `}
                >
                  <p className="text-weight-600 text-18 text-1F1F1F">
                    {item.label}
                  </p>
                  <div className="flex items-center mobile-mt-20 ">
                    <label className="flex items-center ratings-questions-checkbox ">
                      <input
                        className="ml-18"
                        type="checkbox"
                        checked={questions[index].value}
                        onChange={(event) => {
                          updateQuestionValue(index, event.target.value);
                        }}
                      />
                      <span className="text-weight-400 text-1F1F1F text-18  ml-16 ">
                        Yes
                      </span>
                    </label>
                    <label className="flex items-center ratings-questions-checkbox ratings-questions-checkbox-mobile-ml">
                      <input
                        className="ml-30"
                        type="checkbox"
                        checked={!questions[index].value}
                        onChange={(event) => {
                          updateQuestionValue(index, !event.target.value);
                        }}
                      />
                      <span className="text-weight-400 text-1F1F1F text-18 ml-16">
                        No
                      </span>
                    </label>
                  </div>
                </div>
              ))}

              {/* Select Grade */}
              <div className="full-width flex justify-between items-center professor-mobile-results-selection">
                <p className="text-weight-600 text-18 text-1F1F1F">
                  Select grade received
                </p>

                <div style={{height:"60px"}} className="relative sort-dropdown full-width-responsive" ref={dropdownRefGrade}>
                  <div
                    onClick={() => setDropdownOpenGrade(!DropdownOpenGrade)}
                    style={{
                      height: '36px',
                      width: '234px',
                      borderRadius: '4px',

                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    className="px-16 border-color-D9D9D9 mobile-width-sort-dropdown full-width-responsive"
                  >
                    <p className="text-14">
                      {grade.find((option) => option.value === gradeReceived?.value)
                        ?.label || 'Select Grade'}
                    </p>
                    <Image
                      style={{ marginLeft: '24px' }}
                      height={10}
                      width={10}
                      src="/arrowicon.svg"
                      alt="searchIcon"
                    />
                  </div>
                  {DropdownOpenGrade && (
                    <div
                      style={{
                        position: 'absolute',
                        marginTop:"4px",
                        width: '200px',
                        borderRadius: '12px',
                        border: '1px solid #D9D9D9',
                        backgroundColor: '#ffffff',
                        zIndex: 10,
                        maxHeight: '300px',
                      }}
                      className="px-10 border-color-D9D9D9"
                    >
                      {grade.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setGradeReceived(option);
                            setFieldValue('gradeReceived', option);
                            setDropdownOpenGrade(false);
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
                   <ErrorMessage
              name="gradeReceived"
              component="div"
              className="error-message"
              style={{ color: 'red' }}
            />
                </div>
              </div>
            </div>

            {/* Add tags */}
            {/* <div className="full-width border-color-D9D9D9 border-radius-8 px-16 pt-16 mb-24">
              <p className="text-weight-600 text-18 text-1F1F1F mb-32">
                Select up to 3 tags
              </p>
              <div className="row full-width">
                <div className="col-12 ">
                  <div className="flex flex-wrap">
                    {tags.map((tag, index) => (
                      <div
                        key={tag + '-' + index}
                        className={`fit-content ${tagExists(tag) ? "bg-763FF9 text-ffffff" :"bg-F0F0F0 text-595959"}  text-14 text-weight-400 pa-10 border-radius-6 mr-16 mb-16`}
                        onClick={()=>{
                          setSelectedTags((prev)=>{
                            let check =tagExists(tag);
                            if(check){
                              return prev.filter((prevtag)=> prevtag!=tag)
                            } else {
                            return [...prev,tag]
                            }
                          })
                        }}
                     >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div> */}
                      <div style={{height:"170px"}} className="full-width border-color-D9D9D9 border-radius-8 px-16 pt-16 mb-24">
            <p className="text-weight-600 text-18 text-1F1F1F mb-32">Select up to 3 tags</p>
            <div className="row full-width">
              <div className="col-12 ">
                <div className="flex flex-wrap">
                  {tags.map((tag, index) => (
                    <div
                      key={tag + '-' + index}
                      className={`fit-content ${
                        values.selectedTags.includes(tag)
                          ? 'bg-763FF9 text-ffffff'
                          : 'bg-F0F0F0 text-595959'
                      } text-14 text-weight-400 pa-10 border-radius-6 mr-16 mb-16 cursor-pointer`}
                      onClick={() => {
                        let newTags = [...values.selectedTags];
                        if (newTags.includes(tag)) {
                          newTags = newTags.filter((t) => t !== tag);
                        } else if (newTags.length < 3) {
                          newTags.push(tag);
                        }
                        setFieldValue('selectedTags', newTags);
                        setSelectedTags(newTags)
                      }}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ErrorMessage
              name="selectedTags"
              component="div"
              className="error-message"
              style={{ color: 'red' }}
            />
          </div>

            {/* Write Review */}
            <div className="full-width border-color-D9D9D9 border-radius-8 pa-16">
              <p className="text-weight-600 text-18 text-1F1F1F mb-12">
                Write a Review*
              </p>
              <p className="text-weight-400 text-14 text-434343 mb-24">
                Discuss the professor&apos;s professional abilities including
                teaching style and ability to convey the material clearl
              </p>
              <div className="pa-16 flex bg-E6F1F6 border-radius-8 mb-16">
                <Image
                  width={20}
                  height={20}
                  src="/guidelinesIcon.svg"
                  alt="guidelinesIcon"
                />
                <div className="ml-12 ">
                  <p className="text-weight-600 text-16 text-141414 mb-16">
                    Guidelines
                  </p>
                  <ul>
                    <li className="text-weight-400 text-14 text-141414">
                      Your rating could be removed if you use profanity or
                      derogatory terms
                    </li>
                    <li className="text-weight-400 text-14 text-141414">
                      Don&apos;t claim that the professor shows bias or
                      favoritism for or against students.
                    </li>
                    <li className="text-weight-400 text-14 text-141414">
                      Don’t forget to proof read!
                    </li>
                  </ul>
                </div>
              </div>
              {/* <textarea
                value={review}
                onChange={handleTextChange}
                placeholder="Write your review"
                className="pa-10 border-color-D9D9D9 text-434343 mb-8 full-width border-radius-8 text-area-min-height"
              ></textarea> */}
              <div style={{height:"150px"}} >
            <Field
              as="textarea"
              name="review"
              value={values.review}
              onChange={(e) => {
                let inputText = e.target.value;
                
                if (filter.isProfane(inputText)) {
                  setPopup({
                    show: true,
                    type: 'warning',
                    message: 'Please refrain from using offensive language.',
                    timeout: 3000,
                  });
                  inputText = inputText
                    .split(/\s+/)
                    .map((word) => (filter.isProfane(word) ? '' : word))
                    .join(' ')
                    .trim();
                }
                
                if (inputText.length <= maxChars) {
                  setFieldValue('review', inputText); 
                  setReview(inputText)
                }
              }}
              placeholder="Write your review"
              className="pa-10 border-color-D9D9D9 text-434343 mb-8 full-width border-radius-8 text-area-min-height"
            />
            <ErrorMessage
              name="review"
              component="div"
              className="error-message"
              style={{ color: 'red' }}
            />
            </div>

              <div className="flex full-width justify-end text-14 text-434343 text-weight-400">
                {review.length.toString().padStart(3, '0')}/{maxChars}
              </div>
              <p className="text-weight-400 text-14 text-1F1F1F mb-16">
                By clicking the "Submit" button, I acknowledge that I have read
                and agreed to the Know My Professors{' '}
                <span className="text-0378A6 text-weight-500">
                  Site Guidelines
                </span>{' '}
                ,{' '}
                <span className="text-0378A6 text-weight-500">
                  Terms of Use
                </span>{' '}
                and{' '}
                <span className="text-0378A6 text-weight-500">
                  Privacy Policy
                </span>
                . Submitted data becomes the property of Know My Professors.
              </p>
              {
                submitLoader ?
                <button
                style={{ 
                  height: '44px',
                  width: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#763FF9',
                  color: '#ffffff',
                  borderRadius: '4px',
                  fontWeight: 500,
                  fontSize: '16px',
                  border: 'none',
                  cursor: "not-allowed",
                }}
                disabled={true}
              >
                <span className="submitloader"></span>
                <span className="ms-2">Submitting</span>
              </button>
                :
                <button
                style={{ height: '44px' ,width:"180px"}}
                className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                type="submit"
                // onClick={submitRating}
              >
                Submit
              </button>
              }
              
            </div>
          </div>
        </section>
        <PopUp props={popup} />
      </main>
      </Form>
      )}
    </Formik>
      }
     </>)
}
