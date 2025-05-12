import React from "react";

const features = [
  {
    img: "/assets/img/intro_func_1.jpg",
    title: "Dễ dàng quản lý nhiều lớp học, nhiều học sinh",
  },
  {
    img: "/assets/img/intro_func_2.png",
    title: "Giao bài tập và quản lý thời hạn nộp bài",
  },
  {
    img: "/assets/img/intro_func_3.png",
    title: "Bảo mật tài liệu, nâng cao hiệu quả giảng dạy",
  },
  {
    img: "/assets/img/intro_func_4.png",
    title: "Dễ dàng quản lý nhiều lớp học, nhiều học sinh",
  },
];

export default function IntroFeature() {
  return (
    <section id="intro-feature" className="intro-feature">
      <div className="content container">
        <h1 className="title">Tính năng chính</h1>
        <div className="row">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-box col-12 col-sm-12 col-md-6"
            >
              <div className="inner">
                <img
                  className="img-illus"
                  src={feature.img}
                  alt="illustration"
                />
                <h3>{feature.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
