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
  notification,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CaretRightOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AddSemester from "./AddSemester";
import EditSemester from "./EditSemester";
import { API } from "../../../api/api";
import UpdateVideo from "./semesterVideos/UpdateVideo";
import AddSemesterVideos from "./semesterVideos/AddSemesterVideos";

const { Panel } = Collapse;
const { confirm } = Modal;

function Semesters({ semesterData = [], refetch }) {
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [activePanels, setActivePanels] = useState(["chapters", "videos"]);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteVideo = (videoId) => {
    confirm({
      title: "Are you sure you want to delete this video?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return handleDelete(videoId);
      },

      onCancel() {
        console.log("Cancelled delete");
      },
    });
  };

  const handleDelete = async (videoId) => {
    try {
      setIsDeleting(true);
      await API.delete(`/video/delete/${videoId}`);
      notification.success({
        message: "Video deleted successfully",
      });
      refetch();
    } catch (error) {
      notification.error({
        message: "Failed to Delete Video",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsDeleting(false);
    }
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
            loading={isDeleting}
            disabled={isDeleting}
          />
        </Space>
      ),
    },
  ];

  const videoColumns = [
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

          <UpdateVideo refetch={refetch} videoData={record} />
          <Button
            type="text"
            icon={<DeleteOutlined className="text-red-500" />}
            onClick={() => handleDeleteVideo(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {semesterData.id == null ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-dashed border-gray-200">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Semester Added Yet
          </h3>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Get started by creating your first semester. Add chapters and videos
            to organize your course content.
          </p>
          <AddSemester refetch={refetch}>
            <Button type="primary" size="large" icon={<EditOutlined />}>
              Create New Semester
            </Button>
          </AddSemester>
        </div>
      ) : (
        <div>
          <Card
            title={
              <div className="flex justify-between">
                <h2>{semesterData.title}</h2>
                <EditSemester semesterData={semesterData} refetch={refetch} />
              </div>
            }
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

          <Card className=" shadow-md">
            <Collapse
              bordered={false}
              activeKey={activePanels}
              onChange={handlePanelChange}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              className="site-collapse-custom-collapse border-solid border-gray-200 border-2 "
            >
              {/* <Panel
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
              </Panel> */}

              <Panel
                header={
                  <div className="flex justify-between">
                    <h1 className="font-medium text-lg">Videos</h1>

                    <div onClick={(e) => e.stopPropagation()}>
                      <AddSemesterVideos
                        contentID={semesterData.id}
                        refetch={refetch}
                      />
                    </div>
                  </div>
                }
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
        </div>
      )}

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
