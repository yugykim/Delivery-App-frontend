/** @format */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	CATEGORY_FRAGMENT,
	DISH_FRAGMENT,
	RESTAURANT_FRAGMENT,
} from '../../fragments';
import { gql, useQuery } from '@apollo/client';
import { restaurant, restaurantVariables } from '../../gql/restaurant';
import { Dish } from '../../components/dish';
import { Helmet } from 'react-helmet-async';
import { CreateOrderItemInput } from '../../gql/graphql';

const RESTAURANT_QUERY = gql`
	query restaurant($input: RestaurantInput!) {
		restaurant(input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
				menu {
					...DishParts
				}
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

export const Restaurant = () => {
	const params = useParams();
	const id = params.id!;
	const { loading, data } = useQuery<restaurant, restaurantVariables>(
		RESTAURANT_QUERY,
		{
			variables: {
				input: {
					restaurantId: +id,
				},
			},
		}
	);
	const [orderStarted, setOrderStarted] = useState(false);
	const [orderDishes, setOrderDishes] = useState<CreateOrderItemInput[]>([]);
	const triggerStartOrder = () => {
		setOrderStarted(true);
	};
	const addItemOrder = (dishId: number) => {
    setOrderDishes((current) => [{dishId, options: null}])
  }
	return (
		<div>
			<Helmet>
				<title>{data?.restaurant.restaurant?.name || ''} | Uber eat</title>
			</Helmet>
			<div
				className=' bg-gray-800 bg-center bg-cover py-48'
				style={{
					backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
				}}>
				<div className='bg-white w-3/12 py-8 pl-10'>
					<h4 className='text-3xl mb-3'>{data?.restaurant.restaurant?.name}</h4>
					<h5 className='text-sm font-light mb-2'>
						{data?.restaurant.restaurant?.category?.name}
					</h5>
					<h6 className='text-sm font-light'>
						{data?.restaurant.restaurant?.address}
					</h6>
				</div>
			</div>
			<div className='container pb-32 flex flex-col items-end mt-20'>
				<button
					onClick={triggerStartOrder}
					className='btn px-10'>
					Start order
				</button>
				<div className='w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10'>
					{data?.restaurant.restaurant?.menu.map((dish, index) => (
						<Dish
              id={dish.id}
							orderStarted={orderStarted}
							key={index}
							name={dish.name}
							description={dish.description}
							price={dish.price}
							isCustomer={true}
							options={dish.options}
              addDishesToOrder={addItemOrder}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
