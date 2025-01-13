/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import CardPost from './components/CardPost';
import { getCollectionFirebase } from './utils/firebaseUtils';
import { IoIosSearch } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";

export default function Home() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await getCollectionFirebase('channels', [], { field: 'createdAt', direction: 'desc' }, 10);
        setResults(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchResults();
  }, [])
  return (
    <div className=''>
      <div className='border-b-2 border-gray-200 mb-10 py-2 flex w-full h-[5rem] justify-around items-center'>
        <label className="input w-[20rem] input-bordered flex items-center gap-1">
          <input type="text" className="grow" placeholder="Search" />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
        <IoIosSearch size={20} />
        <IoChatbubbleOutline size={20} />
      </div>
      {results?.map((channel, i) => (
        <CardPost data={channel} key={i} />
      ))}
    </div>
  );
}
