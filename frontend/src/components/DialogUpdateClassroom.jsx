import React, { useRef, useState, useEffect } from "react";
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
  updateClassroom,
  fetchUserInfo,
  resetUpdateClassroom,
} from "../redux/modules/Home/action";

function DialogUpdateClassroom(props) {
  const { openUpdateDialog, handleCloseUpdateDialog, classInfo } = props;
  const classroomId = classInfo._id;

  const [emptyNameNotice, setEmptyNameNotice] = useState(false);
  const inputName = useRef(null);
  const inputDescription = useRef(null);

  const dispatch = useDispatch();
  const [render, setRender] = useState(false);

  const data = useSelector((state) => state.updateClassroomReducer.data);
  const loading = useSelector((state) => state.updateClassroomReducer.loading);
  const err = useSelector((state) => state.updateClassroomReducer.err);

  const [state, setState] = useState({
    name: classInfo.name,
    description: classInfo.description,
  });

  useEffect(() => {
    setState({
      name: classInfo.name,
      description: classInfo.description,
    });
  }, [render, classInfo]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleValidationName = () => {
    if (state.name === "") {
      setEmptyNameNotice(true);
    }
  };

  const renderNotice = () => {
    if (emptyNameNotice) {
      setTimeout(() => setEmptyNameNotice(false), 1000);
      return <Alert severity="error">Tên lớp học không được để trống</Alert>;
    }
    if (err) {
      handleClearInput();
      setTimeout(handleReset, 1000);
      return <Alert severity="error">{err?.response.data.message}</Alert>;
    }
  };

  const handleClearInput = () => {
    if (inputName.current) inputName.current.value = classInfo.name;
    if (inputDescription.current)
      inputDescription.current.value = classInfo.description;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (state.name === "") {
      setEmptyNameNotice(true);
      return;
    }

    dispatch(updateClassroom(classroomId, state));
    setRender(!render);
  };

  const handleReset = () => {
    dispatch(resetUpdateClassroom());
  };

  const renderLoading = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      );
    }
  };

  if (data) {
    alert("Cập nhật lớp học thành công");
    handleReset();
    handleCloseUpdateDialog();
    dispatch(fetchUserInfo());
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
      >
        <DialogTitle sx={{ pb: 0 }}>Chỉnh sửa lớp học</DialogTitle>

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
              type="text"
              name="name"
              autoComplete="off"
              defaultValue={classInfo.name}
              onChange={handleChange}
              onBlur={handleValidationName}
            />
            <TextField
              inputRef={inputDescription}
              margin="normal"
              fullWidth
              name="description"
              label="Mô tả"
              type="text"
              id="Description"
              autoComplete="off"
              defaultValue={classInfo.description}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: "0 24px 20px" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseUpdateDialog}
          >
            Hủy
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogUpdateClassroom;
