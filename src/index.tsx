/** @format */

import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { client } from './apollo';
import './styles/styles.css';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './components/app';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<ApolloProvider client={client}>
		<HelmetProvider>
			<App />
		</HelmetProvider>
	</ApolloProvider>
);
