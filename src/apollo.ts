import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { LOCAL_STORAGE_TOKEN } from "./constant";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token)); //false -> begining
export const authToken = makeVar(token); //null -> begining

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
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