import { SearchRestaurantInput } from "./graphql";

export interface searchRestaurant_searchRestaurant_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface searchRestaurant_searchRestaurant_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: searchRestaurant_searchRestaurant_restaurants_category | null;
  address: string;
  IsPromoted: boolean;
}

export interface searchRestaurant_searchRestaurant {
  __typename: "SearchRestaurantOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResult: number | null;
  restaurants: searchRestaurant_searchRestaurant_restaurants[] | null;
}

export interface searchRestaurant {
  searchRestaurant: searchRestaurant_searchRestaurant;
}

export interface searchRestaurantVariables {
  input: SearchRestaurantInput;
}