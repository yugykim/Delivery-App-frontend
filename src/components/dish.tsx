/** @format */

import React, { ReactNode } from 'react';
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
	removeFromOrder?: (dishId: number) => void;
	isSelected?: boolean;
  children?: ReactNode;
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
	removeFromOrder,
	isSelected = false,
	children,
}) => {
	const onClick = () => {
		if (orderStarted) {
			if (!isSelected && addDishesToOrder) {
				return addDishesToOrder(id);
			}
			if (isSelected && removeFromOrder) {
				return removeFromOrder(id);
			}
		}
	};
	return (
		<div
			onClick={onClick}
			className={`px-8 py-4 border cursor-pointer transition-all ${
				isSelected ? 'border-gray-800' : 'hover:border-gray-800'
			}`}>
			<div className='mb-5'>
				<h3 className='text-lg font-medium '>
					{name}{' '}
					{orderStarted && (
						<button onClick={onClick}>{isSelected ? 'Remove' : 'Add'}</button>
					)}
				</h3>
				<h4 className='font-medium'>{description}</h4>
			</div>
			<span>${price}</span>
			{isCustomer && options && options?.length !== 0 && (
				<div>
					<h5 className='mb-3 font-medium'>Dish Options:</h5>
					{children}
				</div>
			)}
		</div>
	);
};
