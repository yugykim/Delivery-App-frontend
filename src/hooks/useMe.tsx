import { gql, useQuery } from "@apollo/client";
import { meQuery } from "../gql/meQuery";

//apollo put this in cache, and give it to us. so it is better using hook, which calls graphql once, and
//get things from cache
const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY);
};