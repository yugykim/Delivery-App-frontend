
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { SignUp } from "../pages/create-account";
import { Login } from "../pages/login";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Route>
        <Route path="/create-account">
          <SignUp />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Route>
    </Router>
  );
};