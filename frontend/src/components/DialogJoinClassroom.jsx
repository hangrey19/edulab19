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
    Snackbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUserInfo,
    joinClassroom,
    resetJoinClassroom,
} from "../redux/modules/Home/action";

function DialogJoinClassroom(props) {
    const { openJoinDialog, handleCloseJoinDialog } = props;

    const dispatch = useDispatch();
    const [render, setRender] = useState(false);
    const [state, setState] = useState({ code: "" });
    const [emptyCodeNotice, setEmptyCodeNotice] = useState(false);

    const data = useSelector((state) => state.joinClassroomReducer.data);
    const loading = useSelector((state) => state.joinClassroomReducer.loading);
    const err = useSelector((state) => state.joinClassroomReducer.err);

    useEffect(() => {
        setState({ code: "" });
    }, [render]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleValidationCode = () => {
        if (state.code === "") {
            setEmptyCodeNotice(true);
        }
    };

    const handleReset = () => {
        dispatch(resetJoinClassroom());
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (state.code === "") {
            setEmptyCodeNotice(true);
            return;
        }
        dispatch(joinClassroom(state));
        setRender(!render);
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
        if (emptyCodeNotice) {
            return <Alert severity="error">Mã lớp học không được để trống</Alert>;
        }
        if (err) {
            return <Alert severity="error">{err?.response?.data?.message}</Alert>;
        }
    };

    const handleCloseSnackbar = () => {
        setEmptyCodeNotice(false);
    };

    useEffect(() => {
        if (data) {
            alert("Tham gia lớp học thành công");
            handleReset();
            handleCloseJoinDialog();
            dispatch(fetchUserInfo());
        }
    }, [data, dispatch, handleCloseJoinDialog]);

    return (
        <>
            <Dialog
                fullWidth
                maxWidth="xs"
                open={openJoinDialog}
                onClose={handleCloseJoinDialog}
            >
                <DialogTitle sx={{ pb: 0 }}>Tham gia lớp học</DialogTitle>

                <DialogContent>
                    {renderLoading()}
                    {renderNotice()}

                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="code"
                            label="Mã lớp học"
                            type="text"
                            id="code"
                            autoComplete="off"
                            onChange={handleChange}
                            onBlur={handleValidationCode}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ padding: "0 24px 20px" }}>
                    <Button variant="contained" color="error" onClick={handleCloseJoinDialog}>
                        Hủy
                    </Button>

                    <Button variant="contained" onClick={handleSubmit}>
                        Tham gia
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Thông báo lỗi sử dụng Snackbar */}
            <Snackbar
                open={emptyCodeNotice}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
                    Mã lớp học không được để trống
                </Alert>
            </Snackbar>
        </>
    );
}

export default DialogJoinClassroom;
