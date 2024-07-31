'use client';
import Image from 'next/image';
import Link from 'next/link';
import {getToken} from '../services/JwtService';
import { NextResponse } from 'next/server';
import {AuthApi} from '../app/(auth)/AuthApi';

export default function Header() {
  let token = getToken();
  const data = {
    id:'11',
    firstName:'Mazher',
    lastName:'Hussain',
    email:'mazherhussain1998@gmail.com'
  }
  const logout = ()=>{
    AuthApi.logout({email:data.email})
  }
  const closeDropDown = (parentClass)=>{
    const dropdown = document.querySelector(parentClass);
    dropdown.style.display ='none';
    setTimeout(()=>{
      dropdown.style.display ='block';
    },200)
  }
  return <>
    <nav>
      <div style={{height:'80px'}} className="px-160 flex justify-between items-center">
        <Link href="/">
          <Image height={35} width={70} src="/KYP.png" alt="KYPIcon"/>
        </Link>
        {token &&(<div>
          <div className="profile-btn">
            <div className="bg-763FF9 border-radius-100 flex items-center justify-center cursor-pointer"
                 style={{ width: '47px', height: '47px' }}>
              <Image height={20} width={16} src="/profileicon.svg" alt="profileicon." />
            </div>
            <div className="position-relative">
              <div className="z-3 profile-div" style={{ position: 'absolute',right:'0' }}>
                <div className="nav-dropdown border-radius-8 pa-16 profile-dropdown mt-3">
                  <div className="flex column ">
                    <div className="flex">
                      <div className="bg-D6C5FD border-radius-8 pa-10 text-capitalize">
                        {data.firstName[0] + data.lastName[0]}
                      </div>
                      <div className="ml-8">
                        <p className="text-141414 text-weight-600 text-16">{data.firstName + ' ' + data.lastName}</p>
                        <p className="text-8C8C8C text-12 text-weight-400">{data.email}</p>
                      </div>
                    </div>
                    <div className="separator-x my-12"></div>
                    <div className="px-12">
                      <Link href={'/user/'+data.id+'?active=0'} className="text-decoration-none" onClick={()=>{closeDropDown('profile-div')}}>
                        <div className="flex items-center mb-16 cursor-pointer">
                          <Image height={10} width={11} src="/saveProfessorsIcon.svg" alt="savedProfessorIcon" />
                          <p className="text-weight-400 text-14 text-1F1F1F ml-12">Saved Professors</p>
                        </div>
                      </Link>
                      <Link href={'/user/'+data.id+'?active=1'} className="text-decoration-none" onClick={()=>{closeDropDown('profile-div')}}>
                        <div className="flex items-center mb-16 cursor-pointer">
                          <Image height={10} width={11} src="/ratingIcon.svg" alt="ratingIcon" />
                          <p className="text-weight-400 text-14 text-1F1F1F ml-12">My Ratings</p>
                        </div>
                      </Link>
                      <Link href={'/user/'+data.id+'?active=2'} className="text-decoration-none" onClick={()=>{closeDropDown('profile-div')}}>
                        <div className="flex items-center mb-16 cursor-pointer">
                          <Image height={10} width={11} src="/profileBlackIcon.svg" alt="profileBlackIcon" />
                          <p className="text-weight-400 text-14 text-1F1F1F ml-12">Profile Settings</p>
                        </div>
                      </Link>
                      <div className="flex items-center mb-16 cursor-pointer" onClick={()=>{logout()}}>
                        <Image height={10} width={11} src="/logoutIcon.svg" alt="logoutIcon" />
                        <p className="text-weight-400 text-14 text-1F1F1F ml-12">Logout</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)}
        {!token && (<div className="flex">
          <button
            className="cursor-pointer px-20 py-12 text-18 flex justify-center items-center bg-ffffff text-763FF9 border-color-763FF9 border-radius-4">
            Sign Up
          </button>

          <Link href="/login" className="text-decoration-none">
            <button
              className="cursor-pointer px-20 py-12 ml-12 text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4">
              Login
            </button>
          </Link>
        </div>)}
      </div>
    </nav>
  </>
}
