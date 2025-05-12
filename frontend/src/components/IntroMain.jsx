import React from "react";
import { Link } from "react-router-dom";

export default function IntroMain() {
  return (
    <section className="intro-main container" id="IntroMain">
      <div className="left">
        <h1 className="title">
          Nền tảng lớp học trực tuyến <br /> hiệu quả và phổ biến
        </h1>
        <p className="des">
          EduLab ra đời với sứ mệnh giải quyết những vấn đề trong việc học và dạy.
        </p>
        <Link to="/login" className="btn btn-join">
          <i className="fa fa-hand-pointer" style={{ marginRight: 8 }}></i>
          Tham gia ngay
        </Link>
      </div>
      <div className="right">
        <img
          src="/assets/img/intro_study.png"
          className="img-study"
          alt="Giới thiệu học trực tuyến"
        />
      </div>
    </section>
  );
}
