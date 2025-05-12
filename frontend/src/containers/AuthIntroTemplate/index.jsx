import React from "react";
import { Navigate } from "react-router-dom";

function LayoutAuthIntro({ children }) {
  return <>{children}</>;
}

export default function AuthIntroTemplate({ Component }) {
  // Chỉ kiểm tra xem có đăng nhập hay không
  const isLogin = !!localStorage.getItem("User");

  // Nếu có intro path (trang giới thiệu), render component được truyền vào
  if (Component.name === "Intro" || !isLogin) {
    return (
      <LayoutAuthIntro>
        <Component />
      </LayoutAuthIntro>
    );
  }

  // Nếu đăng nhập rồi và không phải trang intro, chuyển về home
  return <Navigate to="/home" />;
}