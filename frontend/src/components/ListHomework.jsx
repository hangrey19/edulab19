import React, { useEffect, useState } from "react";
import { Box, Tab, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import VerticalListHomework from "./VerticalListHomework";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  actFetchDocumentList,
  actFetchHomeworkList,
} from "../redux/modules/Homework/action";

export default function ListHomework() {
  const [value, setValue] = useState("homework");
  const dispatch = useDispatch();
  const classroomId = localStorage.getItem("classroomId");

  const {
    data: dataHomework,
    loading: loadingHomework,
    err: errHomework,
    key: keyHomework,
  } = useSelector((state) => state.homeworkReducer);

  const {
    data: dataDocument,
    loading: loadingDocument,
    err: errDocument,
    key: keyDocument,
  } = useSelector((state) => state.documentReducer);

  useEffect(() => {
    if (classroomId) {
      dispatch(actFetchHomeworkList(classroomId));
      dispatch(actFetchDocumentList(classroomId));
    }
  }, [dispatch, classroomId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loadingHomework || loadingDocument) return <Loading />;

  if (errHomework || errDocument) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Đã xảy ra lỗi khi tải dữ liệu!
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="list-homework" sx={{ width: "100%" }}>
      <TabContext value={value}>
        <TabList centered onChange={handleChange}>
          <Tab label="Danh sách bài tập" value="homework" />
          <Tab label="Danh sách tài liệu" value="document" />
        </TabList>

        <TabPanel value="homework">
          {dataHomework?.length === 0 ? (
            <Notification message="Hiện không có bài tập nào!" />
          ) : (
            <VerticalListHomework
              type="Homework"
              listHomework={dataHomework}
              keySearch={keyHomework}
            />
          )}
        </TabPanel>

        <TabPanel value="document">
          {dataDocument?.length === 0 ? (
            <Notification message="Hiện không có tài liệu nào!" />
          ) : (
            <VerticalListHomework
              type="Document"
              listHomework={dataDocument}
              keySearch={keyDocument}
            />
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
}

function Notification({ message }) {
  return (
    <Typography className="notification-nothing" variant="h6" sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "red" }}>
      <NotInterestedIcon sx={{ mr: 1 }} />
      {message}
    </Typography>
  );
}
