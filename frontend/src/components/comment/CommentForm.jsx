import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";

import {
  createComment,
  resetCreateComment,
} from "../../redux/modules/Stream/Comment/action";
import { fetchAllPost } from "../../redux/modules/Stream/Post/action";

function CommentForm(props) {
  const [text, setText] = useState("");
  const isTextareaDisabled = text.length === 0;

  const avatar = localStorage.getItem("avatar") || null;

  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(createComment(props.classroomId, props.id, { body: text }));
    setText("");
  };

  const dataCreateComment = useSelector(
    (state) => state.createCommentReducer?.data
  );

  // ✅ Di chuyển logic fetch lại bài post khi bình luận thành công vào useEffect
  useEffect(() => {
    if (dataCreateComment) {
      dispatch(fetchAllPost(props.classroomId));
      dispatch(resetCreateComment());
    }
  }, [dataCreateComment, dispatch, props.classroomId]);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="comment-form-display">
          <Avatar
            src={avatar}
            alt="avatar"
            sx={{ width: 40, height: 40 }}
          />
          <textarea
            className="form-control comment-form-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="comment-form-button" disabled={isTextareaDisabled}>
            {props.submitLabel}
          </button>
          {props.hasCancelButton && (
            <button
              type="button"
              className="comment-form-button comment-form-cancel-button"
              onClick={props.handleCancel}
            >
              <CancelIcon />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
