/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';
import { authFirebase } from '@/app/config/firebase';
import { getCollectionFirebase, updateDocumentFirebase } from '@/app/utils/firebaseUtils';
import { priceFormat } from '@/app/utils/priceFormat';
import { Payments } from '@/types';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


const NotificationsComponent = () => {
  const [payments, setPayments] = useState<Payments[] | Error | null>([]);
  const [detail, setDetail] = useState({} as Payments);
  const [loading, setLoading] = useState(false);


  function openDetail(data: Payments) {
    setDetail(data);
    (document.getElementById('detail_modal') as HTMLDialogElement).showModal()
  };

  async function handleApprove(arg: boolean) {
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
      fetchData();
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

  async function fetchData() {
    try {
      if (authFirebase.currentUser?.uid) {
        const res = await getCollectionFirebase('payments', [{
          field: 'channelOwnerUid',
          operator: '==',
          value: authFirebase.currentUser?.uid
        }])
        setPayments(res);
        console.log(res, 'res');
      }
    } catch (error: unknown) {
      if (error instanceof Error)
        console.log(error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='flex flex-col gap-2'>
      {Array.isArray(payments) && payments.map((x, i) => (
        <div
          key={i}
          onClick={() => openDetail(x)}
          className='flex w-full justify-between border-b border-gray-200 cursor-pointer hover:bg-gray-100 p-4 lg:p-5 active:scale-95 transition-ease 1s'
        >
          <div className='flex flex-row items-center gap-2'>
            <img src={x.userAvatar || 'https://liccar.com/wp-content/uploads/png-transparent-head-the-dummy-avatar-man-tie-jacket-user-768x768.png'} className='w-10 h-10 rounded-full' />
            <p className='text-xs lg:text-sm text-gray-600'>
              <span className='font-bold text-gray-900'>{x.channelName}</span>{' '}
              {x.name} membayar Rp {priceFormat(x.amount)} untuk channel {x?.channelName}
              <span className='text-sm text-gray-600'> {moment(x.createdAt.toDate()).fromNow()}</span>
            </p>
            {
              x.status !== 'PAID' ? <div className="badge badge-xs badge-error">{x.status}</div> :
                <div className="badge badge-xs badge-secondary">PAID</div>
            }
          </div>

          <div className='min-w-[100px] flex justify-end'>
            <img src={x.receiptUrl || 'https://liccar.com/wp-content/uploads/png-transparent-head-the-dummy-avatar-man-tie-jacket-user-768x768.png'} className='w-20 aspect-square rounded-sm object-contain border-[1px] border-gray-200' />
          </div>
        </div>
      ))}
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
              <button className='btn btn-primary text-white' onClick={() => handleApprove(true)}>Approve</button>}
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

