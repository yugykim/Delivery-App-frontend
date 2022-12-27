import React from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Login } from "../pages/login";
import { SignUp } from "../pages/create-account";
import { NotFound } from "../pages/404";


export const LoggedOutRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create-account" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </Router>
  );
};