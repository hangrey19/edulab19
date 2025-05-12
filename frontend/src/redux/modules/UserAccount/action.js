import axios from "axios";
import { pathAPI } from "../../../utils/constants";
import * as actionTypes from "./constants";

// action Fetch All Task
export const changeAvatar = (avatar) => {
    let accessToken = "";
    if (localStorage.getItem("User"))
        accessToken = JSON.parse(localStorage.getItem("User")).token;

    // Kiểm tra file
    if (!avatar || !(avatar instanceof File)) {
        return (dispatch) => {
            dispatch(changeAvatarFailed({ response: { data: { message: "File không hợp lệ" } } }));
        }
    }

    // Kiểm tra kích thước file (giới hạn 5MB)
    if (avatar.size > 5 * 1024 * 1024) {
        return (dispatch) => {
            dispatch(changeAvatarFailed({ response: { data: { message: "File quá lớn (tối đa 5MB)" } } }));
        }
    }

    // Kiểm tra định dạng file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(avatar.type)) {
        return (dispatch) => {
            dispatch(changeAvatarFailed({ response: { data: { message: "Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)" } } }));
        }
    }

    let formData = new FormData();
    formData.append("avatar", avatar);

    return (dispatch) => {
        dispatch(changeAvatarRequest());
        axios({
            url: pathAPI + "/user/changeAvatar",
            method: "POST",
            data: formData,
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => {
                dispatch(changeAvatarSuccess(res.data));
            })
            .catch(err => {
                dispatch(changeAvatarFailed(err));
            })
    }
}
export const resetAvatar = () => {
    return (dispatch) => {
        dispatch(changeAvatarReset());
    }
}
const changeAvatarRequest = () => {
    return {
        type: actionTypes.CHANGE_AVATAR_REQUEST
    }
}

const changeAvatarSuccess = (data) => {
    return {
        type: actionTypes.CHANGE_AVATAR_SUCCESS,
        payload: data
    }
}

const changeAvatarFailed = (err) => {
    return {
        type: actionTypes.CHANGE_AVATAR_FAILED,
        payload: err
    }
}

const changeAvatarReset = () => {
    return {
        type: actionTypes.CHANGE_AVATAR_RESET,
    }
}


