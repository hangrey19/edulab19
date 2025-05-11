import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  createClassroom,
  resetCreateClassroom,
  fetchUserInfo,
} from "../redux/modules/Home/action";

function DialogCreateClassroom({ openCreateDialog, handleCloseCreateDialog }) {
  const dispatch = useDispatch();

  // Trạng thái lỗi và loading
  const loading = useSelector((state) => state.createClassroomReducer.loading);
  const error = useSelector((state) => state.createClassroomReducer.err);
  const data = useSelector((state) => state.createClassroomReducer.data);

  // Trạng thái lớp học (name, description)
  const [state, setState] = useState({
    name: "",
    description: "",
  });

  // Lỗi khi name bị trống
  const [emptyNameNotice, setEmptyNameNotice] = useState(false);

  const inputName = useRef(null);
  const inputDescription = useRef(null);

  useEffect(() => {
    // Reset trạng thái khi dialog đóng
    setState({
      name: "",
      description: "",
    });
  }, [openCreateDialog]);

  // Hàm xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  // Hàm xác nhận tên lớp học không được trống
  const handleValidationName = () => {
    if (!state.name) {
      setEmptyNameNotice(true);
    }
  };

  // Hàm gửi yêu cầu tạo lớp học
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!state.name) {
      setEmptyNameNotice(true);
      return;
    }

    dispatch(createClassroom(state));
  };

  // Hàm render thông báo lỗi
  const renderNotice = () => {
    if (emptyNameNotice) {
      setTimeout(() => setEmptyNameNotice(false), 1000);
      return <Alert severity="error">Tên lớp học không được để trống</Alert>;
    }

    if (error) {
      return <Alert severity="error">{error?.response?.data?.message}</Alert>;
    }
  };

  // Hàm render trạng thái loading
  const renderLoading = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      );
    }
  };

  // Hàm reset và đóng dialog khi tạo lớp học thành công
  useEffect(() => {
    if (data) {
      alert("Tạo lớp học thành công");
      dispatch(resetCreateClassroom());
      handleCloseCreateDialog();
      dispatch(fetchUserInfo());
    }
  }, [data, dispatch, handleCloseCreateDialog]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={openCreateDialog}
      onClose={handleCloseCreateDialog}
    >
      <DialogTitle sx={{ pb: 0 }}>Tạo lớp học</DialogTitle>

      <DialogContent>
        {renderLoading()}
        {renderNotice()}

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            inputRef={inputName}
            margin="normal"
            required
            fullWidth
            id="name"
            label="Tên lớp học"
            name="name"
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleValidationName}
            value={state.name}
          />

          <TextField
            inputRef={inputDescription}
            margin="normal"
            fullWidth
            name="description"
            label="Mô tả"
            type="text"
            id="description"
            autoComplete="off"
            onChange={handleChange}
            value={state.description}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "0 24px 20px" }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleCloseCreateDialog}
        >
          Hủy
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          Tạo lớp
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogCreateClassroom;
