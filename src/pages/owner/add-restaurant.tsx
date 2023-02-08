/** @format */

import { gql, useMutation } from '@apollo/client';
import React from 'react';
import {
	createRestaurant,
	createRestaurantVariables,
} from '../../gql/createRestaurant';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';

const CREATE_RESTAURANT_MUTATION = gql`
	mutation createRestaurant($input: createRestaurantInput!) {
		createRestaurant(input: $input) {
			error
			ok
		}
	}
`;

interface IFormProps {
	name: string;
	address: string;
	categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
	const [createRestaurantMutation, { loading, data }] = useMutation<
		createRestaurant,
		createRestaurantVariables
	>(CREATE_RESTAURANT_MUTATION);
	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<IFormProps>();
	const onSubmit = () => {
		console.log(getValues());
	};
	return (
		<div className='"container flex flex-col items-center mt-52"'>
			<h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
			<form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
				<input
					{...register('name', { required: true })}
					className='input'
					type='text'
					name='name'
					placeholder='name'
				/>
				<input
					{...register('address', { required: true })}
					className='input'
					type='text'
					name='address'
					placeholder='address'
				/>
				<input
					{...register('categoryName', { required: true })}
					className='input'
					type='text'
					name='categoryName'
					placeholder='categoryName'
				/>
        <div>
          <input type="file"  {...register('file', { required: true })} />
        </div>
				<Button
					loading={loading}
					canClick={isValid}
					actionText='Create Restaurant'
				/>
			</form>
		</div>
	);
};
