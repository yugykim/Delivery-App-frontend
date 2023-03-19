/** @format */

import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import {
	restaurantsPageQuery,
	restaurantsPageQueryVariables,
} from '../../gql/restaurantsPageQuery';
import { useForm } from 'react-hook-form';
import { Restaurant } from '../../components/restaurant';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';

const RESTAURANTS_QUERY = gql`
	query restaurantsPageQuery($input: RestaurantsInput!) {
		allCategories {
			ok
			error
			categories {
				...CategoryParts
			}
		}
		restaurants(input: $input) {
			ok
			error
			totalPages
			totalResult
			results {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${CATEGORY_FRAGMENT}
`;

interface IFormProps {
	searchTerm: string;
}

const imageLink = 'https://www.yogiyo.co.kr/mobile/image/bg-top.png?v=1';
export const Restaurants = () => {
	const [page, setPage] = useState(1);
	const { data, loading, error } = useQuery<
		restaurantsPageQuery,
		restaurantsPageQueryVariables
	>(RESTAURANTS_QUERY, {
		variables: {
			input: {
				page,
			},
		},
	});
	const onNextPageClick = () => setPage((current) => current + 1);
	const onPrevPageClick = () => setPage((current) => current - 1);
	const { register, handleSubmit, getValues } = useForm<IFormProps>();
	const navigate = useNavigate();
	const onSearchSubmit = () => {
		const { searchTerm } = getValues();
		navigate(`/search/?term=${searchTerm}`);
	};
	return (
		<div>
			<Helmet>
				<title>Home | Here You Go</title>
			</Helmet>
			<div
				className='w-full py-28 flex items-center justify-center bg-center bg-cover'
				style={{ backgroundImage: `url(${imageLink})` }}>
				<form
					onSubmit={handleSubmit(onSearchSubmit)}
					className='w-full flex items-center justify-center'>
					<input
						{...register('searchTerm', { required: true, min: 3 })}
						name='searchTerm'
						type='Search'
						className='input rounded-md border-0 w-1/2 md:w-3/12 mt-20'
						placeholder='Search restaurants...'
					/>
				</form>
			</div>
			<div>
				{!loading && (
					<div className='max-w-screen-2xl mx-auto mt-8 pb-20'>
						<div className='flex justify-around max-w-sm mx-auto'>
							{data?.allCategories.categories?.map((category) => (
								<Link to={`/category/${category.slug}`}>\</Link>
							))}  
						</div>
						<div className='flex flex-wrap justify-center mt-16'>
            <div className='basis-1/4 m-2 bg-red-300'>ddddd</div>
            <div className='basis-1/4 m-2 bg-red-300'>ddd</div>
            <div className='basis-1/4 m-2 bg-red-300'>dd</div>
            <div className='basis-1/4 m-2 bg-red-300'>ddd</div>
							{data?.restaurants.results?.map((restaurant) => (
								<div className='basis-1/4 m-2 bg-red-300'>
									<Restaurant
										key={restaurant.id}
										id={restaurant.id + ''}
										coverImage={restaurant.coverImage}
										name={restaurant.name}
										categoryName={restaurant.category?.name}
									/>
								</div>
							))}
						</div>
						<div className='grid grid-cols-3 tㅁext-center max-w-md items-center max-auto mt-10'>
							{page > 1 ? (
								<button
									onClick={onPrevPageClick}
									className=' focus:outline-none font-medium text-2xl'>
									&larr;
								</button>
							) : (
								<div></div>
							)}
							<span>
								Page {page} of {data?.restaurants.totalPages}
							</span>
							{page !== data?.restaurants.totalPages ? (
								<button
									onClick={onNextPageClick}
									className=' focus:outline-none font-medium text-2xl'>
									&rarr;
								</button>
							) : (
								<div></div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
