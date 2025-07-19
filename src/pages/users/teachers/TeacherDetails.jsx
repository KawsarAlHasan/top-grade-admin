import React from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Rate,
  Tabs,
  Card,
  Tag,
  Divider,
  List,
  Skeleton,
  Alert,
  Button,
  Statistic,
  Row,
  Col,
  Descriptions,
  Badge,
  Collapse,
  Space,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  BookOutlined,
  ClockCircleOutlined,
  FileOutlined,
  DollarOutlined,
  ReloadOutlined,
  PercentageOutlined,
  IdcardOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  FieldNumberOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  PieChartOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

import { useTeacherWithDetails } from "../../../api/api";
import ResetEarnings from "./ResetEarnings";

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Countdown } = Statistic;

function TeacherDetails() {
  const { teacherId } = useParams();
  const { teacherDetails, isLoading, isError, error, refetch } =
    useTeacherWithDetails(teacherId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton active avatar paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
          action={
            <Button
              danger
              icon={<ReloadOutlined />}
              onClick={refetch}
              className="flex items-center"
            >
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  const teacher = teacherDetails?.data?.user;

  const homeTutoring = teacherDetails?.data?.homeTutoring || [];
  const courseDetails = teacherDetails?.data?.courseDetails || [];
  const assignments = teacherDetails?.data?.assignments || [];

  // Group assignments by status
  const groupedAssignments = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.status]) {
      acc[assignment.status] = [];
    }
    acc[assignment.status].push(assignment);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Delivered":
        return "green";
      case "Assigned":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Teacher Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar
              size={150}
              src={teacher?.profile_pic}
              icon={<UserOutlined />}
              className="border-2 border-blue-100"
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {teacher?.first_name} {teacher?.last_name}
                </h1>
                <p className="text-blue-600 mb-2">{teacher?.role}</p>
              </div>
              <Tag color={teacher?.status === "Active" ? "green" : "red"}>
                {teacher?.status}
              </Tag>
            </div>

            <div className="flex items-center mb-4">
              <Rate
                allowHalf
                defaultValue={teacher?.average_rating}
                disabled
                className="mr-2"
              />
              <span className="text-gray-600">
                ({teacher?.total_rating} reviews)
              </span>
            </div>

            <p className="text-gray-700 mb-6">{teacher?.description}</p>

            {/* Income Summary Section - Added this new section */}
            <div className="mb-6">
              <Divider orientation="left" orientationMargin={0}>
                <h3 className="text-lg font-semibold">Income Summary</h3>
              </Divider>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Card>
                  <Statistic
                    title="Total Earnings"
                    value={teacher?.total_total_amount.toFixed(2)}
                    prefix={<MoneyCollectOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                    suffix="$"
                  />
                </Card>

                <Card>
                  <Statistic
                    title="Net Payment"
                    value={teacher?.total_net_payment.toFixed(2)}
                    prefix={<PieChartOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                    suffix="$"
                  />
                </Card>

                <Card>
                  <Statistic
                    title="Total Tax"
                    value={teacher?.total_tax.toFixed(2)}
                    prefix={<PercentageOutlined />}
                    valueStyle={{ color: "#faad14" }}
                    suffix="$"
                  />
                </Card>

                <div className="flex items-center">
                  <div className="w-full">
                    <ResetEarnings teacher={teacher} refetch={refetch} />
                  </div>
                </div>
              </div>
            </div>

            <Row gutter={16} className="mb-4">
              <Col span={12}>
                <Statistic
                  title="Hourly Rate"
                  value={teacher?.price_per_hour}
                  prefix={<DollarOutlined />}
                  suffix="/hr"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Total Assignments"
                  value={assignments.length}
                  prefix={<FileOutlined />}
                />
              </Col>
            </Row>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <MailOutlined className="text-blue-500 mr-2" />
                <span className="text-gray-600">{teacher?.email}</span>
              </div>
              <div className="flex items-center">
                <PhoneOutlined className="text-blue-500 mr-2" />
                <span className="text-gray-600">{teacher?.phone}</span>
              </div>
              <div className="flex items-center">
                <GlobalOutlined className="text-blue-500 mr-2" />
                <span className="text-gray-600">{teacher?.country}</span>
              </div>
              <div className="flex items-center">
                <IdcardOutlined className="text-blue-500 mr-2" />
                <span className="text-gray-600">
                  UID: {teacher?.uid || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Introduction */}
      {teacher?.intro_video && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Introduction Video
          </h2>
          <div className="aspect-w-16 aspect-h-9">
            <video
              controls
              className="w-full h-auto rounded-lg"
              src={teacher?.intro_video}
              poster={teacher?.profile_pic}
            />
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Tabs defaultActiveKey="assignments">
          {/* Assignments Tab */}
          <TabPane
            tab={
              <span>
                <FileOutlined />
                Assignments ({assignments.length})
              </span>
            }
            key="assignments"
          >
            {Object.entries(groupedAssignments).map(([status, assignments]) => (
              <div key={status} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  <Badge
                    count={assignments.length}
                    style={{ backgroundColor: getStatusColor(status) }}
                    className="mr-2"
                  />
                  {status} Assignments
                </h3>

                <Collapse accordion className="assignment-collapse">
                  {assignments.map((assignment) => (
                    <Panel
                      key={assignment.id}
                      header={
                        <div className="flex justify-between items-center w-full">
                          <span>
                            <strong>Assignment #{assignment.id}</strong> -{" "}
                            {assignment.course_name}
                          </span>
                          <Space>
                            <Tag color={getStatusColor(assignment.status)}>
                              {assignment.status}
                            </Tag>
                            {assignment.lowest_bid && (
                              <Tag icon={<DollarOutlined />} color="green">
                                $ {assignment.lowest_bid?.toFixed(2)}
                              </Tag>
                            )}
                          </Space>
                        </div>
                      }
                      extra={<CalendarOutlined className="text-gray-500" />}
                    >
                      <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Course Type">
                          {assignment.courses_type}
                        </Descriptions.Item>
                        <Descriptions.Item label="Course Title">
                          {assignment?.course_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Student">
                          <div className="flex items-center">
                            <Avatar
                              src={assignment?.student_profile_pic}
                              className="mr-2"
                            />
                            {assignment?.student_first_name}{" "}
                            {assignment?.student_last_name}
                          </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                          {assignment.description || "No description provided"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Level">
                          {assignment.lavel || "Not specified"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Due Date">
                          {assignment.date}
                        </Descriptions.Item>
                        <Descriptions.Item label="Bid Time">
                          {new Date(assignment.bid_time).toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Bid Details">
                          <Space direction="vertical">
                            <div>
                              <InfoCircleOutlined /> Is Bid:{" "}
                              {assignment.is_bid ? "Yes" : "No"}
                            </div>
                            <div>
                              <DollarOutlined /> Lowest Bid: $
                              {assignment.lowest_bid}
                            </div>
                            <div>
                              <PercentageOutlined /> Tax: {assignment.tax}%
                            </div>
                            <div>
                              Total: $ {assignment.lowest_bid?.toFixed(2)}
                            </div>
                            <div>
                              Net Pament: ${assignment.net_payment || 0}
                            </div>
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Winning Bidder">
                          {assignment.winning_bidder ? (
                            <Tag icon={<CheckCircleOutlined />} color="green">
                              Teacher #{assignment.winning_bidder}
                            </Tag>
                          ) : (
                            <Tag color="orange">Not assigned yet</Tag>
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Panel>
                  ))}
                </Collapse>
              </div>
            ))}
          </TabPane>

          {/* Courses Tab */}
          <TabPane
            tab={
              <span>
                <BookOutlined />
                Courses
              </span>
            }
            key="courses"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseDetails.map((course) => (
                <Card
                  key={course.id}
                  title={course.title || "Untitled Course"}
                  className="shadow-sm hover:shadow-md"
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Topic">
                      {course.coursse_topic_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Duration">
                      {course.total_duration}
                    </Descriptions.Item>
                    <Descriptions.Item label="Chapters">
                      {course.total_chapter}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              ))}
            </div>
          </TabPane>

          {/* Home Tutoring Tab */}
          <TabPane
            tab={
              <span>
                <SolutionOutlined />
                Home Tutoring
              </span>
            }
            key="tutoring"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {homeTutoring.map((subject) => (
                <Card
                  key={subject.id}
                  cover={
                    <img
                      alt={subject.title}
                      src={subject.image}
                      className="h-32 object-cover"
                    />
                  }
                >
                  <Card.Meta
                    title={subject.title}
                    description="Available for home tutoring"
                  />
                </Card>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default TeacherDetails;
