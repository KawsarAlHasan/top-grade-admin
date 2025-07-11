import React, { useState } from "react";
import { API } from "../../../../api/api";
import { Button, Form, Input, Modal, Select, Spin, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

function AddSemesterVideos({ contentID, refetch }) {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const payload = {
        type: "semester",
        type_id: contentID,
        url: values.url,
        title: values.title,
        duration: values.duration,
        isPaid: values.isPaid,
      };

      await API.post("/video/create", payload);
      message.success("Video added successfully");
      refetch();
      handleCancel();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to add video");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Video
      </Button>

      <Modal
        title="Add New Video to Semester"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isPaid: 1 }}
        >
          <Form.Item
            name="title"
            label="Video Title"
            rules={[{ required: true, message: "Please input video title!" }]}
          >
            <Input placeholder="Enter video title" />
          </Form.Item>

          <Form.Item
            name="url"
            label="Video URL"
            rules={[{ required: true, message: "Please input video URL!" }]}
          >
            <Input placeholder="Enter video URL" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: "Please input duration!" }]}
          >
            <Input placeholder="e.g. 05:00 Minutes" />
          </Form.Item>

          <Form.Item
            name="isPaid"
            label="Video Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value={1}>Paid</Option>
              <Option value={0}>Free</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-3">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {loading ? <Spin /> : "Add Video"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddSemesterVideos;
