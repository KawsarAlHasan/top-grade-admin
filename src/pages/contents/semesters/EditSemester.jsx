import React, { useState, useEffect } from "react";
import { API } from "../../../api/api";
import { Button, Form, Input, Modal, Select, Spin, message } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Option } = Select;

function EditSemester({ semesterData, refetch }) {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && semesterData) {
      form.setFieldsValue({
        title: semesterData.title,
        price: semesterData.price,
        duration: semesterData.duration,
        intro_url: semesterData.intro_url,
        description: semesterData.description,
      });
    }
  }, [visible, semesterData, form]);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (data) => {
    try {
      setLoading(true);
      const payload = {
        title: data.title,
        price: data.price,
        duration: data.duration,
        intro_url: data.intro_url,
        description: data.description,
      };

      await API.put(`/content/semester/update/${semesterData.id}`, payload);
      message.success("Video updated successfully");
      refetch();
      handleCancel();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        icon={<EditOutlined />}
        onClick={showModal}
        disabled={!semesterData}
      >
        Edit
      </Button>

      <Modal
        title={`Update Video: ${semesterData?.title || ""}`}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label="Video Title"
            rules={[{ required: true, message: "Please input video title!" }]}
          >
            <Input placeholder="Enter video title" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>

          <Form.Item
            name="intro_url"
            label="Video intro url"
            rules={[
              { required: true, message: "Please input video intro url!" },
            ]}
          >
            <Input placeholder="Enter video intro url" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: "Please input duration!" }]}
          >
            <Input placeholder="e.g. 05:00 Minutes" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-3">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {loading ? <Spin /> : "Update Video"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditSemester;