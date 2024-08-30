import Image from 'next/image';
import Reviews from '../Reviews';
import { useEffect, useState } from 'react';
import CustomDropdown from './CustomDropdown.';
import { BaseApi } from '../../app/(base)/BaseApi';
export default function UserRatings() {
  const [type, setType] = useState('name');
  const [search, setSearch] = useState('');
  const [searchCheck, setSearchCheck] = useState('');
  const [ratings, setRatings] = useState([]);
  const [ratingsData, setRatingsData] = useState({});
  const searchProfessor= ()=>{
    if(search === ''){
      setSearchCheck('Search field can not be empty')
    }else{
      setSearchCheck('')
    }
  }
  const getRatings = async (searchBy=type,text=search,seeMore= false,page=1)=>{
    try{
      await BaseApi.getReviews({searchBy:searchBy,search:text,page:page})
        .then((response)=>{
          if(seeMore){
            let tempRatings = ratings;
            tempRatings = tempRatings.concat(response.data.data);
            console.log('tempProfessors:', tempRatings);
            setRatings(tempRatings);
          }else{
            console.log('response.data.data');
            console.log(response.data.data);
            setRatings(response.data.data);
          }
          setRatingsData(response.data)
        })
    }catch(e){
      console.log(e)
    }
  }
  const updateRatings =  (updatedReview,professorId) => {
     const tempRatings = ratings.map(rating =>
       rating.professor.id === professorId
        ? {...rating, ratings:rating.ratings.map(review => review.id === updatedReview.id ? { ...review, updatedReview } : review) }
        : rating
    );
    setRatings(tempRatings)
  }
  useEffect(() => {
    getRatings();
  }, []);
  return<>
    <div>
      <div className="flex full-width justify-center mb-32 mt-60 ">
        <div className="flex items-center  border-radius-12 professor-mobile-flex-col  full-width-responsive ">
          <div className=" search-drop-shadow-class flex full-width-responsive">
            <CustomDropdown  selectedValue={type}
                             onSelect={setType}
                             placeholder="Select"/>
          <input value={search} onChange={(event) => {
            setSearch(event.target.value);
            if (searchCheck !== '') {
              setSearchCheck('')
            }
          }} className="px-20 search-input-field rating-input mobile-border-right "
                 placeholder={type === 'name' ? 'Search professor with name' : 'Search for professors by university.'} />
          </div>
          <div
            onClick={searchProfessor}
            style={{
              height: '72px',
              width: '72px',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px'
            }} className="bg-FFA337 flex items-center justify-center cursor-pointer full-width-responsive border-mobile height-search-52">
            <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon" />
          </div>
        </div>
      </div>
      <div className="flex justify-between mb-32">
        <p className="text-weight-600 text-24 text-1F1F1F">My Ratings</p>
        <p className="text-weight-600 text-18 text-8C8C8C">{ratingsData.total} ratings</p>
      </div>
      {ratings.length>0 &&(<div>
        {ratings.map((rating, index) => (
          <div key={'myratings_' + index}>
            <div className="flex mb-60 position-relative">
              <Image className="border-radius-100" height={48} width={48} src={false ?rating.professor.image_url:'/professor.png'} alt={rating.image_url} />
              <div className="ml-24">
                <h2 className="text-20 text-000000 text-weight-600 mb-6">{rating.professor.name}</h2>
                <p className="text-14 text-weight-400 text-595959">{rating.professor.department_name} . {rating.professor.institute_name}</p>
                <p className="text-14 text-weight-400 text-595959 mb-18">
                  <span className="text-1F1F1F text-weight-600">{rating.professor.percentage_take_again}&nbsp;</span> Take
                  Again&nbsp;|&nbsp;
                  <span className="text-1F1F1F text-weight-600">{rating.professor.percentage_love_teaching_style}&nbsp;</span> Students loves
                  teaching
                  style
                </p>
              </div>
              <div style={{ top: '64px', left: '22px' }} className="position-absolute">
                <Image width={32} height={108} src="/user/myRatingLine.svg" alt="myRatingLine" className='desktop-display-rating-img'/>
                <div className='tablet-display' style={{borderRight: "1px solid #D9D9D9", height:'75px'}}></div>
              </div>
            </div>
            <div className="pl-72 mobile-padding-left-0">
              <Reviews reviews={rating.ratings} updateRatings={updateRatings} professorId={rating.professor.id} />
            </div>
            {index < ratings.length - 1 && (<div className="separator-x my-4"></div>)}
          </div>
        ))}
          {Number(ratingsData.page) < ratingsData.lastPage && (<div className="flex items-center justify-center mt-4">
            <p className="text-weight-600 text-763FF9 text-24 cursor-pointer" onClick={() => {
              getRatings(type, search, true, Number(ratingsData.page) + 1);}}>See more</p>
          </div>)}
      </div>
      )}
    </div>
  </>
}
