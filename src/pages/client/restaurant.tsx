import React from 'react';
import { useParams } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { gql, useQuery } from '@apollo/client';
import { restaurant, restaurantVariables } from '../../gql/restaurant';

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Restaurant = () => {
  const params = useParams();
  const id = params.id!;
  const {loading, data} = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
      },
    }
  });
  return (
    <div>
      <div className='bg-gray-800 bg-center py-48 bg-cover ' style={{backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`}}>
        <div className=' bg-white w-3/12 py-4 pl-48'>
          <h4 className='text-4xl mb-2'>{ data?.restaurant.restaurant?.name }</h4>
          <h5 className='text-sm font-light mb-2'>{ data?.restaurant.restaurant?.category?.name }</h5>
          <h6 className='text-sm font-light'>{ data?.restaurant.restaurant?.address }</h6>
        </div>
      </div>
    </div>
  );
};