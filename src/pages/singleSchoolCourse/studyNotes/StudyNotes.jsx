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
  Tag,
  message,
  Select,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { Link, useParams } from "react-router-dom";
// import AddPackage from "./AddPackage";
import { API } from "../../../api/api";

const { Search } = Input;
const { confirm } = Modal;

function StudyNotes({ studyNotesData = [], refetch }) {
  const { schoolCoursesID } = useParams();
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStudyNote, setSelectedStudyNote] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleEdit = (record) => {
    setEditingPackage(record);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingPackage(null);
  };

  const handleStatusChange = async () => {
    if (!selectedStudyNote || !selectedStatus) return;

    try {
      setIsUpdatingStatus(true);
      //   await API.put(`/user/status/${selectedStudyNote.id}`, {
      //     status: selectedStatus,
      //   });

      console.log(selectedStudyNote.id, "selectedStudyNote.id");
      message.success(`User status updated to ${selectedStatus}`);
      refetch();
      setIsStatusModalVisible(false);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const showDeleteConfirm = (pID) => {
    confirm({
      title: "Are you sure you want to delete this Study Note?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, cancel",
      onOk() {
        return handleDelete(pID);
      },
    });
  };

  const handleDelete = async (pID) => {
    try {
      setIsDeleting(true);
      //   await API.delete(`/content/package/delete/${pID}`);
      notification.success({
        message: "Study Note deleted successfully",
      });
      refetch();
    } catch (error) {
      notification.error({
        message: "Failed to Delete Study Note",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  console.log(studyNotesData, "studyNotesData");

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Deactive":
        return "orange";
      case "Block":
        return "red";
      case "Pending":
        return "blue";
      default:
        return "gray";
    }
  };

  const statusOptions = ["Active", "Deactive"];

  const triggerModal = (user) => {
    setSelectedStudyNote(user);
    setSelectedStatus(user.status);
    setIsStatusModalVisible(true);
  };

  const filteredData = studyNotesData?.filter((item) =>
    item?.name?.toLowerCase().includes(searchText.toLowerCase())
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center">
          <Tag color={getStatusColor(status)}>{status}</Tag>
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
      <h2 className="text-center text-2xl font-bold ">Study Notes List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Study Notes..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        {/* <AddPackage refetch={refetch} /> */}
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

      {/* <EditPackage
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        packageData={editingPackage}
        refetch={refetch}
      /> */}

      <Modal
        title="Change Study Note Status"
        visible={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsStatusModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isUpdatingStatus}
            onClick={handleStatusChange}
          >
            Update Status
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-4">
          <p>
            Current Status:{" "}
            <Tag color={getStatusColor(selectedStudyNote?.status)}>
              {selectedStudyNote?.status}
            </Tag>
          </p>
          <Select
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            placeholder="Select new status"
          >
            {statusOptions.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
}

export default StudyNotes;
