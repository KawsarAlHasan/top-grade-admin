import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import { ShoppingCartOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const OrderManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Demo order data
  const orders = [
    {
      id: "ORD-2023-001",
      customer: "John Smith",
      date: "2023-05-15",
      amount: 1250,
      status: "completed",
      items: 3,
    },
    {
      id: "ORD-2023-002",
      customer: "Sarah Johnson",
      date: "2023-05-18",
      amount: 850,
      status: "processing",
      items: 2,
    },
    {
      id: "ORD-2023-003",
      customer: "Michael Brown",
      date: "2023-05-20",
      amount: 2100,
      status: "shipped",
      items: 5,
    },
    {
      id: "ORD-2023-004",
      customer: "Emily Davis",
      date: "2023-05-22",
      amount: 450,
      status: "pending",
      items: 1,
    },
    {
      id: "ORD-2023-005",
      customer: "Robert Wilson",
      date: "2023-05-25",
      amount: 3200,
      status: "cancelled",
      items: 7,
    },
  ];

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `৳${amount.toLocaleString()}`,
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        switch (status) {
          case "completed":
            color = "green";
            break;
          case "processing":
            color = "blue";
            break;
          case "shipped":
            color = "orange";
            break;
          case "pending":
            color = "gold";
            break;
          case "cancelled":
            color = "red";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => viewOrderDetails(record)}>
            View
          </Button>
          <Button type="link" danger onClick={() => cancelOrder(record.id)}>
            Cancel
          </Button>
        </Space>
      ),
    },
  ];

  const viewOrderDetails = (order) => {
    Modal.info({
      title: `Order Details - ${order.id}`,
      content: (
        <div className="p-4">
          <p>
            <strong>Customer:</strong> {order.customer}
          </p>
          <p>
            <strong>Date:</strong> {order.date}
          </p>
          <p>
            <strong>Amount:</strong> ৳{order.amount.toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> <Tag color="blue">{order.status}</Tag>
          </p>
          <p>
            <strong>Items:</strong> {order.items}
          </p>
        </div>
      ),
      onOk() {},
    });
  };

  const cancelOrder = (orderId) => {
    Modal.confirm({
      title: "Are you sure you want to cancel this order?",
      content: `Order ID: ${orderId}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // Handle cancel order logic here
        console.log(`Order ${orderId} cancelled`);
      },
    });
  };

  const showAddOrderModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log("Received values of form: ", values);
      // Handle add order logic here
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <ShoppingCartOutlined className="mr-2" /> Order Management
        </h2>
        <div className="flex space-x-4">
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined />}
            className="w-64"
          />
          <Button type="primary" onClick={showAddOrderModal}>
            Add New Order
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* Add Order Modal */}
      <Modal
        title="Add New Order"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="customer"
              label="Customer"
              rules={[{ required: true, message: "Please select a customer" }]}
            >
              <Select placeholder="Select customer">
                <Option value="John Smith">John Smith</Option>
                <Option value="Sarah Johnson">Sarah Johnson</Option>
                <Option value="Michael Brown">Michael Brown</Option>
                <Option value="Emily Davis">Emily Davis</Option>
                <Option value="Robert Wilson">Robert Wilson</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Order Date"
              rules={[{ required: true, message: "Please select order date" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="items"
              label="Items"
              rules={[{ required: true, message: "Please enter items" }]}
            >
              <Input type="number" placeholder="Number of items" />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <Input type="number" prefix="৳" placeholder="Order amount" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status">
                <Option value="pending">Pending</Option>
                <Option value="processing">Processing</Option>
                <Option value="shipped">Shipped</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderManagement;
