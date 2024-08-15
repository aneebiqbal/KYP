'use client'

import Image from 'next/image';
import Reviews from '../../../../components/Reviews';
import StarRating from '../../../../components/StarRating';
import RatingBar from '../../../../components/RatingBar';
import { useState, useEffect, useRef } from 'react';

export default function page(){
  const [course, setCourse] = useState('');
  const [DropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const options = [
    { value: '0', label: 'CS106' },
    { value: '1', label: 'CS107' },
  ];

  const reviews = [
    {
      image:'/student.png',
      rating:4.3,
      courseCode:'ENG101',
      date:'Aug 19, 2021',
      review:'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
      tags:['Tough Grader','Porttitor tincidunt','Tough Grader'],
      credit:'Yes',
      attendance:'Mandatory',
      upVotes:5,
      downVotes:5,
      reports:3,
    },
    {
      image:'/student.png',
      rating:4.3,
      courseCode:'ENG101',
      date:'Aug 19, 2021',
      review:'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
      tags:['Tough Grader','Porttitor tincidunt','Tough Grader'],
      credit:'Yes',
      attendance:'Mandatory',
      upVotes:5,
      downVotes:5,
      reports:3,
    },
    {
      image:'/student.png',
      rating:4.3,
      courseCode:'ENG101',
      date:'Aug 19, 2021',
      review:'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
      tags:['Tough Grader','Porttitor tincidunt','Tough Grader'],
      credit:'Yes',
      attendance:'Mandatory',
      upVotes:5,
      downVotes:5,
      reports:3,
    },
    {
      image:'/student.png',
      rating:4.3,
      courseCode:'ENG101',
      date:'Aug 19, 2021',
      review:'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
      tags:['Tough Grader','Porttitor tincidunt','Tough Grader'],
      credit:'Yes',
      attendance:'Mandatory',
      upVotes:5,
      downVotes:5,
      reports:3,
    },
    {
      image:'/student.png',
      rating:4.3,
      courseCode:'ENG101',
      date:'Aug 19, 2021',
      review:'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
      tags:['Tough Grader','Porttitor tincidunt','Tough Grader'],
      credit:'Yes',
      attendance:'Mandatory',
      upVotes:5,
      downVotes:5,
      reports:3,
    },
    {
      image:'/student.png',
      rating:4.3,
      courseCode:'ENG101',
      date:'Aug 19, 2021',
      review:'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
      tags:['Tough Grader','Porttitor tincidunt','Tough Grader'],
      credit:'Yes',
      attendance:'Mandatory',
      upVotes:5,
      downVotes:5,
      reports:3,
    },
  ]
  const tags = ['Tough Grader','Porttitor tincidunt','Tough Grader','Porttitor tincidunt','Tough Grader','Porttitor tincidunt','Tough Grader','Porttitor tincidunt','Tough Grader','Porttitor tincidunt','Tough Grader','Porttitor tincidunt','Tough Grader',];
  return<>
    <div className="px-120 py-30 tablet-px-90 tablet-px-50 mobile-px-20">

      <p className="text-8C8C8C text-14 text-weight-400 mb-40">Professor / <span
        className="text-1F1F1F">James Jameson</span></p>

      <div className="flex mb-60 professor-profile-mobile-center">
        <div>
          <Image className="border-radius-100" height={114} width={114} src="/professor.png" alt="professor" />
        </div>
        <div className="px-20 flex-1 flex column justify-center professor-name-mt-24">
          <h2 className="text-24 text-1F1F1F text-weight-600 mb-6">James Jameson</h2>
          <p className="text-14 text-weight-400 text-434343">Professor in the
            <span className="text-1F1F1F text-weight-600"> English department</span> at <span
              className="line-break-2"><br />  </span>
            <span className="text-1F1F1F text-weight-600"> Greenville Technical College</span></p>
        </div>
        <div className="flex items-center mobile-mt-28">

          <div className=" cursor-pointer">
            <svg width="25" height="31" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.3721 15.4746C11.2438 15.4746 11.1148 15.4416 11.0001 15.3756L6.12207 12.5879L1.24407 15.3756C1.01157 15.5084 0.72657 15.5076 0.49557 15.3734C0.26457 15.2391 0.12207 14.9916 0.12207 14.7246V2.72461C0.12207 1.48411 1.13157 0.474609 2.37207 0.474609H9.87207C11.1126 0.474609 12.1221 1.48411 12.1221 2.72461V14.7246C12.1221 14.9916 11.9803 15.2391 11.7486 15.3734C11.6323 15.4409 11.5026 15.4746 11.3721 15.4746ZM6.12207 10.9746C6.25032 10.9746 6.37857 11.0076 6.49407 11.0736L10.6221 13.4316V2.72461C10.6221 2.31136 10.2861 1.97461 9.87207 1.97461H2.37207C1.95882 1.97461 1.62207 2.31136 1.62207 2.72461V13.4316L5.75007 11.0729C5.86557 11.0076 5.99382 10.9746 6.12207 10.9746Z"
                fill={false ? '#763FF9' : '#595959'} />
            </svg>
          </div>
          <button
            style={{ height: '48px' }}
            className="ml-12 cursor-pointer px-12 flex items-center justify-between  text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4">
            Write a Review
          </button>
        </div>
      </div>

      <div className="row mb-60">
        <div className="col-xl-7 col-lg-12 ">
          <p className="text-1F1F1F text-weight-500 text-16">Overall Rating</p>
          <div className="separator-x mt-3 mb-4"></div>
          <div className="flex mb-40 professor-mobile-flex-col ">

            <div className="bg-FFEBCC flex column items-center justify-center star-rating-full-width"
                 style={{ width: '180px', height: '180px' }}>
              <p className="text-weight-600 text-40 text-1F1F1F">4</p>
              <StarRating rating={4} />
              <p className="text-weight-500 text-14 text-1F1F1F">Quality Rating</p>
            </div>

            <div className="flex-1 ml-30 mobil-ml-none mobile-mt-28">
              <RatingBar rating={5} reviews={100} reviewsGot={67} text={'Awesome'} />
              <RatingBar rating={4} reviews={100} reviewsGot={20} text={'Great'} />
              <RatingBar rating={3} reviews={100} reviewsGot={10} text={'Good'} />
              <RatingBar rating={2} reviews={100} reviewsGot={2} text={'OK'} />
              <RatingBar rating={1} reviews={100} reviewsGot={1} text={'Awful'} />
            </div>
          </div>
          <div className="d-none d-xl-block">
            <p className="text-1F1F1F text-weight-500 text-16 ">Tags</p>
            <div className="separator-x mt-3 mb-4"></div>
            <div className="flex mb-20 flex-wrap">
              {tags.map((tag, index) => (
                <div key={tag + '-' + index}
                     className=" bg-F0F0F0 text-14 text-595959 text-weight-400 pa-10 border-radius-6 mr-16 mb-16">
                  {tag}
                </div>
              ))}
            </div>
          </div>


        </div>
        <div className="col-xl-5 col-lg-12
        {/*d-none d-sm-block*/}
        "
        >
          <div className="row  ml-60  ml-mobile-30 mobile-width-ml-none-2" style={{ height: 504 }}  >
            <div className="col-sm-12 col-md-6 flex column justify-between full-width-responsive">
              <div className="flex items-center professor-flex-review ">
                <div className="border-radius-8 flex items-center justify-center bg-E4D9FE"
                     style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/courseDifficulty.svg" alt="courseDifficulty" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24 ">100%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Course Difficulty</p>
                </div>
              </div>
              <div className="flex items-center ">
                <div className="border-radius-8 flex items-center justify-center bg-FEE9E8"
                     style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/collaboration.svg" alt="courseDifficulty" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">50%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Collaboration</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-F0F0F0"
                     style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/knowledgeable.svg" alt="courseDifficulty" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">100%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Knowledgeable</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-F0F0F0"
                     style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/knowledgeable.svg" alt="courseDifficulty" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">100%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Exam Difficulty</p>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 mobile-mt-24 flex column justify-between full-width-responsive">
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-E6F1F6"
                     style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/clarity.svg" alt="courseDifficulty" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30 ">
                  <p className="text-1F1F1F text-weight-400 text-24 ">78%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Clarity</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-E8F6F1"
                     style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/helpful.svg" alt="courseDifficulty" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">100%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Helpful</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-FFF5E5"
                     style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/textBook.svg" alt="courseDifficulty" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">50%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">TextBook Use</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-FFF5E5"
                     style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/textBook.svg" alt="courseDifficulty" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">50%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Love Teaching Style</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-block d-xl-none">
        <p className="text-1F1F1F text-weight-500 text-16 ">Tags</p>
        <div className="separator-x mt-3 mb-4"></div>
        <div className="flex mb-20 flex-wrap">
          {tags.map((tag, index) => (
            <div key={tag + '-' + index}
                 className=" bg-F0F0F0 text-14 text-595959 text-weight-400 pa-10 border-radius-6 mr-16 mb-16">
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-1D2026 text-weight-600 text-24 mb-20 ">Reviews (154)</p>
        <div className="relative sort-dropdown my-28" ref={dropdownRef}>
                <div
                  onClick={() => setDropdownOpen(!DropdownOpen)}
                  style={{
                    
                    height: '72px',
                    maxWidth: '341px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className="px-28 border-radius-12 border-color-D9D9D9"
                >
                  <p className="text-18">
                    {options.find((option) => option.value === course)?.label ||
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
                {DropdownOpen && (
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
                          setCourse(option.value);
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
              </div>
        <Reviews reviews={reviews} />
      </div>
    </div>
  </>
}
