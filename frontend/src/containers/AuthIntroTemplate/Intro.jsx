import React, { useEffect } from "react";
import AboutUs from "../../components/AboutUs.jsx";
import Footer from "../../components/Footer.jsx";
import IntroFeature from "../../components/IntroFeature.jsx";
import IntroMain from "../../components/IntroMain.jsx";
import NavbarIntro from "../../components/NavbarIntro.jsx";
import { Navigate } from "react-router";

function Intro() {
  // Xử lý hash để hiển thị #about-us khi trang được load
  useEffect(() => {
    // Nếu đường dẫn là /intro và không có hash, thêm hash #about-us
    if (window.location.pathname === "/intro" && !window.location.hash) {
      window.location.hash = "about-us";
    }
    
    // Nếu có hash #about-us, scroll đến element với id="about-us"
    if (window.location.hash === "#about-us") {
      const aboutUsElement = document.getElementById("about-us");
      if (aboutUsElement) {
        aboutUsElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  // Nếu đã đăng nhập, chuyển đến trang home
  if (localStorage.getItem("User") !== null) {
    return <Navigate to="/home" />;
  }

  return (
    <div>
      <NavbarIntro />
      <IntroMain />
      <IntroFeature />
      <AboutUs />
      <Footer />
    </div>
  );
}

export default Intro;