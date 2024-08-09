'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getToken, getUserInfo } from '../services/JwtService';
import { AuthApi } from '../app/(auth)/AuthApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    setToken(token);
    const userInfoData = getUserInfo();
    if (userInfoData) {
      setUserInfo(JSON.parse(userInfoData));
    }
  }, []);

  const logout = () => {
    if (userInfo && userInfo.email) {
      AuthApi.logout({ email: userInfo.email }).then(() => {
        router.push('/login');
      });
    }
  };

  const closeDropDown = (parentClass) => {
    const dropdown = document.querySelector(parentClass);
    if (dropdown) {
      dropdown.style.display = 'none';
      setTimeout(() => {
        dropdown.style.display = 'block';
      }, 200);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <nav>
      <div style={{ height: '80px' }} className="px-160 flex justify-between items-center tablet-px-90 mobile-px-20">
        <Link href="/">
          <Image height={35} width={70} src="/KYP.png" alt="KYPIcon" />
        </Link>
        <div>
          {token && userInfo ? (
            <div className="profile-btn">
              <div className="bg-763FF9 border-radius-100 flex items-center justify-center cursor-pointer" onClick={toggleSidebar} style={{ width: '47px', height: '47px' }}>
                <Image height={20} width={16} src="/profileicon.svg" alt="profileicon" />
              </div>
              <div className="position-relative d-none d-sm-flex">
                <div className="z-3 profile-div" style={{ position: 'absolute', right: '0' }}>
                  <div className="nav-dropdown border-radius-8 pa-16 profile-dropdown mt-3">
                    <div className="flex column">
                      <div className="flex">
                        <div className="text-14 bg-D6C5FD border-radius-8 pa-10 text-uppercase flex items-center justify-center" style={{ minWidth: '42px' }}>
                          {userInfo?.first_name[0] + userInfo?.last_name[0]}
                        </div>
                        <div className="ml-8">
                          <p className="text-141414 text-weight-600 text-16 text-capitalize">
                            {userInfo?.first_name + ' ' + userInfo?.last_name}
                          </p>
                          <p className="text-8C8C8C text-12 text-weight-400">{userInfo?.email}</p>
                        </div>
                      </div>
                      <div className="separator-x my-12"></div>

                      <div className="px-12">
                        <Link href={`/user/${userInfo.id}?active=0`} className="text-decoration-none" onClick={() => {closeDropDown('.profile-div');}}>
                          <div className="flex items-center mb-16 cursor-pointer">
                            <Image height={10} width={11} src="/saveProfessorsIcon.svg" alt="savedProfessorIcon" />
                            <p className="text-weight-400 text-14 text-1F1F1F ml-12">Saved Professors</p>
                          </div>
                        </Link>
                        <Link href={`/user/${userInfo.id}?active=1`} className="text-decoration-none" onClick={() => {closeDropDown('.profile-div');}}>
                          <div className="flex items-center mb-16 cursor-pointer">
                            <Image height={10} width={11} src="/ratingIcon.svg" alt="ratingIcon" />
                            <p className="text-weight-400 text-14 text-1F1F1F ml-12">My Ratings</p>
                          </div>
                        </Link>
                        <Link href={`/user/${userInfo.id}?active=2`} className="text-decoration-none" onClick={() => {closeDropDown('.profile-div');}}>
                          <div className="flex items-center mb-16 cursor-pointer">
                            <Image height={10} width={11} src="/profileBlackIcon.svg" alt="profileBlackIcon" />
                            <p className="text-weight-400 text-14 text-1F1F1F ml-12">Profile Settings</p>
                          </div>
                        </Link>
                        <div className="flex items-center mb-16 cursor-pointer" onClick={logout}>
                          <Image height={10} width={11} src="/logoutIcon.svg" alt="logoutIcon" />
                          <p className="text-weight-400 text-14 text-1F1F1F ml-12">Logout</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="d-block d-sm-none">
                <Image height={20} width={20} src="/toggleSidebaricon.svg" alt="toggleSidebaricon" onClick={toggleSidebar} />
              </div>

              <div className="d-none d-sm-flex">

                <button onClick={() => {
                  router.push('/sign-up');
                }}
                        className="cursor-pointer px-20 py-12 text-18 flex justify-center items-center bg-ffffff text-763FF9 border-color-763FF9 border-radius-4">
                  Sign Up
                </button>

                <button onClick={() => {
                  router.push('/login');
                }}
                        className="cursor-pointer px-20 py-12 ml-12 text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4">
                  Login
                </button>
              </div>
            </div>

          )}
        </div>
      </div>
      {
        sidebarOpen && (<div className={`d-block d-sm-none sidebar  ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-content ">
            {/* Sidebar content goes here */}
            <div className="close-button" onClick={closeSidebar}>
              &times;
            </div>
            {token && userInfo ? (<div className="flex column">
              <div className="flex">
                <div className="text-14 bg-D6C5FD border-radius-8 pa-10 text-uppercase flex items-center justify-center" style={{ minWidth: '42px' }}>
                  {userInfo?.first_name[0] + userInfo?.last_name[0]}
                </div>
                <div className="ml-8">
                  <p className="text-141414 text-weight-600 text-16 text-capitalize">
                    {userInfo?.first_name + ' ' + userInfo?.last_name}
                  </p>
                  <p className="text-8C8C8C text-12 text-weight-400">{userInfo?.email}</p>
                </div>
              </div>
              <div className="separator-x my-12"></div>

              <div className="px-12">
                <Link href={`/user/${userInfo.id}?active=0`} className="text-decoration-none" onClick={closeSidebar}>
                  <div className="flex items-center mb-16 cursor-pointer">
                    <Image height={10} width={11} src="/saveProfessorsIcon.svg" alt="savedProfessorIcon" />
                    <p className="text-weight-400 text-14 text-1F1F1F ml-12">Saved Professors</p>
                  </div>
                </Link>
                <Link href={`/user/${userInfo.id}?active=1`} className="text-decoration-none" onClick={closeSidebar}>
                  <div className="flex items-center mb-16 cursor-pointer">
                    <Image height={10} width={11} src="/ratingIcon.svg" alt="ratingIcon" />
                    <p className="text-weight-400 text-14 text-1F1F1F ml-12">My Ratings</p>
                  </div>
                </Link>
                <Link href={`/user/${userInfo.id}?active=2`} className="text-decoration-none" onClick={closeSidebar}>
                  <div className="flex items-center mb-16 cursor-pointer">
                    <Image height={10} width={11} src="/profileBlackIcon.svg" alt="profileBlackIcon" />
                    <p className="text-weight-400 text-14 text-1F1F1F ml-12">Profile Settings</p>
                  </div>
                </Link>
                <div className="flex items-center mb-16 cursor-pointer" onClick={logout}>
                  <Image height={10} width={11} src="/logoutIcon.svg" alt="logoutIcon" />
                  <p className="text-weight-400 text-14 text-1F1F1F ml-12">Logout</p>
                </div>
              </div>
            </div> ) : (<div>
              <button onClick={() => {
                router.push('/sign-up');
              }}
                      className="cursor-pointer px-20 py-12 text-18 flex justify-center items-center bg-ffffff text-763FF9 border-color-763FF9 border-radius-4 mb-6">
                Sign Up
              </button>

              <button onClick={() => {
                router.push('/login');
              }}
                      className="cursor-pointer px-20 py-12 ml-12 text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4">
                Login
              </button>
            </div>)}


          </div>
        </div>)
      }

      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </nav>
  );
}
