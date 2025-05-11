import React from "react";
import ListHomework from "../../components/ListHomework";
import OperationHomework from "../../components/OperationHomework";
import { useLocation, useNavigate } from "react-router-dom";

export default function Homework() {
  const location = useLocation();
  const history = useNavigate();

  // console.log("location: " + location);

  if (location.state?.reason !== undefined) {
    alert(location.state.reason);
    location.state.reason = undefined;
    history.replace(location.pathname);
  }

  return (
    <div className="homework container">
      <OperationHomework />
      <ListHomework />
    </div>
  );
}
