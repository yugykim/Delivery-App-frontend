/** @format */

import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from '../header';
import { MockedProvider } from '@apollo/client/testing';
import { ME_QUERY } from '../../hooks/useMe';

describe('<Header />', () => {
	it('renders verify banner', async () => {
		const { debug, getByText } = render(
			<MockedProvider
				mocks={[
					{
						request: {
							query: ME_QUERY,
						},
						result: {
							data: {
								me: {
									id: 1,
									email: '',
									role: '',
									verified: false,
								},
							},
						},
					},
				]}>
				<Router>
					<Header />
				</Router>
			</MockedProvider>
		);
		await waitFor(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
      // eslint-disable-next-line testing-library/prefer-screen-queries
      getByText("Please verify your email.");
		});
	});

  it('renders without verify banner', async () => {
		const { queryByText } = render(
			<MockedProvider
				mocks={[
					{
						request: {
							query: ME_QUERY,
						},
						result: {
							data: {
								me: {
									id: 1,
									email: '',
									role: '',
									verified: true,
								},
							},
						},
					},
				]}>
				<Router>
					<Header />
				</Router>
			</MockedProvider>
		);
		await waitFor(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
      // eslint-disable-next-line testing-library/prefer-screen-queries
      expect(queryByText("Please verify your email")).toBeNull();
		});
	});
});
