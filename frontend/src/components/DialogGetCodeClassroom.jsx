import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    Alert,
} from "@mui/material";
import React, { useState } from "react";

function DialogGetCodeClassroom(props) {
    const { openGetCodeDialog, handleCloseGetCodeDialog, classInfo } = props;
    const code = classInfo.code;

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const copyCodeToClipboard = () => {
        navigator.clipboard.writeText(code).then(() => {
            // Hiển thị thông báo sao chép thành công
            setOpenSnackbar(true);
            // Đóng dialog sau một khoảng thời gian ngắn
            setTimeout(() => {
                handleCloseGetCodeDialog();
            }, 1000); // Đợi 1 giây trước khi đóng dialog
        });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Dialog
                fullWidth
                maxWidth="xs"
                open={openGetCodeDialog}
                onClose={handleCloseGetCodeDialog}
            >
                <DialogTitle sx={{ pb: 0 }}>Lớp học {classInfo.name}</DialogTitle>

                <DialogContent>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Mã lớp học"
                            value={code}
                            InputProps={{
                                readOnly: true,
                            }}
                            type="text"
                            name="name"
                            autoComplete="off"
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ padding: "0 24px 20px" }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCloseGetCodeDialog}
                    >
                        Hủy
                    </Button>

                    <Button variant="contained" onClick={copyCodeToClipboard}>
                        Sao chép mã
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000} // Tự động ẩn sau 2 giây
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Mã lớp học đã được sao chép!
                </Alert>
            </Snackbar>
        </>
    );
}

export default DialogGetCodeClassroom;
