import React from "react";
import { useParams } from "react-router-dom";
import { useSingleSchoolCourse } from "../../api/api";
import {
  Avatar,
  Card,
  Col,
  Divider,
  Row,
  Image,
  Space,
  Tabs,
  Tag,
  Typography,
  Alert,
  Button,
  Skeleton,
} from "antd";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  BookOutlined,
  AntDesignOutlined,
  ReadOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import HomeTutoring from "./homeTutoring/HomeTutoring";
import StudyNotes from "./studyNotes/StudyNotes";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

function SingleSchoolCourse() {
  const { schoolCoursesID } = useParams();

  const { singleSCDetail, isLoading, isError, error, refetch } =
    useSingleSchoolCourse(schoolCoursesID);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (isError) {
    if (error?.response?.status === 404) {
      return (
        <div className="p-4">
          <Alert
            message="No Data"
            description="No course content found for this topic and teacher."
            type="info"
            showIcon
          />
        </div>
      );
    }

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

  const homeTutoringData = singleSCDetail?.homeTutoringData;
  const studyNotesData = singleSCDetail?.studyNotes;

  return (
    <div>
      <div className="container mx-auto px-4">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={8} lg={6}>
            <Avatar
              shape="square"
              size={240}
              icon={<AntDesignOutlined />}
              src={
                <Image
                  src={singleSCDetail?.data?.image}
                  alt={singleSCDetail?.data?.title}
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
                {singleSCDetail?.data?.title}
              </Title>

              <Space size="large">
                <Space>
                  <Text strong>Status:</Text>
                  <Tag
                    icon={getStatusIcon(singleSCDetail?.data?.status)}
                    color={
                      singleSCDetail?.data?.status?.toLowerCase() === "active"
                        ? "success"
                        : singleSCDetail?.data?.status?.toLowerCase() ===
                          "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {singleSCDetail?.data?.status}
                  </Tag>
                </Space>

                {/* <Space>
                  <Text strong>Total Topics:</Text>
                  <Tag color="blue">
                    {singleSCDetail?.data?.courseTopic?.length || 0}
                  </Tag>
                </Space> */}
              </Space>

              {singleSCDetail?.data?.description && (
                <Text type="secondary" className="text-lg">
                  {singleSCDetail.data.description}
                </Text>
              )}
            </Space>
          </Col>
        </Row>
      </div>
      <Tabs defaultActiveKey="1" className="mb-6">
        {/* Packages Tab */}
        <TabPane
          tab={
            <span>
              <AppstoreOutlined />
              <span className="ml-[-4px]">Study Notes</span>
            </span>
          }
          key="1"
        >
          <StudyNotes studyNotesData={studyNotesData || []} refetch={refetch} />
        </TabPane>

        {/* Semester Tab */}
        <TabPane
          tab={
            <span>
              <ReadOutlined />
              <span className="ml-[-4px]">Home Tutoring</span>
            </span>
          }
          key="2"
        >
          <HomeTutoring
            homeTutoringData={homeTutoringData || []}
            refetch={refetch}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default SingleSchoolCourse;
