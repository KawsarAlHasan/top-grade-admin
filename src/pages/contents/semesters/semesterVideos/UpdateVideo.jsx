import React, { useState, useEffect } from "react";
import { API } from "../../../../api/api";
import { Button, Form, Input, Modal, Select, Spin, message } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Option } = Select;

function UpdateVideo({ videoData, refetch }) {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && videoData) {
      form.setFieldsValue({
        title: videoData.title,
        url: videoData.url,
        duration: videoData.duration,
        isPaid: videoData.isPaid,
      });
    }
  }, [visible, videoData, form]);

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
        url: values.url,
        title: values.title,
        duration: values.duration,
        isPaid: values.isPaid,
      };

      await API.put(`/video/update/${videoData.id}`, payload);
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
        type="text"
        icon={<EditOutlined className="text-blue-500" />}
        onClick={showModal}
        disabled={!videoData}
      />

      <Modal
        title={`Update Video: ${videoData?.title || ""}`}
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
                {loading ? <Spin /> : "Update Video"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateVideo;
