/** @format */

import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, RenderResult, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { LOGIN_MUTATION, Login } from '../../pages/login';
import { debug } from 'console';

describe('<Login />', () => {
	let renderResult: RenderResult;
	let mockedClient: MockApolloClient;
	mockedClient = createMockClient();
	render(
		<HelmetProvider>
			<Router>
				<ApolloProvider client={mockedClient}>
					<Login />
				</ApolloProvider>
			</Router>
		</HelmetProvider>
	);
	it('should render OK', async () => {
		await waitFor(() => {
			expect(document.title).toBe('Login | Uber eat');
		});
	});
	it('displays email validation errors', async () => {
		const email = screen.getByPlaceholderText(/email/i);
		userEvent.type(email, 'this@wont');
		let errorMessage = screen.getByRole('alert');
		await waitFor(() => {
			expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
		});
		userEvent.clear(email);
		errorMessage = screen.getByRole('alert');
		await waitFor(() => {
			expect(errorMessage).toHaveTextContent(/email is required/i);
		});
	});
	it('display password required errors', async () => {
		const email = screen.getByPlaceholderText(/email/i);
		const submitBtn = screen.getByRole('button');
		userEvent.type(email, 'this@wont.com');
		userEvent.click(submitBtn);
		const errorMessage = screen.getByRole('alert');
		await waitFor(() => {
			expect(errorMessage).toHaveTextContent(/password is required/i);
		});
	});
	it('submits form and calls mutation', async () => {
		const email = screen.getByPlaceholderText(/email/i);
		const password = screen.getByPlaceholderText(/password/i);
		const submitBtn = screen.getByRole('button');
		const formData = {
			email: 'real@test.com',
			password: '123',
		};
		const mockedMutationResponse = jest.fn().mockResolvedValue({
			data: {
				login: {
					ok: true,
					token: 'XXX',
					error: 'mutation-error',
				},
			},
		});
		mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
		jest.spyOn(Storage.prototype, 'setItem');
		userEvent.type(email, formData.email);
		userEvent.type(password, formData.password);
		userEvent.click(submitBtn);
		await waitFor(() => {
			expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
		});
		await waitFor(() => {
			expect(mockedMutationResponse).toHaveBeenCalledWith({
				loginInput: {
					email: formData.email,
					password: formData.password,
				},
			});
		});
		const errorMessage = screen.getByRole('alert');
		await waitFor(() => {
			expect(errorMessage).toHaveTextContent(/mutation-error/i);
		});
		await waitFor(() => {
			expect(localStorage.setItem).toHaveBeenCalledWith('nuber-token', 'XXX');
		});
	});
});
