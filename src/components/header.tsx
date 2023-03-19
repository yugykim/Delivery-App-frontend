import React from 'react';
import logo from '../imges/logo.svg';
import { useMe } from '../hooks/useMe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


export const Header:React.FC = () => {
  const { data } = useMe(); //go to cache, avoid passing props
  console.log(data);
  return (
    <>
{/*       {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-xs">
          <span role={"alert"}>Please verify your email.</span>  
        </div>
      )} */}
      <header className='py-4 bg-rose-600'>
        <div className='w-full px-5 xl:px-0 max-w-screen-2xl mx-auto  items-center flex justify-between'>
          <h1 className='w-24 font-bold'>Here You Go</h1>
          <span className='text-xs'>
            <Link to='/edit-profile'>
              <FontAwesomeIcon icon={faUser} className='text-xl'/>
            </Link>
          </span>
        </div>
      </header>
    </>
  ); 
};