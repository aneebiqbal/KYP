
import LoginForm from "../../../components/auth/LoginForm";
export default function page(){

  return<>
    <div className="bg-ffffff px-40 py-20 border-radius-8" style={{width:'467px'}}>
      <h2 className="text-24 text-1F1F1F text-weight-500 mb-2">Login</h2>
      <p className="text-434343 text-16 text-weight-400 mb-4">Enter your credentials to login</p>
      <LoginForm/>
    </div>
  </>
}

