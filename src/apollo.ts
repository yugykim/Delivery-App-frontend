import { ApolloClient, InMemoryCache, createHttpLink, makeVar } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { LOCAL_STORAGE_TOKEN } from "./constant";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token)); //false -> begining
export const authToken = makeVar(token); //null -> begining

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
});

const authLink = setContext((_, { headers }) => {
  // set head
  return {
    headers: {
      ...headers,
      "x-jwt": token || "", //this request will happen everytimes
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink), //
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