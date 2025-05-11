import React from "react";
import { Route, Navigate } from "react-router-dom";

function LayoutAuthIntro({ children }) {
  return <>{children}</>;
}

export default function AuthIntroTemplate({ path, Component }) {
  const isLogin = !!localStorage.getItem("User");

  if (isLogin) {
    return (
      <Route
        path={path}
        element={
          <LayoutAuthIntro>
            <Component />
          </LayoutAuthIntro>
        }
      />
    );
  }

  return <Navigate to="/login" />;
}
