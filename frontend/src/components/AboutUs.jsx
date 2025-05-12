import React from "react";
import CardMember from "./CardMember";

export default function AboutUs() {
  const members = [
    {
      name: "Cao Thị Thu Hương",
      role: "Fullstack Developer",
      id: "B22DCCN422",
      des: "Sinh viên năm 3",
      dept: "Công nghệ thông tin",
      img: "me.jpg",
    },
  ];

  return (
    <section id="about-us" className="about-us container">
      <div className="about-title">
        <h1>
          Dev by <span className="group-name">Huong</span>
        </h1>
        <p>Năm thực hiện: 2025</p>
        <p>Học phần: Thực tập cơ sở</p>
      </div>

      <div className="about-member">
        {members?.map((item) => (
          <CardMember key={item.id} student={item} />
        ))}
      </div>

      <div className="about-thank">
        Cảm ơn cô và các bạn đã sử dụng sản phẩm!
      </div>
    </section>
  );
}
