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
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addScore, resetAddScore, fetchAllSubmission } from "../redux/modules/HomeworkDetail/action";

function DialogAddScore(props) {
  const { openAddScoreDialog, handleCloseAddScoreDialog, studentId } = props;
  const { homeworkId } = useParams();
  
  const inputScore = useRef(null);
  const inputComment = useRef(null);
  
  const dispatch = useDispatch();
  
  const data = useSelector((state) => state.addScoreReducer.data);
  const loading = useSelector((state) => state.addScoreReducer.loading);
  const err = useSelector((state) => state.addScoreReducer.err);
  
  const [state, setState] = useState({
    homeworkId,
    studentId,
    score: "",
    comment: "",
  });

  const [emptyScoreNotice, setEmptyScoreNotice] = useState(false);

  useEffect(() => {
    setState({
      homeworkId,
      studentId,
      score: "",
      comment: "",
    });
  }, [homeworkId, studentId]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleValidationScore = () => {
    if (state.score === "") {
      setEmptyScoreNotice(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (state.score === "") {
      setEmptyScoreNotice(true);
      return;
    }

    dispatch(addScore(state));
  };

  const handleReset = () => {
    dispatch(resetAddScore());
    setState({
      homeworkId,
      studentId,
      score: "",
      comment: "",
    });
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

  const renderNotice = () => {
    if (emptyScoreNotice) {
      setTimeout(() => setEmptyScoreNotice(false), 1000);
      return <Alert severity="error">Điểm số không được để trống</Alert>;
    }

    if (err) {
      handleReset();
      setTimeout(handleReset, 1000);
      return <Alert severity="error">{err?.response.data.message}</Alert>;
    }
  };

  useEffect(() => {
    if (data) {
      alert("Chấm điểm thành công");
      handleReset();
      handleCloseAddScoreDialog();
      dispatch(fetchAllSubmission(homeworkId));
    }
  }, [data, dispatch, homeworkId, handleCloseAddScoreDialog]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={openAddScoreDialog}
      onClose={handleCloseAddScoreDialog}
    >
      <DialogTitle sx={{ pb: 0 }}>Chấm điểm bài nộp</DialogTitle>
      
      <DialogContent>
        {renderLoading()}
        {renderNotice()}

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            inputRef={inputScore}
            margin="normal"
            required
            fullWidth
            id="score"
            label="Điểm số"
            type="number"
            name="score"
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleValidationScore}
          />

          <TextField
            inputRef={inputComment}
            margin="normal"
            fullWidth
            name="comment"
            label="Nhận xét"
            type="text"
            id="comment"
            autoComplete="off"
            onChange={handleChange}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "0 24px 20px" }}>
        <Button variant="contained" color="error" onClick={handleCloseAddScoreDialog}>
          Hủy
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          Chấm điểm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogAddScore;
