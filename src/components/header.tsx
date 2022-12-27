import React from 'react';
import logo from '../imges/logo.svg';

export const Header = () => (
  <header className='bg-red-500 py-4'>
    <div className='w-full max-w-screen-xl bg-yellow-500 mx-auto'>
      <img src={logo} className='w-40 mb-10' alt='Nuber Eats'/>
      im the header
    </div>
  </header>
);