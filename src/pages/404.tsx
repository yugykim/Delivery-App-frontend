import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="h-screen flex items-center justify-center">
    <h2>Page Not Found.</h2>
    <h4>The page you're looking for does not exist or has moved.</h4>
    <Link to="/">Go back home &rarr;</Link>
  </div>
);