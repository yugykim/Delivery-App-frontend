/** @format */

import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { Helmet } from 'react-helmet-async';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';
import { createDish, createDishVariables } from '../../gql/createDish';

const CREATE_DISH_MUTATION = gql`
	mutation createDish($input: CreateDishInput!) {
		createDish(input: $input) {
			ok
			error
		}
	}
`;

interface IForm {
	name: string;
	price: string;
	description: string;
	[key: string]: string;
}

export const AddDish = () => {
	const { register, handleSubmit, formState, getValues, setValue } =
		useForm<IForm>({
			mode: 'onChange',
		});
	const navigate = useNavigate();
	//when the mode 'onChange', formState is going to be worked. It means that this form will be validated every inputs
	const { restaurantId } = useParams<{ restaurantId: string }>();
	const [createDishMutation, { loading }] = useMutation<
		createDish,
		createDishVariables
	>(CREATE_DISH_MUTATION, {
		refetchQueries: [
			{
				query: MY_RESTAURANTS_QUERY,
				variables: {
					// refetching my-restaurant, my restaurant input shoould be provided. To refetch the query need the variable
					input: {
						id: restaurantId ? +restaurantId : 0, // my restaurant input
					},
				},
			},
		],
	});
	//submit
	const onSubmit = () => {
		const { name, price, description, ...rest } = getValues();
		const optionObjects = optionsNumber.map(theId => ({ name: rest[`${theId}-optionName`], extra: +rest[`${theId}-optionExtra`]}));

 		createDishMutation({
			variables: {
				input: {
					name,
					price: +price,
					description,
					restaurantID: restaurantId ? +restaurantId : 0,
          options: optionObjects
				},
			},
		}); 
		createDishMutation({
			variables: {
				input: {
					name,
					price: +price,
					description,
					restaurantID: restaurantId ? +restaurantId : 0,
				},
			},
		});
		navigate(-1);
	};
	const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
	const onAddOptionClick = () => {
		setOptionsNumber((current) => [Date.now(), ...current]);
	};
	const onDeleteClick = (idToDelete: number) => {
		setOptionsNumber((current) => current.filter(id => id !== idToDelete));
		setValue(`${idToDelete}-optionName`, '');
		setValue(`${idToDelete}-optionExtra`, '');
	};
	return (
		<div className='container flex flex-col items-center mt-52'>
			<Helmet>
				<title>Add Dish | Here You Go</title>
			</Helmet>
			<h4 className='font-semibold text-2xl mb-3'>Add Dish</h4>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5'>
				<input
					{...register('name', { required: 'Name is required.' })}
					className='input'
					type='text'
					name='name'
					placeholder='Name'
				/>
				<input
					{...register('price', { required: 'Price is required.' })}
					className='input'
					type='number'
					name='price'
					min={0}
					placeholder='Price'
				/>
				<input
					{...register('description', { required: 'Description is required.' })}
					className='input'
					type='text'
					name='description'
					placeholder='Description'
				/>
				<div className='my-10'>
					<h4 className='font-medium  mb-3 text-lg'>Dish Options</h4>
					<span
						onClick={onAddOptionClick}
						className='cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5'>
						Add Dish Option
					</span>
					{optionsNumber.length !== 0 && //dynamic form
						optionsNumber.map((id) => (
							<div
								key={id}
								className='mt-5'>
								<input
									{...register(`${id}-optionName`)}
									type='text'
									placeholder='Option Name'
									className='py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2'
								/>
								<input
									{...register(`${id}-optionExtra`)}
									type='number'
									min={0}
									placeholder='Option Extra'
									className='py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2'
								/>
								<span className='cursor-pointer text-sm text-white bg-red-500 ml-2 py-3 px-3 mt-5' onClick={() => onDeleteClick(id)}>DeleteOption</span>
							</div>
						))}
				</div>
				<Button
					loading={loading}
					canClick={formState.isValid}
					actionText='Create Dish'
				/>
			</form>
		</div>
	);
};
