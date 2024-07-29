'use client';
import * as yup from 'yup';
import { useState } from 'react';
import Image from 'next/image';
export default function page() {
  const validationSchema = yup.object().shape({
    course: yup.string().required('Course is required'),
    courseDifficulty: yup.string().required('Course Difficulty is required'),
    clarity: yup.string().required('Clarity is required'),
    collaboration: yup.string().required('Collaboration is required'),
    knowledgeable: yup.string().required('Knowledgeable is required'),
    helpful: yup.string().required('Helpful is required'),
    textbookUse: yup.string().required('TextBook Use is required'),
    examDifficulty: yup.string().required('Exam Difficulty is required'),
    loveTeachingStyle: yup.string().required('Love Teaching Style is required'),
    takeAgain: yup.string().required('Would you take this professor again? is required'),
    forCredit: yup.string().required('Was this class taken for credit? is required'),
    attendanceMandatory: yup.string().required('Was attendance mandatory? is required'),
    gradeReceived: yup.string().required('Grade Received is required'),
    review: yup.string().required('Review is required'),
  });
  const [isOnline, setIsOnline] = useState(false);
  const [course, setCourse] = useState('');
  const [gradeReceived, setGradeReceived] = useState('');
  const [ratings, setRatings] = useState([
    {
      label:'Course Difficulty',
      value: 0,
    },
    {
      label:'Clarity',
      value: 0,
    },
    {
      label:'Collaboration',
      value: 0,
    },
    {
      label:'Knowledgeable',
      value: 0,
    },
    {
      label:'Helpful',
      value: 0,
    },
    {
      label:'TextBook Use',
      value: 0,
    },
    {
      label:'Exam Difficulty',
      value: 0,
    },
    {
      label:'Love Teaching Style',
      value: 0,
    },
  ]);
  const [questions, setQuestions] = useState([
    {
      label:'Would you take this professor again?*',
      value: 0,
    },
    {
      label:'Was this class taken for credit?',
      value: 0,
    },
    {
      label:'Was attendance mandatory?',
      value: 0,
    }
  ]);
  const tags = ['Tough Grader','Tough Grader1','Tough Grader2','Tough Grader3','Tough Grader4','Tough Grader5'];
  const updateQuestionValue = (index,value)=>{
    let tempQuestions = [...questions];
    tempQuestions[index].value = value
    console.log(value);
    setQuestions(tempQuestions)
  }
  return<>
    <main>
      <section>
        <div className="px-120 py-60">
          <p className="text-14 text-weight-400 text-8C8C8C mb-40">Professors / James Jameson / <span
            className="text-1F1F1F">Write a review</span></p>
          <h1 className="text-1F1F1F text-weight-600 text-24 mb-8">Rate James Jameson</h1>
          <p className="text-14 text-weight-400 text-434343 mb-32">Professor in the <span
            className="text-1F1F1F text-weight-500">English department</span> at <span
            className="text-1F1F1F text-weight-500">Greenville Technical College</span></p>
          <div className="separator-x mb-60"></div>
          <div className="flex items-center mb-32">
            <select onChange={(event) => {
              setCourse(event.target.value);
            }} style={{ height: '48px', width: '430px' }} className="px-20 border-radius-8 border-color-D9D9D9"
                    name="state" value={course}>
              <option value="">Select Course</option>
              <option value="CS106">CS106</option>
              <option value="CS107">CS107</option>
            </select>
            <label className="flex items-center rating-is-online-checkbox">
              <input className="ml-18" type="checkbox" checked={isOnline} onChange={(event) => {
                setIsOnline(event.target.checked)
              }} />
              <span className="text-weight-400 text-1F1F1F text-14 ml-8">This is an online course</span>
            </label>

          </div>
          <div className="full-width border-color-D9D9D9 border-radius-8 pa-16 mb-24">
            {ratings.map((item, index) => (
              <div key={'ratings-rates-' + index}
                   className={`full-width flex justify-between items-center ${index < ratings.length - 1 ? 'mb-36' : ''}`}>
                <p className="text-weight-600 text-18 text-1F1F1F">{item.label}</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((number, count) => (
                    <div
                      onClick={() => {
                        let tempRating = [...ratings];
                        tempRating[index].value = number;
                        setRatings(tempRating);
                      }}
                      key={index + '-rate-' + count}
                      className={`flex items-center cursor-pointer justify-center border-radius-4 ${count < 4 ? 'mr-6' : ''} ${item.value >= number ? 'bg-763FF9 text-ffffff' : 'bg-F0F0F0 text-8C8C8C'}`}
                      style={{ width: '42px', height: '42px' }}
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="full-width border-color-D9D9D9 border-radius-8 pa-16 mb-24">
            {questions.map((item, index) => (
              <div key={'ratings-rates-' + index}
                   className={`full-width flex justify-between items-center mb-36`}>
                <p className="text-weight-600 text-18 text-1F1F1F">{item.label}</p>
                <div className="flex items-center">
                  <label className="flex items-center ratings-questions-checkbox">
                    <input className="ml-18" type="checkbox" checked={questions[index].value} onChange={(event) => {
                      updateQuestionValue(index, event.target.value)
                    }} />
                    <span className="text-weight-400 text-1F1F1F text-14 ml-8">Yes</span>
                  </label>
                  <label className="flex items-center ratings-questions-checkbox">
                    <input className="ml-18" type="checkbox" checked={!questions[index].value} onChange={(event) => {
                      updateQuestionValue(index, !event.target.value)
                    }} />
                    <span className="text-weight-400 text-1F1F1F text-14 ml-8">No</span>
                  </label>
                </div>
              </div>
            ))}
            <div className="full-width flex justify-between items-center">
              <p className="text-weight-600 text-18 text-1F1F1F">Select grade received</p>
              <input className="border-color-D9D9D9 text-434343 text-14 px-20 border-radius-4"
                     style={{ height: '36px', width: '234px' }} type="text" value={gradeReceived} onChange={(event) => {
                setGradeReceived(event.target.value)
              }} />
            </div>
          </div>
          <div className="full-width border-color-D9D9D9 border-radius-8 px-16 pt-16 mb-24">
            <p className="text-weight-600 text-18 text-1F1F1F mb-32">Select up to 3 tags</p>
            <div className="row full-width">
              <div className="col-6 ">
                <div className="flex flex-wrap">
                  {tags.map((tag, index) => (
                    <div key={tag + '-' + index}
                         className=" bg-F0F0F0 text-14 text-595959 text-weight-400 pa-10 border-radius-6 mr-16 mb-16">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="full-width border-color-D9D9D9 border-radius-8 pa-16">
            <p className="text-weight-600 text-18 text-1F1F1F mb-12">Write a Review*</p>
            <p className="text-weight-400 text-14 text-434343 mb-24">Discuss the professor&apos;s professional abilities
              including teaching style and ability to convey the material clearl</p>
            <div className="pa-16 flex bg-E6F1F6 border-radius-8 mb-16">
              <Image width={20} height={20} src="/guidelinesIcon.svg" alt="guidelinesIcon" />
              <div className="ml-12 ">
                <p className="text-weight-600 text-16 text-141414 mb-16">Guidelines</p>
                <ul>
                  <li className="text-weight-400 text-14 text-141414">Your rating could be removed if you use profanity
                    or derogatory terms
                  </li>
                  <li className="text-weight-400 text-14 text-141414">Don&apos;t claim that the professor shows bias or
                    favoritism for or against students.
                  </li>
                  <li className="text-weight-400 text-14 text-141414">Don’t forget to proof read!</li>
                </ul>
              </div>
            </div>
            <textarea placeholder="Write your review" className="pa-10 border-color-D9D9D9 text-434343 mb-16 full-width border-radius-8">

            </textarea>
          </div>
        </div>
      </section>
    </main>
  </>
}
