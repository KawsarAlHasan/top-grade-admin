import React from "react";
import { useTopicsByCoursesID } from "../../api/api";
import { useParams } from "react-router-dom";
import {
  Card,
  Skeleton,
  Image,
  List,
  Typography,
  Alert,
  Button,
  Avatar,
  Row,
  Col,
  Tag,
  Divider,
  Space,
} from "antd";
import {
  AntDesignOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import CoursesTopicsTable from "./CoursesTopicsTable";

const { Title, Text } = Typography;

function CoursesTopic() {
  const { courseId } = useParams();
  const { topicsByCoursesID, isLoading, isError, error, refetch } =
    useTopicsByCoursesID(courseId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "pending":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "inactive":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Row gutter={[32, 32]} align="middle">
        <Col xs={24} md={8} lg={6}>
          <Avatar
            shape="square"
            size={240}
            icon={<AntDesignOutlined />}
            src={
              <Image
                src={topicsByCoursesID?.data?.image}
                alt={topicsByCoursesID?.data?.title}
                style={{ objectFit: "cover" }}
                preview={false}
              />
            }
            className="w-full h-auto"
          />
        </Col>
        <Col xs={24} md={16} lg={18}>
          <Space direction="vertical" size="middle">
            <Title level={2} className="m-0 text-3xl font-bold">
              {topicsByCoursesID?.data?.title}
            </Title>

            <Space size="large">
              <Space>
                <Text strong>Status:</Text>
                <Tag
                  icon={getStatusIcon(topicsByCoursesID?.data?.status)}
                  color={
                    topicsByCoursesID?.data?.status?.toLowerCase() === "active"
                      ? "success"
                      : topicsByCoursesID?.data?.status?.toLowerCase() ===
                        "pending"
                      ? "warning"
                      : "error"
                  }
                >
                  {topicsByCoursesID?.data?.status}
                </Tag>
              </Space>

              <Space>
                <Text strong>Total Topics:</Text>
                <Tag color="blue">
                  {topicsByCoursesID?.data?.courseTopic?.length || 0}
                </Tag>
              </Space>
            </Space>

            {topicsByCoursesID?.data?.description && (
              <Text type="secondary" className="text-lg">
                {topicsByCoursesID.data.description}
              </Text>
            )}
          </Space>
        </Col>
      </Row>

      <CoursesTopicsTable
        courseTopics={topicsByCoursesID?.data?.courseTopic}
        refetch={refetch}
      />
    </div>
  );
}

export default CoursesTopic;
