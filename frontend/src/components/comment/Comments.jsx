import { useState, useEffect } from "react";
import CommentForm from "./CommentForm.jsx";
import Comment from "./Comment.jsx";
import SendIcon from "@mui/icons-material/Send";

function Comments(props) {
  const [activeComment, setActiveComment] = useState(null);
  const [userId, setUserId] = useState(null);

  // Lấy userId từ localStorage khi component mount
  useEffect(() => {
    const user = localStorage.getItem("User");
    if (user) {
      setUserId(JSON.parse(user).user._id);
    }
  }, []); // Chạy chỉ một lần khi component được mount

  const rootComments = props.rootComments;

  return (
    <div className="comments">
      <div className="comments-container">
        {rootComments?.map((rootComment) => (
          <Comment
            classroomId={props.classroomId}
            postId={props.id}
            className="comment-child"
            key={rootComment._id}
            comment={rootComment}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            currentUserId={userId}
          />
        ))}
      </div>
      <CommentForm
        classroomId={props.classroomId}
        id={props.id}
        submitLabel={<SendIcon />}
        // handleSubmit={addComment}  // Đảm bảo rằng bạn sẽ thêm chức năng này sau
      />
    </div>
  );
}

export default Comments;
