/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import CardPost from './components/CardPost';
import { getCollectionFirebase } from './utils/firebaseUtils';

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
    <>
      {results?.map((channel, i) => (
        <CardPost data={channel} key={i} />
      ))}
    </>
  );
}
