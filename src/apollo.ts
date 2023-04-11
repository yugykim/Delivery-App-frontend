import { ApolloClient, InMemoryCache, createHttpLink, makeVar, split } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { LOCAL_STORAGE_TOKEN } from "./constant";
//subscription
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token)); //false -> begining
export const authToken = makeVar(token); //null -> begining

//subscription
const wsLink = new GraphQLWsLink(createClient({

  url: process.env.NODE_ENV === 'production'? 'ws://uber-eats-backend.herokuapp.com/graphql':'ws://localhost:4000/graphql',
  connectionParams: {
    'x-jwt': authToken() || "", 
  },
}));

const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'production'? 'ws://uber-eats-backend.herokuapp.com/graphql':'ws://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // set head
  return {
    headers: {
      ...headers,
      "x-jwt": authToken() || "", //this request will happen everytimes
    }
  }
});

// The split function takes three parameters:

//

// * A function that's called for each operation to execute

// * The Link to use for an operation if the function returns a "truthy" value

// * The Link to use for an operation if the function returns a "falsy" value

const splitLink = split(

  ({ query }) => {

    const definition = getMainDefinition(query);

    return (

      definition.kind === 'OperationDefinition' &&

      definition.operation === 'subscription'

    );

  },

  wsLink, //return true

  authLink.concat(httpLink), // return false

);

export const client = new ApolloClient({
  link: splitLink, //
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            }
          },
          token: {
            read() {
              return authToken();
            }
          }
        }
      }
    }
  }),
});
