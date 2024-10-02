'use client';
import styles from '../page.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomDropdown from '../../components/user/CustomDropdown.';
import { AutoComplete } from 'antd';
import { BaseApi } from  './BaseApi';
import { debounce } from 'lodash';
import { useCallback } from 'react';

import { getUserInfo } from '../../services/JwtService';

export default function Page() {
  const router = useRouter();
  const [type, setType] = useState('name');
  const [search, setSearch] = useState('');
  const [searchCheck, setSearchCheck] = useState('');
  const [recommendation,setRecommendation]=useState([])
  const [userInfo, setUserInfo] = useState(null);
  const [buttonText, setButtonText] = useState('Sign Up now');

  const debouncedGetRecommendations = useCallback(
    debounce(async (text,type) => {
      await getRecommendations(text,type);
    }, 1000), [] 
  );

  console.log("type: ",type)
  
  const getRecommendations = async (text,type) => {
      console.log("----inside-----",type)
      if(text){
        try{
         let response =  await BaseApi.getRecommendations({searchBy:type,search:text})
             console.log("response on recommendation: ",response)
             setRecommendation(response.data)
        }catch(e){
          console.log("error on recommendation: ",e)
          setRecommendation([])
        }
      }
  }


  const renderItem = (name, ratings, institute,id) => ({
    value: name,
    label: (
      <div style={{display:"flex"}}>
        <div className='circle-recomendation'>
          {ratings.toFixed(1)}
        </div>

      <div style={{ display: 'flex', flexDirection: 'column',margin:" 3px 10px 2px 20px"  }}>
        {/* { console.log("department: ",department)} */}
        <span style={{ fontSize:"17px" }}>{name}</span>
        <div style={{fontSize:"13px" }}>
        {/* <span style={{ fontSize: 'small', color: 'gray' }}>{department}</span> . */}
        Professor at  <span style={{marginLeft:"3px",fontWeight:"bold"}}>{institute}</span>
        </div>
      </div>
      </div>
    ),
  });

  const options = recommendation
    ? recommendation.map((recommend) =>
        renderItem(recommend.name, recommend.ratings, recommend.institute_name,recommend.id)
      )
    : [];

  useEffect(() => {
    const userInfoData = getUserInfo();
    if (userInfoData) {
      setUserInfo(JSON.parse(userInfoData));
      setButtonText('Rate your professor')
    }else{
      setButtonText('Sign Up now')
    }
  }, []);

  const searchProfessor= ()=>{
    if(search === ''){
      setSearchCheck('Search field can not be empty')
    }else{
      setSearchCheck('')
      router.push('/professors-list?searchBy='+type+'&search='+search);
    }
  }
  const buttonNavigate = ()=>{
    if (userInfo && userInfo.email) {
      router.push('/professors-list');
    }else{
      router.push('/sign-up');
    }
  }

  return (<>
      <main className={styles.page}>
        <section>
          <div className="px-120 py-200 tablet-px-90 tablet-px-50 tablet-py-100 mobile-px-20 mobile-py-48 bg-5F32CA">
            <div className="row items-center   tablet-flex-col">
              <div className="col-xl-6 col-lg-12">
                <h1 className="text-70 text-ffffff text-weight-600 mb-32 ">Find Professors by Name and Institution</h1>
                <p className="text-24 text-F1ECFE text-weight-400 mb-40 mobile-text-16">Evaluate Your Professors and Enhance the Academic Experience</p>
                <div className="flex items-center" >
                  <CustomDropdown
                    selectedValue={type}
                    onSelect={setType}
                    placeholder="Select"
                  />
                    <AutoComplete
                      autoFocus={true}
                      popupClassName=""
                      // popupMatchSelectWidth={500}
                      onSelect={function(value){
                        if(value){
                          let selectedOption = recommendation.filter((recomend)=>recomend.name == value)
                          router.push(`/professor/${selectedOption[0].id}`)
                        }
                        // router.push(`/professor/${value}`)
                      }}
                      style={{
                        width: "446px",
                        height:"72px",
                      }}
                      options={options}
                    >
                  <input value={search} onChange={(event)=>{
                    setSearch(event.target.value);
                    if(searchCheck !== ''){
                      setSearchCheck('')
                    }
                    // getRecommendations(event.target.value)
                    console.log("inside----- type: ",type)
                    debouncedGetRecommendations(event.target.value,type)
                    // debouncedGetRecommendations(getRecommendations(event.target.value),2000)
                    // setTimeout(()=>getRecommendations(event.target.value),2000);
                    }} className="px-20 search-input-field" placeholder={type === 'name'?'Search professor with name':'Search for professors by university.'}
                    onKeyDown={(event)=>{
                      if (event.key === 'Enter') {
                        searchProfessor()
                      }
                    }}
                  />
                  </AutoComplete >
                    <div
                      onClick={searchProfessor}
                      style={{
                        height: '72px',
                        width: '72px',
                        borderTopRightRadius: '12px',
                        borderBottomRightRadius: '12px'
                      }} className="bg-FFA337 flex items-center justify-center cursor-pointer search-icon-width-mobile">
                      <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon" />
                    </div>
                  </div>
                  <div className="position-relative" >
                    <span style={{top:'10px'}} className="text-12 position-absolute text-ffffff">{searchCheck} </span>
                  </div>
              </div>
              <div className="col-xl-6 col-lg-12 home-section-tablet-img">
                <Image height={540} width={738} src="/index/indexSectionOneImage.png" alt=""
                  // className="full-width"
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="px-120 py-150 tablet-px-90 tablet-px-50 tablet-py-100 mobile-px-20 mobile-py-40">
            <div className="flex justify-between items-center mb-80 tablet-flex-col tablet-align-start ">
              <h2 className="text-1F1F1F text-70 text-weight-700 ">Join and Rate <br /> The KYP Family</h2>
              <div className="">
                <p className="text-18 text-595959 text-weight-400 mb-2">Love KYP Family? Let's make it official.</p>
                <button
                  onClick={buttonNavigate}
                  className="cursor-pointer px-20 py-12 width-225  text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4 full-width-responsive">
                  {buttonText}
                </button>
              </div>
            </div>
            <div className="row gx-4 gy-4 mobile-font-24">
              <div className="col-xl-4 col-lg-12">
                <div className="bg-56ABFF pa-40 border-radius-20 flex column items-center">
                  <Image height={302} width={302} src="/homePageSectionOne.png" alt="" />
                  <p className="text-ffffff text-38 text-weight-600 text-center">Manage and edit your ratings</p>
                </div>
              </div>
              <div className="col-xl-4 col-lg-12">
                <div className="bg-A9A8F6 pa-40 border-radius-20 flex column items-center">
                  <Image height={302} width={302} src="/index/indexSectionTwoImageTwo.png" alt="" />
                  <p className="text-ffffff text-38 text-weight-600 text-center">Manage and edit your ratings</p>
                </div>
              </div>
              <div className="col-xl-4 col-lg-12">
                <div className="bg-FFBFA7 pa-40 border-radius-20 flex column items-center">
                  <Image height={302} width={302} src="/index/indexSectionTwoImageThree.png" alt="" />
                  <p className="text-ffffff text-38 text-weight-600 text-center">Manage and edit your ratings</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>

  );
}

