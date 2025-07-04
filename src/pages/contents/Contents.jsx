import React from "react";
import { useCourseContents, useCourseContentsByID } from "../../api/api";
import {
  Skeleton,
  Typography,
  Avatar,
  Row,
  Col,
  Space,
  Button,
  Card,
  Tag,
  Divider,
  Tabs,
  List,
  Alert,
} from "antd";
import {
  ReloadOutlined,
  UserOutlined,
  BookOutlined,
  ReadOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import Packages from "./Packages/Packages";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function Contents() {
  const { courseDetailsID } = useParams();
  const { contentsWithDetailsByID, isLoading, isError, error, refetch } =
    useCourseContentsByID(courseDetailsID);

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

  const data = contentsWithDetailsByID?.data;
  const teacher = data?.teacher;
  const semester = data?.semester;

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Course Details</Title>

      {/* Teacher Info */}
      <Card>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={6}>
            <Avatar
              src={teacher?.profile_pic}
              size={100}
              icon={<UserOutlined />}
            />
          </Col>
          <Col xs={24} sm={18}>
            <Title level={4}>
              {teacher?.first_name} {teacher?.last_name}
            </Title>
            <Text type="secondary">{teacher?.description}</Text>
            <br />
            <Tag color="blue">Country: {teacher?.country}</Tag>
            <Tag color="green">Rating: {teacher?.average_rating}/5</Tag>
            <Tag color="purple">Total Ratings: {teacher?.total_rating}</Tag>
            <Tag color="gold">Price/hr: ${teacher?.price_per_hour}</Tag>
          </Col>
        </Row>
      </Card>

      <Divider />

      <Tabs defaultActiveKey="1" className="mb-6">
        {/* Packages Tab */}
        <TabPane
          tab={
            <span>
              <AppstoreOutlined />
              <span className="ml-[-4px]">Packages</span>
            </span>
          }
          key="1"
        >
          <Packages packagesData={data?.packages} refetch={refetch} />
        </TabPane>

        {/* Semester Tab */}
        <TabPane
          tab={
            <span>
              <ReadOutlined />
              <span className="ml-[-4px]">Semester</span>
            </span>
          }
          key="2"
        >
          <Card
            title={semester?.title}
            extra={<Tag color="orange">${semester?.price}</Tag>}
          >
            <p>{semester?.description}</p>
            <Text type="secondary">Duration: {semester?.duration}</Text>

            <Divider orientation="left">Chapters</Divider>
            <List
              dataSource={semester?.chapter}
              bordered
              renderItem={(item) => (
                <List.Item>
                  <BookOutlined className="mr-2" /> {item.chapter_name}
                </List.Item>
              )}
            />

            <Divider orientation="left">Videos</Divider>
            <Row gutter={[16, 16]}>
              {semester?.vedios?.map((video) => (
                <Col xs={24} sm={12} md={8} key={video.id}>
                  <Card
                    title={video.title}
                    cover={
                      <video
                        src={video.url}
                        controls
                        style={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                      />
                    }
                  >
                    <Text>Duration: {video.duration}</Text>
                    <br />
                    <Tag color={video.isPaid ? "red" : "green"}>
                      {video.isPaid ? "Paid" : "Free"}
                    </Tag>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Contents;
