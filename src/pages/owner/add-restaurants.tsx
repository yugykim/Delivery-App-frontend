/** @format */

import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import {
	createRestaurant,
	createRestaurantVariables,
} from '../../gql/createRestaurant';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { Helmet } from 'react-helmet-async';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';
import { useNavigate } from 'react-router-dom';

const CREATE_RESTAURANT_MUTATION = gql`
	mutation createRestaurant($input: createRestaurantInput!) {
		createRestaurant(input: $input) {
			error
			ok
			restaurantId
		}
	}
`;

interface IFormProps {
	name: string;
	address: string;
	categoryName: string;
	file: FileList;
}

export const AddRestaurants = () => {
	const client = useApolloClient();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("ß");
	//get the current restaurants cache
	const onCompleted = (data: createRestaurant) => {
		const {
			createRestaurant: { ok, restaurantId },
		} = data;
		if (ok) {
			const { name, categoryName, address } = getValues();
			setUploading(false);
			const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
			client.writeQuery({
				query: MY_RESTAURANTS_QUERY,
				data: {
					myRestaurants: {
						...queryResult?.myRestaurant, //same data in the cache
						restaurants: [
							{
								IsPromoted: false,
								__typename: 'Restaurant',
								address,
								category: {
                  name: categoryName,
                  __typename: 'Category',
                  __photo__: Object
                },
								coverImage: imageUrl,
								id: restaurantId,
								name,
							},
							...queryResult.myRestaurant.restaurants,
						],
					},
				},
			});
      navigate('/');
		}
	};
	const [createRestaurantMutation, { data }] = useMutation<
		createRestaurant,
		createRestaurantVariables
	>(CREATE_RESTAURANT_MUTATION, {
		onCompleted,
		refetchQueries: [{ query: MY_RESTAURANTS_QUERY }], //get all restaurants, interact with cache directly
	});
	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<IFormProps>({
		mode: 'onChange',
	});
	const [uploading, setUploading] = useState(false);
	const onSubmit = async () => {
		try {
			setUploading(true);
			const { file, name, categoryName, address } = getValues();
			const actualFile = file[0];
			const formBody = new FormData();
			formBody.append('file', actualFile);
			const { url: coverImage } = await (
				await fetch('http://localhost:4000/uploads/', {
					method: 'POST',
					body: formBody,
				})
			).json();

			setImageUrl(coverImage);
			createRestaurantMutation({
				variables: {
					input: {
						name,
						categoryName,
						address,
						coverImage,
					},
				},
			});
			setUploading(false);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='"container flex flex-col items-center mt-52"'>
			<Helmet>
				<title>Add Restaurant | Here You Go</title>
			</Helmet>
			<h4 className='font-semibold text-2xl mb-3'>Add Restaurant</h4>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5'>
				<input
					{...register('name', { required: true })}
					className='input'
					type='text'
					name='name'
					placeholder='name'
				/>
				{errors.name?.message && (
					<FormError errorMessage={errors.name.message} />
				)}
				{errors.name?.type === 'pattern' && (
					<FormError errorMessage={'Please enter a valid email'} />
				)}
				<input
					{...register('address', { required: true })}
					className='input'
					type='text'
					name='address'
					placeholder='address'
				/>
				{errors.address?.message && (
					<FormError errorMessage={errors.address.message} />
				)}
				{errors.address?.type === 'pattern' && (
					<FormError errorMessage={'Please enter a valid email'} />
				)}
				<input
					{...register('categoryName', { required: true })}
					className='input'
					type='text'
					name='categoryName'
					placeholder='categoryName'
				/>
				{errors.categoryName?.message && (
					<FormError errorMessage={errors.categoryName.message} />
				)}
				{errors.categoryName?.type === 'pattern' && (
					<FormError errorMessage={'Please enter a valid email'} />
				)}
				<div>
					<input
						type='file'
						accept='image/*'
						{...register('file', { required: true })}
					/>
				</div>
				<Button
					loading={uploading}
					canClick={isValid}
					actionText='Create Restaurant'
				/>
				{data?.createRestaurant?.error && (
					<FormError errorMessage={data.createRestaurant.error} />
				)}
			</form>
		</div>
	);
};
