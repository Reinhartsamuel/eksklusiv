import Image from 'next/image';
import React from 'react';

const HeaderComponent = () => {
  return (
    <div className='max-w-xl w-full h-[3rem] lg:h-[5rem] bg-white flex items-center justify-center border-b border-gray-200'>
      <Image width={150} height={80} src='/eksklusiv_logo.png' alt='logo' />
    </div>
  );
};

export default HeaderComponent;
