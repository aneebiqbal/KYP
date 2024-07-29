import StarRating from './StarRating';
export default function RatingBar({rating, reviews, reviewsGot,text}) {
  let progress = (reviewsGot/reviews) * 100;
  return<>
    <div className="flex items-center full-width">
      <div className="flex items-center" style={{width:'222px'}}>
        <StarRating rating={rating} />
        <p className="text-14 text-weight-500 text-1F1F1F ml-12">{text}</p>
      </div>

      <div className="flex flex-1 ml-12" style={{ height: '8px' }}>
        <div
          className="bg-FE9900"
          style={{ width: `${progress}%`, height: '8px' }}
        ></div>
        <div
          className="bg-D9D9D9"
          style={{ width: `${100 - progress}%`, height: '8px' }}
        ></div>
      </div>
      <p className="text-14 text-weight-500 text-1F1F1F ml-12 text-right" style={{width:'37px'}}>{progress}%</p>
    </div>
  </>

}
