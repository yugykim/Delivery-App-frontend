export interface myRestaurants_myRestaurants_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface myRestaurants_myRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: myRestaurants_myRestaurants_restaurants_category | null;
  address: string;
  IsPromoted: boolean;
}

export interface myRestaurants_myRestaurants {
  __typename: "MyRestaurantsOutput";
  ok: boolean;
  error: string | null;
  restaurants: myRestaurants_myRestaurants_restaurants[];
}

export interface myRestaurants {
  myRestaurants: myRestaurants_myRestaurants;
}