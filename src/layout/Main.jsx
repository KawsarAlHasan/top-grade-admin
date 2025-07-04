import React, { useState, useEffect, useRef } from "react";
import { Breadcrumb, Layout, Drawer, Button } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const { Header, Content, Footer, Sider } = Layout;

const Main = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  // Breadcrumb create
  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return [
      { title: "Home", href: "/" },
      ...pathnames.map((value, index) => {
        const url = `/${pathnames.slice(0, index + 1).join("/")}`;
        return {
          title: value.charAt(0).toUpperCase() + value.slice(1),
          href: url,
        };
      }),
    ];
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Layout>
      {/* Header */}
      <Header className="bg-white sticky top-0 z-10 w-full flex items-center">
        <Navbar showDrawer={showDrawer} />
      </Header>

      <Layout>
        {isLargeScreen && (
          <Sider
            className="hidden lg:block h-screen fixed left-0 top-16"
            width={320}
            style={{
              backgroundColor: "#fff",
              overflow: "auto",
              height: "90vh",
              position: "fixed",
              insetInlineStart: 0,
              bottom: 64,
              scrollbarWidth: "thin",
              scrollbarGutter: "stable",
            }}
          >
            <Sidebar />
          </Sider>
        )}

        <Drawer
          title="Navigation"
          placement="left"
          onClose={closeDrawer}
          open={drawerVisible}
          styles={{
            body: { padding: 0 },
          }}
        >
          <Sidebar onClick={closeDrawer} />
        </Drawer>

        <Layout
          style={{
            marginLeft: isLargeScreen ? 320 : 0,
          }}
        >
          <Content className="px-6">
            <div className="flex justify-between">
              <Breadcrumb className="my-4">
                {generateBreadcrumbItems().map((item, index) => (
                  <Breadcrumb.Item key={index}>
                    <Link to={item.href}>{item.title}</Link>
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </div>

            <div
              className="p-6 min-h-[380px]"
              style={{ background: "#fff", borderRadius: "8px" }}
            >
              <Outlet />
            </div>
          </Content>

          <Footer className="text-center">
            Top Grade ©{new Date().getFullYear()} Created by Kawsar Al Hasan
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Main;
