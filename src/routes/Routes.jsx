import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import Users from "../pages/users/Users";
import Main from "../layout/Main";
import NotFound from "../components/NotFound";
import Dashboard from "../pages/Dashboard";
import Courses from "../pages/courses/Courses";
import PrivateRoute from "./PrivageRoute";
import CoursesTopic from "../pages/coursesTopic/CoursesTopic";
import Contents from "../pages/contents/Contents";
import CourseDetails from "../pages/courseDetails/CourseDetails";
import SchoolCourses from "../pages/schoolCourses/SchoolCourses";
import SingleSchoolCourse from "../pages/singleSchoolCourse/SingleSchoolCourse";
import Orders from "../pages/orders/Orders";
import OrdersDetails from "../pages/orders/OrdersDetails";
import SchoolOrders from "../pages/schoolOrders/SchoolOrders";
import SchoolOrderDetails from "../pages/schoolOrders/SchoolOrderDetails";
import PackageVideos from "../pages/contents/Packages/packageVideos/PackageVideos";
import Profile from "../pages/profile/Profile";
import ChangePassword from "../pages/profile/ChangePassword";
import Coupon from "../pages/settings/Coupon";

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
        path: "/university-courses",
        element: <Courses />,
      },
      {
        path: "/university-courses/:courseId",
        element: <CoursesTopic />,
      },
      {
        path: "/university-courses/:courseId/:topicId",
        element: <CourseDetails />,
      },
      {
        path: "/university-courses/:courseId/:topicId/:courseDetailsID",
        element: <Contents />,
      },
      {
        path: "/university-courses/:courseId/:topicId/:courseDetailsID/:contentID",
        element: <PackageVideos />,
      },
      {
        path: "/school-courses",
        element: <SchoolCourses />,
      },
      {
        path: "/school-courses/:schoolCoursesID",
        element: <SingleSchoolCourse />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/university-orders",
        element: <Orders />,
      },
      {
        path: "/university-orders/:orderId",
        element: <OrdersDetails />,
      },
      {
        path: "/school-orders",
        element: <SchoolOrders />,
      },
      {
        path: "/school-orders/:schoolOrderId",
        element: <SchoolOrderDetails />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/coupon",
        element: <Coupon />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
