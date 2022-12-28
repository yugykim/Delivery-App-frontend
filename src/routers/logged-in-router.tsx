import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Restaurant } from "../pages/client/restaurants";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

const ClientRoutes = [
  <>
    <Route key={1} path="/" element={<Restaurant />} />
    <Route key={2} path="/confrim" element={<ConfirmEmail />} />
    <Route key={3} path="/edit-profile" element={<EditProfile />} />
  </>
];

export const LoggedInRouter = () => {
  const {data, loading, error} = useMe(); //go to cache
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