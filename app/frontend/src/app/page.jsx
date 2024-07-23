'use client';
import styles from './page.module.css';
import Image from 'next/image';
import { useState } from 'react';

export default function Index() {
const [type, setType] = useState('name');
  return (<>
      <main className={styles.page}>
        <section>
          <div className="px-120 py-200 bg-5F32CA">
            <div className="row">
              <div className="col-6">
                <h1 className="text-70 text-ffffff text-weight-600 mb-32">Find Professors by <br/> Name and Institution</h1>
                <p className="text-24 text-F1ECFE text-weight-400 mb-40">Evaluate Your Professors and Enhance the Academic Experience</p>
                <div className="flex items-center">
                  <select onChange={(event)=>{setType(event.target.value)}} style={{height:'72px',borderTopLeftRadius:'12px',borderBottomLeftRadius:'12px'}} className="px-20" name="state" value={type}>
                    <option value="name">Name</option>
                    <option value="university">University</option>
                  </select>
                  <input style={{height:'72px',width:'446px'}} className="px-20" placeholder={type === 'name'?'Search professor with name':'Search for professors by university.'}/>
                  <div style={{height:'70px',width:'72px',borderTopRightRadius:'12px',borderBottomRightRadius:'12px'}} className="bg-FFA337 flex items-center justify-center">
                    <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon"/>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <Image height={540} width={738} src="/index/indexSectionOneImage.png" alt="" />
              </div>
            </div>
          </div>
        </section>
        <section >
          <div className="px-120 py-150">
            <div className="flex justify-between items-center mb-80">
              <h2 className="text-1F1F1F text-70 text-weight-700 ">Join and Rate <br/> The KYP Family</h2>
              <div>
                <p className="text-18 text-595959 text-weight-400 mb-2">Love KYP Family? Let's make it official.</p>
                <button
                  className="cursor-pointer px-20 py-12  text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4">
                  Sign Up Now!
                </button>
              </div>
            </div>
            <div className="row gx-4 gy-4">
              <div className="col-4">
                <div className="bg-56ABFF pa-40 border-radius-20 flex column items-center">
                  <Image height={302} width={408} src="/index/indexSectionTwoImageOne.png" alt="" />
                  <p className="text-ffffff text-38 text-weight-600 text-center">Manage and edit your ratings</p>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-A9A8F6 pa-40 border-radius-20 flex column items-center">
                  <Image height={302} width={302} src="/index/indexSectionTwoImageTwo.png" alt="" />
                  <p className="text-ffffff text-38 text-weight-600 text-center">Manage and edit your ratings</p>
                </div>
              </div>
              <div className="col-4">
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
