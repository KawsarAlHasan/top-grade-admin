import { Menu } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  TeamOutlined,
  ContainerOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { signOutAdmin } from "../api/api";

const { SubMenu } = Menu;

const Sidebar = ({ onClick }) => {
  const handleSignOut = () => {
    signOutAdmin();
  };

  const sidebarItems = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "3",
      icon: <TeamOutlined />,
      label: "Users",
      children: [
        {
          key: "3-1",
          label: <Link to="/students">Students</Link>,
        },
        {
          key: "3-2",
          label: <Link to="/teachers">Teachers</Link>,
        },
        {
          key: "3-3",
          label: <Link to="/users">All Role</Link>,
        },
      ],
    },
    {
      key: "4",
      icon: <ContainerOutlined />,
      label: "All Courses",
      children: [
        {
          key: "4-1",
          label: <Link to="/university-courses">University Courses</Link>,
        },
        {
          key: "4-2",
          label: <Link to="/school-courses">School Courses</Link>,
        },
      ],
    },
    {
      key: "5",
      icon: <BarChartOutlined />,
      label: "All Orders",
      children: [
        {
          key: "5-1",
          label: <Link to="/university-orders">University Orders</Link>,
        },
        {
          key: "5-2",
          label: <Link to="/school-orders">School Orders</Link>,
        },
      ],
    },
    {
      key: "6",
      icon: <ContainerOutlined />,
      label: <Link to="/assignments">Assignments</Link>,
    },

    {
      key: "8",
      icon: <SettingOutlined />,
      label: "Settings",
      children: [
        {
          key: "8-1",
          label: <Link to="/coupon">Coupon</Link>,
        },
        {
          key: "8-2",
          label: <Link to="/services-fees">Services Fees</Link>,
        },
        {
          key: "8-3",
          label: <Link to="/change-password">Change Password</Link>,
        },
      ],
    },
    // Add logout as a menu item at the bottom
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleSignOut,
      style: {
        position: "absolute",
        bottom: 0,
        width: "100%",
      },
      danger: true, // makes it red (Ant Design feature)
    },
  ];

  return (
    <div style={{ position: "relative", height: "90vh" }}>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={sidebarItems}
        onClick={onClick}
        style={{ height: "calc(100% - 64px)" }}
      />
    </div>
  );
};

export default Sidebar;
