import ProfessorsList from '../ProfessorsList';
export default function SavedProfessor({professors}) {
return<>
  <div>
    <div className="flex justify-between mb-32">
      <p className="text-weight-600 text-24 text-1F1F1F">Saved</p>
      <p className="text-weight-600 text-18 text-8C8C8C">58</p>
    </div>
    <ProfessorsList professors={professors} />
  </div>
</>
}
