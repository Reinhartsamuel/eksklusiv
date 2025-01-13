/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState, ChangeEvent } from 'react';
import telegram_logo from '../../../public/Telegram_logo.svg';
import pricetag from '../../../public/pricetag.png';
import Image from 'next/image';
import { FaMapMarkerAlt, FaRegCopy } from 'react-icons/fa';
import { copyTextToClipboard } from '@/app/utils/copyTextToClipboard';
import Swal from 'sweetalert2';
import { addDocumentFirebase, getSingleDocumentFirebase } from '@/app/utils/firebaseUtils';
import { priceFormat } from '@/app/utils/priceFormat';
import { MdClose } from 'react-icons/md';
import GalleryMediaItem from '@/app/profile/components/GalleryMediaItem';
import { DocumentData } from 'firebase/firestore';
import { authFirebase } from '@/app/config/firebase';
import { Channel } from '@/types';



const IMAGES_VIDS = [
  'https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/eksklusiv%2F1.mp4?alt=media&token=41204c06-286c-441f-8cba-680ee09aef3b',
  'https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/2.webp',
  'https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/3.webp',
  'https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/4.webp',
  'https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/5.webp',
  'https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/eksklusiv%2F6.mp4?alt=media&token=0c9ecd1c-3a65-49bd-b69d-000e1b8979d8'
]



