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
  Spin,
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
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Option } = Select;

function CreateSchoolOrder() {
  const [form] = Form.useForm();
  const [schoolCoursesID, setSchoolCoursesID] = useState(null);
  const [orderType, setOrderType] = useState("home_tutoring");
  const [couponData, setCouponData] = useState({ code: "", discount: 0 });
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudyNote, setSelectedStudyNote] = useState(null);

  // API hooks
  const { allUsers, isLoading: userLoading } = useAllUsers();
  const { allSchoolCourses, isLoading: allSchoolCoursesIsLoading } =
    useAllSchoolCourses();
  const {
    singleSCDetail,
    isLoading: singleSCDetailIsLoading,
    refetch,
  } = useSingleSchoolCourse(schoolCoursesID);

  useEffect(() => {
    if (schoolCoursesID) refetch();
  }, [schoolCoursesID, orderType]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
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
        totalPayment: values.totalPayment,
        coupon_code: couponData.code || null,
        coupon_discount: couponData.discount,
        sub_total_price: values.totalPayment + couponData.discount,
        total_price: values.totalPayment,
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
    setCouponData({ code: "", discount: 0 });
    setSchoolCoursesID(null);
    setSelectedTeacher(null);
    setSelectedStudyNote(null);
  };

  const teacherColumns = [
    {
      title: "Teacher",
      key: "teacher",
      render: (record) => (
        <div>
          {record.first_name || "N/A"} {record.last_name || ""}
          {record.email && <div className="text-gray-500">{record.email}</div>}
          {record.phone && <div className="text-gray-500">{record.phone}</div>}
        </div>
      ),
    },
    {
      title: "Price/Hour",
      key: "price",
      render: (record) => `$${record.price_per_hour || "N/A"}`,
    },
    {
      title: "Select",
      key: "action",
      render: (record) => (
        <Button
          type={
            selectedTeacher === record.home_tutoring_id ? "primary" : "default"
          }
          onClick={() => {
            setSelectedTeacher(record.home_tutoring_id);
            form.setFieldsValue({
              totalPayment:
                record.price_per_hour *
                (form.getFieldValue("totalHourse") || 2),
            });
          }}
        >
          {selectedTeacher === record.home_tutoring_id ? "Selected" : "Select"}
        </Button>
      ),
    },
  ];

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
          onClick={() => {
            setSelectedStudyNote(record.id);
            form.setFieldsValue({ totalPayment: record.price });
          }}
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
            Order Details
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="type"
                label="Order Type"
                initialValue="home_tutoring"
              >
                <Select
                  onChange={(value) => {
                    setOrderType(value);
                    setSelectedTeacher(null);
                    setSelectedStudyNote(null);
                    setSchoolCoursesID(null);
                    form.setFieldsValue({ schoolCoursesID: undefined });
                  }}
                >
                  <Option value="home_tutoring">Home Tutoring</Option>
                  <Option value="study_notes">Study Notes</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="schoolCoursesID"
                label={`Select ${
                  orderType === "home_tutoring" ? "Course" : "Study Notes"
                }`}
                rules={[{ required: true, message: "Please select a course" }]}
              >
                <Select
                  placeholder={`Select ${
                    orderType === "home_tutoring" ? "course" : "study notes"
                  }`}
                  loading={allSchoolCoursesIsLoading}
                  onChange={(value) => {
                    setSchoolCoursesID(value);
                    setSelectedTeacher(null);
                    setSelectedStudyNote(null);
                  }}
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

          {/* Course Details Section */}
          {singleSCDetailIsLoading && schoolCoursesID ? (
            <Spin tip="Loading course details..." />
          ) : (
            singleSCDetail && (
              <div className="mb-6">
                <div className="p-4 border rounded-lg mb-4">
                  <Title level={5}>{singleSCDetail.title}</Title>
                  <Text>{singleSCDetail.description}</Text>
                </div>

                {/* Teachers/Study Notes Selection */}
                {orderType === "home_tutoring" &&
                  singleSCDetail.homeTutoringData?.length > 0 && (
                    <div className="mb-6">
                      <Title level={5} className="mb-4">
                        Available Teachers
                      </Title>
                      <Table
                        columns={teacherColumns}
                        dataSource={singleSCDetail.homeTutoringData}
                        rowKey="home_tutoring_id"
                        pagination={false}
                      />
                      {selectedTeacher && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <Text strong>Selected Teacher: </Text>
                          <Text>
                            {singleSCDetail.homeTutoringData.find(
                              (t) => t.home_tutoring_id === selectedTeacher
                            )?.first_name || "N/A"}
                          </Text>
                        </div>
                      )}
                    </div>
                  )}

                {orderType === "study_notes" &&
                  singleSCDetail.studyNotes?.length > 0 && (
                    <div className="mb-6">
                      <Title level={5} className="mb-4">
                        Available Study Notes
                      </Title>
                      <Table
                        columns={studyNotesColumns}
                        dataSource={singleSCDetail.studyNotes}
                        rowKey="id"
                        pagination={false}
                      />
                      {selectedStudyNote && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <Text strong>Selected Study Note: </Text>
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
                      )}
                    </div>
                  )}
              </div>
            )
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
                  <Form.Item name="date" label="Date" initialValue={dayjs()}>
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="fromTime"
                    label="From Time"
                    initialValue={dayjs().hour(14).minute(0)}
                  >
                    <TimePicker className="w-full" format="HH:mm" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="toTime"
                    label="To Time"
                    initialValue={dayjs().hour(16).minute(0)}
                  >
                    <TimePicker className="w-full" format="HH:mm" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="totalHourse" label="Total Hours">
                    <InputNumber
                      className="w-full"
                      min={1}
                      placeholder="e.g., 2"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {/* Payment Section */}
          <Divider />
          <Title level={4} className="mb-4">
            Payment Information
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={orderType === "home_tutoring" ? 12 : 24}>
              <Form.Item name="totalPayment" label="Total Payment ($)">
                <InputNumber
                  className="w-full"
                  min={0}
                  disabled={orderType === "study_notes" && selectedStudyNote}
                />
              </Form.Item>
            </Col>
            {orderType === "home_tutoring" && (
              <Col xs={24} md={12}>
                <Form.Item label="Calculated Price">
                  <Input
                    className="w-full"
                    value={
                      selectedTeacher && form.getFieldValue("totalHourse")
                        ? `$${
                            singleSCDetail?.homeTutoringData?.find(
                              (t) => t.home_tutoring_id === selectedTeacher
                            )?.price_per_hour *
                            form.getFieldValue("totalHourse")
                          }`
                        : "Select teacher and hours"
                    }
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
                <Input
                  placeholder="Coupon code"
                  value={couponData.code}
                  onChange={(e) =>
                    setCouponData({ ...couponData, code: e.target.value })
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Discount Amount ($)">
                <InputNumber
                  placeholder="Discount amount"
                  min={0}
                  value={couponData.discount}
                  onChange={(value) =>
                    setCouponData({ ...couponData, discount: value || 0 })
                  }
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button */}
          <Divider />
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            disabled={
              !schoolCoursesID ||
              (orderType === "home_tutoring" && !selectedTeacher) ||
              (orderType === "study_notes" && !selectedStudyNote)
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
