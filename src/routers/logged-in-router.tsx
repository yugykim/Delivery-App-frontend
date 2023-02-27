/** @format */

import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useNavigate,
} from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { Restaurants } from '../pages/client/restaurants';
import { Search } from '../pages/client/search';
import { Category } from '../pages/client/category';
import { Restaurant } from '../pages/client/restaurant';
import { NotFound } from '../pages/404';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { AddRestaurants } from '../pages/owner/add-restaurants';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';

const clientRoutes = [
	{
		path: '/',
		component: <Restaurants />,
	},
	{
		path: '/search',
		component: <Search />,
	},
	{
		path: '/category/:slug',
		component: <Category />,
	},
	{
		path: '/restaurants/:id',
		component: <Restaurant />,
	},
];

const commonRoutes = [
	{
		path: '/confirm',
		component: <ConfirmEmail />,
	},
	{
		path: '/edit-profile',
		component: <EditProfile />,
	},
];

const restaurantRoutes = [
	{
		path: '/',
		component: <MyRestaurants />,
	},
	{
		path: '/add-restaurant',
		component: <AddRestaurants />,
	},
	{
		path: '/restaurants/:id',
		component: <MyRestaurant />,
	},
  {
		path: '/restaurants/:restaurantId/add-dish',
		component: <AddDish />,
	},
];

export const LoggedInRouter = () => {
	const { data, loading, error } = useMe(); //go to cache

	if (loading || error || !data) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<span className='font-medium text-xl tracking-wide'>Loading...</span>
			</div>
		);
	}
	return (
		<Router>
			<Header />
			<Routes>
				{commonRoutes.map((route) => (
					<Route
						key={route.path}
						path={route.path}
						element={route.component}></Route>
				))}
				{data.me.role === 'Customer' &&
					clientRoutes.map((route) => (
						<Route
							key={route.path}
							path={route.path}
							element={route.component}></Route>
					))}
				{data.me.role === 'Owner' &&
					restaurantRoutes.map((route) => (
						<Route
							key={route.path}
							path={route.path}
							element={route.component}></Route>
					))}
				<Route
					path='*'
					element={<NotFound />}
				/>
			</Routes>
		</Router>
	);
};
