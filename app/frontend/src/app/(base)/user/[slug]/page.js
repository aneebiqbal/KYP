'use client';
import Image from 'next/image';
import { useState } from 'react';
import SavedProfessor from '../../../../components/user/SavedProfessor';
import UserRatings from '../../../../components/user/UserRatings';
import Profile from '../../../../components/user/Profile';
export default function page(){
  const [activeTab, setActiveTab] = useState(0);
  const professors = [
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:true,
      rating:'4.7',
      reviews:600
    },
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:true,
      rating:'4.7',
      reviews:600
    },
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:true,
      rating:'4.7',
      reviews:600
    },
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:true,
      rating:'4.7',
      reviews:600
    },
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:true,
      rating:'4.7',
      reviews:600
    }
  ]
  const myRatings = [
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      reviews:[
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
        }
      ]
    },
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      reviews:[
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
        }
      ]
    },
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      reviews:[
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
        }
      ]
    },
  ]
  const userInfo = {
    name:'Mazher Hussain',
    email:'mazherhussain1998@gmail.com',
    university:'COMSATS',
    image:'/professor.png',

  }
  return<>
    <main>
      <section>
        <div className="px-120 py-80">
          <div className="flex items-center column">
            <Image width={200} height={200} src="/user/userImage.png" alt="userImage" className="mb-3"/>
            <h1 className="text-weight-700 text-1F1F1F text-48">Khusan Akhmedov</h1>
            <p className="text-434343 text-weight-400 text-24 mb-60">School Name here</p>
            <div className="flex ">
              <p className={`text-141414 text-24 text-weight-400 mr-100 cursor-pointer ${activeTab === 0?'active-user-tab pb-4 ':''}`} onClick={()=>{setActiveTab(0)}}>Saved Professors</p>
              <p className={`text-141414 text-24 text-weight-400 mr-100 cursor-pointer ${activeTab === 1?'active-user-tab pb-4 ':''}`} onClick={()=>{setActiveTab(1)}}>Ratings</p>
              <p className={`text-141414 text-24 text-weight-400 mr-100 cursor-pointer ${activeTab === 2?'active-user-tab pb-4 ':''}`} onClick={()=>{setActiveTab(2)}}>Profile and settings</p>
            </div>
          </div>
          <div>
            {activeTab === 0 &&(<SavedProfessor professors={professors} />)}
            {activeTab === 1 &&(<UserRatings ratings={myRatings} />)}
            {activeTab === 2 &&(<Profile userInfo={userInfo} />)}
          </div>
        </div>
      </section>
    </main>
  </>
}
