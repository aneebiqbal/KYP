import ProfessorsList from '../ProfessorsList';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BaseApi } from '../../app/(base)/BaseApi';
export default function SavedProfessor() {
  const [type, setType] = useState('0');
  const [search, setSearch] = useState('');
  const [searchCheck, setSearchCheck] = useState('');
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
      ratings:[]
    },
    {
      id:2,
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:0,
      rating:'4.7',
      ratings:[]
    },
    {
      id:3,
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:0,
      rating:'4.7',
      ratings:[]
    },
    {
      id:4,
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:0,
      rating:'4.7',
      ratings:[]
    },
    {
      id:5,
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain:'40',
      loveTeaching:'80',
      saved:0,
      rating:'4.7',
      ratings:[]
    }
  ]);

  const updateProfessors = (professorId) => {
    const updatedProfessors = professors.map(professor =>
      professor.id === professorId
        ? { ...professor, saved: professor.saved === 1 ? 0 : 1 }
        : professor
    );
    setProfessors(updatedProfessors);
  }
  const searchProfessor= ()=>{
    if(search === ''){
      setSearchCheck('Search field can not be empty')
    }else{
      getProfessors();
      setSearchCheck('')
    }
  }
  const getProfessors = async (searchBy=type,text=search,seeMore= false)=>{
    try{
      await BaseApi.SavedProfessors({searchBy:searchBy,search:text})
        .then((response)=>{
          console.log('response----', response);
          if(seeMore){
            let tempProfessors = professors;
            tempProfessors = tempProfessors.concat(response);
            setProfessors(tempProfessors);
          }else{
            setProfessors(response);
          }
        })
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    // getProfessors();
  }, []);
return<>
  <div>
    <div className="flex full-width justify-center mb-32 mt-60">
      <div className="flex items-center search-drop-shadow-class border-radius-12">
        <select onChange={(event) => {
          setType(event.target.value)
        }} style={{ height: '72px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }} className="px-20 border-color-D9D9D9"
                name="state" value={type}>
          <option value="0">Name</option>
          <option value="1">Institute</option>
        </select>
        <input value={search} onChange={(event) => {
          setSearch(event.target.value);
          if (searchCheck !== '') {
            setSearchCheck('')
          }
        }} className="px-20 search-input-field"
               placeholder={type === 'name' ? 'Search professor with name' : 'Search for professors by university.'} />
        <div
          onClick={searchProfessor}
          style={{
            height: '72px',
            width: '72px',
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px'
          }} className="bg-FFA337 flex items-center justify-center cursor-pointer">
          <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon" />
        </div>
      </div>
    </div>
    {searchCheck !== '' && (<span className="text-12 text-ffffff">{searchCheck}</span>)}
    <div className="flex justify-between mb-32">
      <p className="text-weight-600 text-24 text-1F1F1F">Saved</p>
      <p className="text-weight-600 text-18 text-8C8C8C">58</p>
    </div>
    <ProfessorsList professors={professors} updateProfessors={updateProfessors} />
  </div>
</>
}
