import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  API,
  useAllCoursesForAdmin,
  useAllUsers,
  useCourseDetailsWithContents,
  useServicesFee,
} from "../../api/api";
import {
  Form,
  Select,
  Button,
  Card,
  Divider,
  InputNumber,
  Input,
  message,
  Typography,
  Row,
  Col,
  Radio,
  Spin,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const { Option } = Select;

function CreateOrder() {
  const [form] = Form.useForm();
  const [courseId, setCourseId] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [couponData, setCouponData] = useState({
    code: "",
    discount: 0,
    loading: false,
    valid: false,
    applied: false,
  });
  const [taxRate, setTaxRate] = useState(0);
  const navigate = useNavigate();

  // API hooks
  const { allUsers, isLoading: userLoading } = useAllUsers();
  const { courseWithTopics, isLoading } = useAllCoursesForAdmin();
  const { courseDetailsWithPreData, isLoading: courseLoading } =
    useCourseDetailsWithContents(topicId);

  const {
    singleServices,
    isLoading: servicesLoading,
    isError,
    error,
  } = useServicesFee("university");

  useEffect(() => {
    if (singleServices && singleServices.percentage) {
      setTaxRate(singleServices.percentage);
    }
  }, [singleServices]);

  // Handle course selection
  const handleCourseChange = (value) => {
    setCourseId(value);
    setTopicId(null);
    setSelectedType(null);
    setSelectedPrice(0);
    resetCoupon();
    form.setFieldsValue({
      topicId: undefined,
      packageType: undefined,
      semesterOrPackage: undefined,
    });
  };

  // Handle topic selection
  const handleTopicChange = (value) => {
    setTopicId(value);
    setSelectedType(null);
    setSelectedPrice(0);
    resetCoupon();
    form.setFieldsValue({
      packageType: undefined,
      semesterOrPackage: undefined,
    });
  };

  // Handle package type selection
  const handlePackageTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedPrice(0);
    resetCoupon();
    form.setFieldsValue({ semesterOrPackage: undefined });
  };

  // Handle semester/package selection
  const handleSelectionChange = (value) => {
    const selectedItem =
      selectedType === "semester"
        ? courseDetailsWithPreData?.data?.find(
            (item) => item.semester?.id === value
          )?.semester
        : courseDetailsWithPreData?.data
            ?.find((item) => item.packages?.some((pkg) => pkg.id === value))
            ?.packages?.find((pkg) => pkg.id === value);

    setSelectedPrice(selectedItem?.price || 0);
    resetCoupon();
  };

  // Reset coupon data
  const resetCoupon = () => {
    setCouponData({
      code: "",
      discount: 0,
      loading: false,
      valid: false,
      applied: false,
    });
  };

  // Validate coupon code
  const applyCoupon = async () => {
    if (!couponData.code) {
      message.warning("Please enter a coupon code");
      return;
    }

    if (!selectedPrice) {
      message.warning("Please select a package first");
      return;
    }

    try {
      setCouponData((prev) => ({ ...prev, loading: true }));

      const response = await API.put("/coupon/check", {
        code: couponData.code,
      });

      if (response.data.success) {
        const coupon = response.data.data;
        const discountAmount = Math.min(coupon.discount, selectedPrice);

        setCouponData({
          code: coupon.code,
          discount: discountAmount,
          loading: false,
          valid: true,
          applied: true,
        });

        message.success(
          `Coupon applied successfully! Discount: $${discountAmount}`
        );
      } else {
        setCouponData({
          ...couponData,
          loading: false,
          valid: false,
          applied: true,
        });
        message.error("Invalid coupon code");
      }
    } catch (error) {
      setCouponData({
        ...couponData,
        loading: false,
        valid: false,
        applied: true,
      });
      message.error("Failed to validate coupon");
      console.error("Coupon validation error:", error);
    }
  };

  // Handle coupon code change
  const handleCouponCodeChange = (e) => {
    const code = e.target.value;
    setCouponData({
      ...couponData,
      code,
      applied: false,
    });
  };

  // Calculate order totals
  const calculateTotals = () => {
    const subTotal = selectedPrice;
    const discountAmount =
      couponData.applied && couponData.valid ? couponData.discount : 0;
    const taxableAmount = subTotal - discountAmount;
    const taxAmount = taxableAmount * (taxRate / 100);
    const totalPrice = taxableAmount; // Tax is not added to total

    return {
      subTotal,
      discount: discountAmount,
      tax: taxAmount,
      totalPrice,
    };
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { subTotal, discount, tax, totalPrice } = calculateTotals();

      const payload = {
        user_id: values.userId,
        c_number: values.contactNumber,
        sub_total: subTotal,
        tax: tax,
        coupon_discount: discount,
        total_price: totalPrice, // This doesn't include tax
        coupon_code:
          couponData.applied && couponData.valid ? couponData.code : null,
        orders_items: [
          {
            type: selectedType,
            type_id:
              selectedType === "semester"
                ? values.semesterOrPackage
                : values.semesterOrPackage,
          },
        ],
      };

      await API.post("/order/create-for-admin", payload);
      message.success("Order created successfully!");
      resetForm();
      navigate("/university-orders");
    } catch (error) {
      message.error("Failed to create order. Please try again.");
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    form.resetFields();
    resetCoupon();
    setCourseId(null);
    setTopicId(null);
    setSelectedType(null);
    setSelectedPrice(0);
  };

  const totals = calculateTotals();

  // Get topics for the selected course
  const selectedCourse = courseWithTopics?.data?.find(
    (course) => course.id === courseId
  );
  const courseTopics = selectedCourse?.courseTopic || [];

  // Get available semesters and packages
  const availableSemesters =
    courseDetailsWithPreData?.data
      ?.filter((item) => item.semester)
      .map((item) => item.semester) || [];

  const availablePackages =
    courseDetailsWithPreData?.data?.flatMap((item) => item.packages || []) ||
    [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        Create Order
      </Title>

      <Card className="shadow-lg">
        <Form form={form} layout="vertical">
          {/* Student Information Section */}
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
            Course Information
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="courseId"
                label="Select Course"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select a course"
                  onChange={handleCourseChange}
                  loading={isLoading}
                >
                  {courseWithTopics?.data?.map((course) => (
                    <Option key={course.id} value={course.id}>
                      {course.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="topicId"
                label="Select Topic"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select a topic"
                  onChange={handleTopicChange}
                  disabled={!courseId}
                  loading={isLoading}
                >
                  {courseTopics.map((topic) => (
                    <Option key={topic.id} value={topic.id}>
                      {topic.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Semester/Package Selection Section */}
          {topicId && (
            <>
              <Divider />
              <Title level={4} className="mb-4">
                Package Information
              </Title>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="packageType"
                    label="Select Package Type"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group onChange={handlePackageTypeChange}>
                      <Radio value="semester">Semester</Radio>
                      <Radio value="package">Package</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {selectedType === "semester" && (
                    <Form.Item
                      name="semesterOrPackage"
                      label="Select Semester"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select a semester"
                        onChange={handleSelectionChange}
                        loading={courseLoading}
                      >
                        {availableSemesters.map((semester) => (
                          <Option key={semester.id} value={semester.id}>
                            {semester.title} (${semester.price})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                  {selectedType === "package" && (
                    <Form.Item
                      name="semesterOrPackage"
                      label="Select Package"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select a package"
                        onChange={handleSelectionChange}
                        loading={courseLoading}
                      >
                        {availablePackages.map((pkg) => (
                          <Option key={pkg.id} value={pkg.id}>
                            {pkg.title} (${pkg.price})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Col>
              </Row>
            </>
          )}

          <Divider />

          {/* Coupon Section */}
          <Title level={4} className="mb-4">
            Coupon Information
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Coupon Code">
                <div style={{ display: "flex", gap: "8px" }}>
                  <Input
                    placeholder="Enter coupon code"
                    value={couponData.code}
                    onChange={handleCouponCodeChange}
                  />
                  <Button
                    type="primary"
                    onClick={applyCoupon}
                    loading={couponData.loading}
                    disabled={!couponData.code || !selectedPrice}
                  >
                    Apply Coupon
                  </Button>
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Discount Amount ($)">
                <InputNumber
                  placeholder={
                    couponData.applied ? "No discount" : "Apply coupon first"
                  }
                  value={couponData.applied ? couponData.discount : 0}
                  disabled
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Order Summary Section */}
          <Divider />
          <Title level={4} className="mb-4">
            Order Summary
          </Title>
          <Card className="mb-6">
            <div className="flex justify-between mb-2">
              <Text>
                Selected {selectedType === "semester" ? "Semester" : "Package"}{" "}
                Price:
              </Text>
              <Text>${selectedPrice.toFixed(2)}</Text>
            </div>
            {couponData.applied && (
              <div className="flex justify-between mb-2">
                <Text>Discount:</Text>
                <Text type="danger">-${couponData.discount.toFixed(2)}</Text>
              </div>
            )}
            <div className="flex justify-between mb-2">
              <Text>Tax ({taxRate}%):</Text>
              <Text>${totals.tax.toFixed(2)}</Text>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between">
              <Text strong>Total:</Text>
              <Text strong>${totals.totalPrice.toFixed(2)}</Text>
            </div>
          </Card>

          {/* Submit Button */}
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!courseId || !topicId || !selectedType || !selectedPrice}
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
