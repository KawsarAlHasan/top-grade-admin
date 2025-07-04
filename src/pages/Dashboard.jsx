import React from "react";
import { Layout, Card, Row, Col, Table, Progress, Tag, Space } from "antd";
import {
  BookOutlined,
  UserOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  HomeOutlined,
  BankOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;

const Dashboard = () => {
  // Demo data
  const stats = [
    {
      id: 1,
      title: "Total Courses",
      value: 48,
      icon: <BookOutlined />,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Course Topics",
      value: 326,
      icon: <FileTextOutlined />,
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Home Tutors",
      value: 24,
      icon: <HomeOutlined />,
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "School Courses",
      value: 15,
      icon: <BankOutlined />,
      color: "bg-yellow-500",
    },
    {
      id: 5,
      title: "Semesters",
      value: 8,
      icon: <CalendarOutlined />,
      color: "bg-pink-500",
    },
    {
      id: 6,
      title: "Users",
      value: 1243,
      icon: <UserOutlined />,
      color: "bg-indigo-500",
    },
    {
      id: 7,
      title: "Videos",
      value: 587,
      icon: <VideoCameraOutlined />,
      color: "bg-red-500",
    },
    {
      id: 8,
      title: "Study Notes",
      value: 412,
      icon: <FileTextOutlined />,
      color: "bg-teal-500",
    },
  ];

  const popularCourses = [
    {
      id: 1,
      name: "Advanced Mathematics",
      enrolled: 245,
      progress: 78,
      status: "active",
    },
    {
      id: 2,
      name: "Physics Fundamentals",
      enrolled: 189,
      progress: 65,
      status: "active",
    },
    {
      id: 3,
      name: "Literature 101",
      enrolled: 132,
      progress: 42,
      status: "active",
    },
    {
      id: 4,
      name: "Computer Science",
      enrolled: 321,
      progress: 88,
      status: "active",
    },
    {
      id: 5,
      name: "Business Studies",
      enrolled: 97,
      progress: 35,
      status: "inactive",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      joined: "2023-05-15",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      joined: "2023-05-18",
      status: "active",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      joined: "2023-05-20",
      status: "pending",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      joined: "2023-05-22",
      status: "active",
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "robert@example.com",
      joined: "2023-05-25",
      status: "inactive",
    },
  ];

  const columnsCourses = [
    { title: "Course Name", dataIndex: "name", key: "name" },
    { title: "Enrolled", dataIndex: "enrolled", key: "enrolled" },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (text) => <Progress percent={text} size="small" />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={text === "active" ? "green" : "red"}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const columnsUsers = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Joined", dataIndex: "joined", key: "joined" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={
            text === "active" ? "green" : text === "pending" ? "orange" : "red"
          }
        >
          {text.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      {/* <Header className="bg-white shadow">
        <h1 className="text-xl font-semibold">Education Platform Dashboard</h1>
      </Header> */}
      <Content className="p-6">
        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          {stats.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={3} key={item.id}>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <div
                  className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-3`}
                >
                  {React.cloneElement(item.icon, { className: "text-xl" })}
                </div>
                <h3 className="text-gray-500 text-sm">{item.title}</h3>
                <p className="text-2xl font-bold">
                  {item.value.toLocaleString()}
                </p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Main Content */}
        <Row gutter={[16, 16]}>
          {/* Popular Courses */}
          <Col xs={24} lg={12}>
            <Card title="Popular Courses" className="shadow-md">
              <Table
                dataSource={popularCourses}
                columns={columnsCourses}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </Card>
          </Col>

          {/* Recent Users */}
          <Col xs={24} lg={12}>
            <Card title="Recent Users" className="shadow-md">
              <Table
                dataSource={recentUsers}
                columns={columnsUsers}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </Card>
          </Col>
        </Row>

        {/* Additional Stats */}
        <Row gutter={[16, 16]} className="mt-6">
          <Col xs={24} md={12}>
            <Card title="Course Distribution" className="shadow-md">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-medium">School Courses</h4>
                  <p className="text-gray-500">15 courses (31%)</p>
                </div>
                <div>
                  <h4 className="font-medium">University Courses</h4>
                  <p className="text-gray-500">22 courses (46%)</p>
                </div>
                <div>
                  <h4 className="font-medium">Professional</h4>
                  <p className="text-gray-500">11 courses (23%)</p>
                </div>
              </div>
              <Progress percent={31} strokeColor="#3B82F6" />
              <Progress percent={46} strokeColor="#10B981" className="mt-2" />
              <Progress percent={23} strokeColor="#F59E0B" className="mt-2" />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="User Activity" className="shadow-md">
              <div className="flex justify-between mb-4">
                <div>
                  <h4 className="font-medium">Active Users</h4>
                  <p className="text-gray-500">1,023 (82%)</p>
                </div>
                <div>
                  <h4 className="font-medium">Inactive Users</h4>
                  <p className="text-gray-500">220 (18%)</p>
                </div>
              </div>
              <Progress
                type="circle"
                percent={82}
                strokeColor="#10B981"
                format={(percent) => `${percent}% Active`}
                width={150}
                className="mx-auto"
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
