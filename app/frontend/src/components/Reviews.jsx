import Image from 'next/image';

export default function Reviews({reviews}) {
  return<>
    {reviews.map((review,index) => (
      <div key={'review'+index} className="flex mb-20">
        <div className="flex column items-center">
          <Image className="border-radius-100" height={48} width={48} src={review.image} alt={review.image} />
          <p className="text-0378A6 text-26 text-weight-600">{review.rating}</p>
        </div>
        <div className="flex-1 ml-12  border-radius-10 pa-20 bg-E6F1F6">
          <div className="flex justify-between mb-20">
            <p className="text-16 text-141414 text-weight-700">{review.courseCode}</p>
            <p className="text-14 text-141414 text-weight-600">{review.date}</p>
          </div>
          <p className="text-141414 text-16 text-weight-400 mb-20">{review.review}</p>
          <div className="flex mb-20">
            {review.tags.map((tag,index) => (
              <div key={tag+'-'+index} className=" bg-CDE4ED text-14 text-024864 text-weight-400 pa-10 border-radius-6 mr-16">
                {tag}
              </div>
            ))}
          </div>
          <div className="flex mb-10">
            <p className="text-434343 text-14 text-weight-400">For Credit: <span className="text-weight-600 text-141414">{review.credit}</span></p>
            <p className=" ml-12 text-434343 text-14 text-weight-400">Attendance: <span className="text-weight-600 text-141414">{review.attendance}</span></p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image width={16} height={16} src="/like.svg" alt="like"/>
              <p className="text-14 text-434343 text-weight-400 " style={{marginLeft:'4px',marginRight:'8px'}}>{review.upVotes}</p>
              <Image width={16} height={16} src="/like.svg" alt="like"/>
              <p className="text-14 text-434343 text-weight-400" style={{marginLeft:'4px',marginRight:'8px'}}>{review.downVotes}</p>
              <Image width={13} height={16} src="/report.svg" alt="like"/>
              <p className="text-14 text-434343 text-weight-400" style={{marginLeft:'4px'}}>{review.reports}</p>
            </div>
            <Image width={15} height={16} src="/share.svg" alt="like"/>
          </div>
        </div>
      </div>
    ))}
  </>
}