const ProfilePage = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [uploading, setUploading] = useState(false);
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    userWhatsapp: '',
    userTelegram: '',
    receiptUrl: ''
  });
  const [channelData, setChannelData] = useState<Channel | DocumentData>({} as Channel);
  const [urlToShow, setUrlToShow] = useState('');

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    setUploading(true);
    // console.log(e.target.files[0], 'this is filesss');
    try {
      const formData = new FormData();
      if (e.target.files && e.target.files.length > 0) {
        formData.append('file', e.target.files[0]);

        const res = await fetch('https://byscript-aceternity.vercel.app/api/upload/aws', {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        console.log(result, 'result');
        setInputs({ ...inputs, receiptUrl: result.url });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message, '::::errorrr!!!');
        Swal.fire('Error', error.message, 'error');
      }
    } finally {
      setUploading(false);
    }
  }

  function onClickMedia(url: string) {
    setUrlToShow(url);
    const modal = document.getElementById(
      'photos_modal'
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    } else {
      console.error('Modal element not found');
    }
  }

  async function onSubmit() {
    // return console.log(inputs)
    if (!inputs.name) return Swal.fire('Kamu belum mengisi nama kamu!', '', 'warning');
    if (!inputs.email) return Swal.fire('Kamu belum mengisi email kamu!', '', 'warning');
    if (!inputs.userWhatsapp) return Swal.fire('Kamu belum mengisi Whatsapp kamu!', '', 'warning');
    if (!inputs.userTelegram) return Swal.fire('Kamu belum mengisi Telegram kamu!', '', 'warning');
    if (!inputs.receiptUrl) return Swal.fire('Isi semua data, ya!', 'Kamu harus upload bukti bayar berlangganan', 'warning');

    try {
      // return console.log(inputs)
      const saveData = {
        ...inputs,
        accountHolder: channelData.accountHolder,
        accountNumber: channelData.accountNumber,
        amount: channelData?.discountedPrice || channelData.price,
        channelOwnerUid: channelData.channelOwnerUid,
        channelOwnerName: channelData.channelOwnerName,
        channelOwnerEmail: channelData.channelOwnerEmail,
        channelName: channelData.channelName,
        channelTelegram: channelData.telegram,
        uid: authFirebase.currentUser?.uid || null,
        userAvatar: authFirebase.currentUser?.photoURL || null,
        status: 'PENDING'
      };
      console.log(saveData, 'saveData');
      await addDocumentFirebase('payments', saveData, 'eksklusiv');


      const xx = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: channelData.channelOwnerName,
          email: channelData.channelOwnerEmail,
          subject: `${inputs.name} membayar Rp ${priceFormat(saveData.amount)} untuk ${channelData.name}`,
          htmlContent: `<p>${inputs.name} membayar Rp ${priceFormat(saveData.amount)} untuk Pembayaran Channel ${saveData.channelName} </p>
                <br />
             <p>Nama : ${saveData.name}</p> <br/>
             <p>Email : ${saveData.email}</p> <br/>
             <p>Whatsapp : ${saveData.name}</p> <br/>
             <p>Username Telegram : ${saveData.userTelegram}</p> <br/>
             <p>Jumlah pembayaran : ${saveData.userWhatsapp}</p> <br/>
             <p>Receipt</p> <br/>
                <img
          src="${inputs.receiptUrl}"
          width="45%"
          style="padding:0;background-color:white;"
        />
                `,
          bcc: [
            { name: 'Reinhart', email: 'reinhartsams@gmail.com' },
          ],
        }),
      });
      const resEmail = await xx.json();
      console.log('resEmail', resEmail)
    
      Swal.fire({
        icon: 'success',
        title: 'Pembayaran kamu sedang diproses',
        text: 'Admin akan segera mengonfirmasi pembayaranmu. Invite link akan dikirimkan setelah pembayaran dikonfirmasi.',
        showConfirmButton: true,
        confirmButtonText : 'Tutup'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      }
    }
  }

  useEffect(() => {
    // get inputs
    async function fetchData() {
      try {
        const result = (await getSingleDocumentFirebase('channels', id));
        // Type assertion to ensure result is of type ChannelData
        if (result && typeof result !== 'string') { // Assuming error messages are returned as strings
          const channelData = result; // Type assertion
          console.log(channelData, 'channelData');
          setChannelData(channelData);
        } else {
          console.error('Error fetching channel data:', result);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
    fetchData();
  }, []);


  return (
    <div className='min h-screen mb-[100rem]'>
      <img
        alt='banner'
        id='profile-banner'
        className='w-full h-1/2 object-cover'
        src={
          channelData.banner || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
        }
      />
      <img
        alt='avatar'
        src={channelData.avatar || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
        className='rounded-full w-[8rem] h-[8rem] translate-x-[30px] -translate-y-[40px] border-4 border-white'
      />
      <div className='px-5'>
        <div className='-translate-y-[30px] block'>
          <p className='font-bold text-2xl tracking-light font-mono'>
            {channelData.name}
            <span className='badge bg-orange-50 font-sans'>🔥 15.2K</span>
          </p>
          <div className='flex items-center'>
            {channelData.telegram && (
              <span className='badge  bg-blue-50'>
                <Image
                  alt='telegram'
                  src={telegram_logo}
                  width={20}
                  height={20}
                />
                <p>Telegram</p>
              </span>
            )}
            <span className='badge'>
              <FaMapMarkerAlt />
              <p>Jakarta</p>
            </span>
          </div>
          <p className='mt-5'>
            {channelData.description}
          </p>
          <span className='mt-10 badge w-full bg-red-100 text-red-500 text-sm lg:text-lg'>
            🔥 Lebih dari 200 orang menyukai host ini
          </span>
        </div>
        {/* <CardPost /> */}
        {/* CAROUSELL */}

        <div className='grid grid-cols-3 gap-2'>
          {IMAGES_VIDS.map((url, index) => (
            <GalleryMediaItem key={index} url={url} onClickMedia={onClickMedia} />
          ))}
        </div>
        <a
          href='#payment'
          className='btn rounded-full w-full mt-10 bg-primary text-white text-xl'
        >
          Join Sekarang!!
        </a>

        <div className='w-full relative'>
          <Image src={pricetag} alt='price' className='w-full' />
          <div className='absolute w-full font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
            {channelData.discountedPrice && <p className=' text-lg lg:text-3xl line-through text-black decoration-red-200'>
              Rp {priceFormat(channelData.price)}
            </p>}
            <p className='text-3xl lg:text-5xl text-white text-'>Rp {priceFormat(channelData?.discountedPrice || channelData.price)}</p>
          </div>
        </div>

        <div
          id='payment'
          className='mt-10 flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 border-dashed p-5'
        >
          <p>Silakan melakukan transfer Ke Nomor Rekening Berikut ini:</p>
          <img
            src='https://buatlogoonline.com/wp-content/uploads/2022/10/Logo-BCA-PNG.png'
            className='w-20'
          />
          <p className='font-bold text-gray-800 text-sm'>BCA</p>
          <div className='flex items-center'>
            <p className='font-bold text-2xl'>{channelData.accountHolder}</p>
          </div>
          <div className='flex items-center'>
            <p className='font-light text-xl'>{channelData.accountNumber}</p>
            <button
              onClick={() => copyTextToClipboard('6800838582')}
              className='ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 text-gray-700 bg-gray-100 hover:bg-gray-100 focus:ring-gray-300 font-small rounded-lg text-sm px-2 py-2.5 me-2 mb-2'
            >
              <FaRegCopy size={20} />
            </button>
          </div>
          <div className='flex items-center'>
            <p className='font-bold text-6xl'>Rp {priceFormat(channelData?.discountedPrice || channelData.price)}</p>
            <button
              onClick={() => copyTextToClipboard(String(channelData?.discountedPrice || channelData.price))}
              className='ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 text-gray-700 bg-gray-100 hover:bg-gray-100 focus:ring-gray-300 font-small rounded-lg text-sm px-2 py-2.5 me-2 mb-2'
            >
              <FaRegCopy size={20} />
            </button>
          </div>
        </div>
        <div className='flex flex-col gap-0 bg-gray-100 mt-10 p-2 rounded-md'>
          <div className='w-full flex flex-col items-center justify-center'>
            <label className='inputs-control w-full'>
              <div className='label'>
                <span className='label-text'>Nama</span>
              </div>
              <input
                name='name'
                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                type='text'
                placeholder='Masukkan nama kamu'
                className='input input-bordered border-2 w-full'
              />
            </label>
          </div>
          <div className='w-full flex flex-col items-center justify-center'>
            <label className='inputs-control w-full'>
              <div className='label'>
                <span className='label-text'>Email</span>
              </div>
              <input
                name='email'
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                type='text'
                placeholder='Masukkan email kamu'
                className='input input-bordered w-full'
              />
            </label>
          </div>
          <div className='w-full flex flex-col items-center justify-center'>
            <label className='inputs-control w-full'>
              <div className='label'>
                <span className='label-text'>Whatsapp</span>
              </div>
              <input
                name='whatsapp'
                onChange={(e) => setInputs({ ...inputs, userWhatsapp: e.target.value })}
                type='text'
                placeholder='Nomor Whatsapp'
                className='input input-bordered w-full'
              />
            </label>
          </div>
          <div className='w-full flex flex-col items-center justify-center'>
            <label className='inputs-control w-full'>
              <div className='label'>
                <span className='label-text'>Telegram</span>
              </div>
              <input
                name='telegram'
                onChange={(e) => setInputs({ ...inputs, userTelegram: e.target.value })}
                type='text'
                placeholder='Username Telegram'
                className='input input-bordered w-full'
              />
            </label>
          </div>
          <div className='flex justify-center mt-5'>
            <p className='font-bold text-gray-800 text-sm'>
              {uploading ? 'Uploading...' : 'Payment Receipt / bukti transfer'}
            </p>
            {uploading && (
              <span className='loading loading-dots loading-md'></span>
            )}
          </div>


          {inputs?.receiptUrl ? (
            <div className='flex w-full justify-center'>
              <img src={inputs.receiptUrl} className='w-3/4' />
            </div>
          ) : (
            <div className='flex items-center justify-center w-full'>
              <label
                htmlFor='dropzone-file'
                className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100'
              >
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <svg
                    className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 16'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                    />
                  </svg>
                  <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                    <span className='font-semibold'>Click to upload</span> or
                    drag and drop
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    SVG, PNG, or JPG
                  </p>
                </div>
                <input
                  id='dropzone-file'
                  type='file'
                  className='hidden'
                  onChange={handleUpload}
                />
              </label>
            </div>
          )}
          <button className='btn btn-primary text-white' onClick={onSubmit}>Submit</button>
        </div>
      </div>
      {/* MODAL */}
      {/* <dialog id='photos_modal' className='modal w-full h-screen px-0 m-0'>
        <div className='modal-box'>
          <img src={urlToShow} className='w-full' />
          <div className="modal-action">
            <form method="dialog">

              <button className=""><MdClose /></button>
            </form>
          </div>
        </div>
      </dialog> */}
      <dialog id='photos_modal' className='modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80'>
        <div className='modal-box w-full h-full p-0'>
          {urlToShow?.includes('.mp4') ?
            <video
              className="w-full max-w-lg rounded-lg object-cover"
              autoPlay
              loop
            >
              <source src={urlToShow} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            :
            <img src={urlToShow} className='w-full h-full object-cover' />
          }

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-sm absolute top-4 right-4" onClick={() => {
                const modal = document.getElementById('photos_modal') as HTMLDialogElement | null;
                if (modal) {
                  modal.close();
                  setUrlToShow('');
                }
              }}>
                <MdClose />
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProfilePage;
