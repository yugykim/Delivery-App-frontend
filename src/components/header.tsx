/** @format */

import React from 'react';
import { useMe } from '../hooks/useMe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInVar } from '../apollo';
import { Button } from './button';

export const Header: React.FC = () => {
	const { data } = useMe(); //go to cache, avoid passing props
	const isLoggedIn = useReactiveVar(isLoggedInVar);
	return (
		<>
			{/*       {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-xs">
          <span role={"alert"}>Please verify your email.</span>  
        </div>
      )} */}
			<header className='py-5 bg-rose-600 flex justify-center'>
				<div className='w-4/5 flex justify-between'>
					<Link to='/'>
						<h1 className='font-bold text-4xl text-white'>Here You Go</h1>
					</Link>
					<span className='text-xs text-white mr-5'>
						{isLoggedIn ? (
							<Link to='/edit-profile'>
								<FontAwesomeIcon
									icon={faUser}
									className='text-xl'
								/>
							</Link>
						) : (
							<Link to='/login'>
								<button
									className={`text-lg font-medium text-white py-2 px-8 transition-colors border border-orange-300`}>
									Log in
								</button>
							</Link>
						)}
					</span>
				</div>
			</header>
		</>
	);
};
