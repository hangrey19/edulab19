import Login from "../containers/AuthIntroTemplate/Login.jsx";
import Home from "../containers/HomeTemplate/Home.jsx";
import Intro from "../containers/AuthIntroTemplate/Intro.jsx";
import Register from "../containers/AuthIntroTemplate/Register.jsx";
import Stream from "../containers/ClassroomTemplate/Stream.jsx";
import Member from "../containers/ClassroomTemplate/Member.jsx";
import Calendar from "../containers/HomeTemplate/Calendar.jsx";
import TodoList from "../containers/HomeTemplate/TodoList.jsx";
import UserAccount from "../containers/HomeTemplate/UserAccount.jsx";
import Grade from "../containers/ClassroomTemplate/Grade.jsx";
import AssignHomework from "../containers/ClassroomTemplate/AssignHomework.jsx";
import SubmitHomework from "../containers/ClassroomTemplate/SubmitHomework.jsx";
import UploadDocument from "../containers/ClassroomTemplate/UploadDocument.jsx";
import HomeworkDetail from "../containers/ClassroomTemplate/HomeworkDetail.jsx";
import Homework from "../containers/ClassroomTemplate/Homework.jsx";
import UpdateHomework from "../containers/ClassroomTemplate/UpdateHomework.jsx";
import UpdateDocument from "../containers/ClassroomTemplate/UpdateDocument.jsx";
import { Navigate, useLocation } from "react-router-dom";

// Component để kiểm tra quyền truy cập
const TeacherRoute = ({ Component }) => {
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (role !== "teacher") {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Component />;
};

// Component để kiểm tra quyền truy cập classroom
const ClassroomRoute = ({ Component }) => {
  const role = localStorage.getItem("role");
  const classroomId = localStorage.getItem("classroomId");
  const location = useLocation();

  if (!role || !classroomId) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return <Component />;
};

const routeAuthIntro = [
    {
        exact: true,   // disable the partial comparison
        path: "/",
        component: Intro
    },
    {
        exact: false,
        path: "/login",
        component: Login
    },
    {
        exact: false,
        path: "/register",
        component: Register
    },
    {
        exact: false,
        path: "/unauthorized",
        component: () => (
            <div className="container mt-5 text-center">
                <h2>Không có quyền truy cập</h2>
                <p>Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ giáo viên nếu cần hỗ trợ.</p>
            </div>
        )
    }
]

const routeHome = [
    {
        exact: false,
        path: "/home",
        component: Home
    },
    {
        exact: false,
        path: "/calendar",
        component: Calendar
    },
    {
        exact: false,
        path: "/todo-list",
        component: TodoList
    },
    {
        exact: false,
        path: "/user-account",
        component: UserAccount
    },
]

const routeClassroom = [
    {
        exact: false,
        path: "/classroom/:classroomId/stream",
        component: (props) => <ClassroomRoute Component={() => <Stream {...props} />} />
    },
    {
        exact: false,
        path: "/classroom/:classroomId/member",
        component: (props) => <ClassroomRoute Component={() => <Member {...props} />} />
    },
    {
        exact: true,
        path: "/classroom/:classroomId/homework",
        component: (props) => <ClassroomRoute Component={() => <Homework {...props} />} />
    },
    {
        exact: false,
        path: "/classroom/:classroomId/grade",
        component: (props) => <ClassroomRoute Component={() => <Grade {...props} />} />
    },
    {
        exact: false,
        path: "/classroom/:classroomId/assign-homework",
        component: (props) => <TeacherRoute Component={() => <AssignHomework {...props} />} />
    },
    {
        exact: false,
        path: "/classroom/:classroomId/upload-document",
        component: (props) => <TeacherRoute Component={() => <UploadDocument {...props} />} />
    },
    {
        exact: false,
        path: "/classroom/:classroomId/homework/:homeworkId",
        component: (props) => <ClassroomRoute Component={() => <SubmitHomework {...props} />} />
    },
    {
        exact: true,
        path: "/classroom/:classroomId/homework-detail/:homeworkId/",
        component: (props) => <ClassroomRoute Component={() => <HomeworkDetail {...props} />} />
    },
    {
        exact: false,
        path: "/classroom/:classroomId/homework-detail/:homeworkId/update",
        component: (props) => <TeacherRoute Component={() => <UpdateHomework {...props} />} />
    },
    {
        exact: false,
        path: "/classroom/:classroomId/document/:documentId/update",
        component: (props) => <TeacherRoute Component={() => <UpdateDocument {...props} />} />
    },
];

export { routeHome, routeClassroom, routeAuthIntro };