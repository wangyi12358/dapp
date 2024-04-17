import React from 'react';
import { Header } from '../header';

export interface LayoutProps {

}

export const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({ children }) => {
  return (
    <div className='flex flex-col w-full h-screen'>
      <Header />
      <div className='mx-auto w-4/5 max-w-[1200px] mt-4'>
        {children}
      </div>
    </div>
  );
};