'use client';
import { authFirebase } from '@/app/config/firebase';
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {getSingleDocumentFirebase, setDocumentFirebase } from '@/app/utils/firebaseUtils';

const provider = new GoogleAuthProvider();

const LoginComponent = () => {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(authFirebase, provider);
      console.log(res, 'res');
      const user = res.user;
      const findUser = await getSingleDocumentFirebase('users', user.uid);
      if (!findUser) {
        await setDocumentFirebase('users', user.uid, {
          uid: user.uid,
          email: user.email,
          username: '',
          photoURL: user.photoURL,
          name: user.displayName || null,
        })
      }
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
              Sign in to your account {authFirebase.currentUser?.email}
            </h1>
            <form className='space-y-4 md:space-y-6' action='#'>
              <div>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  placeholder='name@company.com'
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Password
                </label>
                <input
                  type='password'
                  name='password'
                  id='password'
                  placeholder='••••••••'
                  className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                />
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-start'>
                  <div className='flex items-center h-5'>
                    <input
                      id='remember'
                      aria-describedby='remember'
                      type='checkbox'
                      className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
                    />
                  </div>
                  <div className='ml-3 text-sm'>
                    <label
                      htmlFor='remember'
                      className='text-gray-500 dark:text-gray-300'
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href='#'
                  className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'
                >
                  Forgot password?
                </a>
              </div>
              <button
                type='submit'
                className='w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600'
              >
                Sign in
              </button>
              <div className='relative my-4 flex w-full items-center text-xs uppercase text-slate-900'>
                <div className='w-full flex h-0 border-[0.5px] border-slate-300' />
                <span className='bg-background wrap-no-wrap px-2 text-muted-foreground whitespace-nowrap'>
                  Login with google
                </span>
                <div className='w-full flex h-0 border-[0.5px] border-slate-300' />
              </div>

              <button
                onClick={handleLogin}
                className={`w-full flex items-center justify-center gap-2 px-8 py-2 h-11 border-[1px] border-slate-300 bg-white text-slate-800 text-sm rounded-md font-semibold`}
              >
                {loading ? (
                  <span className='loading loading-dots loading-lg'></span>
                ) : (
                  <>
                    <FcGoogle size={30} />
                    <p>Google</p>
                  </>
                )}
              </button>
              <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                Don’t have an account yet?{' '}
                <a
                  href='#'
                  className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginComponent;
