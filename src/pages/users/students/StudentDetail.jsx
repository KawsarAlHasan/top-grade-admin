import React from "react";
import { useParams } from "react-router-dom";
import { useStudentWithDetails } from "../../../api/api";
import {
  Alert,
  Skeleton,
  Button,
  Card,
  Tag,
  Divider,
  Avatar,
  Rate,
  List,
  Typography,
} from "antd";
import {
  ReloadOutlined,
  FilePdfOutlined,
  UserOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;

function StudentDetail() {
  const { studentId } = useParams();
  const { studentDetails, isLoading, isError, error, refetch } =
    useStudentWithDetails(studentId);

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

  const { student, assignments } = studentDetails.data;

  const getStatusTag = (status) => {
    let color = "";
    switch (status) {
      case "Active":
        color = "green";
        break;
      case "Pending":
        color = "orange";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  const getAssignmentStatusTag = (status) => {
    let color = "";
    switch (status) {
      case "Completed":
        color = "green";
        break;
      case "In Progress":
        color = "blue";
        break;
      case "Pending":
        color = "orange";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Student Profile Section */}
      <Card className="mb-8 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar
            size={120}
            src={student.profile_pic || null}
            icon={!student.profile_pic && <UserOutlined />}
            className="bg-gray-200"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start flex-wrap">
              <div>
                <Title level={2} className="mb-1">
                  {student.first_name} {student.last_name}
                </Title>
                <Text type="secondary" className="block mb-2">
                  {student.email}
                </Text>
              </div>
              <div className="text-right">
                {getStatusTag(student.status)}
                <div className="mt-2">
                  <Rate disabled defaultValue={student.average_rating} />
                  <Text type="secondary" className="block">
                    {student.total_rating} reviews
                  </Text>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Text strong>Country:</Text>
                <Text className="block">{student.country}</Text>
              </div>
              <div>
                <Text strong>Phone:</Text>
                <Text className="block">{student.phone}</Text>
              </div>
              <div>
                <Text strong>Price Per Hour:</Text>
                <Text className="block">${student.price_per_hour}</Text>
              </div>
            </div>

            {student.description && (
              <>
                <Divider className="my-4" />
                <div>
                  <Text strong>About:</Text>
                  <Text className="block">{student.description}</Text>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Assignments Section */}
      <Title level={3} className="mb-6">
        Assignments ({assignments.length})
      </Title>

      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 3,
        }}
        dataSource={assignments}
        renderItem={(assignment) => (
          <List.Item
            key={assignment.id}
            extra={
              <div className="w-full md:w-48 text-center">
                <img
                  alt={assignment.course_title}
                  src={assignment.course_image}
                  className="w-full h-auto rounded-lg"
                />
                <Text strong className="block mt-2">
                  {assignment.course_title}
                </Text>
              </div>
            }
          >
            <List.Item.Meta
              title={
                <div className="flex justify-between flex-wrap">
                  <span>
                    Assignment #{assignment.id} - {assignment.courses_type}
                  </span>
                  {getAssignmentStatusTag(assignment.status)}
                </div>
              }
              description={
                <div className="space-y-2">
                  <div>
                    <Text strong>Due Date:</Text> {assignment.date}
                  </div>
                  {assignment.description && (
                    <div>
                      <Text strong>Description:</Text> {assignment.description}
                    </div>
                  )}
                </div>
              }
            />

            {assignment.is_bid && (
              <div className="mt-4">
                <Text strong>Bidding Information:</Text>
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <div className="flex justify-between">
                    <Text>
                      Lowest Bid: <Text strong>${assignment.lowest_bid}</Text>
                    </Text>
                    <Text>
                      Total Bids: <Text strong>{assignment.bids.length}</Text>
                    </Text>
                  </div>
                  {assignment.winning_bidder_id && (
                    <div className="mt-2">
                      <Text strong>Winning Bidder:</Text>{" "}
                      {assignment.winning_bidder_first_name}{" "}
                      {assignment.winning_bidder_last_name}
                    </div>
                  )}
                </div>
              </div>
            )}
          </List.Item>
        )}
      />
    </div>
  );
}

export default StudentDetail;
