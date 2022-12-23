import React from "react"
import { isLoggedInVar } from "../apollo"
import { gql, useQuery } from "@apollo/client";

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
export const LoggedInRouter = () => {
  const {data, loading, error} = useQuery(ME_QUERY);
  console.log(error);
  return (
    <div>
      <h1>Logged In</h1>
      <button onClick={() => isLoggedInVar(false)}>Log Out</button>
    </div>
  )
}