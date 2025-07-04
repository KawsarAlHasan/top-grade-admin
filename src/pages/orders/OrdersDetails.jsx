import React from "react";
import { useParams } from "react-router-dom";
import { API, useSingleOrder } from "../../api/api";
import {
  Card,
  Divider,
  Table,
  Tag,
  Typography,
  Avatar,
  Row,
  Col,
  Button,
  Select,
  message,
  Skeleton,
  Alert,
} from "antd";
import {
  LoadingOutlined,
  FileDoneOutlined,
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  MailOutlined,
  CreditCardOutlined,
  GlobalOutlined,
  PrinterOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useEffect } from "react";

const { Title, Text } = Typography;

function OrdersDetails() {
  const { orderId } = useParams();
  const { singleOrder, isLoading, isError, error, refetch } =
    useSingleOrder(orderId);

  const [status, setStatus] = useState(singleOrder?.data?.status);

  useEffect(() => {
    if (singleOrder) {
      setStatus(singleOrder?.data?.status);
    }
  }, [singleOrder]);

  const handleStatusChange = async (value) => {
    try {
      const response = await API.put(`/order/status/${orderId}`, {
        status: value,
      });

      if (response.statusText == "OK") {
        setStatus(value); // Update status locally
        message.success("Order status updated successfully");
        refetch(); // Refresh order details after update
      } else {
        message.error("Failed to update order status");
      }
    } catch (error) {
      message.error(`Error updating status ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton active avatar paragraph={{ rows: 8 }} />
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

  if (!singleOrder) return <div>No order found</div>;

  const { data: order } = singleOrder;
  const orderDate = new Date(order.create_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const updateDate = new Date(order.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const columns = [
    {
      title: "Package Details",
      dataIndex: "packages_title",
      key: "name",
      render: (text, record) => (
        <div>
          <Text strong className="text-lg">
            {text}
          </Text>
          <div className="text-gray-500 text-sm mt-1">{record.description}</div>
          <div className="mt-2">
            <div className="flex items-center">
              <Avatar
                size="small"
                src={record.teacher_profile_pic}
                icon={<UserOutlined />}
                className="mr-2"
              />
              <Text>
                {record.teacher_first_name} {record.teacher_last_name}
              </Text>
            </div>
            {record.course_title && (
              <div className="text-sm mt-1">
                <Text type="secondary">
                  <span className="font-medium">Course:</span>{" "}
                  {record.course_title}
                </Text>
              </div>
            )}
            {record.topic_name && (
              <div className="text-sm mt-1">
                <Text type="secondary">
                  <span className="font-medium">Topic:</span>{" "}
                  {record.topic_name}
                </Text>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <div>
          <div className="mb-2">
            <Text strong>Duration:</Text> {record.packages_duration}
          </div>
          {record.total_chapter && (
            <div>
              <Text strong>Chapters:</Text> {record.total_chapter}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <Text strong className="text-lg">
          ${text.toFixed(2)}
        </Text>
      ),
      align: "right",
    },
  ];

  const summaryData = [
    {
      key: "subtotal",
      label: "Subtotal",
      value: `$${order.sub_total.toFixed(2)}`,
    },
    {
      key: "discount",
      label: "Discount",
      value: `-$${order.coupon_discount.toFixed(2)}`,
    },
    {
      key: "tax",
      label: "Tax",
      value: `$${order.tax.toFixed(2)}`,
    },
    {
      key: "total",
      label: "Total",
      value: `$${order.total_price.toFixed(2)}`,
      isTotal: true,
    },
  ];

  return (
    <div className="container mx-auto px-4  max-w-5xl">
      <div className="flex justify-between items-center py-8">
        <Title level={4} className="mb-0">
          Order Details
        </Title>
        <div className="flex space-x-2">
          <Select
            value={status}
            onChange={handleStatusChange}
            style={{ width: 120 }}
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Processing", label: "Processing" },
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
          />
        </div>
      </div>

      <Card className="shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Title level={3} className="flex items-center">
              <FileDoneOutlined className="mr-2" /> Invoice #{order.order_id}
            </Title>
            <Tag
              color={
                order.status === "Pending"
                  ? "orange"
                  : order.status === "Completed"
                  ? "green"
                  : "blue"
              }
              className="text-sm py-1 px-3"
            >
              {order.status}
            </Tag>
          </div>
          <div className="text-right">
            <Title level={4} className="m-0 text-primary">
              Top Grade
            </Title>
            <Text type="secondary">Contact: {order.c_number}</Text>
          </div>
        </div>

        <Divider className="bg-gray-200" />

        <Row gutter={24} className="mb-8">
          <Col xs={24} md={12}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5} className="flex items-center mb-3">
                <UserOutlined className="mr-2" /> Customer Information
              </Title>
              {order.user ? (
                <div>
                  <div className="flex items-center mb-2">
                    <Avatar
                      size="large"
                      src={order.user.profile_pic}
                      icon={<UserOutlined />}
                      className="mr-3"
                    />
                    <div>
                      <Text strong className="text-lg">
                        {order.user.first_name} {order.user.last_name}
                      </Text>
                      <div className="flex items-center text-sm mt-1">
                        <MailOutlined className="mr-1" />
                        <Text type="secondary">{order.user.email}</Text>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm mt-2">
                    <PhoneOutlined className="mr-1" />
                    <Text type="secondary">{order.user.phone}</Text>
                  </div>
                  <div className="flex items-center text-sm mt-1">
                    <GlobalOutlined className="mr-1" />
                    <Text type="secondary">{order.user.country}</Text>
                  </div>
                </div>
              ) : (
                <Text>No user information available</Text>
              )}
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5} className="flex items-center mb-3">
                <CreditCardOutlined className="mr-2" /> Order Summary
              </Title>
              <div className="space-y-2">
                <div>
                  <Text strong>Coupon Code:</Text>{" "}
                  <Tag color="blue">{order.coupon_code}</Tag>
                </div>
                <div>
                  <Text strong>Discount Applied:</Text>{" "}
                  <Text type="success">
                    -${order.coupon_discount.toFixed(2)}
                  </Text>
                </div>
                <div>
                  <Text strong>Contact Number:</Text>{" "}
                  <Text>{order.c_number}</Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mb-6 flex flex-wrap items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <CalendarOutlined className="mr-2" />
            <Text strong>Order Date:</Text>
            <Text className="ml-2">{orderDate}</Text>
          </div>
          {order.create_at !== order.updated_at && (
            <div className="flex items-center mt-2 sm:mt-0">
              <Text strong>Last Updated:</Text>
              <Text className="ml-2">{updateDate}</Text>
            </div>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={order.order_items}
          pagination={false}
          rowKey="packages_id"
          className="mb-6"
          bordered
        />

        <div className="ml-auto w-full md:w-1/3 bg-gray-50 p-4 rounded-lg">
          {summaryData.map((item) => (
            <div
              key={item.key}
              className={`flex justify-between py-2 ${
                item.isTotal ? "border-t-2 border-gray-300 pt-3" : ""
              }`}
            >
              <Text
                strong={item.isTotal}
                className={item.isTotal ? "text-lg" : ""}
              >
                {item.label}
              </Text>
              <Text
                strong={item.isTotal}
                className={item.isTotal ? "text-lg text-primary" : ""}
              >
                {item.value}
              </Text>
            </div>
          ))}
        </div>

        <Divider className="bg-gray-200" />

        <div className="text-center text-gray-500 py-4">
          <Text className="block mb-2">
            For any questions regarding this order, please contact support.
          </Text>
          <Text>
            Order ID: {order.order_id} | Customer ID: {order.user_id}
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default OrdersDetails;
