import React from "react";
import {
  Card,
  Avatar,
  Tag,
  Row,
  Col,
  Divider,
  Button,
  Statistic,
  Skeleton,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
  CheckCircleOutlined,
  ProjectOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAdminProfile } from "../../api/api";

function Profile() {
  const { admin: data, isLoading, isError, error, refetch } = useAdminProfile();

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card className="text-center">
          <p className="text-red-500">Error loading profile: {error.message}</p>
          <Button type="primary" onClick={refetch} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const admin = {
    id: 1,
    name: "John Doe",
    email: "admin@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "Super Admin",
    joinDate: "2022-01-15",
    lastLogin: "2023-06-20T14:30:22Z",
    status: "active",
    contact: {
      phone: "+1 (555) 123-4567",
      address: "123 Admin St, Suite 100, Tech City",
    },
    stats: {
      totalLogins: 1245,
      tasksCompleted: 89,
      projects: 15,
    },
  };

  return (
    <div className="p-6">
      <Row gutter={[24, 24]}>
        {/* Profile Overview */}
        <Col xs={24} md={8}>
          <Card className="shadow-md">
            <div className="text-center">
              <Avatar
                size={120}
                src={admin.avatar}
                icon={<UserOutlined />}
                className="mb-4 border-2 border-blue-500"
              />
              <h2 className="text-2xl font-semibold mb-1">{admin.name}</h2>
              <Tag
                icon={<SafetyCertificateOutlined />}
                color={admin.status === "active" ? "success" : "error"}
                className="mb-4"
              >
                {admin.role}
              </Tag>

              <Divider className="my-4" />

              <div className="text-left space-y-3">
                <div className="flex items-center">
                  <MailOutlined className="text-gray-500 mr-2" />
                  <span>{admin.email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneOutlined className="text-gray-500 mr-2" />
                  <span>{admin.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <EnvironmentOutlined className="text-gray-500 mr-2" />
                  <span>{admin.contact.address}</span>
                </div>
                <div className="flex items-center">
                  <ClockCircleOutlined className="text-gray-500 mr-2" />
                  <span>
                    Joined {moment(admin.joinDate).format("MMMM Do, YYYY")}
                  </span>
                </div>
              </div>

              <Divider className="my-4" />

              {/* <Button type="primary" block className="mb-2">
                Edit Profile
              </Button> */}
              <Link to="/change-password">
                <Button block>Change Password</Button>
              </Link>
            </div>
          </Card>
        </Col>

        {/* Stats and Activity */}
        <Col xs={24} md={16}>
          <Row gutter={[24, 24]}>
            {/* Statistics */}
            <Col span={24}>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <Card className="shadow-sm">
                    <Statistic
                      title="Total Logins"
                      value={admin.stats.totalLogins}
                      prefix={<LoginOutlined />}
                      className="text-center"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card className="shadow-sm">
                    <Statistic
                      title="Tasks Completed"
                      value={admin.stats.tasksCompleted}
                      prefix={<CheckCircleOutlined />}
                      className="text-center"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card className="shadow-sm">
                    <Statistic
                      title="Projects"
                      value={admin.stats.projects}
                      prefix={<ProjectOutlined />}
                      className="text-center"
                    />
                  </Card>
                </Col>
              </Row>
            </Col>

            {/* Recent Activity */}
            <Col span={24}>
              <Card title="Recent Activity" className="shadow-md">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <DashboardOutlined className="text-blue-500 text-lg mr-3 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Logged in to dashboard</p>
                      <p className="text-gray-500 text-sm">
                        {moment(admin.lastLogin).fromNow()} •{" "}
                        {moment(admin.lastLogin).format("h:mm A")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ProjectOutlined className="text-green-500 text-lg mr-3 mt-1" />
                    <div>
                      <p className="font-medium mb-1">
                        Created new project "Admin Portal Redesign"
                      </p>
                      <p className="text-gray-500 text-sm">
                        {moment().subtract(2, "days").fromNow()} •{" "}
                        {moment().subtract(2, "days").format("MMM Do")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleOutlined className="text-purple-500 text-lg mr-3 mt-1" />
                    <div>
                      <p className="font-medium mb-1">
                        Completed user management module
                      </p>
                      <p className="text-gray-500 text-sm">
                        {moment().subtract(5, "days").fromNow()} •{" "}
                        {moment().subtract(5, "days").format("MMM Do")}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Account Settings */}
            <Col span={24}>
              <Card title="Account Settings" className="shadow-md">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Two-factor Authentication</p>
                      <p className="text-gray-500 text-sm">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Tag color="orange">Not Enabled</Tag>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-gray-500 text-sm">
                        Receive important updates
                      </p>
                    </div>
                    <Tag color="green">Enabled</Tag>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
