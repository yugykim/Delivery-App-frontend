/** @format */

import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import {
	searchRestaurant,
	searchRestaurantVariables,
} from '../../gql/searchRestaurant';
import { Restaurant } from '../../components/restaurant';

const SEARCH_RESTAURANT = gql`
	query searchRestaurant($input: SearchRestaurantInput!) {
		searchRestaurant(input: $input) {
			ok
			error
			totalPages
			totalResult
			restaurants {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [callQuery, { loading, data, called }] = useLazyQuery<
		searchRestaurant,
		searchRestaurantVariables
	>(SEARCH_RESTAURANT);
	useEffect(() => {
		const [_, query] = location.search.split('?term=');
		if (!query) {
			return navigate('/');
		}
		callQuery({
			variables: {
				input: {
					page: 1,
					query,
				},
			},
		});
	}, [navigate, location]);
	console.log(loading, data, called);
	return (
		<div>
			<Helmet>
				<title>Search | Here You Go</title>
			</Helmet>
			<div className='flex flex-wrap justify-center mt-16'>
				{data?.searchRestaurant.restaurants?.map((restaurant) => (
					<div className='basis-1/4 m-2'>
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
		</div>
	);
};
