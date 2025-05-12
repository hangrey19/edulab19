import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  deleteClassroom,
  fetchUserInfo,
  resetDeleteClassroom,
} from "../redux/modules/Home/action";

function DialogDeleteClassroom({ openDeleteDialog, handleCloseDeleteDialog, classInfo }) {
  const dispatch = useDispatch();
  const classroomId = classInfo._id;

  // Trạng thái loading và error
  const loading = useSelector((state) => state.deleteClassroomReducer.loading);
  const err = useSelector((state) => state.deleteClassroomReducer.err);
  const data = useSelector((state) => state.deleteClassroomReducer.data);

  // Hàm reset lỗi
  const handleReset = () => {
    dispatch(resetDeleteClassroom());
  };

  // Hàm xử lý khi người dùng xác nhận xóa lớp
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(deleteClassroom(classroomId));
  };

  // Render trạng thái loading
  const renderLoading = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      );
    }
  };

  // Render lỗi nếu có
  const renderError = () => {
    if (err) {
      return <Alert severity="error">{err?.response?.data?.message}</Alert>;
    }
  };

  // Khi xóa lớp học thành công, reset và đóng dialog
  useEffect(() => {
    if (data) {
      alert("Xóa lớp học thành công");
      dispatch(fetchUserInfo());
      handleReset();
      handleCloseDeleteDialog();
    }
  }, [data, dispatch, handleCloseDeleteDialog]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={openDeleteDialog}
      onClose={handleCloseDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ pb: 1 }}>
        Xóa lớp học
      </DialogTitle>

      <DialogContent>
        {renderLoading()}
        {renderError()}

        <DialogContentText sx={{ color: "inherit", mt: 1 }} id="alert-dialog-description">
          Lớp học {classInfo.name} sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn xóa lớp học này?
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ padding: "0 24px 20px" }}>
        <Button variant="contained" color="error" onClick={handleCloseDeleteDialog}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogDeleteClassroom;
