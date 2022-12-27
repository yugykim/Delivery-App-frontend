import React from "react"
import { gql, useQuery } from "@apollo/client";
import { meQuery } from "../gql/meQuery";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Restaurant } from "../pages/client/restaurants";
import { Header } from "../components/header";

const ClientRoutes = [
  <Route path="/" element={<Restaurant />} />
];

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
  const {data, loading, error} = useQuery<meQuery>(ME_QUERY);
  if ( loading || error || !data) {
    return <div className="h-screen flex justify-center items-center">
      <span className="font-medium text-xl tracking-wide">Loading...</span>
    </div>
  }
  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === "Customer" && ClientRoutes}
      </Routes>
    </Router>
  );
}