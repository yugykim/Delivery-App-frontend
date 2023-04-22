/** @format */

import React from 'react';
import { Link } from 'react-router-dom';

interface ICategoryProps {
	coverImage: string | null;
	name: string;
  slug:string;
}

export const Category: React.FC<ICategoryProps> = ({
	coverImage,
	name,
  slug
}) => (
	<Link to={`/category/${slug}`}>
		<div className='flex flex-col'>
			<div
				style={{
					backgroundImage: `url(${coverImage})`,
				}}
				className='bg-cover bg-center mb-3 py-28'></div>
			<h3 className='text-xl'>{name}</h3>
		</div>
	</Link>
);
