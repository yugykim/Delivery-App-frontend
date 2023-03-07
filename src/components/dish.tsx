/** @format */

import React from 'react';
import { restaurant_restaurant_restaurant_menu_options } from '../gql/restaurant';

interface IDishProps {
	id?: number;
	description: string;
	name: string;
	price: number;
	isCustomer?: boolean;
	orderStarted?: boolean;
	options?: restaurant_restaurant_restaurant_menu_options[] | null;
	addDishesToOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
	id = 0,
	description,
	name,
	price,
	orderStarted = false,
	isCustomer = false,
	options,
	addDishesToOrder,
}) => {
	return (
		<div
			onClick={() =>
				orderStarted && addDishesToOrder ? addDishesToOrder(id) : null
			}
			className=' px-8 py-4 border cursor-pointer hover:border-gray-800 transition-all '>
			<div className='mb-5'>
				<h3 className='text-lg font-medium '>{name}</h3>
				<h4 className='font-medium'>{description}</h4>
			</div>
			<span>${price}</span>
			{isCustomer && options && options?.length !== 0 && (
				<div>
					<h5 className='mb-3 font-medium'>Dish Options:</h5>
					{options?.map((options, index) => (
						<span
							className='flex items-center'
							key={index}>
							<h6 className='mr-2'>{options.name}</h6>
							<h6 className='text-sm opacity-75'>(${options.extra})</h6>
						</span>
					))}
				</div>
			)}
		</div>
	);
};
