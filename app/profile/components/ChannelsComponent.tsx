'use client';
import CardPost from '@/app/components/CardPost';
import { authFirebase } from '@/app/config/firebase';
import { getCollectionFirebase } from '@/app/utils/firebaseUtils';
import { Channel } from '@/types';
import React, { useEffect, useState } from 'react';
import useFetchData from '@/app/hooks/queryHook';
import useCountDocuments from '@/app/hooks/countHook';
import InfiniteScroll from 'react-infinite-scroll-component';

const ChannelsComponent = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data, loadMore, fetchData, isFetchingMore } = useFetchData({
    collectionName: 'payments',
    conditions: [
      {
        field: 'channelOwnerUid', operator: '==',
        // value: authFirebase.currentUser?.uid || ''
        value: 'PdSj1xK3K7WjlOi9QtiCJR629qN2'
      }
    ],
    limitQuery: 10
  })


  const { count: channelsCount } = useCountDocuments({
    collectionName: 'payments',
    conditions: [
      {
        field: 'channelOwnerUid', operator: '==',
        // value: authFirebase.currentUser?.uid || ''
        value: 'PdSj1xK3K7WjlOi9QtiCJR629qN2'
      }
    ],
  })


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
      <InfiniteScroll
        dataLength={channelsCount} //This is important field to render the next data
        next={() => {
          console.log('load more');
          loadMore();
        }}
        hasMore={true}
        loader={
          isFetchingMore &&
          <div className='w-full flex justify-center'>
            <span className="loading loading-ring loading-md"></span>
          </div>
        }
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Ups, kamu belum punya channel! <span><a href='/'>Buat sekarang</a></span></b>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={fetchData}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
      >
        {channels.map((channel, i) => (
          <CardPost key={i} data={channel} />
        ))}
      </InfiniteScroll>
    </div>

  );
};

export default ChannelsComponent;