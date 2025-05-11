import React from "react";
import Footer from "../../components/Footer";
import NavbarClassroom from "../../components/NavbarClassroom";
import { Navigate, useLocation } from "react-router-dom";

function LayoutClassroom({ children }) {
  return (
    <>
      <NavbarClassroom />
      {children}
      <Footer />
    </>
  );
}

export default function ClassroomTemplate({ Component }) {
  const location = useLocation();
  const isLogin = !!localStorage.getItem("User");

  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <LayoutClassroom>
      <Component />
    </LayoutClassroom>
  );
}
