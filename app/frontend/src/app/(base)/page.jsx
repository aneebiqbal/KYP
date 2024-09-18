'use client';
import styles from '../page.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomDropdown from '../../components/user/CustomDropdown.';

export default function Page() {
  const router = useRouter();
  const [type, setType] = useState('name');
  const [search, setSearch] = useState('');
  const [searchCheck, setSearchCheck] = useState('');


  const searchProfessor= ()=>{
    if(search === ''){
      setSearchCheck('Search field can not be empty')
    }else{
      setSearchCheck('')
      router.push('/professors-list?searchBy='+type+'&search='+search);
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
                  <input value={search} onChange={(event)=>{setSearch(event.target.value);if(searchCheck !== ''){setSearchCheck('')}}} className="px-20 search-input-field" placeholder={type === 'name'?'Search professor with name':'Search for professors by university.'}/>
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
                {searchCheck !== '' &&(<span className="text-12 text-ffffff">{searchCheck}</span>)}

              </div>
              <div className="col-xl-6 col-lg-12 home-section-tablet-img">
                <img height={540} width={738} src="/index/indexSectionOneImage.png" alt=""
                // className="full-width"
                />
              </div>
            </div>
          </div>
        </section>
        <section >
          <div className="px-120 py-150 tablet-px-90 tablet-px-50 tablet-py-100 mobile-px-20 mobile-py-40">
            <div className="flex justify-between items-center mb-80 tablet-flex-col tablet-align-start ">
              <h2 className="text-1F1F1F text-70 text-weight-700 ">Join and Rate <br/> The KYP Family</h2>
              <div className="">
                <p className="text-18 text-595959 text-weight-400 mb-2">Love KYP Family? Let's make it official.</p>
                <button
                  className="cursor-pointer px-20 py-12 width-225  text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4 full-width-responsive">
                  Sign Up Now!
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

