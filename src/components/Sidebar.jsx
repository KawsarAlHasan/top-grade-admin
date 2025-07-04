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
      key: "6",
      icon: <BarChartOutlined />,
      label: <Link to="/courses-topics">Courses Topics</Link>,
    },
    {
      key: "7",
      icon: <BarsOutlined />,
      label: "Assignment",
      children: [
        {
          key: "7-1",
          label: <Link to="/order">All Orders</Link>,
        },
        {
          key: "7-2",
          label: <Link to="/order/regular">Regular Orders</Link>,
        },
        {
          key: "7-3",
          label: <Link to="/order/schedule">Schedule Orders</Link>,
        },
      ],
    },

    {
      key: "8",
      icon: <SettingOutlined />,
      label: "Settings",
      children: [
        {
          key: "8-3",
          label: <Link to="/tax-&-fees">Tax & Fees</Link>,
        },
        {
          key: "8-10",
          label: <Link to="/opening">Opening & Closing</Link>,
        },
        {
          key: "8-11",
          label: "Promotion & Coupons",
          children: [
            {
              key: "8-11-1",
              label: <Link to="/promotion">Promotion</Link>,
            },
            {
              key: "8-11-2",
              label: <Link to="/birthday-voucher">Birthday Voucher</Link>,
            },
            {
              key: "8-11-3",
              label: <Link to="/coupons">Coupons</Link>,
            },
          ],
        },
        {
          key: "8-4",
          label: "Terms, Banner & About Us",
          children: [
            {
              key: "8-5",
              label: <Link to="/banner">Banner</Link>,
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
