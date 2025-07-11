import React, { useState, useEffect } from "react";
import {
  API,
  useAllCourses,
  useAllUsers,
  useCourseContentsByID,
  useSingleTopicsWithTeacher,
  useTopicsByCoursesID,
} from "../../api/api";
import {
  Form,
  Select,
  Button,
  Spin,
  Card,
  Divider,
  Checkbox,
  InputNumber,
  Input,
  message,
  Avatar,
  Typography,
  Tag,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  StarOutlined,
  ClockCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { Option } = Select;

function CreateOrder() {
  const [form] = Form.useForm();
  const [courseId, setCourseId] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [courseDetailsID, setCourseDetailsID] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [couponData, setCouponData] = useState({
    code: "",
    discount: 0,
  });

  // API hooks
  const { allUsers, isLoading: userLoading } = useAllUsers();
  const { allCourses, isLoading: courseLoading } = useAllCourses();
  const { topicsByCoursesID, isLoading: topicsLoading } =
    useTopicsByCoursesID(courseId);
  const { topicsWithTeacher, isLoading: topicsWithTeacherLoading } =
    useSingleTopicsWithTeacher(topicId);
  const { contentsWithDetailsByID, isLoading: contentsLoading } =
    useCourseContentsByID(courseDetailsID);

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (courseId) {
      form.setFieldsValue({ topicId: undefined });
      setTopicId(null);
      setCourseDetailsID(null);
    }
  }, [courseId, form]);

  useEffect(() => {
    if (topicId) {
      form.setFieldsValue({ courseDetailsID: undefined });
      setCourseDetailsID(null);
    }
  }, [topicId, form]);

  const handleItemSelect = (type, item) => {
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.type_id === item.id && i.type === type);
      if (exists) {
        return prev.filter((i) => !(i.type_id === item.id && i.type === type));
      }
      return [
        ...prev,
        {
          type,
          type_id: item.id,
          name: item.title || item.name,
          price: item.price,
        },
      ];
    });
  };

  const calculateTotals = () => {
    const subTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const totalPrice = subTotal - couponData.discount;
    return { subTotal, totalPrice };
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { subTotal, totalPrice } = calculateTotals();

      const payload = {
        user_id: values.userId,
        c_number: values.contactNumber,
        sub_total: subTotal,
        coupon_discount: couponData.discount,
        total_price: totalPrice,
        coupon_code: couponData.code || null,
        orders_items: selectedItems.map((item) => ({
          type: item.type,
          type_id: item.type_id,
        })),
      };

      await API.post("/order/create-for-admin", payload);
      message.success("Order created successfully!");
      resetForm();
    } catch (error) {
      message.error("Failed to create order. Please try again.");
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setSelectedItems([]);
    setCouponData({ code: "", discount: 0 });
    setCourseId(null);
    setTopicId(null);
    setCourseDetailsID(null);
  };

  const totals = calculateTotals();

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        Create Order
      </Title>

      <Card className="shadow-lg">
        <Form form={form} layout="vertical">
          {/* User Information Section */}
          <Title level={4} className="mb-4">
            Student Information
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="userId"
                label="Select Student"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select a student"
                  loading={userLoading}
                  showSearch
                  optionFilterProp="children"
                >
                  {allUsers?.map((user) => (
                    <Option key={user.id} value={user.id}>
                      <div className="flex items-center">
                        <UserOutlined className="mr-2" />
                        {user.first_name} {user.last_name} ({user.email})
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="contactNumber"
                label="Contact Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter contact number" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Course Selection Section */}
          <Title level={4} className="mb-4">
            Course Selection
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="courseId"
                label="Course"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select course"
                  loading={courseLoading}
                  onChange={setCourseId}
                  showSearch
                >
                  {allCourses?.map((course) => (
                    <Option key={course.id} value={course.id}>
                      {course.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="topicId"
                label="Topic"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder={
                    courseId ? "Select topic" : "Select course first"
                  }
                  disabled={!courseId}
                  loading={topicsLoading}
                  onChange={setTopicId}
                >
                  {topicsByCoursesID?.data?.courseTopic?.map((topic) => (
                    <Option key={topic.id} value={topic.id}>
                      {topic.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="courseDetailsID"
                label="Instructor"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder={
                    topicId ? "Select instructor" : "Select topic first"
                  }
                  disabled={!topicId}
                  loading={topicsWithTeacherLoading}
                  onChange={setCourseDetailsID}
                  optionLabelProp="label"
                >
                  {topicsWithTeacher?.data?.teachers?.map((teacher) => (
                    <Option
                      key={teacher.id}
                      value={teacher.id}
                      label={`${teacher.first_name} ${teacher.last_name}`}
                    >
                      <div className="flex items-start">
                        <Avatar
                          src={teacher.profile_pic}
                          icon={<UserOutlined />}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">
                            {teacher.first_name} {teacher.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            <MailOutlined className="mr-1" /> {teacher.email}
                          </div>
                          <div className="mt-1">
                            <Tag
                              icon={<BookOutlined />}
                              color="blue"
                              className="mr-1"
                            >
                              {teacher.total_chapter}
                            </Tag>
                            <Tag
                              icon={<ClockCircleOutlined />}
                              color="purple"
                              className="mr-1"
                            >
                              {teacher.total_duration}
                            </Tag>
                            <Tag icon={<StarOutlined />} color="gold">
                              {teacher.average_rating}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Packages & Semesters Section */}
          {contentsLoading ? (
            <Spin tip="Loading course contents..." />
          ) : (
            contentsWithDetailsByID && (
              <>
                <Divider />
                <Title level={4} className="mb-4">
                  Available Packages
                </Title>
                <Row gutter={16}>
                  {contentsWithDetailsByID.packages?.map((pkg) => (
                    <Col xs={24} md={12} key={`pkg-${pkg.id}`}>
                      <Card
                        hoverable
                        className={`mb-4 ${
                          selectedItems.some(
                            (i) => i.type_id === pkg.id && i.type === "packages"
                          )
                            ? "border-blue-500 border-2"
                            : ""
                        }`}
                        onClick={() => handleItemSelect("packages", pkg)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <Title level={5}>{pkg.title}</Title>
                            <Text>{pkg.description}</Text>
                            <div className="mt-2">
                              <Tag icon={<ClockCircleOutlined />}>
                                {pkg.duration}
                              </Tag>
                            </div>
                          </div>
                          <div className="text-right">
                            <Text strong className="text-lg">
                              ${pkg.price}
                            </Text>
                            <Checkbox
                              checked={selectedItems.some(
                                (i) =>
                                  i.type_id === pkg.id && i.type === "packages"
                              )}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Divider />
                <Title level={4} className="mb-4">
                  Available Semesters
                </Title>
                {contentsWithDetailsByID.semester && (
                  <Card
                    hoverable
                    className={`mb-6 ${
                      selectedItems.some(
                        (i) =>
                          i.type_id === contentsWithDetailsByID.semester.id &&
                          i.type === "semester"
                      )
                        ? "border-blue-500 border-2"
                        : ""
                    }`}
                    onClick={() =>
                      handleItemSelect(
                        "semester",
                        contentsWithDetailsByID.semester
                      )
                    }
                  >
                    <div className="flex justify-between">
                      <div>
                        <Title level={5}>
                          {contentsWithDetailsByID.semester.title}
                        </Title>
                        <Text>
                          {contentsWithDetailsByID.semester.description}
                        </Text>
                        <div className="mt-2">
                          <Tag icon={<ClockCircleOutlined />}>
                            {contentsWithDetailsByID.semester.duration}
                          </Tag>
                          <Tag icon={<BookOutlined />} className="ml-1">
                            {contentsWithDetailsByID.semester.chapter?.length}{" "}
                            Chapters
                          </Tag>
                        </div>
                      </div>
                      <div className="text-right">
                        <Text strong className="text-lg">
                          ${contentsWithDetailsByID.semester.price}
                        </Text>
                        <Checkbox
                          checked={selectedItems.some(
                            (i) =>
                              i.type_id ===
                                contentsWithDetailsByID.semester.id &&
                              i.type === "semester"
                          )}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </Card>
                )}
              </>
            )
          )}

          {/* Coupon & Summary Section */}
          <Divider />
          <Title level={4} className="mb-4">
            Payment Information
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <div className="mb-4">
                <Form.Item label="Coupon Code">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponData.code}
                    onChange={(e) =>
                      setCouponData({ ...couponData, code: e.target.value })
                    }
                  />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mb-4">
                <Form.Item label="Discount Amount ($)">
                  <InputNumber
                    placeholder="Enter discount"
                    min={0}
                    value={couponData.discount}
                    onChange={(value) =>
                      setCouponData({ ...couponData, discount: value || 0 })
                    }
                    className="w-full"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Card className="mb-6">
            <div className="flex justify-between mb-2">
              <Text>Subtotal:</Text>
              <Text>${totals.subTotal.toFixed(2)}</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>Discount:</Text>
              <Text type="danger">-${couponData.discount.toFixed(2)}</Text>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between">
              <Text strong>Total:</Text>
              <Text strong>${totals.totalPrice.toFixed(2)}</Text>
            </div>
          </Card>

          {/* Selected Items */}
          {selectedItems.length > 0 && (
            <div className="mb-6">
              <Title level={5} className="mb-2">
                Selected Items
              </Title>
              {selectedItems.map((item) => (
                <div
                  key={`${item.type}-${item.type_id}`}
                  className="flex justify-between py-2 border-b"
                >
                  <Text>
                    {item.name} ({item.type})
                  </Text>
                  <Text>${item.price}</Text>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            disabled={selectedItems.length === 0}
            block
          >
            Create Order
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default CreateOrder;
