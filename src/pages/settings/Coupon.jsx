import React, { useState } from "react";
import {
  Skeleton,
  Alert,
  Table,
  Button,
  Input,
  Modal,
  notification,
  Card,
  Tag,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { API, useAllCoupons } from "../../api/api";

const { Search } = Input;
const { confirm } = Modal;

const Coupon = () => {
  const { allCoupons, isLoading, isError, error, refetch } = useAllCoupons();
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      await API.delete(`/coupon/delete/${id}`);
      openNotification("success", "Success", "Coupon deleted successfully");
      refetch();
    } catch (error) {
      openNotification("error", "Error", "Failed to delete the Coupon");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Coupon?",
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

  const filteredData = allCoupons.data.filter((item) =>
    item?.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((item) => ({
    key: item.id,
    ...item,
  }));

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => `${discount}% OFF`,
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <Tag color={is_active ? "green" : "red"}>
          {is_active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => console.log("Edit", record.id)}
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            loading={deleteLoading}
            onClick={() => showDeleteConfirm(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Coupon Management
      </h2>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-6">
          <Search
            placeholder="Search coupons..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            Add New Coupon
          </Button>
        </div>

        {data.length === 0 ? (
          <Card>
            <div className="text-center text-gray-500 font-medium py-8">
              No coupons available. Create your first coupon!
            </div>
          </Card>
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
          />
        )}
      </div>
    </div>
  );
};

export default Coupon;
