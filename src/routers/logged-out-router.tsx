/** @format */

import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from 'react-router-dom';
import { Login } from '../pages/login';
import { SignUp } from '../pages/create-account';
import { NotFound } from '../pages/404';
import { Restaurants } from '../pages/client/restaurants';
import { Header } from '../components/header';

export const LoggedOutRouter = () => {
	return (
		<Router>
			<Header />
			<Routes>
				<Route
					path='/create-account'
					element={<SignUp />}
				/>
				<Route
					path='/login'
					element={<Login />}
				/>
				<Route
					path='/'
					element={<Restaurants />}
				/>
				<Route
					path='*'
					element={<NotFound />}
				/>
			</Routes>
		</Router>
	);
};
