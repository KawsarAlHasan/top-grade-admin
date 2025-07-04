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
  Select,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { API, useAllSchoolCourses } from "../../api/api";
import AddSchoolCourse from "./AddSchoolCourse";

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

function SchoolCourses() {
  const { allSchoolCourses, isLoading, isError, error, refetch } =
    useAllSchoolCourses();

  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/school-courses/delete/${id}`);
      openNotification(
        "success",
        "Success",
        "School Course deleted successfully"
      );
      refetch();
    } catch (error) {
      openNotification("error", "Error", "Failed to delete the School course");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this School course?",
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
    setSelectedStatus(course.status);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await API.put(`/school-courses/status/${selectedCourse.id}`, {
        status: selectedStatus,
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

  const filteredData = allSchoolCourses.filter((item) =>
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
        <Image src={image} alt="course" width={50} height={50} />
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
        <Link to={`/school-courses/${record.id}`}>
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
      <h2 className="text-center text-2xl font-bold my-5">
        School Courses List
      </h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Courses..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />

        <AddSchoolCourse refetch={refetch} />
      </div>
      {data.length === 0 ? (
        <Card>
          <div className="text-center text-gray-500 font-bold">
            No School Course available
          </div>
        </Card>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 100 }}
        />
      )}

      <Modal
        title="Update Course Status"
        visible={isStatusModalOpen}
        onCancel={() => setIsStatusModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsStatusModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            onClick={handleStatusUpdate}
            disabled={!selectedStatus}
          >
            Update
          </Button>,
        ]}
      >
        <div className="mb-4">
          <p className="font-medium mb-2">Current Status:</p>
          <p className="mb-4">
            <span
              className={
                selectedCourse?.status === "Active"
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {selectedCourse?.status}
            </span>
          </p>
        </div>
        <div>
          <p className="font-medium mb-2">Select New Status:</p>
          <Select
            style={{ width: "100%" }}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
          >
            <Option value="Active">Active</Option>
            <Option value="Deactivated">Deactivated</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}

export default SchoolCourses;
