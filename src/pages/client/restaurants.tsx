import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../gql/restaurantsPageQuery';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResult
      results {
        id
        name
        coverImage
        category {
          name 
        }
        address
        isPromoted
      }
    }
  }
`;
export const Restaurant = () => {
  const { data, loading, error } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page:1
      }
    }
  });
  console.log(data);
  return (
    <div> 
      <form className='bg-gray-800 w-full py-40 flex items-center justify-center'>
        <input type="Search" className="input rounded-md border-0 w-3/12" placeholder='Search restaurants...' />
      </form>
      <div>
        {!loading && ( 
          <div className='max-w-screen-2xl mx-auto mt-8'>
            <div className='flex justify-around max-w-sm mx-auto'>
              {data?.allCategories.categories?.map(category => (
                <div className='flex flex-col items-center cursor-pointer'>
                  <div className='w-14 h-14 bg-cover hover:bg-gray-200 rounded-full' style={{backgroundImage: `url(${category.coverImg})`}}></div>
                  <span className='mt-1 text-sm text-center font-medium'>{ category.name }</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};