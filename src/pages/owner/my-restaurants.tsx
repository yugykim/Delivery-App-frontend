/** @format */

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { Helmet } from 'react-helmet-async';
import { myRestaurants } from '../../gql/myRestaurants';
import { Link } from 'react-router-dom';

const MY_RESTAURANTS_QUERY = gql`
	query myRestaurants {
		myRestaurants {
			ok
			error
			restaurants {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
	const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);
	console.log(data);
	return (
		<div>
			<Helmet>
				<title>My Restaurants | Uber eat</title>
			</Helmet>
			<div className='max-w-screen-2xl mx-auto mt-32'>
				<h2 className='text-4xl font-medium mb-10'>My Restaurants</h2>
				{data?.myRestaurants.ok &&
					data.myRestaurants.restaurants.length === 0 && (
						<>
							<h4 className='text-xl mb-5'>You have no restaurants.</h4>
							<Link
								className='text-lime-600 hover:underline'
								to='/add-restaurant'>
								Create one &rarr;
							</Link>
						</>
					)}
			</div>
		</div>
	);
};