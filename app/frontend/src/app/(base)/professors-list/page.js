'use client';
import Image from 'next/image';
import { useState } from 'react';
import ProfessorsList from '../../../components/ProfessorsList';
export default function page(){
  const [type, setType] = useState('0');
  const [sort, setSort] = useState('0');
  const Professors = [
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
  return<>
    <section>
      <div className="px-120 py-40">
        <div className="mb-60">
          <div className="flex items-center">
            <select onChange={(event) => {
              setType(event.target.value)
            }} style={{ height: '72px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }} className="px-20 border-color-D9D9D9"
                    name="state" value={type}>
              <option value="name">Name</option>
              <option value="university">University</option>
            </select>
            <input style={{ height: '72px', width: '420px',borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }} className="px-20 border-color-D9D9D9"
                   placeholder={type === 'name' ? 'Search professor with name' : 'Search for professors by university.'} />
            <div
              style={{ height: '72px', width: '72px' }}
              className="bg-FFA337 flex items-center justify-center border-radius-12 ml-30">
              <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon" />
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-32">
          <div>
            <p className="text-24 text-1F1F1F text-weight-600">Search Results</p>
          </div>
          <div className="flex items-center">
            <p className="text-weight-600 text-8C8C8C text-18">5,872 Results found</p>
            <select onChange={(event) => {
              setSort(event.target.value)
            }} style={{ height: '48px' }}
                    className="ml-12 px-20 border-color-D9D9D9 border-radius-6 text-434343"
                    name="state" value={sort}>
              <option value="0">Name</option>
              <option value="1">Rating</option>
            </select>
          </div>
        </div>
        <ProfessorsList professors={Professors}/>
      </div>
    </section>
  </>
}
