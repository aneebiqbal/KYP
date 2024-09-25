import ProfessorsList from '../ProfessorsList';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BaseApi } from '../../app/(base)/BaseApi';
import CustomDropdown from './CustomDropdown.';
import {getToken}  from '../../services/JwtService'
import { useRouter } from 'next/navigation';

export default function SavedProfessor() {
  const token = getToken();
  const router = useRouter();
  const [type, setType] = useState('name');
  const [search, setSearch] = useState('');
  const [searchCheck, setSearchCheck] = useState('');
  const [professors, setProfessors] = useState([]);
  const [professorsData, setProfessorsData] = useState({});
  const [loading,setLoading] = useState(true);

  const updateProfessors = (professorId) => {
    console.log('professorId', professorId);
    const updatedProfessors = professors.filter(professor =>
      !(professor.id === professorId )
    );
    if(updatedProfessors.length === 0 && professorsData.page < professorsData.total) {
      getProfessors(type, search, false,  1);
    }
    setProfessors(updatedProfessors);
    let tempProfessorData = professorsData;
    tempProfessorData.total = tempProfessorData.total -1;
    setProfessorsData(tempProfessorData);
  }

  const searchProfessor = ()=>{
    if(search === ''){
      getProfessors("");
      setSearchCheck('Search field can not be empty')
    }else{
      getProfessors();
      setSearchCheck('')
    }
  }
  const getProfessors = async (searchBy=type,text=search,seeMore= false,page=1)=>{
    console.log(" text: ",text," search by: ",searchBy)
    try{
      setLoading(true)
      await BaseApi.SavedProfessors({searchBy:searchBy,search:text,page:page})
        .then((response)=>{
          console.log('response----', response);
          if(seeMore){
            let tempProfessors = professors;
            tempProfessors = tempProfessors.concat(response.data.data);
            console.log('tempProfessors:', tempProfessors);
            setProfessors(tempProfessors);
          }else{
            console.log(response.data.data);
            setProfessors(response.data.data);
          }
          setProfessorsData(response.data)
          setLoading(false)
        })
    }catch(e){
      console.log(e)
      setProfessors([])
      setProfessorsData([])
      setLoading(false)
    }
  }

  useEffect(() => {
    if(!token){
      router.push('/')
    }
    getProfessors("");
  }, []);
return<>
 { loading
    ?
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"15%", marginBottom:"30%"}}><span className="loader"></span> </div>
    :
    <>
  <div>
    <div className="flex full-width justify-center mb-32 mt-60">
      <div className="flex items-center  border-radius-12 professor-mobile-flex-col  full-width-responsive ">
        <div className=" search-drop-shadow-class flex full-width-responsive">
          <CustomDropdown selectedValue={type}
                          onSelect={setType}
                          placeholder="Select" />
          <input value={search} onChange={(event) => {
            setSearch(event.target.value);
            if (searchCheck !== '') {
              setSearchCheck('')
            }
          }} className="px-20 search-input-field rating-input mobile-border-right"
                 placeholder={type === 'name' ? 'Search professor with name' : 'Search for professors by university.'} />
        </div>
        <div
          onClick={searchProfessor}
          style={{
            height: '72px',
            width: '72px',
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px'
          }} className=" bg-FFA337 flex items-center justify-center cursor-pointer full-width-responsive border-mobile height-search-52">
          <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon" />
        </div>
      </div>
    </div>
    {searchCheck !== '' && (<span className="text-12 text-ffffff">{searchCheck}</span>)}
    <div className="flex justify-between mb-32">
      <p className="text-weight-600 text-24 text-1F1F1F">Saved</p>
      <p className="text-weight-600 text-18 text-8C8C8C">{professorsData.total?professorsData.total:0}</p>
    </div>
    {professors.length>0 ?
    (<div>
      <ProfessorsList professors={professors} updateProfessors={updateProfessors} />
      {Number(professorsData.page) < professorsData.lastPage && (<div className="flex items-center justify-center mt-4">
        <p className="text-weight-600 text-763FF9 text-24 cursor-pointer" onClick={() => {
          getProfessors(type, search, true, Number(professorsData.page) + 1);
        }}>See more</p>
      </div>)}
    </div>)
    :
    (<div className="full-width full-height flex items-center justify-center column">
        <Image className="mb-20" width={112} height={112} src="/norecordfound.svg" alt="norecordfound" />
        <p className="text-weight-600 text-18 text-1F1F1F mb-8">No records found</p>
        <p className="text-weight-400 text-14 text-595959">The record you tried to filter was not found.</p>
      </div>)
    }

  </div>
  </>
}
</>
}
