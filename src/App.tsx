import { useReactiveVar } from "@apollo/client";
import React from "react";
import { isLoggedInVar } from "./apollo";
import { LoggedInRouter } from "./routers/logged-in-router";
import { LoggedOutRouter } from "./routers/logged-out-router";

const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  console.log(isLoggedIn);
  return (isLoggedInVar()? <LoggedInRouter /> : <LoggedOutRouter />);
};


export default App;