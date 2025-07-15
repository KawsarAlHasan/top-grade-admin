import React, { useState } from "react";
import {
  Modal,
  Descriptions,
  Image,
  Tag,
  Divider,
  Typography,
  Button,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  DollarOutlined,
  VideoCameraOutlined,
  StarOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function ViewHomeTutor({ homeTutoringSingleData }) {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" icon={<EyeOutlined />} onClick={showModal}>
        View
      </Button>

      <Modal
        title={
          <Title level={3} style={{ margin: 0 }}>
            Tutor Details
          </Title>
        }
        width={800}
        visible={visible}
        onCancel={handleCancel}
        footer={
          <Button type="primary" onClick={handleCancel}>
            Close
          </Button>
        }
        centered
      >
        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          <Image
            width={200}
            src={homeTutoringSingleData?.profile_pic}
            alt={homeTutoringSingleData?.first_name}
            fallback="https://via.placeholder.com/200"
            style={{ borderRadius: 8 }}
          />

          <div>
            <Title level={4} style={{ marginTop: 0 }}>
              {homeTutoringSingleData?.first_name}{" "}
              {homeTutoringSingleData?.last_name}
            </Title>

            <Tag color="blue" icon={<UserOutlined />}>
              {homeTutoringSingleData?.role}
            </Tag>

            <Tag
              color={
                homeTutoringSingleData?.status === "Active" ? "green" : "red"
              }
            >
              {homeTutoringSingleData?.status}
            </Tag>

            <div style={{ marginTop: 16 }}>
              <Paragraph>
                <StarOutlined /> Rating:{" "}
                {homeTutoringSingleData?.average_rating} (
                {homeTutoringSingleData?.total_rating} reviews)
              </Paragraph>
              <Paragraph>
                <DollarOutlined /> Price: $
                {homeTutoringSingleData?.price_per_hour}/hour
              </Paragraph>
            </div>
          </div>
        </div>

        <Divider orientation="left">Personal Information</Divider>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Email" span={2}>
            <a href={`mailto:${homeTutoringSingleData?.email}`}>
              <MailOutlined /> {homeTutoringSingleData?.email}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            <PhoneOutlined /> {homeTutoringSingleData?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Country">
            <GlobalOutlined /> {homeTutoringSingleData?.country}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Introduction</Divider>
        <Paragraph>{homeTutoringSingleData?.description}</Paragraph>

        {homeTutoringSingleData?.intro_video && (
          <>
            <Divider orientation="left">Introduction Video</Divider>
            <div style={{ textAlign: "center" }}>
              <video
                controls
                src={homeTutoringSingleData?.intro_video}
                style={{ maxWidth: "100%", borderRadius: 8 }}
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export default ViewHomeTutor;
