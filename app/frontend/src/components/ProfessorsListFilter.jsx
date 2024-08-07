'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ProfessorsList from './ProfessorsList';
import { BaseApi } from '../app/(base)/BaseApi';
import CustomDropdown from './user/CustomDropdown.';


export default function ProfessorsListFilter(){
  const [professors, setProfessors] = useState([]);
  const searchParams = useSearchParams();
  const [type, setType] = useState('0');
  const [sort, setSort] = useState('1');
  const [sortOrder, setSortOrder] = useState(true);
  const [search, setSearch] = useState('');

  const [DropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const options = [
    { value: '0', label: 'Name' },
    { value: '1', label: 'Rating' }
  ];
  const updateProfessors = (professorId) => {
    const updatedProfessors = professors.map(professor =>
      professor.id === professorId
        ? { ...professor, is_saved: professor.is_saved === 1 ? 0 : 1 }
        : professor
    );
    setProfessors(updatedProfessors);
  }
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
  useEffect(() => {
    setSearch(searchParams.get('search')|| '')
    setType(searchParams.get('searchBy') || '0')
    getProfessors(searchParams.get('searchBy'),searchParams.get('search'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ searchParams.get('search')]);
  return <>
    <div className="mb-60">
      <div className="flex flex-nowrap professor-mobile-flex-col ">
        <div className="flex items-center ">
       <CustomDropdown  selectedValue={type}
                        onSelect={setType}
                        placeholder="Select"/>

        <input value={search} onChange={(event)=>{setSearch(event.target.value)}} style={{ height: '72px', width: '420px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}
               className="px-20 border-color-D9D9D9 mobile-px-10 search-input-field"
               placeholder={type === 'name' ? 'Search professor with name' : 'Search for professors by university.'} />
        </div>
        <div
          onClick={()=>{getProfessors()}}
          style={{ height: '72px', width: '72px' }}
          className="bg-FFA337 flex items-center justify-center border-radius-12 ml-30 cursor-pointer professer-list-ml-0">
          <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon" />
        </div>
      </div>
    </div>
    <div className="flex justify-between mb-32 professor-mobile-flex-col">
      <div className="flex items-center">
        <p className="text-24 text-1F1F1F text-weight-600">Search Results</p>
        <Image onClick={()=>{setSortOrder(!sortOrder)}} className="ml-12 cursor-pointer" width={20} height={16} src="/sortingIcon.svg" alt="sortingIcon"/>
        <p className="ml-8 text-12 text-434343">{sortOrder?'ASC':'DESC'}</p>
      </div>
      <div className="flex items-center professor-mobile-results-selection  mobile-mt-20">
        <p className="text-weight-600 text-8C8C8C text-18">5,872 Results found</p>
        <div className="relative sort-dropdown" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!DropdownOpen)}
            style={{
              height: '48px',
              borderRadius: '12px',
              width: "156px",
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',

            }}
            className="px-28 border-color-D9D9D9 mobile-width-sort-dropdown"
          >
          <p className='text-18'>{options.find(option => option.value === sort)?.label || "Sort By"}</p>
            <span style={{ marginLeft: '20px' }}>▼</span>
          </div>
          {DropdownOpen && (
            <div
              style={{
                position: 'absolute',
                // top: '100%',
                // left: '0',
                width: '200px',
                borderRadius: '12px',
                border: '1px solid #D9D9D9',
                backgroundColor: '#ffffff',
                zIndex: 10,
                maxHeight: '200px',

              }}
              className="px-10 border-color-D9D9D9"
            >
              {options.map(option => (
                <div
                  key={option.value}
                  onClick={() => {
                    setSort(option.value);
                    setDropdownOpen(false);
                  }}
                  style={{

                    cursor: 'pointer',

                  }}
                  className="px-10 py-12"
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    {professors.length > 0 ?
      (<ProfessorsList professors={professors} updateProfessors={updateProfessors} />)
      : (<div className="full-width full-height flex items-center justify-center column">
        <Image className="mb-20" width={112} height={112} src="/norecordfound.svg" alt="norecordfound" />
        <p className="text-weight-600 text-18 text-1F1F1F mb-8">No records found</p>
        <p className="text-weight-400 text-14 text-595959">The record that you tired to filter is not found</p>
      </div>)}


  </>
}
