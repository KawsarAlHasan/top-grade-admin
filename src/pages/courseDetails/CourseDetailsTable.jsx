import React, { useState } from "react";
import {
  Table,
  Button,
  Card,
  Input,
  Modal,
  Avatar,
  notification,
  Tag,
  Typography,
  Space,
  Badge,
} from "antd";
import {
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  StarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import AddCourseDetails from "./AddCourseDetails";
import { API } from "../../api/api";
import EditCourseDetails from "./EditCourseDetails";

const { Search } = Input;
const { Text } = Typography;
const { confirm } = Modal;

function CourseDetailsTable({ teachers, refetch }) {
  const { topicId, courseId } = useParams();
  const [searchText, setSearchText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourseDetails, setEditingCourseDetails] = useState(null);

  const filteredData = teachers?.filter((item) =>
    `${item?.first_name} ${item?.last_name}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const data = filteredData?.map((item, index) => ({
    key: index + 1,
    ...item,
  }));

  const showDeleteConfirm = (tID) => {
    confirm({
      title: "Are you sure you want to remove this Course Details?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, remove it",
      okType: "danger",
      cancelText: "No, cancel",
      onOk() {
        return handleDelete(tID);
      },
    });
  };

  const handleDelete = async (tID) => {
    try {
      setIsDeleting(true);
      await API.delete(`/courses-deatials/delete/${tID}`);
      notification.success({
        message: "Course Details removed successfully",
      });
      refetch();
    } catch (error) {
      notification.error({
        message: "Failed to Remove Course Details",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderRating = (rating) => {
    if (!rating) return "N/A";
    return (
      <Space>
        <StarOutlined style={{ color: "#faad14" }} />
        <Text>{rating.toFixed(1)}</Text>
      </Space>
    );
  };

  const handleEdit = (record) => {
    setEditingCourseDetails(record);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingCourseDetails(null);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "serial",
      align: "center",
    },
    {
      title: "Teacher",
      dataIndex: "first_name",
      key: "teacher",
      render: (_, record) => (
        <Space>
          <Avatar
            src={record?.profile_pic}
            icon={<UserOutlined />}
            size="large"
          />
          <div>
            <Text strong>
              {record.first_name} {record.last_name}
            </Text>
            <div>
              <Text type="secondary">
                <MailOutlined /> {record.email}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Chapters",
      dataIndex: "total_chapter",
      key: "chapters",
      align: "center",
      render: (chapters) => (
        <Tag color="blue" style={{ minWidth: 50, textAlign: "center" }}>
          {chapters || 0}
        </Tag>
      ),
    },
    {
      title: "Duration",
      dataIndex: "total_duration",
      key: "duration",
      align: "center",
      render: (duration) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{duration || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Rating",
      dataIndex: "average_rating",
      key: "rating",
      align: "center",
      render: (rating, record) => (
        <>
          {renderRating(rating)}{" "}
          <span className="text-gray-600">({record.total_rating || 0})</span>
        </>
      ),
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <Link to={`/courses/${courseId}/${topicId}/${record.course_detail_id}`}>
          <Button size="small" icon={<EyeOutlined />}>
            View
          </Button>
        </Link>
      ),
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          disabled={isDeleting}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "Remove",
      key: "remove",
      render: (_, record) => (
        <Button
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record.course_detail_id)}
          loading={isDeleting}
          disabled={isDeleting}
          danger
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center">
        Course Details List
      </h1>

      <Card
        title={
          <Search
            placeholder="Search teachers..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        }
        bordered={false}
        extra={<AddCourseDetails refetch={refetch} />}
      >
        {data?.length === 0 ? (
          <Card>
            <div className="text-center text-gray-500 font-medium py-8">
              <Text type="secondary">
                No teachers assigned to this topic yet
              </Text>
            </div>
          </Card>
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 100 }}
            loading={isDeleting}
            rowClassName="hover:bg-gray-50 "
          />
        )}
      </Card>

      <EditCourseDetails
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        courseData={editingCourseDetails}
        refetch={refetch}
      />
    </div>
  );
}

export default CourseDetailsTable;
