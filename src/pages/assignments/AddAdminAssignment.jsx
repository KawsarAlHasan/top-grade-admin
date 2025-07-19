import React, { useState, useEffect } from "react";
import { API, useAllCourses, useAllUsers, useServicesFee } from "../../api/api";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  DatePicker,
  message,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

function AddAdminAssignment({ refetch }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [submitFileList, setSubmitFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { allCourses, isLoading: courseLoading } = useAllCourses();
  const { allUsers, isLoading: userLoading } = useAllUsers();

  const {
    singleServices,
    isLoading: servicesLoading,
    isError,
    error,
  } = useServicesFee("university");

  const taxPercentage = singleServices?.percentage || 0;

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key !== "file" && key !== "submit_file" && values[key]) {
          formData.append(key, values[key]);
        }
      });

      if (values.file) {
        values.file.forEach((file) => {
          formData.append("file", file.originFileObj);
        });
      }

      if (values.submit_file) {
        values.submit_file.forEach((file) => {
          formData.append("submit_file", file.originFileObj);
        });
      }

      await API.post("/admin-assignment/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Assignment created successfully!");
      form.resetFields();
      setFileList([]);
      setSubmitFileList([]);
      refetch();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to create assignment: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const teachers = allUsers?.filter((user) => user.role === "Teacher");
  const students = allUsers?.filter((user) => user.role === "Student");

  // Auto-calculate tax and net_payment when lowest_bid changes
  const handleBidChange = (e) => {
    const bid = parseFloat(e.target.value);
    if (!isNaN(bid)) {
      const tax = (bid * taxPercentage) / 100;
      const netPayment = bid - tax;

      form.setFieldsValue({
        tax: tax.toFixed(2),
        net_payment: netPayment.toFixed(2),
      });
    } else {
      form.setFieldsValue({
        tax: "",
        net_payment: "",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create New Assignment
      </Button>

      <Modal
        title="Create New Assignment"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Course"
              name="courses_id"
              rules={[{ required: true, message: "Please select a course!" }]}
            >
              <Select
                showSearch
                placeholder="Select a course"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                loading={courseLoading}
              >
                {allCourses?.map((course) => (
                  <Option key={course.id} value={course.id}>
                    {course.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Student" name="student_id">
              <Select
                showSearch
                placeholder="Select a student"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                loading={userLoading}
              >
                {students?.map((student) => (
                  <Option key={student.id} value={student.id}>
                    {student?.first_name + " " + student?.last_name} (
                    {student?.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Date" name="date">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select defaultValue={"Completed"} placeholder="Select status">
                <Option value="Completed">Completed</Option>
                <Option value="Assigned">Assigned</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Delivered">Delivered</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="File"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                beforeUpload={() => false}
                multiple={false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Submit File"
              name="submit_file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                beforeUpload={() => false}
                multiple={false}
                fileList={submitFileList}
                onChange={({ fileList }) => setSubmitFileList(fileList)}
              >
                <Button icon={<UploadOutlined />}>Select Submit File</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              className="md:col-span-2"
            >
              <TextArea rows={4} placeholder="Enter description" />
            </Form.Item>

            <Form.Item
              label="Teacher"
              name="winning_bidder"
              rules={[{ required: true, message: "Please select a Teacher!" }]}
            >
              <Select
                showSearch
                placeholder="Select a teacher"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                loading={userLoading}
              >
                {teachers?.map((teacher) => (
                  <Option key={teacher.id} value={teacher.id}>
                    {teacher.first_name + " " + teacher.last_name} (
                    {teacher.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Price" name="lowest_bid">
              <Input
                type="number"
                placeholder="Enter lowest bid"
                onChange={handleBidChange}
              />
            </Form.Item>

            <Form.Item label="Tax" name="tax">
              <Input type="number" placeholder="Auto calculated tax" readOnly />
            </Form.Item>

            <Form.Item label="Net Payment" name="net_payment">
              <Input
                type="number"
                placeholder="Auto calculated net payment"
                readOnly
              />
            </Form.Item>
          </div>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Create Assignment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddAdminAssignment;
