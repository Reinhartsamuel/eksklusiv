import { Channel } from '@/types';
import Link from 'next/link';
import React from 'react';


interface CardPostProps {
  data: Channel
}
const CardPost = ({ data }: CardPostProps) => {
  return (
    <Link
      href={`p/${data.id}`}
    >
      <div className="flex flex-col border border-gray-200 rounded-lg mx-2 lg:mx-5">
        <figure>
          <img
            className='w-full object-cover -z-2 aspect-video'
            src={data.banner || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
            alt='Shoes'
          />
        </figure>
        <div className='flex p-4 '>
          <p className='text-clip'>
            <strong className='text-2xl'>{data.channelName}</strong> {data.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CardPost;