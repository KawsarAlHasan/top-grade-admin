import React, { useState } from "react";
import { Avatar, Dropdown, Button, Drawer, Badge, Space } from "antd";
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

  const profileMenuItems = [
    {
      key: "profile",
      label: (
        <Link to="/profile" className="flex items-center gap-2 px-1 py-2">
          <UserOutlined /> Profile
        </Link>
      ),
    },
    {
      key: "change-password",
      label: (
        <Link
          to="/change-password"
          className="flex items-center gap-2 px-1 py-2"
        >
          <SettingOutlined /> Change Password
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <span
          onClick={handleSignOut}
          className="flex items-center gap-2 px-1 py-2 hover:bg-gray-100"
        >
          <LogoutOutlined /> Logout
        </span>
      ),
    },
  ];

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <Button
              type="text"
              className="md:hidden mr-2"
              icon={<MenuOutlined className="text-lg" />}
              onClick={showDrawer}
            />
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 whitespace-nowrap"
            >
              Top Grade
            </Link>
          </div>

          {/* Right section */}
          <Dropdown
            menu={{ items: profileMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
            overlayClassName="w-48"
          >
            <Avatar
              icon={<UserOutlined />}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              size="default"
            />
          </Dropdown>

          <div className="lg:hidden">
            <Avatar
              icon={<UserOutlined />}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              size="default"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
