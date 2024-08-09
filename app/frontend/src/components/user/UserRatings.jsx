import Image from 'next/image';
import Reviews from '../Reviews';
import { useState } from 'react';
import CustomDropdown from './CustomDropdown.';
export default function UserRatings({ratings}) {
  const [type, setType] = useState('name');
  const [search, setSearch] = useState('');
  const [searchCheck, setSearchCheck] = useState('');
  const searchProfessor= ()=>{
    if(search === ''){
      setSearchCheck('Search field can not be empty')
    }else{
      setSearchCheck('')

    }
  }
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
        <p className="text-weight-600 text-18 text-8C8C8C">12 ratings</p>
      </div>
      <div>
        {ratings.map((rating, index) => (
          <div key={'myratings_' + index}>
            <div className="flex mb-60 position-relative">
              <Image className="border-radius-100" height={48} width={48} src={rating.image} alt={rating.image} />
              <div className="ml-24">
                <h2 className="text-20 text-000000 text-weight-600 mb-6">{rating.name}</h2>
                <p className="text-14 text-weight-400 text-595959">{rating.department} . {rating.institute}</p>
                <p className="text-14 text-weight-400 text-595959 mb-18">
                  <span className="text-1F1F1F text-weight-600">{rating.takeAgain}%&nbsp;</span> Take
                  Again&nbsp;|&nbsp;
                  <span className="text-1F1F1F text-weight-600">{rating.loveTeaching}%&nbsp;</span> Students loves
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
              <Reviews reviews={rating.reviews} />
            </div>
            {index < ratings.length - 1 && (<div className="separator-x my-4"></div>)}
          </div>
        ))}
      </div>
    </div>
  </>
}
