import React, { useState } from "react";
import { Button, Modal, Form, Input, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

function AddSchoolCourses({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // Modal Open
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Modal Close
  const handleCancel = () => {
    setIsModalOpen(false);
    reset(); // Reset form fields
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("status", data.status);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0].originFileObj);
    }

    try {
      const response = await API.post("/school-courses/create", formData);
      message.success("courses added successfully!");
      refetch();
      handleCancel(); // Close modal on success
    } catch (error) {
      message.error("Failed to add School courses. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add School Courses
      </Button>
      <Modal
        title="Add School Courses"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Image Upload */}
          <Form.Item label="Upload Image">
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false} // Prevent auto-upload
                  maxCount={1}
                  accept="image/*"
                  fileList={value || []}
                  onChange={({ fileList }) => onChange(fileList)}
                  onPreview={(file) => {
                    const src =
                      file.url || URL.createObjectURL(file.originFileObj);
                    const imgWindow = window.open(src);
                    imgWindow.document.write(
                      `<img src="${src}" style="width: 100%;" />`
                    );
                  }}
                >
                  {value && value.length >= 1 ? null : (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload Image</div>
                    </div>
                  )}
                </Upload>
              )}
            />
          </Form.Item>

          {/* Courses Title */}
          <Form.Item label="Courses Title">
            <Controller
              name="title"
              control={control}
              rules={{ required: "Courses Title is required" }}
              render={({ field }) => (
                <Input placeholder="Enter Courses Title..." {...field} />
              )}
            />
          </Form.Item>

          {/* status */}
          <Form.Item label="Status">
            <Controller
              name="status"
              control={control}
              defaultValue="Active"
              render={({ field }) => (
                <Select {...field}>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Deactivated">Deactivated</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddSchoolCourses;
