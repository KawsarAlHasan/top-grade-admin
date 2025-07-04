import React, { useState } from "react";
import { Table, Button, Input, Modal, notification, Card } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { API } from "../../api/api";
import AddCourseTopic from "./AddCoursesTopic";
import EditCoursesTopic from "./EditCoursesTopic";

const { Search } = Input;
const { confirm } = Modal;

function CoursesTopicsTable({ courseTopics, refetch }) {
  const { courseId } = useParams();
  const [searchText, setSearchText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  const filteredData = courseTopics.filter((item) =>
    item?.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((item, index) => ({
    key: index,
    ...item,
  }));

  const showDeleteConfirm = (topicId) => {
    confirm({
      title: "Are you sure you want to delete this topic?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, cancel",
      onOk() {
        return handleDelete(topicId);
      },
    });
  };

  const handleDelete = async (topicId) => {
    try {
      setIsDeleting(true);
      await API.delete(`/courses-topic/delete/${topicId}`);
      notification.success({
        message: "Topic deleted successfully",
      });
      refetch();
    } catch (error) {
      notification.error({
        message: "Failed to delete topic",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (record) => {
    setEditingTopic(record);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingTopic(null);
  };

  const columns = [
    {
      title: "SN",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Topic Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <Link to={`/courses/${courseId}/${record.id}`}>
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
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record.id)}
          loading={isDeleting}
          disabled={isDeleting}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center">Course Topics</h1>

      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Course Topics..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddCourseTopic refetch={refetch} />
      </div>

      {/* table */}
      {data.length === 0 ? (
        <Card>
          <div className="text-center text-gray-500 font-bold">
            No topics available for this course
          </div>
        </Card>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 100 }}
          loading={isDeleting}
        />
      )}

      <EditCoursesTopic
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        topicData={editingTopic}
        refetch={refetch}
      />
    </div>
  );
}

export default CoursesTopicsTable;
