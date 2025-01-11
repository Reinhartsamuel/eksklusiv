'use client';

import React, { useEffect, useState } from 'react';
import ChannelsComponent from './components/ChannelsComponent';
import LoginComponent from './components/LoginComponent';
import NotificationsComponent from './components/NotificationsComponent';
import { authFirebase } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { MdLogout } from 'react-icons/md';

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('channels');


  useEffect(() => {
    onAuthStateChanged(authFirebase, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    })
  }, []);

  return (
    <div className='min h-screen'>
      {!isLoggedIn ? (
        <LoginComponent />
      ) : (
        <>
          <img
            alt=''
            id='profile-banner'
            className='w-full h-1/3 object-cover'
            src={
              'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
            }
          />
          <img
            src={authFirebase.currentUser?.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'}
            className='rounded-full w-[8rem] h-[8rem] translate-x-[30px] -translate-y-[40px] border-4 border-white'
          />
          <div className='px-5'>
            <div className='-translate-y-[30px] block'>
              <div className="flex justify-between">
                <p className='font-bold text-2xl tracking-light font-mono'>
                  {authFirebase.currentUser?.displayName}
                  <span className='badge bg-orange-50 font-sans'>🔥 15.2K</span>
                </p>
                {isLoggedIn && <button className='btn' onClick={async () => {
                  await authFirebase.signOut()
                }}><MdLogout /></button>}
              </div>
              <p className='mt-5'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
                facilis enim consequuntur eligendi cupiditate. Ad, quibusdam
                quas soluta debitis eos itaque enim error impedit numquam! Iusto
                accusantium quidem minima obcaecati!
              </p>
              <span className='mt-10 badge w-full bg-red-100 text-red-500 text-sm lg:text-lg'>
                🔥 Lebih dari 200 orang menyukai host ini
              </span>
            </div>
          </div>
          <div role='tablist' className='tabs tabs-lifted'>
            <a
              role='tab'
              className={`tab ${activeTab === 'channels' ? 'tab-active' : ''} font-bold`}
              onClick={() => setActiveTab('channels')}
            >
              Channels
            </a>
            <a
              role='tab'
              className={`tab ${activeTab === 'notifications' ? 'tab-active' : ''
                } font-bold`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </a>
            {/* <a
              role='tab'
              className={`tab ${activeTab === 'gatau' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('gatau')}
            >
              tab apa?
            </a> */}
          </div>
          <div className='px-0 lg:px-5 mt-5'>
            {activeTab === 'channels' && <ChannelsComponent />}
            {activeTab === 'notifications' && <NotificationsComponent />}
            {/* {activeTab === 'gatau' && <p>gatau!!!!!!!!!!!!!!!!!!</p>} */}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;

