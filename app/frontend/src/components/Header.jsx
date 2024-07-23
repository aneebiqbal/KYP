import Image from 'next/image';

export default function Header() {
  return <>
    <nav>
      <div style={{height:'80px'}} className="px-160 flex justify-between items-center">
        <Image height={35} width={70} src="/KYP.png" alt="KYPIcon"/>
        <div className="flex">
          <button className="cursor-pointer px-20 py-12 text-18 flex justify-center items-center bg-ffffff text-763FF9 border-color-763FF9 border-radius-4">
            Sign Up
          </button>
          <button className="cursor-pointer px-20 py-12 ml-12 text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4">
            Login
          </button>
        </div>
      </div>
    </nav>
  </>
}
