import React, { useState } from "react";
import {
  Skeleton,
  Alert,
  Table,
  Button,
  Image,
  Input,
  Modal,
  notification,
  Card,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { API, useAllCourses } from "../../api/api";
import AddCourses from "./AddCourses";
import EditCourses from "./EditCourses";
import StatusUpdateModal from "../../components/StatusUpdateModal";
import { Link } from "react-router-dom";

const { Search } = Input;
const { confirm } = Modal;

const Courses = () => {
  const { allCourses, isLoading, isError, error, refetch } = useAllCourses();

  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [preValue, setPreValue] = useState(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (editValue) => {
    setPreValue(editValue);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setPreValue(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/courses/delete/${id}`);
      openNotification("success", "Success", "courses deleted successfully");
      refetch();
    } catch (error) {
      openNotification("error", "Error", "Failed to delete the courses");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Courses?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(id);
      },
    });
  };

  const triggerModal = (course) => {
    setSelectedCourse(course);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await API.put(`/courses/status/${selectedCourse.id}`, {
        status: newStatus,
      });
      openNotification("success", "Success", "Status updated successfully!");
      refetch();
      setIsStatusModalOpen(false);
    } catch (err) {
      openNotification("error", "Error", "Failed to update status.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton active paragraph={{ rows: 4 }} />
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

  const filteredData = allCourses.filter((item) =>
    item?.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((item, index) => ({
    key: index,
    ...item,
  }));

  const columns = [
    {
      title: "SN",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image src={image} alt="courses" width={50} height={50} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <Link to={`/university-courses/${record.id}`}>
          <Button size="small" icon={<EyeOutlined />}>
            View
          </Button>
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <span
            className={
              record.status === "Active" ? "text-green-600" : "text-red-600"
            }
          >
            {record.status}
          </span>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => triggerModal(record)}
          />
        </div>
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
          loading={deleteLoading}
          onClick={() => showDeleteConfirm(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-center text-2xl font-bold my-5">Courses List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Courses..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddCourses refetch={refetch} />
      </div>
      {data.length === 0 ? (
        <Card>
          <div className="text-center text-gray-500 font-bold">
            No Course available
          </div>
        </Card>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 100 }}
        />
      )}

      <EditCourses
        preValue={preValue}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />

      <StatusUpdateModal
        visible={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={selectedCourse?.status}
        onUpdate={handleStatusUpdate}
        statusOptions={["Active", "Deactivated"]}
        title="Update Course Status"
      />
    </div>
  );
};

export default Courses;
