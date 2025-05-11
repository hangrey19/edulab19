import React, { Fragment } from "react";
import NavbarHome from "../../components/NavbarHome";
import Footer from "../../components/Footer";
import { Navigate, useLocation } from "react-router-dom";

function LayoutHome({ children }) {
  return (
    <Fragment>
      <NavbarHome />
      {children}
      <Footer />
    </Fragment>
  );
}

export default function HomeTemplate({ Component }) {
  const location = useLocation();
  const isLogin = !!localStorage.getItem("User");

  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <LayoutHome>
      <Component />
    </LayoutHome>
  );
}
