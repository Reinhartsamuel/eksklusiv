'use client';
import CardPost from '@/app/components/CardPost';
import { authFirebase } from '@/app/config/firebase';
import React from 'react';
import useFetchData from '@/app/hooks/queryHook';
import useCountDocuments from '@/app/hooks/countHook';
import InfiniteScroll from 'react-infinite-scroll-component';

const ChannelsComponent = () => {
  const { data, loadMore, fetchData, isFetchingMore, error } = useFetchData({
    collectionName: 'channels',
    conditions: [
      {
        field: 'channelOwnerUid', operator: '==',
        value: authFirebase.currentUser?.uid || ''
      }
    ],
    limitQuery: 10,
    dependencies: [authFirebase.currentUser?.uid],
    authRequired: true
  })


  const { count: channelsCount } = useCountDocuments({
    collectionName: 'payments',
    conditions: [
      {
        field: 'channelOwnerUid', operator: '==',
        value: authFirebase.currentUser?.uid || ''
      }
    ],
  })

  return (
    <div>
      {error && <p>Error: {error.message}</p>}
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
            <b>Ups, kamu belum punya channel!</b>
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
        {data.map((channel, i) => (
          <CardPost key={i} data={channel} />
        ))}
      </InfiniteScroll>
    </div>

  );
};

export default ChannelsComponent;