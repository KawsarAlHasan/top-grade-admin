import { useSingleTopicsWithTeacher } from "../../api/api";
import {
  Skeleton,
  Image,
  Typography,
  Alert,
  Avatar,
  Row,
  Col,
  Space,
  Button,
  Card,
  Tag,
  Divider,
  Badge,
  Tabs,
} from "antd";
import {
  AntDesignOutlined,
  ReloadOutlined,
  BookOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import CourseDetailsTable from "./CourseDetailsTable";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function TopicWithTeachers() {
  const { topicId, courseId } = useParams();
  const { topicsWithTeacher, isLoading, isError, error, refetch } =
    useSingleTopicsWithTeacher(topicId);

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton active avatar paragraph={{ rows: 6 }} />
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

  const topicData = topicsWithTeacher?.data;
  const courseData = topicData?.course;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card bordered={false} className="mb-6">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={8} lg={6}>
            <Badge.Ribbon
              text={courseData?.status}
              color={
                courseData?.status?.toLowerCase() === "active"
                  ? "green"
                  : courseData?.status?.toLowerCase() === "pending"
                  ? "orange"
                  : "red"
              }
            >
              <Avatar
                shape="square"
                size={240}
                icon={<AntDesignOutlined />}
                src={
                  <Image
                    src={courseData?.image}
                    alt={courseData?.title}
                    style={{ objectFit: "cover" }}
                    preview={false}
                  />
                }
                className="w-full h-auto shadow-md"
              />
            </Badge.Ribbon>
          </Col>
          <Col xs={24} md={16} lg={18}>
            <Space direction="vertical" size="middle" className="w-full">
              <div>
                <Text
                  type="secondary"
                  className="text-sm uppercase tracking-wider"
                >
                  Course
                </Text>
                <Title level={2} className="m-0 text-3xl font-bold">
                  {courseData?.title}
                </Title>
              </div>

              <Divider className="my-2" />

              <div>
                <Text
                  type="secondary"
                  className="text-sm uppercase tracking-wider"
                >
                  Topic
                </Text>
                <Title level={3} className="m-0 text-2xl font-semibold">
                  {topicData?.name}
                </Title>
                {topicData?.description && (
                  <Text className="mt-2 text-gray-600">
                    {topicData.description}
                  </Text>
                )}
              </div>

              <Space size="large" className="mt-4">
                <Space>
                  <Text strong>Course Status:</Text>
                  <Tag
                    icon={getStatusIcon(courseData?.status)}
                    color={
                      courseData?.status?.toLowerCase() === "active"
                        ? "success"
                        : courseData?.status?.toLowerCase() === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {courseData?.status}
                  </Tag>
                </Space>

                <Space>
                  <Text strong>Teachers:</Text>
                  <Tag icon={<TeamOutlined />} color="blue">
                    {topicData?.teachers?.length || 0}
                  </Tag>
                </Space>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      <CourseDetailsTable refetch={refetch} teachers={topicData?.teachers} />
    </div>
  );
}

export default TopicWithTeachers;
