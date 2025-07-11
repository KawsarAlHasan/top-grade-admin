import React from "react";
import { API, useSingleVideoPackage } from "../../../../api/api";
import { useParams } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Modal,
  Space,
  Tag,
  message,
  Spin,
  Descriptions,
  Image,
  Skeleton,
  Alert,
  notification,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AddPackageVideo from "./AddPackageVideo";
import { useState } from "react";
import UpdateVideo from "./UpdateVideo";

const { confirm } = Modal;

function PackageVideos() {
  const { contentID } = useParams();
  const { singleVideoPackage, isLoading, isError, error, refetch } =
    useSingleVideoPackage(contentID);

  const [previewVideo, setPreviewVideo] = React.useState({
    visible: false,
    url: "",
    title: "",
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const showDeleteConfirm = (videoId) => {
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

  const showVideoModal = (url, title) => {
    setPreviewVideo({
      visible: true,
      url,
      title,
    });
  };

  const handleCancelPreview = () => {
    setPreviewVideo({
      visible: false,
      url: "",
      title: "",
    });
  };

  const columns = [
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
      width: 150,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "isPaid",
      key: "isPaid",
      width: 120,
      align: "center",
      render: (isPaid) => (
        <Tag color={isPaid ? "green" : "orange"}>
          {isPaid ? "Paid" : "Free"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showVideoModal(record.url, record.title)}
          >
            View
          </Button>
          <UpdateVideo refetch={refetch} videoData={record} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton active avatar paragraph={{ rows: 6 }} />
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
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Package Details Card */}
      <Card
        title="Package Details"
        className="mb-6 shadow-md"
        cover={
          <div className="relative pt-[56.25%] bg-gray-100">
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={singleVideoPackage?.data?.intro_url}
              controls
            />
          </div>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Title">
            {singleVideoPackage?.data?.title}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            ${singleVideoPackage?.data?.price}
          </Descriptions.Item>
          <Descriptions.Item label="Duration">
            {singleVideoPackage?.data?.duration}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {singleVideoPackage?.data?.description}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Videos Table */}
      <Card
        title="Videos"
        className="shadow-md"
        extra={<AddPackageVideo refetch={refetch} />}
      >
        <Table
          columns={columns}
          dataSource={singleVideoPackage?.data?.videos || []}
          rowKey="id"
          pagination={false}
          bordered
        />
      </Card>

      {/* Video Preview Modal */}
      <Modal
        title={previewVideo.title}
        visible={previewVideo.visible}
        width={800}
        footer={null}
        onCancel={handleCancelPreview}
        destroyOnClose
      >
        <div className="relative pt-[56.25%] bg-black">
          <video
            className="absolute top-0 left-0 w-full h-full"
            src={previewVideo.url}
            controls
            autoPlay
          />
        </div>
      </Modal>
    </div>
  );
}

export default PackageVideos;
