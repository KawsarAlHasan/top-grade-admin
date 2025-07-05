import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API, useSingleSchoolOrder } from "../../api/api";
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
  Descriptions,
  Badge,
  Image,
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
  ClockCircleOutlined,
  HomeOutlined,
  BookOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function SchoolOrderDetails() {
  const { schoolOrderId } = useParams();
  const { singleSchoolOrder, isLoading, isError, error, refetch } =
    useSingleSchoolOrder(schoolOrderId);

  const [status, setStatus] = useState(singleSchoolOrder?.data?.status);

  useEffect(() => {
    if (singleSchoolOrder) {
      setStatus(singleSchoolOrder?.data?.status);
    }
  }, [singleSchoolOrder]);

  const handleStatusChange = async (value) => {
    try {
      const response = await API.put(`/school-order/status/${schoolOrderId}`, {
        status: value,
      });

      if (response.statusText === "OK") {
        setStatus(value);
        message.success("Order status updated successfully");
        refetch();
      } else {
        message.error("Failed to update order status");
      }
    } catch (error) {
      message.error(`Error updating status: ${error.message}`);
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

  if (!singleSchoolOrder) return <div>No order found</div>;

  const { data: order, teacher_details, course_details } = singleSchoolOrder;
  const orderDate = new Date(order.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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

  const paymentSummary = [
    {
      key: "subtotal",
      label: "Subtotal",
      value: `$${order.sub_total_price.toFixed(2)}`,
    },
    {
      key: "discount",
      label: "Discount",
      value: `-$${order.coupon_discount.toFixed(2)}`,
    },
    {
      key: "total",
      label: "Total",
      value: `$${order.total_price.toFixed(2)}`,
      isTotal: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="flex justify-between items-center py-8">
        <Title level={4} className="mb-0">
          School Order Details
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
              <FileDoneOutlined className="mr-2" /> Order #{order.id}
            </Title>
            <Tag
              color={getStatusColor(order.status)}
              className="text-sm py-1 px-3"
            >
              {order.status}
            </Tag>
          </div>
          <div className="text-right">
            <Title level={4} className="m-0 text-primary">
              {order.type === "home_tutoring" ? "Home Tutoring" : "Study Notes"}
            </Title>
            <Text type="secondary">Contact: {order.contact_number}</Text>
          </div>
        </div>

        <Divider className="bg-gray-200" />

        <Row gutter={24} className="mb-8">
          <Col xs={24} md={12}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5} className="flex items-center mb-3">
                <UserOutlined className="mr-2" /> Student Information
              </Title>
              <div className="flex items-center mb-2">
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  className="mr-3"
                />
                <div>
                  <Text strong className="text-lg">
                    {order.first_name} {order.last_name}
                  </Text>
                  <div className="flex items-center text-sm mt-1">
                    <MailOutlined className="mr-1" />
                    <Text type="secondary">{order.email}</Text>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm mt-2">
                <PhoneOutlined className="mr-1" />
                <Text type="secondary">{order.contact_number}</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5} className="flex items-center mb-3">
                <HomeOutlined className="mr-2" /> Address Details
              </Title>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="City">{order.city}</Descriptions.Item>
                <Descriptions.Item label="Block">{order.block}</Descriptions.Item>
                <Descriptions.Item label="Floor">{order.floor}</Descriptions.Item>
                <Descriptions.Item label="Apartment">
                  {order.apartment}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Col>
        </Row>

        {order.type === "home_tutoring" && teacher_details && (
          <>
            <Divider orientation="left">Tutoring Details</Divider>
            <Row gutter={24} className="mb-6">
              <Col xs={24} md={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Title level={5} className="flex items-center mb-3">
                    <BookOutlined className="mr-2" /> Course Information
                  </Title>
                  {course_details && (
                    <div className="flex items-start">
                      <Image
                        width={80}
                        src={course_details.image}
                        alt={course_details.title}
                        className="mr-4"
                        preview={false}
                      />
                      <div>
                        <Text strong className="text-lg">
                          {course_details.title}
                        </Text>
                        <div className="mt-2">
                          <Text type="secondary">
                            Status:{" "}
                            <Tag color={course_details.status === "Active" ? "green" : "red"}>
                              {course_details.status}
                            </Tag>
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Title level={5} className="flex items-center mb-3">
                    <UserOutlined className="mr-2" /> Teacher Information
                  </Title>
                  <div className="flex items-start">
                    <Avatar
                      size={80}
                      src={teacher_details.profile_pic}
                      className="mr-4"
                    />
                    <div>
                      <Text strong className="text-lg">
                        {teacher_details.first_name} {teacher_details.last_name}
                      </Text>
                      <div className="flex items-center mt-1">
                        <StarOutlined className="text-yellow-500 mr-1" />
                        <Text>
                          {teacher_details.average_rating} ({teacher_details.total_rating} reviews)
                        </Text>
                      </div>
                      <div className="mt-2">
                        <Text type="secondary">
                          ${teacher_details.price_per_hour}/hour
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <Title level={5} className="flex items-center mb-3">
                <ClockCircleOutlined className="mr-2" /> Schedule Details
              </Title>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Date">
                  {new Date(order.date).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Time">
                  {order.fromTime} - {order.toTime}
                </Descriptions.Item>
                <Descriptions.Item label="Duration">
                  {order.totalHourse}
                </Descriptions.Item>
                <Descriptions.Item label="Total Payment">
                  <Text strong>${order.totalPayment}</Text>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </>
        )}

        <Divider className="bg-gray-200" />

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <Title level={5} className="flex items-center mb-3">
            <CreditCardOutlined className="mr-2" /> Payment Summary
          </Title>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Text>Coupon Code:</Text>
              <Tag color="blue">{order.coupon_code || "None"}</Tag>
            </div>
            {paymentSummary.map((item) => (
              <div
                key={item.key}
                className={`flex justify-between ${
                  item.isTotal ? "border-t border-gray-300 pt-2" : ""
                }`}
              >
                <Text strong={item.isTotal}>{item.label}</Text>
                <Text strong={item.isTotal}>{item.value}</Text>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between bg-gray-50 p-3 rounded-lg mb-6">
          <div className="flex items-center">
            <CalendarOutlined className="mr-2" />
            <Text strong>Order Date:</Text>
            <Text className="ml-2">{orderDate}</Text>
          </div>
        </div>

        <Divider className="bg-gray-200" />

        <div className="text-center text-gray-500 py-4">
          <Text className="block mb-2">
            For any questions regarding this order, please contact support.
          </Text>
          <Text>
            Order ID: {order.id} | Student ID: {order.student_id}
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default SchoolOrderDetails;