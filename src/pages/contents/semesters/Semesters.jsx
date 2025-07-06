import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Tag,
  Space,
  Card,
  Collapse,
  Descriptions,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import AddSemester from "./AddSemester";

const { Panel } = Collapse;

function Semesters({ semesterData = [], refetch }) {
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [activePanels, setActivePanels] = useState(["chapters", "videos"]);

  const handleViewVideo = (video) => {
    setCurrentVideo(video);
    setVideoModalVisible(true);
  };

  const handleEditChapter = (chapter) => {
    console.log("Edit chapter:", chapter);
  };

  const handleDeleteChapter = (chapter) => {
    console.log("Delete chapter:", chapter);
  };

  const handleEditVideo = (video) => {
    console.log("Edit video:", video);
  };

  const handleDeleteVideo = (video) => {
    console.log("Delete video:", video);
  };

  const handlePanelChange = (keys) => {
    setActivePanels(keys);
  };

  const chapterColumns = [
    {
      title: "Chapter Name",
      dataIndex: "chapter_name",
      key: "chapter_name",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined className="text-blue-500" />}
            onClick={() => handleEditChapter(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined className="text-red-500" />}
            onClick={() => handleDeleteChapter(record)}
          />
        </Space>
      ),
    },
  ];

  const videoColumns = [
    {
      title: "SR No",
      dataIndex: "sr_no",
      key: "sr_no",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "isPaid",
      key: "isPaid",
      width: 100,
      render: (isPaid) => (
        <Tag color={isPaid ? "green" : "orange"}>
          {isPaid ? "Paid" : "Free"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined className="text-blue-400" />}
            onClick={() => handleViewVideo(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined className="text-blue-500" />}
            onClick={() => handleEditVideo(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined className="text-red-500" />}
            onClick={() => handleDeleteVideo(record)}
          />
        </Space>
      ),
    },
  ];

  console.log("semesterData", semesterData);

  return (
    <div className="p-6">
      {semesterData.id == null ? (
        <div>
          <AddSemester />
        </div>
      ) : (
        <Card
          title={semesterData.title}
          className="mb-6 shadow-md"
          cover={
            <div className="relative pt-[56.25%] bg-gray-100">
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={semesterData?.intro_url}
                controls
              />
            </div>
          }
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">
              {semesterData?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              ${semesterData?.price}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {semesterData?.duration}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {semesterData?.description}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Card className=" shadow-md">
        <Collapse
          bordered={false}
          activeKey={activePanels}
          onChange={handlePanelChange}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          className="site-collapse-custom-collapse"
        >
          <Panel
            header={<span className="font-medium text-lg">Chapters</span>}
            key="chapters"
            className="site-collapse-custom-panel"
          >
            <Table
              columns={chapterColumns}
              dataSource={semesterData.chapter || []}
              rowKey="id"
              pagination={false}
              className="mb-4"
              bordered
            />
          </Panel>

          <Panel
            header={<span className="font-medium text-lg">Videos</span>}
            key="videos"
            className="site-collapse-custom-panel"
          >
            <Table
              columns={videoColumns}
              dataSource={semesterData.vedios || []}
              rowKey="id"
              pagination={false}
              bordered
            />
          </Panel>
        </Collapse>
      </Card>

      <Modal
        title={currentVideo?.title}
        visible={videoModalVisible}
        onCancel={() => setVideoModalVisible(false)}
        footer={null}
        width={800}
        centered
        destroyOnClose
      >
        <div className="mt-4">
          <video
            controls
            autoPlay
            className="w-full rounded-lg shadow-md"
            src={currentVideo?.url}
          />
          <div className="mt-4">
            <p className="text-gray-600">
              <span className="font-medium">Duration:</span>{" "}
              {currentVideo?.duration}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Semesters;
