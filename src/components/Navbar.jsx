import React, { useEffect, useState } from "react";
import { Avatar, Menu, Dropdown, Button, Badge, Drawer } from "antd";
import { Link } from "react-router-dom";

import {
  MenuOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { signOutAdmin } from "../api/api";

const Navbar = ({ showDrawer }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleSignOut = () => {
    signOutAdmin();
  };

  // Menu items for the dropdown under the profile
  const profileMenuItems = [
    {
      key: "profile",
      label: (
        <Link to="/profile">
          <UserOutlined /> Profile
        </Link>
      ),
    },
    {
      key: "settings",
      label: (
        <Link to="/settings">
          <SettingOutlined /> Settings
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <span onClick={handleSignOut}>
          <LogoutOutlined /> Logout
        </span>
      ),
    },
  ];

  const profileMenu = {
    items: profileMenuItems,
  };

  const headerItems = [
    {
      label: (
        <Badge count={10} className="mt-[24px]">
          <BellOutlined
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => setDrawerVisible(true)}
          />
        </Badge>
      ),
    },
    {
      label: (
        <Dropdown menu={profileMenu} trigger={["click", "hover"]}>
          <Avatar icon={<UserOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-between w-full">
      {/* Logo on the left side */}
      <div className="logo">
        <Link className="text-2xl font-bold" to="/">
          Top Grade
          {/* <img
            src="https://crictoday.com/wp-content/uploads/2024/05/Shakib-a_d_d-1200x675.webp" // Replace with your logo URL
            alt="Logo"
            style={{ height: "40px" }}
          /> */}
        </Link>
      </div>

      {/* Button for small screens */}
      <Button
        className="lg:hidden block"
        icon={<MenuOutlined />}
        onClick={showDrawer}
      ></Button>

      {/* Menu items on the right side */}
      <Menu
        mode="horizontal"
        items={headerItems}
        className="hidden lg:flex justify-end flex-1 min-w-0"
      />

      {/* Drawer for notifications */}
      <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        hello
        {/* <Notification
          notification={notification}
          isLoading={isLoading}
          isError={isError}
          error={error}
          refetch={refetch}
        /> */}
      </Drawer>
    </div>
  );
};

export default Navbar;
