import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { pathImgFromIndex } from "../utils/constants";
import { Link, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { actFetchDocumentDetailList } from "../redux/modules/Homework/action";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Tooltip from "@mui/material/Tooltip";
import Loading from "./Loading";

function HomeworkCard(props) {
  const { type, homework: item } = props;
  const { classroomId } = useParams();
  const dispatch = useDispatch();

  const role = localStorage.getItem("role");
  const [more, setMore] = useState(false);

  const data = useSelector((state) => state.documentDetailReducer?.data);
  const loading = useSelector((state) => state.documentDetailReducer?.loading);
  const err = useSelector((state) => state.documentDetailReducer?.err);

  useEffect(() => {
    if (data?.document?._id === item._id) {
      setMore(true);
    }
  }, [data, item._id]);

  const handleShowDetailDocument = () => {
    dispatch(actFetchDocumentDetailList(item._id));
  };

  const handleCollapseDocument = () => {
    setMore(false);
  };

  const convertDate = (dateStr) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const renderMore = () => {
    if (more && data?.document) {
      return (
        <div className="More">
          <p className="desc">{data.document.description}</p>
          {data.document.attachedFiles?.[0] && (
            <Tooltip title="Tải xuống tài liệu">
              <a href={data.document.attachedFiles[0]} download>
                <FileDownloadIcon fontSize="large" />
              </a>
            </Tooltip>
          )}
        </div>
      );
    }
    return null;
  };

  const renderDetailButton = () => {
    const isHomework = type === "Homework";

    if (role === "teacher") {
      if (isHomework) {
        return (
          <>
            <Link
              to={`/classroom/${classroomId}/homework-detail/${item._id}/update`}
            >
              <button className="btn btn-change">Sửa</button>
            </Link>
            <Link to={`/classroom/${classroomId}/homework-detail/${item._id}`}>
              <button className="btn btn-detail">Chi tiết</button>
            </Link>
          </>
        );
      } else {
        return (
          <>
            <Link
              to={`/classroom/${classroomId}/document/${item._id}/update`}
            >
              <button className="btn btn-change">Sửa</button>
            </Link>
            <button
              className="btn btn-detail"
              onClick={more ? handleCollapseDocument : handleShowDetailDocument}
            >
              {more ? "Thu gọn" : "Chi tiết"}
            </button>
          </>
        );
      }
    } else {
      if (isHomework) {
        return (
          <Link to={`/classroom/${classroomId}/homework/${item._id}`}>
            <button className="btn btn-detail">Chi tiết</button>
          </Link>
        );
      } else {
        return (
          <button
            className="btn btn-detail"
            onClick={more ? handleCollapseDocument : handleShowDetailDocument}
          >
            {more ? "Thu gọn" : "Chi tiết"}
          </button>
        );
      }
    }
  };

  if (loading) return <Loading />;
  if (err) return <div className="error">Đã xảy ra lỗi: {err?.response?.data?.message || "Không xác định"}</div>;

  const imgIconCard = type === "Homework" ? "homework_icon" : "document_icon";

  return (
    <div className="homework-card">
      <Card style={{ maxWidth: role === "student" ? 600 : 900 }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 20px",
            cursor: "default",
          }}
        >
          <CardMedia
            component="img"
            height={type === "Homework" ? "64" : "80"}
            image={pathImgFromIndex + imgIconCard + ".png"}
            alt="homework icon"
            style={{ width: "auto", display: "inline-block" }}
          />
          <div className="info">
            <span className="hw-name">{item?.title}</span>
            <div className="detail">
              {type === "Homework" ? (
                <span className="hw-deadline">
                  Hạn chót: {convertDate(item?.deadline)}
                </span>
              ) : (
                <span className="hw-createdAt">
                  Ngày đăng: {convertDate(item?.createdAt)}
                </span>
              )}
              {renderDetailButton()}
            </div>
          </div>
        </Box>
        {renderMore()}
      </Card>
    </div>
  );
}

export default HomeworkCard;
