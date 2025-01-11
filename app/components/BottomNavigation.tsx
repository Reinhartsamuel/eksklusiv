'use client';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { GoBell, GoHome, GoPerson } from 'react-icons/go';

const BottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    // <div className='btm-nav bg-red-200 w-full flex justify-around p-2 fixed bottom-0'>
    <div className='btm-nav'>
      <button
        onClick={() => router.push('/')}
        className={pathname === '/' ? 'active' : ''}
      >
        <GoHome size={25} />
        <span className='btm-nav-label text-xs'>Home</span>
      </button>
      {/* <button
        onClick={() => router.push('/recent')}
        className={pathname === '/recent' ? 'active' : ''}
      >
        <GoBell size={25} />
        <span className='btm-nav-label text-xs'>Recent</span>
      </button> */}
      <button
        onClick={() => router.push('/profile')}
        className={pathname === '/profile' ? 'active' : ''}
      >
        <GoPerson size={25} />
        <span className='btm-nav-label text-xs'>Profil</span>
      </button>
    </div>
  );
};

export default BottomNavigation;
