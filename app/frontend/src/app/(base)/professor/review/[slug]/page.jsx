'use client';
import { useEffect, useState } from 'react';
import Reviews from '../../../../../components/Reviews';
import { useParams, useRouter } from 'next/navigation';
import {BaseApi} from '../../../BaseApi';

export default function page(){
  const {slug} = useParams();
  const router = useRouter();
  const [ Loading,setLoading ] = useState(false);
  const [reviewDetails,setReviewDetails] = useState({
    id:4,
    first_name:'Ali',
    last_name:'Hasan',
    department_name:'Mathematics',
    institute_name:'PUCIT',
    reviews:[
      {
        course_name: "CS101",
        id: 48,
        student_id: 74,
        student_image_url: "https://reactkypprofilepics.s3.ap-south-1.amazonaws.com/pic1.avif",
        student_name: "Nimra Noor",
        tags: [
          "detailed explanations"
        ],
        created_at: "2024-09-25T21:03:49.442Z",
        comment: "abc",
        for_credit: false,
        textbook_use: true,
        upVotes: 1,
        downVotes: 0,
        reports: 0,
        attendance: false,
        rating: 4,
        reactRatings: {
          upvote: false,
          downvote: false,
          reported: false
        }
      }
    ]

  })
  const updateRatings = (updatedReview, professorId) => {
    if (!reviewDetails || reviewDetails.id !== professorId) {
      console.error("Professor details not found or ID mismatch");
      return;
    }
    const updatedCourses = reviewDetails.reviews.data.map(course => ({
      ...course,
      reactRatings: course.id === updatedReview.id
        ? { ...course.reactRatings, ...updatedReview }
        : course.reactRatings
    }));
    setReviewDetails({
      ...reviewDetails,
      reviews: updatedCourses
    });
  };
  const getDetails = (id) =>{
    router.push(`/professor/${id}`);
  }
  const getReview = async()=>{
    try{
      setLoading(true)
      await BaseApi.getReview({id:slug})
        .then((response)=>{
          setReviewDetails(response.data)
          setLoading(false)
        })
    }catch(e){
      console.log(e)
      setLoading(false)
    }
  }
  useEffect(() => {
    getReview();
  },[])
  return<>
    { Loading || !reviewDetails
      ?
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"30%", margin:"30%"}}><span className="loader"></span> </div>
      :
      <>
        <div className="px-120 py-30 tablet-px-90 tablet-px-50 mobile-px-20">

          <p className="text-8C8C8C text-14 text-weight-400 mb-40">Professor / <span
            className="text-1F1F1F"> {reviewDetails.first_name} {reviewDetails.last_name}</span></p>

          <div className="py-80">
            <p className="text-9165FA text-14 text-weight-400">Rating for</p>
            <div className="flex-1 flex column justify-center professor-name-mt-24 mt-2">
              <h2 onClick={()=>getDetails(reviewDetails.id)}
                className="text-24 text-1F1F1F text-weight-600 mb-6 cursor-pointer">{reviewDetails?.first_name} {reviewDetails?.last_name}</h2>
              <p className="text-14 text-weight-400 text-434343">Professor in the
                <span className="text-1F1F1F text-weight-600"> {reviewDetails?.department_name} </span> at <span
                  className="line-break-2"><br />  </span>
                <span className="text-1F1F1F text-weight-600"> {reviewDetails?.institute_name} </span></p>
            </div>
            <button onClick={()=>getDetails(reviewDetails.id)}  className="cursor-pointer px-20 py-12 mt-40  text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4 full-width-responsive">
              View Full profile
            </button>
            <div className="mt-60">
              <Reviews reviews={reviewDetails?.reviews} professorId={reviewDetails.id} updateRatings={updateRatings} />
            </div>

          </div>
        </div>
      </>
    }
  </>
}
