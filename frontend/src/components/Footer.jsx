import React from "react";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import { red } from "@mui/material/colors";

const SocialMediaLinks = () => (
  <ul className="contact-list">
    <li>
      <a href="https://www.facebook.com/takagi_kasumi/">
        <FacebookIcon fontSize="large" color="primary" />
      </a>
    </li>
    <li>
      <a href="https://www.instagram.com">
        <InstagramIcon fontSize="large" color="error" />
      </a>
    </li>
    <li>
      <a href="https://twitter.com">
        <TwitterIcon fontSize="large" color="primary" />
      </a>
    </li>
    <li>
      <a href="https://www.facebook.com">
        <TelegramIcon fontSize="large" color={red[50]} />
      </a>
    </li>
  </ul>
);

export default function Footer() {
  return (
    <section className="footer">
      <div className="container">
        <div className="content row">
          {/* General Information Section */}
          <div className="general div-4 col-sm-12 col-md-4 col-lg-4">
            <Link to="/home" className="logo">
              <img src="/assets/img/Friendly_logo.png" alt="Our Logo" />
            </Link>
            <h3>Rèn luyện học tập - EduLab</h3>
          </div>

          {/* Address Section */}
          <div className="address div-4 col-sm-12 col-md-4 col-lg-4">
            <h3>Địa chỉ</h3>
            <ul>
              <li>Học viện Công nghệ Bưu chính Viễn thông</li>
              <li>Khoa Công nghệ thông tin I</li>
              <li>D22CN</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="contact div-4 col-sm-12 col-md-4 col-lg-4">
            <h3>Liên hệ</h3>
            <SocialMediaLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
