import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import BottomNavigation from './components/BottomNavigation';
import HeaderComponent from './profile/components/HeaderComponent';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});


const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Eksklusiv',
  description: 'Monetize your digital presence with Eksklusiv',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen flex flex-col items-center`}
      >
        <HeaderComponent />
        <div className='max-w-xl w-full min-h-[110vh] overflow-y-scroll  bg-white'>
          {children}
        </div>
        <div className='w-full h-[5rem] bg-white flex items-center justify-center'></div>
          <BottomNavigation />
      </body>
    </html>
  );
}
