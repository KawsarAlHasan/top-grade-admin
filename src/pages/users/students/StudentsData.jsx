import React, { useState } from "react";
import { API, useAllUsers } from "../../../api/api";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Card,
  Spin,
  Typography,
  message,
  Space,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  EditOutlined,
  MailOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Text } = Typography;

function StudentsData() {
  const { allUsers, isLoading, isError, error, refetch } = useAllUsers({
    role: "student",
  });
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Status change state
  const [selectedUser, setSelectedUser] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Role change state
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [isRolesModalVisible, setIsRolesModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const statusOptions = ["Active", "Deactive", "Block", "Pending"];
  const roleOptions = ["Student", "Teacher"]; // Available role options

  const handleStatusChange = async () => {
    if (!selectedUser || !selectedStatus) return;

    try {
      setIsUpdatingStatus(true);
      await API.put(`/user/status/${selectedUser.id}`, {
        status: selectedStatus,
      });
      message.success(`Student status updated to ${selectedStatus}`);
      refetch();
      setIsStatusModalVisible(false);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUserRole || !selectedRole) return;

    try {
      setIsUpdatingStatus(true);
      await API.put(`/user/role/${selectedUserRole.id}`, {
        role: selectedRole,
      });
      message.success(`Student role updated to ${selectedRole}`);
      refetch();
      setIsRolesModalVisible(false);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/user/delete/${id}`);
      message.success("Student deleted successfully");
      refetch();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete Student"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Student?",
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

  const triggerModal = (user) => {
    setSelectedUser(user);
    setSelectedStatus(user.status);
    setIsStatusModalVisible(true);
  };

  const triggerRoleModal = (user) => {
    setSelectedUserRole(user);
    setSelectedRole(user.role);
    setIsRolesModalVisible(true);
  };

  const filteredData = allUsers?.filter((user) => {
    const searchString = `${user.first_name || ""} ${user.last_name || ""} ${
      user.email || ""
    }`.toLowerCase();
    const matchesSearch = searchString.includes(searchText.toLowerCase());
    return matchesSearch;
  });

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

  const columns = [
    {
      title: "Students",
      dataIndex: "first_name",
      key: "students",
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
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <div className="flex items-center">
          <Tag color={role === "Teacher" ? "blue" : "green"}>
            {role.toUpperCase()}
          </Tag>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => triggerRoleModal(record)}
          />
        </div>
      ),
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
      title: "View",
      key: "view",
      render: (_, record) => (
        <Link to={`/students/${record.id}`}>
          <Button size="small" icon={<EyeOutlined />}>
            View Details
          </Button>
        </Link>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => showDeleteConfirm(record.id)}
            loading={deleteLoading}
            disabled={deleteLoading}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (isError) {
    return (
      <Card>
        <div className="text-center text-red-500">
          Error loading Student: {error.message}
        </div>
      </Card>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-bold my-5">Students List</h2>

      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search by name or email..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          pagination={{ pageSize: 100 }}
          scroll={{ x: true }}
          locale={{
            emptyText: (
              <div className="text-center py-8">
                <p className="text-gray-500">No Student found</p>
              </div>
            ),
          }}
        />
      </Spin>

      {/* Status Change Modal */}
      <Modal
        title="Change Student Status"
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
            <Tag color={getStatusColor(selectedUser?.status)}>
              {selectedUser?.status}
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

      {/* Role Change Modal */}
      <Modal
        title="Change Student Role"
        visible={isRolesModalVisible}
        onCancel={() => setIsRolesModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsRolesModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isUpdatingStatus}
            onClick={handleRoleChange}
          >
            Update Role
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-4">
          <p>
            Current Role:{" "}
            <Tag
              color={selectedUserRole?.role === "Teacher" ? "blue" : "green"}
            >
              {selectedUserRole?.role}
            </Tag>
          </p>
          <Select
            value={selectedRole}
            onChange={(value) => setSelectedRole(value)}
            placeholder="Select new role"
          >
            {roleOptions.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
}

export default StudentsData;
