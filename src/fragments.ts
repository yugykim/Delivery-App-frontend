/** @format */

import { gql } from '@apollo/client';

export const RESTAURANT_FRAGMENT = gql`
	fragment RestauratParts on Restaurant {
		id
		name
		coverImage
		category {
			name
		}
		address
		isPromoted
	}
`;
