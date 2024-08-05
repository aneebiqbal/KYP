'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ProfessorsList from './ProfessorsList';
import { BaseApi } from '../app/(base)/BaseApi';
export default function ProfessorsListFilter(){
  const [professors, setProfessors] = useState([
    {
      id:1,
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:0,
      rating:'4.7',
      reviews:600
    },
    {
      id:1,
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:1,
      rating:'4.7',
      reviews:600
    },
    {
      id:1,
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:1,
      rating:'4.7',
      reviews:600
    },
    {
      id:1,
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:1,
      rating:'4.7',
      reviews:600
    },
    {
      id:1,
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:1,
      rating:'4.7',
      reviews:600
    }
  ]);
  const searchParams = useSearchParams();
  const [type, setType] = useState('0');
  const [sort, setSort] = useState('1');
  const [sortOrder, setSortOrder] = useState(true);
  const [search, setSearch] = useState('');
  const getProfessors = async (searchBy=type,text=search)=>{
    try{
      await BaseApi.getProfessors({sortField:sort,sortOrder:sortOrder?'ASC':'DESC',searchBy:searchBy,search:text})
        .then((response)=>{
          let tempProfessors = professors;
          tempProfessors = tempProfessors.concat(response)
          setProfessors(tempProfessors)
        })
    }catch(e){
      console.log(e)
    }
  }
  const updateProfessors = (professorId) => {
    const updatedProfessors = professors.map(professor =>
      professor.id === professorId
        ? { ...professor, saved: professor.saved === 1 ? 0 : 1 }
        : professor
    );
    setProfessors(updatedProfessors);
  }
  useEffect(() => {
    setSearch(searchParams.get('search')|| '')
    setType(searchParams.get('searchBy') || '0')
    getProfessors(searchParams.get('searchBy'),searchParams.get('search'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ searchParams.get('search')]);
  return <>
    <div className="mb-60">
      <div className="flex items-center">
        <select onChange={(event) => {
          setType(event.target.value)
        }} style={{ height: '72px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}
                className="px-20 border-color-D9D9D9"
                name="state" value={type}>
          <option value="0">Name</option>
          <option value="1">University</option>
        </select>
        <input value={search} onChange={(event)=>{setSearch(event.target.value)}} style={{ height: '72px', width: '420px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}
               className="px-20 border-color-D9D9D9"
               placeholder={type === 'name' ? 'Search professor with name' : 'Search for professors by university.'} />
        <div
          onClick={()=>{getProfessors()}}
          style={{ height: '72px', width: '72px' }}
          className="bg-FFA337 flex items-center justify-center border-radius-12 ml-30 cursor-pointer">
          <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon" />
        </div>
      </div>
    </div>
    <div className="flex justify-between mb-32">
      <div className="flex items-center">
        <p className="text-24 text-1F1F1F text-weight-600">Search Results</p>
        <Image onClick={()=>{setSortOrder(!sortOrder)}} className="ml-12 cursor-pointer" width={20} height={16} src="/sortingIcon.svg" alt="sortingIcon"/>
        <p className="ml-8 text-12 text-434343">{sortOrder?'ASC':'DESC'}</p>
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
    <ProfessorsList professors={professors} updateProfessors={updateProfessors}/>

  </>
}
