import React, { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { API } from "../../api/api";

const { Item } = Form;

const EditCoursesTopic = ({ isOpen, onClose, topicData, refetch }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (topicData) {
      form.setFieldsValue({
        name: topicData.name,
      });
    }
  }, [topicData, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      await API.put(`/courses-topic/update/${topicData.id}`, {
        name: values.name,
      });
      notification.success({
        message: "Topic updated successfully",
      });
      onClose();
      refetch();
    } catch (error) {
      notification.error({
        message: "Failed to update topic",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Edit Topic"
      visible={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Save"
      cancelText="Cancel"
      confirmLoading={isSubmitting}
    >
      <Form form={form} layout="vertical">
        <Item
          name="name"
          label="Topic Name"
          rules={[
            {
              required: true,
              message: "Please enter topic name",
            },
          ]}
        >
          <Input placeholder="Enter topic name" />
        </Item>
      </Form>
    </Modal>
  );
};

export default EditCoursesTopic;
