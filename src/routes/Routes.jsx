import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import Users from "../pages/users/Users";
import Main from "../layout/Main";
import NotFound from "../components/NotFound";
import Dashboard from "../pages/Dashboard";
import Courses from "../pages/courses/Courses";
import PrivateRoute from "./PrivageRoute";
import CoursesTopic from "../pages/coursesTopic/CoursesTopic";
import CoursesDetails from "../pages/coursesDeatails/CoursesDetails";
import TopicWithTeachers from "../pages/topicWithTeachers/TopicWithTeachers";
import Contents from "../pages/contents/Contents";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/courses/:courseId",
        element: <CoursesTopic />,
      },
      {
        path: "/courses/:courseId/:topicId",
        element: <TopicWithTeachers />,
      },
      {
        path: "/courses/:courseId/:topicId/:courseDetailsID",
        element: <Contents />,
      },
      {
        path: "/courses-details",
        element: <CoursesDetails />,
      },
      {
        path: "/users",
        element: <Users />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
