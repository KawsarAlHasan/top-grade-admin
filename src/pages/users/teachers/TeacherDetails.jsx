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
} from "@ant-design/icons";
import { useTeacherWithDetails } from "../../../api/api";

const { TabPane } = Tabs;

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
  const courses = teacherDetails?.data?.courses || [];
  const courseDetails = teacherDetails?.data?.courseDetails || [];
  const assignments = teacherDetails?.data?.assignments || [];

  // Group course details by course name
  const groupedCourses = courseDetails.reduce((acc, course) => {
    if (!acc[course.course_name]) {
      acc[course.course_name] = [];
    }
    acc[course.course_name].push(course);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Teacher Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar
              size={150}
              src={teacher.profile_pic}
              icon={<UserOutlined />}
              className="border-2 border-blue-100"
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {teacher.first_name} {teacher.last_name}
                </h1>
                <p className="text-blue-600 mb-2">{teacher.role}</p>
              </div>
              <Tag color={teacher.status === "Active" ? "green" : "red"}>
                {teacher.status}
              </Tag>
            </div>

            <div className="flex items-center mb-4">
              <Rate
                allowHalf
                defaultValue={teacher.average_rating}
                disabled
                className="mr-2"
              />
              <span className="text-gray-600">
                ({teacher.total_rating} reviews)
              </span>
            </div>

            <p className="text-gray-700 mb-6">{teacher.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <MailOutlined className="text-blue-500 mr-2" />
                <span className="text-gray-600">{teacher.email}</span>
              </div>
              <div className="flex items-center">
                <PhoneOutlined className="text-blue-500 mr-2" />
                <span className="text-gray-600">{teacher.phone}</span>
              </div>
              <div className="flex items-center">
                <GlobalOutlined className="text-blue-500 mr-2" />
                <span className="text-gray-600">{teacher.country}</span>
              </div>
              <div className="flex items-center">
                <DollarOutlined className="text-blue-500 mr-2" />
                <span className="text-gray-600">
                  ${teacher.price_per_hour}/hour
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Introduction */}
      {teacher.intro_video && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Introduction Video
          </h2>
          <div className="aspect-w-16 aspect-h-9">
            <video
              controls
              className="w-full h-auto rounded-lg"
              src={teacher.intro_video}
            />
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Tabs defaultActiveKey="1" className="p-4">
          <TabPane
            tab={
              <span>
                <BookOutlined />
                Courses
              </span>
            }
            key="1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedCourses).map(([courseName, details]) => (
                <Card
                  key={courseName}
                  title={courseName}
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={
                        courses.find((c) => c.title === courseName)?.image ||
                        "https://via.placeholder.com/50"
                      }
                      alt={courseName}
                      className="w-12 h-12 object-cover mr-3"
                    />
                    <span className="font-medium">{courseName}</span>
                  </div>
                  <Divider className="my-3" />
                  <List
                    dataSource={details}
                    renderItem={(item) => (
                      <List.Item>
                        <div className="w-full">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              Topic #{item.course_topic_id}
                            </span>
                            <Tag color="blue">{item.total_chapter}</Tag>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <ClockCircleOutlined className="mr-1" />
                            {item.total_duration}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              ))}
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileOutlined />
                Assignments
              </span>
            }
            key="2"
          >
            <List
              itemLayout="vertical"
              dataSource={assignments}
              renderItem={(assignment) => (
                <List.Item>
                  <div className="w-full p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">
                          {assignment.course_name} - {assignment.courses_type}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {assignment.description}
                        </p>
                        <div className="flex items-center text-gray-500 text-sm">
                          <span className="mr-3">
                            Due:{" "}
                            {new Date(assignment.date).toLocaleDateString()}
                          </span>
                          {assignment.lowest_bid && (
                            <span>Lowest bid: ${assignment.lowest_bid}</span>
                          )}
                        </div>
                      </div>
                      <Tag
                        color={
                          assignment.status === "Pending" ? "orange" : "green"
                        }
                      >
                        {assignment.status}
                      </Tag>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default TeacherDetails;
