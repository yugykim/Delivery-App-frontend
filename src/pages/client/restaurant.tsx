/** @format */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { gql, useMutation, useQuery } from '@apollo/client';
import { restaurant, restaurantVariables } from '../../gql/restaurant';
import { Dish } from '../../components/dish';
import { Helmet } from 'react-helmet-async';
import { CreateOrderItemInput } from '../../gql/graphql';
import { DishOption } from '../../components/dish-option';
import { createOrder, createOrderVariables } from '../../gql/createOrder';

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
      orderId
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

	const getItem = (dishId: number) => {
		return orderDishes.find((order) => order.dishId === dishId);
	};

	const isSelected = (dishId: number) => {
		return Boolean(getItem(dishId));
	};

	const addItemOrder = (dishId: number) => {
		if (isSelected(dishId)) {
			return;
		}
		setOrderDishes((current) => [{ dishId, options: [] }, ...current]);
	};

	const removeFromOrder = (dishId: number) => {
		setOrderDishes((current) =>
			current.filter((dish) => dish.dishId !== dishId)
		);
	};

	const removeOptionFromItem = (dishId: number, optionName: string) => {
		//
		const oldItem = getItem(dishId);
		if (oldItem) {
			removeFromOrder(dishId); //removing order
			setOrderDishes((current) => [
				//add item
				{
					dishId,
					options: oldItem.options?.filter(
						(option) => option.name !== optionName //only have options name is not name of the options
					),
				},
				...current,
			]);
		}
	};

	const addOptionToItem = (dishId: number, optionName: string) => {
		if (!isSelected(dishId)) {
			return;
		}
		const oldItem = getItem(dishId);
		if (oldItem) {
			const hasOption = Boolean(
				oldItem.options?.find((aOption) => aOption.name === optionName)
			);
			if (!hasOption) {
				removeFromOrder(dishId); //removing order
				setOrderDishes((current) => [
					{ dishId, options: [{ name: optionName }, ...oldItem.options!] },
					...current,
				]); // setorderitems again
			}
		}
	};
	const getOptionFromItem = (
		item: CreateOrderItemInput,
		optionName: string
	) => {
		return item.options?.find((option) => option.name === optionName);
	};

	const isOptionSelected = (dishId: number, optionName: string) => {
		const item = getItem(dishId);
		if (item) {
			return Boolean(getOptionFromItem(item, optionName));
		}
		return false;
	};

	const triggerCancleOrder = () => {
		setOrderStarted(false);
		setOrderDishes([]);
	};
  const navigate = useNavigate();
  //creating order mutation
  const onCompleted = (data: createOrder) => {
    const { createOrder: {ok, orderId}} = data;
    if (data.createOrder.ok) {
      navigate(`orders/${orderId}`);
    }
    
  }
	const [createOrderMutation, { loading: placingOrder }] = useMutation<
		createOrder,
		createOrderVariables
	>(CREATE_ORDER_MUTATION, {
    onCompleted,
  });

	const triggerConfirmOrder = () => {
		if (orderDishes.length === 0) {
			alert("Can't place empty order");
			return;
		}

		const ok = window.confirm('You are about to place an order');
		if (ok) {
			createOrderMutation({
				variables: {
					input: {
						restaurantID: +id,
						items: orderDishes,
					},
				},
			});
		}
	};

	return (
		<div>
			<Helmet>
				<title>{data?.restaurant.restaurant?.name || ''} | Here You Go</title>
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
				{!orderStarted && (
					<button
						onClick={triggerStartOrder}
						className='btn px-10'>
						Start Order
					</button>
				)}
				{orderStarted && (
					<div className='flex items-center'>
						<button
							onClick={triggerConfirmOrder}
							className='btn px-10 mr-3'>
							Confirm Order
						</button>
						<button
							onClick={triggerCancleOrder}
							className='btn px-10 bg-black hover:bg-black'>
							Cancle Order
						</button>
					</div>
				)}
				<div className='w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10'>
					{data?.restaurant.restaurant?.menu.map((dish, index) => (
						<Dish
							isSelected={isSelected(dish.id)}
							id={dish.id}
							orderStarted={orderStarted}
							key={index}
							name={dish.name}
							description={dish.description}
							price={dish.price}
							isCustomer={true}
							options={dish.options}
							addDishesToOrder={addItemOrder}
							removeFromOrder={removeFromOrder}>
							<div>
								{dish.options?.map((option, index) => (
									<DishOption
										key={index}
										isSelected={isOptionSelected(dish.id, option.name)}
										extra={option.extra}
										name={option.name}
										dishId={dish.id}
										addOptionToItem={addOptionToItem}
										removeOptionFromItem={removeOptionFromItem}
									/>
								))}
							</div>
						</Dish>
					))}
				</div>
			</div>
		</div>
	);
};
