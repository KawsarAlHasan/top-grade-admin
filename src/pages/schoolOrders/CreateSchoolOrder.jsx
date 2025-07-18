import React, { useState, useEffect } from "react";
import {
  API,
  useAllSchoolCourses,
  useAllUsers,
  useSingleSchoolCourse,
} from "../../api/api";
import {
  Form,
  Select,
  Button,
  Card,
  Divider,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  message,
  Typography,
  Row,
  Col,
  Table,
  Radio,
  Spin,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Option } = Select;

function CreateSchoolOrder() {
  const [form] = Form.useForm();
  const [schoolCourseId, setSchoolCourseId] = useState(null);
  const [orderType, setOrderType] = useState("home_tutoring");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudyNote, setSelectedStudyNote] = useState(null);
  const [couponData, setCouponData] = useState({
    code: "",
    discount: 0,
    loading: false,
    valid: false,
    applied: false,
  });

  // API hooks
  const { allUsers, isLoading: userLoading } = useAllUsers();
  const { allSchoolCourses, isLoading: allSchoolCoursesLoading } =
    useAllSchoolCourses();
  const {
    singleSCDetail,
    isLoading: singleSCDetailLoading,
    refetch,
  } = useSingleSchoolCourse(schoolCourseId);

  useEffect(() => {
    if (schoolCourseId) refetch();
  }, [schoolCourseId, orderType]);

  // Handle course selection
  const handleCourseChange = (value) => {
    setSchoolCourseId(value);
    setSelectedTeacher(null);
    setSelectedStudyNote(null);
    resetCoupon();
  };

  // Handle order type change
  const handleOrderTypeChange = (value) => {
    setOrderType(value);
    setSchoolCourseId(null);
    setSelectedTeacher(null);
    setSelectedStudyNote(null);
    resetCoupon();
    form.setFieldsValue({ schoolCourseId: undefined });
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

    const totalPayment = form.getFieldValue("totalPayment");
    if (!totalPayment) {
      message.warning("Please select a teacher/study note first");
      return;
    }

    try {
      setCouponData((prev) => ({ ...prev, loading: true }));

      const response = await API.put("/coupon/check", {
        code: couponData.code,
      });

      if (response.data.success) {
        const coupon = response.data.data;
        const discountAmount = Math.min(coupon.discount, totalPayment);

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
        form.setFieldsValue({ totalPayment: totalPayment - discountAmount });
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

  // Handle teacher selection
  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher.home_tutoring_id);
    const hours = form.getFieldValue("totalHourse") || 2;
    const totalPayment = teacher.price_per_hour * hours;
    form.setFieldsValue({ totalPayment });
    resetCoupon();
  };

  // Handle study note selection
  const handleStudyNoteSelect = (studyNote) => {
    setSelectedStudyNote(studyNote.id);
    form.setFieldsValue({ totalPayment: studyNote.price });
    resetCoupon();
  };

  // Handle hours change for tutoring
  const handleHoursChange = (value) => {
    if (selectedTeacher) {
      const teacher = singleSCDetail?.homeTutoringData?.find(
        (t) => t.home_tutoring_id === selectedTeacher
      );
      if (teacher) {
        const totalPayment = teacher.price_per_hour * value;
        form.setFieldsValue({ totalPayment });
        resetCoupon();
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const totalPayment = couponData.applied
        ? values.totalPayment + couponData.discount
        : values.totalPayment;

      const payload = {
        student_id: values.studentId,
        home_tutoring_id: orderType === "home_tutoring" ? selectedTeacher : 0,
        study_notes_id: orderType === "study_notes" ? selectedStudyNote : 0,
        type: orderType,
        city: values.city,
        block: values.block,
        floor: values.floor,
        apartment: values.apartment,
        contact_number: values.contactNumber,
        date:
          orderType === "home_tutoring"
            ? values.date.format("YYYY-MM-DD")
            : null,
        fromTime:
          orderType === "home_tutoring"
            ? values.fromTime.format("HH:mm:ss")
            : null,
        toTime:
          orderType === "home_tutoring"
            ? values.toTime.format("HH:mm:ss")
            : null,
        totalHourse: orderType === "home_tutoring" ? values.totalHourse : null,
        total_price: values.totalPayment,
        coupon_code: couponData.applied ? couponData.code : null,
        coupon_discount: couponData.applied ? couponData.discount : 0,
        sub_total_price: totalPayment,
      };

      await API.post("/school-order/create-for-admin", payload);
      message.success("School order created successfully!");
      resetForm();
    } catch (error) {
      message.error("Failed to create school order. Please try again.");
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    form.resetFields();
    resetCoupon();
    setSchoolCourseId(null);
    setSelectedTeacher(null);
    setSelectedStudyNote(null);
  };

  // Teacher table columns
  const teacherColumns = [
    {
      title: "Teacher",
      key: "teacher",
      render: (record) => (
        <div>
          <Text strong>
            {record.first_name || "N/A"} {record.last_name || ""}
          </Text>
          {record.email && <div className="text-gray-500">{record.email}</div>}
          {record.phone && <div className="text-gray-500">{record.phone}</div>}
        </div>
      ),
    },
    {
      title: "Price/Hour",
      dataIndex: "price_per_hour",
      key: "price",
      render: (price) => `$${price || "N/A"}`,
    },
    {
      title: "Select",
      key: "action",
      render: (record) => (
        <Button
          type={
            selectedTeacher === record.home_tutoring_id ? "primary" : "default"
          }
          onClick={() => handleTeacherSelect(record)}
        >
          {selectedTeacher === record.home_tutoring_id ? "Selected" : "Select"}
        </Button>
      ),
    },
  ];

  // Study notes table columns
  const studyNotesColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Select",
      key: "action",
      render: (_, record) => (
        <Button
          type={selectedStudyNote === record.id ? "primary" : "default"}
          onClick={() => handleStudyNoteSelect(record)}
        >
          {selectedStudyNote === record.id ? "Selected" : "Select"}
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        Create School Order
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
                name="studentId"
                label="Select Student"
                rules={[{ required: true, message: "Please select a student" }]}
              >
                <Select
                  placeholder="Select a student"
                  loading={userLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
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
                rules={[
                  { required: true, message: "Please enter contact number" },
                ]}
              >
                <Input placeholder="Enter contact number" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Order Type Section */}
          <Title level={4} className="mb-4">
            Order Type
          </Title>
          <Form.Item name="type" initialValue="home_tutoring">
            <Radio.Group
              onChange={(e) => handleOrderTypeChange(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="home_tutoring">Home Tutoring</Radio.Button>
              <Radio.Button value="study_notes">Study Notes</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* Course Selection Section */}
          <Title level={4} className="mb-4">
            {orderType === "home_tutoring" ? "Course" : "Study Notes"} Selection
          </Title>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="schoolCourseId"
                label={`Select ${
                  orderType === "home_tutoring" ? "Course" : "Study Notes"
                }`}
                rules={[{ required: true, message: "Please select a course" }]}
              >
                <Select
                  placeholder={`Select ${
                    orderType === "home_tutoring" ? "course" : "study notes"
                  }`}
                  loading={allSchoolCoursesLoading}
                  onChange={handleCourseChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {allSchoolCourses?.map((course) => (
                    <Option key={course.id} value={course.id}>
                      {course.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Loading state */}
          {singleSCDetailLoading && schoolCourseId && (
            <div className="text-center my-8">
              <Spin tip="Loading course details..." />
            </div>
          )}

          {/* Course Details Section */}
          {!singleSCDetailLoading && singleSCDetail && (
            <>
              <div className="mb-6 p-4 border rounded-lg">
                <Title level={5} className="mb-2">
                  {singleSCDetail.title}
                </Title>
                <Text>{singleSCDetail.description}</Text>
              </div>

              {/* Teachers/Study Notes Selection */}
              {orderType === "home_tutoring" ? (
                <>
                  <Title level={4} className="mb-4">
                    Available Teachers
                  </Title>
                  <Table
                    columns={teacherColumns}
                    dataSource={singleSCDetail.homeTutoringData || []}
                    rowKey="home_tutoring_id"
                    pagination={false}
                    className="mb-6"
                  />

                  {selectedTeacher && (
                    <Card className="mb-6" size="small">
                      <Title level={5} className="mb-2">
                        Selected Teacher
                      </Title>
                      <Text>
                        {
                          singleSCDetail.homeTutoringData.find(
                            (t) => t.home_tutoring_id === selectedTeacher
                          )?.first_name
                        }
                      </Text>
                    </Card>
                  )}
                </>
              ) : (
                <>
                  <Title level={4} className="mb-4">
                    Available Study Notes
                  </Title>
                  <Table
                    columns={studyNotesColumns}
                    dataSource={singleSCDetail.studyNotes || []}
                    rowKey="id"
                    pagination={false}
                    className="mb-6"
                  />

                  {selectedStudyNote && (
                    <Card className="mb-6" size="small">
                      <Title level={5} className="mb-2">
                        Selected Study Note
                      </Title>
                      <div>
                        <Text>
                          {
                            singleSCDetail.studyNotes.find(
                              (n) => n.id === selectedStudyNote
                            )?.name
                          }
                        </Text>
                        <div>
                          <Text strong>Price: </Text>
                          <Text>
                            $
                            {
                              singleSCDetail.studyNotes.find(
                                (n) => n.id === selectedStudyNote
                              )?.price
                            }
                          </Text>
                        </div>
                      </div>
                    </Card>
                  )}
                </>
              )}
            </>
          )}

          <Divider />

          {/* Address Section */}
          <Title level={4} className="mb-4">
            Address Information
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="city" label="City">
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="block" label="Block">
                <Input placeholder="Enter block" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="floor" label="Floor">
                <Input placeholder="Enter floor" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="apartment" label="Apartment">
                <Input placeholder="Enter apartment" />
              </Form.Item>
            </Col>
          </Row>

          {/* Schedule Section (only for tutoring) */}
          {orderType === "home_tutoring" && (
            <>
              <Divider />
              <Title level={4} className="mb-4">
                Schedule Information
              </Title>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="date"
                    label="Date"
                    initialValue={dayjs()}
                    rules={[{ required: true }]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="fromTime"
                    label="From Time"
                    initialValue={dayjs().hour(14).minute(0)}
                    rules={[{ required: true }]}
                  >
                    <TimePicker className="w-full" format="HH:mm" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="toTime"
                    label="To Time"
                    initialValue={dayjs().hour(16).minute(0)}
                    rules={[{ required: true }]}
                  >
                    <TimePicker className="w-full" format="HH:mm" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="totalHourse"
                    label="Total Hours"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      className="w-full"
                      min={1}
                      placeholder="e.g., 2"
                      onChange={handleHoursChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Divider />

          {/* Payment Section */}
          <Title level={4} className="mb-4">
            Payment Information
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="totalPayment"
                label="Total Payment ($)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  disabled={orderType === "study_notes" && selectedStudyNote}
                />
              </Form.Item>
            </Col>
            {orderType === "home_tutoring" && selectedTeacher && (
              <Col xs={24} md={12}>
                <Form.Item label="Price Per Hour">
                  <Input
                    className="w-full"
                    value={`$${
                      singleSCDetail?.homeTutoringData?.find(
                        (t) => t.home_tutoring_id === selectedTeacher
                      )?.price_per_hour
                    }`}
                    disabled
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          {/* Coupon Section */}
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
                    disabled={
                      !couponData.code || !form.getFieldValue("totalPayment")
                    }
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
              <Text>Subtotal:</Text>
              <Text>
                $
                {(
                  form.getFieldValue("totalPayment") +
                  (couponData.applied ? couponData.discount : 0)
                ).toFixed(2)}
              </Text>
            </div>
            {couponData.applied && (
              <div className="flex justify-between mb-2">
                <Text>Discount:</Text>
                <Text type="danger">-${couponData.discount.toFixed(2)}</Text>
              </div>
            )}
            <Divider className="my-2" />
            <div className="flex justify-between">
              <Text strong>Total:</Text>
              <Text strong>
                ${form.getFieldValue("totalPayment")?.toFixed(2) || "0.00"}
              </Text>
            </div>
          </Card>

          {/* Submit Button */}
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            disabled={
              !schoolCourseId ||
              (orderType === "home_tutoring" && !selectedTeacher) ||
              (orderType === "study_notes" && !selectedStudyNote) ||
              !form.getFieldValue("totalPayment")
            }
            block
          >
            Create School Order
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default CreateSchoolOrder;
