import React, { useState } from "react";
import { API, useAllUsers } from "../../api/api";
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
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Text } = Typography;

function Users() {
  const { allUsers, isLoading, isError, error, refetch } = useAllUsers();
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const statusOptions = ["Active", "Deactive", "Block", "Pending"];

  const handleStatusChange = async () => {
    if (!selectedUser || !selectedStatus) return;

    try {
      setIsUpdatingStatus(true);
      await API.put(`/user/status/${selectedUser.id}`, {
        status: selectedStatus,
      });
      message.success(`User status updated to ${selectedStatus}`);
      refetch();
      setIsStatusModalVisible(false);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/user/delete/${id}`);
      console.log(id, "id");
      message.success("User deleted successfully");
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this User?",
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

  const filteredData = allUsers?.filter((user) => {
    const searchString = `${user.first_name || ""} ${user.last_name || ""} ${
      user.email || ""
    }`.toLowerCase();
    const matchesSearch = searchString.includes(searchText.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
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
      title: "User",
      dataIndex: "first_name",
      key: "user",
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
      render: (role) => (
        <Tag color={role === "Teacher" ? "blue" : "green"}>
          {role.toUpperCase()}
        </Tag>
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
          Error loading users: {error.message}
        </div>
      </Card>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-bold my-5">User List</h2>

      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search by name or email..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />

        <Select
          defaultValue="all"
          style={{ width: 150 }}
          onChange={(value) => setRoleFilter(value)}
        >
          <Option value="all">All Roles</Option>
          <Option value="Student">Students</Option>
          <Option value="Teacher">Teachers</Option>
        </Select>
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
                <p className="text-gray-500">No users found</p>
              </div>
            ),
          }}
        />
      </Spin>

      <Modal
        title="Change User Status"
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
    </div>
  );
}

export default Users;
