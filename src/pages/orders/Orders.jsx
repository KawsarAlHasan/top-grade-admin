import React, { useState } from "react";
import {
  Table,
  Button,
  Spin,
  Input,
  Skeleton,
  Alert,
  Tag,
  Modal,
  Select,
  notification,
  Avatar,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { API, useOrders } from "../../api/api";
import CreateOrder from "./CreateOrder";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

function Order() {
  const [searchText, setSearchText] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Maintain state for filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    status: null,
  });

  // Fetch orders using the API hook
  const { orders, pagination, isLoading, isError, error, refetch } =
    useOrders(filters);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const triggerModal = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    setUpdateLoading(true);
    try {
      await API.put(`/order/status/${selectedOrder.id}`, {
        status: selectedStatus,
      });
      openNotification("success", "Success", "Status updated successfully!");
      refetch();
      setIsStatusModalOpen(false);
    } catch (err) {
      openNotification("error", "Error", "Failed to update status.");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle table changes (pagination, filters, sorter)
  const handleTableChange = (pagination, tableFilters) => {
    const { current: page, pageSize: limit } = pagination;
    const status = tableFilters.status ? tableFilters.status[0] : null;

    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
      limit,
      status,
    }));
  };

  React.useEffect(() => {
    refetch(); // Refetch data whenever filters are updated
  }, [filters, refetch]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "Processing":
        return "blue";
      case "Pending":
        return "orange";
      case "Cancelled":
        return "red";
      default:
        return "gray";
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
    if (error?.response?.status === 404) {
      return (
        <div className="p-4">
          <Alert
            message="No Data"
            description="No Order found."
            type="info"
            showIcon
          />
        </div>
      );
    }

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

  const columns = [
    {
      title: "Order Id",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "User Name",
      key: "user_name",
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar src={record.profile_pic} size="small">
            {record.first_name?.charAt(0)}
          </Avatar>
          <div className="ml-2">
            <div>{`${record.first_name} ${record.last_name}`}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
    },
    {
      title: "Phone Number",
      dataIndex: "c_number",
      key: "c_number",
    },
    {
      title: "Order Date",
      dataIndex: "create_at",
      key: "create_at",
      render: (_, record) => (
        <p>{new Date(record.create_at).toLocaleDateString()}</p>
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
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Processing", value: "Processing" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
      ],
    },
    {
      title: "Details",
      dataIndex: "Details",
      key: "Details",
      render: (_, record) => (
        <Link to={`/university-orders/${record.id}`}>
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            Details
          </Button>
        </Link>
      ),
    },
  ];

  const filteredData = orders.filter((item) =>
    item?.order_id.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((item, index) => ({
    key: index,
    ...item,
  }));

  return (
    <div>
      <h2 className="text-center text-2xl font-semibold ">All Orders List</h2>
      <div className="flex justify-between my-4">
        <Search
          placeholder="Search Order ID..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />

        <Link to="/university-orders/create">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add New Order
          </Button>{" "}
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: pagination.total,
        }}
        onChange={handleTableChange}
        bordered
      />

      <Modal
        title="Update Order Status"
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
            loading={updateLoading}
            disabled={!selectedStatus}
          >
            Update
          </Button>,
        ]}
      >
        <div className="mb-4">
          <p className="font-medium mb-2">Current Status:</p>
          <p className="mb-4">
            <Tag color={getStatusColor(selectedOrder?.status)}>
              {selectedOrder?.status}
            </Tag>
          </p>
        </div>
        <div>
          <p className="font-medium mb-2">Select New Status:</p>
          <Select
            style={{ width: "100%" }}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}

export default Order;
