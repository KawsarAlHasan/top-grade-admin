import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  notification,
  Select,
  Spin,
  Avatar,
  InputNumber,
  Space,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { API, useAllUsers } from "../../api/api";

const { Item } = Form;
const { Option } = Select;

const EditCourseDetails = ({ isOpen, onClose, courseData, refetch }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { allUsers, isLoading, isError, error } = useAllUsers();

  const teachers = allUsers?.filter((user) => user.role === "Teacher");

  useEffect(() => {
    if (courseData && teachers) {
      const currentTeacher = teachers.find(
        (teacher) => teacher.id === courseData.teacher_id
      );

      form.setFieldsValue({
        teacher_id: currentTeacher
          ? {
              value: currentTeacher.id,
              label: `${currentTeacher.first_name} ${currentTeacher.last_name}`,
            }
          : undefined,
        total_chapter: parseInt(
          courseData.total_chapter.replace(" Chapters", "")
        ),
        total_duration: parseInt(
          courseData.total_duration.replace(" Minutes", "")
        ),
      });
    }
  }, [courseData, form, teachers]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      await API.put(`/courses-deatials/update/${courseData.id}`, {
        teacher_id: values.teacher_id.value,
        total_chapter: `${values.total_chapter} Chapters`,
        total_duration: `${values.total_duration} Minutes`,
      });

      notification.success({
        message: "Course details updated successfully",
      });
      onClose();
      refetch();
    } catch (error) {
      console.error(error, "error");
      notification.error({
        message: "Failed to update course details",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Spin />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Modal
      title="Edit Course Details"
      visible={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Save"
      cancelText="Cancel"
      confirmLoading={isSubmitting}
    >
      <Form key={courseData?.id} form={form} layout="vertical">
        {/* Teacher Selection */}
        <Item
          name="teacher_id"
          label="Select Teacher"
          rules={[
            {
              required: true,
              message: "Please select a teacher",
            },
          ]}
        >
          <Select
            labelInValue
            showSearch
            placeholder="Select a teacher"
            optionLabelProp="label"
            onChange={(value) => {
              form.setFieldsValue({ teacher_id: value });
            }}
            filterOption={(input, option) => {
              const name = option?.label?.toLowerCase();
              const email = option?.email?.toLowerCase();
              return (
                name?.includes(input.toLowerCase()) ||
                email?.includes(input.toLowerCase())
              );
            }}
          >
            {teachers?.map((teacher) => (
              <Option
                key={teacher.id}
                value={teacher.id}
                label={`${teacher.first_name} ${teacher.last_name}`}
                email={teacher.email}
              >
                <Space>
                  <Avatar
                    src={teacher.profile_pic}
                    icon={<UserOutlined />}
                    alt={teacher.first_name}
                  />
                  <div>
                    <div>
                      {teacher.first_name} {teacher.last_name}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {teacher.email}
                    </div>
                  </div>
                </Space>
              </Option>
            ))}
          </Select>
        </Item>

        {/* Total Chapters */}
        <Item
          name="total_chapter"
          label="Total Chapters"
          rules={[
            {
              required: true,
              message: "Please enter total chapters",
            },
            {
              type: "number",
              min: 1,
              message: "Must be at least 1",
            },
          ]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Enter total chapters"
          />
        </Item>

        {/* Total Duration */}
        <Item
          name="total_duration"
          label="Total Duration (minutes)"
          rules={[
            {
              required: true,
              message: "Please enter total duration",
            },
            {
              type: "number",
              min: 1,
              message: "Must be at least 1",
            },
          ]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Enter total duration in minutes"
          />
        </Item>
      </Form>
    </Modal>
  );
};

export default EditCourseDetails;
