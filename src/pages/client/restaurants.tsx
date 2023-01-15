import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../gql/restaurantsPageQuery';
import { useForm } from 'react-hook-form';
import { Restaurant } from '../../components/restaurant';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput) {
    allCategories {
      okP
      error
      categories {
        ...CategoryParts
      }P
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResult
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      }
    }
  });
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current -1);
  const {register, handleSubmit, getValues} = useForm<IFormProps>();
  const navigate = useNavigate();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    navigate(`/search/?term=${searchTerm}`);
  };
  return (
    <div> 
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSearchSubmit)} className='bg-gray-800 w-full py-40 flex items-center justify-center'>
        <input {...register('searchTerm', {required: true, min: 3})} name="searchTerm" type="Search" className="input rounded-md border-0 w-3/4 md:w-3/12" placeholder='Search restaurants...' />
      </form>
      <div>
        {!loading && ( 
          <div className='max-w-screen-2xl mx-auto mt-8 pb-20'>
            <div className='flex justify-around max-w-sm mx-auto'>
              {data?.allCategories.categories?.map(category => (
                <Link to={`/category/${category.slug}`}>
\
                </Link>
              ))}
            </div>
            <div className='grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10'>
              { data?.restaurants.results?.map(restaurant => (
                <Restaurant 
                  key={restaurant.id}
                  id={restaurant.id+""}
                  coverImg={restaurant.coverImg} 
                  name={restaurant.name} 
                  categoryName={restaurant.category?.name} 
                />
              ))}
            </div>
            <div className='grid grid-cols-3 text-center max-w-md items-center max-auto mt-10'>
              {page > 1 ? ( <button onClick={onPrevPageClick} className=' focus:outline-none font-medium text-2xl'>&larr;</button> ) : <div></div>}
              <span>Page {page} of {data?.restaurants.totalPages}</span>
              {page !== data?.restaurants.totalPages ? ( <button onClick={onNextPageClick} className=' focus:outline-none font-medium text-2xl'>&rarr;</button> ) : <div></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
