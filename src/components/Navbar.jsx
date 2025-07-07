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
        <Link to="/profile" className="flex items-center gap-2 px-4 py-2">
          <UserOutlined /> Profile
        </Link>
      ),
    },
    {
      key: "settings",
      label: (
        <Link to="/settings" className="flex items-center gap-2 px-4 py-2">
          <SettingOutlined /> Settings
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <span 
          onClick={handleSignOut} 
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
        >
          <LogoutOutlined /> Logout
        </span>
      ),
    },
  ];

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="flex items-center gap-4">
            <Badge 
              count={0} 
              size="small" 
              className="cursor-pointer hover:text-blue-500 transition-colors"
            >
              <BellOutlined
                className="text-xl"
                onClick={() => setDrawerVisible(true)}
              />
            </Badge>

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
          </div>
        </div>
      </div>

      <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={300}
        bodyStyle={{ padding: 0 }}
      >
        <div className="p-4">
          <p>No new notifications</p>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;