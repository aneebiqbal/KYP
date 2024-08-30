
import SignUpForm from '../../../components/auth/SignUpForm';
export default function page(){

  return<>
    <div className="bg-ffffff px-40 py-20 border-radius-8 mobile-px-20" style={{width:'650px'}}>
      <h2 className="text-24 text-1F1F1F text-center text-xl-start text-weight-500 mb-2">Sign Up</h2>
      <p className="text-434343 text-16 text-center text-xl-start text-weight-400 mb-4">Enter details to create an account</p>
      <SignUpForm/>

    </div>
  </>
}

