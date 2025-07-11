import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Skeleton,
  Alert,
  Tag,
  Modal,
  Select,
  notification,
  Avatar,
  Badge,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { API, useSchoolOrders } from "../../api/api";

const { Search } = Input;
const { Option } = Select;

function SchoolOrders() {
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

  // Fetch school orders using the API hook
  const { schoolOrders, pagination, isLoading, isError, error, refetch } =
    useSchoolOrders(filters);

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
      await API.put(`/school-order/status/${selectedOrder.id}`, {
        status: selectedStatus,
      });

      openNotification("success", "Success", "Status updated successfully!");
      refetch();
      setIsStatusModalOpen(false);
    } catch (err) {
      console.log(err, "err");
      openNotification("error", "Error", "Failed to update status.");
    } finally {
      setUpdateLoading(false);
    }
  };

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
    refetch();
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

  const getOrderTypeBadge = (type) => {
    switch (type) {
      case "home_tutoring":
        return <Tag color="blue">Home Tutoring</Tag>;
      case "study_nodes":
        return <Tag color="green">Study Notes</Tag>;
      default:
        return <Tag color="gray">{type}</Tag>;
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
            description="No school orders found."
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
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
    },
    {
      title: "Student",
      key: "student",
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => getOrderTypeBadge(type),
      filters: [
        { text: "Home Tutoring", value: "home_tutoring" },
        { text: "Study Notes", value: "study_nodes" },
      ],
    },
    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <div>
          <div>
            <span className="font-medium">Date:</span>{" "}
            {new Date(record.date).toLocaleDateString()}
          </div>
          {record.type === "home_tutoring" && (
            <>
              <div>
                <span className="font-medium">Time:</span> {record.fromTime} -{" "}
                {record.toTime}
              </div>
              <div>
                <span className="font-medium">Duration:</span>{" "}
                {record.totalHourse}
              </div>
            </>
          )}
          <div>
            <span className="font-medium">Address:</span> {record.city},{" "}
            {record.block}, Floor {record.floor}, Apt {record.apartment}
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact_number",
      key: "contact_number",
    },
    {
      title: "Payment",
      key: "payment",
      render: (_, record) => (
        <div>
          <div>Total: ${record.total_price}</div>
          {record.coupon_code && (
            <div className="text-xs">
              Coupon: {record.coupon_code} (-${record.coupon_discount})
            </div>
          )}
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
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Processing", value: "Processing" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
      ],
    },
    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <Link to={`/school-orders/${record.id}`}>
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            View
          </Button>
        </Link>
      ),
    },
  ];

  const filteredData = schoolOrders?.filter((item) => {
    const searchContent =
      `${item.id} ${item.first_name} ${item.last_name} ${item.email} ${item.contact_number} ${item.type}`.toLowerCase();
    return searchContent.includes(searchText.toLowerCase());
  });

  const data = filteredData?.map((item) => ({
    key: item.id,
    ...item,
  }));

  return (
    <div className="container mx-auto px-4 ">
      <h2 className="text-2xl font-semibold text-center">
        School Orders Management
      </h2>

      <div className="flex justify-between my-4 ">
        <Search
          placeholder="Search orders..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Link to="/school-orders/create">
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
          total: pagination?.total || 0,
        }}
        onChange={handleTableChange}
        bordered
        scroll={{ x: true }}
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

export default SchoolOrders;
