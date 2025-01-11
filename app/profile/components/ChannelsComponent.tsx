'use client';
import CardPost from '@/app/components/CardPost';
import { authFirebase } from '@/app/config/firebase';
import { getCollectionFirebase } from '@/app/utils/firebaseUtils';
import { Channel } from '@/types';
import React, { useEffect, useState } from 'react';

const ChannelsComponent = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async function () {
      try {
        const res = await getCollectionFirebase(
          'channels',
          [{ field: 'channelOwnerUid', operator: '==', value: authFirebase.currentUser?.uid || '' }],
          { field: 'createdAt', direction: 'desc' },
          10
        );
        setChannels(res);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          setError(error.message);
        }
      }
    })();
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {channels.map((channel, i) => (
        <CardPost key={i} data={channel} />
      ))}
    </div>
  );
};

export default ChannelsComponent;