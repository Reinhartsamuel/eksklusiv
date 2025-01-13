/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';
import { authFirebase } from '@/app/config/firebase';
import useFetchData from '../../hooks/queryHook';
import { updateDocumentFirebase } from '@/app/utils/firebaseUtils';
import { priceFormat } from '@/app/utils/priceFormat';
import { Payments } from '@/types';
import moment from 'moment';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import useCountDocuments from '@/app/hooks/countHook';



const NotificationsComponent = () => {
  // const [payments, setPayments] = useState<Payments[] | Error | null>([]);
  const [detail, setDetail] = useState({} as Payments);
  const [loading, setLoading] = useState(false);

  const { data: payments, loadMore, fetchData, isFetchingMore } = useFetchData({
    collectionName: 'payments',
    conditions: [
      {
        field: 'channelOwnerUid', operator: '==',
        value: authFirebase.currentUser?.uid || ''
      }
    ],
    limitQuery: 10
  })


  const { count: notificatioNCount } = useCountDocuments({
    collectionName: 'payments',
    conditions: [
      {
        field: 'channelOwnerUid', operator: '==',
        value: authFirebase.currentUser?.uid || ''
      }
    ],
  })
  function openDetail(data: Payments) {
    setDetail(data);
    (document.getElementById('detail_modal') as HTMLDialogElement).showModal()
  };

  async function handleApprove(arg: boolean) {
    if (authFirebase.currentUser?.uid !== detail.channelOwnerUid)
      return console.log('you are not the owner!')
    setLoading(true);
    try {
      await updateDocumentFirebase('payments', detail.id, { status: arg ? 'PAID' : 'REJECTED' });
      const resEmail = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: authFirebase.currentUser?.displayName,
          email: authFirebase.currentUser?.email,
          subject: `Pembayaran Channel ${detail.channelName} ${arg ? 'berhasil di-approve' : 'ditolak'}`,
          htmlContent: `Pembayaran Channel ${detail.channelName} ${arg ? 'berasil di-approve' : 'ditolak'} 
          Klik link di bawah untuk masuk ke grup telegram:
          <a href="${detail?.channelTelegram}">${detail?.channelTelegram}</a>
          
          `,
          bcc: [
            { name: 'Reinhart', email: 'reinhartsams@gmail.com' },
          ],
        }),
      });
      const res = await resEmail.json();
      console.log(res, 'res');
      (document.getElementById('detail_modal') as HTMLDialogElement).close()
      // fetchData();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: `Pembayaran ${detail.name}` + (arg ? 'berhasil di-approve' : 'ditolak'),
      })
    } catch (error) {
      (document.getElementById('detail_modal') as HTMLDialogElement).close()
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: (error as Error).message,
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <InfiniteScroll
        dataLength={notificatioNCount} //This is important field to render the next data
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
            <b>Tidak ada data baru</b>
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
        {Array.isArray(payments) && payments.map((x, i) => (
          <div
            key={i}
            onClick={() => openDetail(x)}
            className='flex w-full justify-between border-b border-gray-200 cursor-pointer hover:bg-gray-100 p-4 lg:p-5 active:scale-95 transition-ease 1s'
          >
            <div className='flex flex-row items-center gap-2'>
              <img src={x.userAvatar || 'https://liccar.com/wp-content/uploads/png-transparent-head-the-dummy-avatar-man-tie-jacket-user-768x768.png'} className='w-10 h-10 rounded-full' />
              <div className='flex flex-col'>
                <p className='text-xs lg:text-sm text-gray-600'>
                  <span className='font-bold text-gray-900'>{x.name}</span>{' '}
                   membayar Rp {priceFormat(x.amount)} untuk channel {x?.channelName}

                </p>

                <div className='flex gap-2'>
                  <p className='text-sm text-gray-600'> {moment(x.createdAt.toDate()).fromNow()}</p>
                  <span
                    className={
                      clsx("font-bold me-2 px-1 py-0.5 rounded text-xs w-fit",
                        x.status === 'PAID' ?
                          'bg-green-100 text-green-800' :
                          'bg-pink-100 text-pink-800'
                          )
                    }>
                    {x.status}
                  </span>
                </div>

              </div>

            </div>

            <div className='min-w-[100px] flex justify-end'>
              <img src={x.receiptUrl || 'https://liccar.com/wp-content/uploads/png-transparent-head-the-dummy-avatar-man-tie-jacket-user-768x768.png'} className='w-20 aspect-square rounded-sm object-contain border-[1px] border-gray-200' />
            </div>
          </div>
        ))}
      </InfiniteScroll>





      <dialog id="detail_modal" className="modal">
        <div className="modal-box w-full max-w-2xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Pembayaran untuk channel {detail.channelName}!</h3>
          <p className="">Nama: <span className='font-bold'>{detail.name}</span> </p>
          <p className="">Emai: <span className='font-bold'>{detail.email}</span></p>
          <p className="">Telegram: <span className='font-bold'>{detail.userTelegram}</span></p>
          <p className="">Whatsapp: <span className='font-bold'>{detail.userWhatsapp}</span></p>
          <img
            src={detail.receiptUrl || 'https://liccar.com/wp-content/uploads/png-transparent-head-the-dummy-avatar-man-tie-jacket-user-768x768.png'}
            className='w-full aspect-square rounded-sm object-contain border-[1px] border-gray-200'
          />

          <div className='flex items-center gap-3 w-full justify-end mt-5'>
            {loading ?
              <span className="loading loading-dots loading-lg"></span> :
              <button className={clsx('btn btn-primary text-white',
                detail.status === 'PAID' && 'btn-disabled'
              )} disabled={detail.status === 'PAID'} onClick={() => handleApprove(true)}>Approve</button>
            }
            {loading ?
              <span className="loading loading-dots loading-lg"></span> :
              <button className='btn btn-error text-white' onClick={() => handleApprove(false)}>Deny</button>}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </div>
  );
};

export default NotificationsComponent;

