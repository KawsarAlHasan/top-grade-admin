import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  TeamOutlined,
  ContainerOutlined,
  SettingOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

const Sidebar = ({ onClick }) => {
  const sidebarItems = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "3",
      icon: <TeamOutlined />,
      label: <Link to="/users">All Users</Link>,
    },
    {
      key: "4",
      icon: <ContainerOutlined />,
      label: <Link to="/courses">Courses</Link>,
    },

    {
      key: "5",
      icon: <BarChartOutlined />,
      label: <Link to="/school-courses">School Courses</Link>,
    },
    {
      key: "6",
      icon: <BarChartOutlined />,
      label: <Link to="/orders">Orders</Link>,
    },

    {
      key: "8",
      icon: <SettingOutlined />,
      label: "Settings",
      children: [
        {
          key: "8-1",
          label: <Link to="/coupons">Coupons</Link>,
        },

        {
          key: "8-4-1",
          label: <Link to="/terms">Terms</Link>,
        },
        {
          key: "8-4-2",
          label: <Link to="/privacy">Privacy</Link>,
        },
        {
          key: "8-4-3",
          label: <Link to="/about-us">About us</Link>,
        },
      ],
    },
  ];

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={["1"]}
      items={sidebarItems}
      onClick={onClick}
    />
  );
};

export default Sidebar;
