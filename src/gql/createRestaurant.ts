// This file was automatically generated and should not be edited.

import { CreateRestaurantInput } from "./graphql";


// ====================================================
// GraphQL mutation operation: createRestaurant
// ====================================================

export interface createRestaurant_createRestaurant {
  __typename: "CreateRestaurantOutput";
  error: string | null;
  ok: boolean;
}

export interface createRestaurant {
  createRestaurant: createRestaurant_createRestaurant;
}

export interface createRestaurantVariables {
  input: CreateRestaurantInput;
}