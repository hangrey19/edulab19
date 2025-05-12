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
      <a href="https://www.facebook.com/duy.onix/">
        <FacebookIcon fontSize="large" color="primary" />
      </a>
    </li>
    <li>
      <a href="https://www.instagram.com/duyonix/">
        <InstagramIcon fontSize="large" color="error" />
      </a>
    </li>
    <li>
      <a href="https://twitter.com/duyonix">
        <TwitterIcon fontSize="large" color="primary" />
      </a>
    </li>
    <li>
      <a href="https://www.facebook.com/duy.onix/">
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
            <h3>Lớp học thân thiện - Friendly Classroom</h3>
            <p>&copy;Copyright HiFive Team</p>
          </div>

          {/* Address Section */}
          <div className="address div-4 col-sm-12 col-md-4 col-lg-4">
            <h3>Địa chỉ</h3>
            <ul>
              <li>Trường Đại học Khoa học tự nhiên</li>
              <li>Khoa Công nghệ thông tin</li>
              <li>19CNTN</li>
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
