import Image from 'next/image';
import {getToken} from '../services/JwtService';

export default function ProfessorsList({professors}) {
  let token = getToken();
  return<>
  {professors.map((professor,index) => (
    <div key={'professors-list-'+index} className="full-width">
      <div className="border-color-D9D9D9 full-width border-radius-12 py-20 px-28 flex mb-20">
        <div>
          <Image className="border-radius-100" height={74} width={74} src={professor.image} alt={professor.image}/>
        </div>
        <div className="px-20 flex-1">
          <h2 className="text-20 text-000000 text-weight-600 mb-6">{professor.name}</h2>
          <p className="text-14 text-weight-400 text-595959">{professor.department} . {professor.institute}</p>
          <p className="text-14 text-weight-400 text-595959 mb-18">
            <span className="text-1F1F1F text-weight-600">{professor.takeAgain}%&nbsp;</span> Take Again&nbsp;|&nbsp;
            <span className="text-1F1F1F text-weight-600">{professor.loveTeaching}%&nbsp;</span> Students loves teaching
            style
          </p>
          {token &&(<div className="flex items-center">
            <button
              style={{ height: '36px' }}
              className="cursor-pointer px-12 flex items-center justify-between  text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4">
              Write a Review
            </button>
            <div className="ml-12 cursor-pointer">
              <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.3721 15.4746C11.2438 15.4746 11.1148 15.4416 11.0001 15.3756L6.12207 12.5879L1.24407 15.3756C1.01157 15.5084 0.72657 15.5076 0.49557 15.3734C0.26457 15.2391 0.12207 14.9916 0.12207 14.7246V2.72461C0.12207 1.48411 1.13157 0.474609 2.37207 0.474609H9.87207C11.1126 0.474609 12.1221 1.48411 12.1221 2.72461V14.7246C12.1221 14.9916 11.9803 15.2391 11.7486 15.3734C11.6323 15.4409 11.5026 15.4746 11.3721 15.4746ZM6.12207 10.9746C6.25032 10.9746 6.37857 11.0076 6.49407 11.0736L10.6221 13.4316V2.72461C10.6221 2.31136 10.2861 1.97461 9.87207 1.97461H2.37207C1.95882 1.97461 1.62207 2.31136 1.62207 2.72461V13.4316L5.75007 11.0729C5.86557 11.0076 5.99382 10.9746 6.12207 10.9746Z"
                  fill={professor.saved ? '#763FF9' : '#595959'} />
              </svg>
            </div>
          </div>)}
        </div>
        <div >
          <div className="flex" style={{height:'fit-content'}}>
            <p className="text-36 text-FE9900 text-weight-800">{professor.rating}</p>
            <p className="text-14 text-weight-600 text-1F1F1F mt-2 ml-12">{professor.reviews} <br />Reviews</p>
          </div>
        </div>
      </div>
    </div>
  ))}</>
}
