import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables } from '../../gql/category';
import { Restaurant } from '../../components/restaurant';

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResult
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Category = () => {
  const params = useParams();
  const { data, loading } = useQuery<category, categoryVariables>(CATEGORY_QUERY,{
    variables: {
      input: {
        page: 1,
        slug: params.slug
      }
    }
  });
  return (
    <div className='flex flex-wrap justify-center mt-16'>
    {data?.category.restaurants?.map((restaurant) => (
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
  );
};