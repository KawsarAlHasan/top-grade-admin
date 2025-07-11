import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { API } from "../../api/api";

function AddCoupon({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // 🔹 loading state

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields(); // optional reset
  };

  const handleSubmit = async (values) => {
    setLoading(true); // 🔸 loading starts
    try {
      const payload = {
        ...values,
        expiration_date: values.expiration_date.format("YYYY-MM-DD"),
      };

      await API.post("/coupon/create", payload);
      refetch(); // optional data refresh
      notification.success({ message: "Coupon created successfully!" });
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      notification.error({
        message: "Failed to create coupon",
        description: error.message,
      });
    } finally {
      setLoading(false); // 🔸 loading ends
    }
  };

  return (
    <div className="p-4">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="bg-blue-600 hover:bg-blue-700"
        onClick={showModal}
      >
        Add New Coupon
      </Button>

      <Modal
        title="Add New Coupon"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Submit"
        cancelText="Cancel"
        confirmLoading={loading} // ✅ loading spinner on OK button
        className="rounded-lg"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ is_active: true }}
        >
          <Form.Item
            label="Coupon Title"
            name="title"
            rules={[{ required: true, message: "Please enter coupon title" }]}
          >
            <Input placeholder="Enter coupon title" />
          </Form.Item>

          <Form.Item
            label="Coupon Code"
            name="code"
            rules={[{ required: true, message: "Please enter coupon code" }]}
          >
            <Input placeholder="e.g., SAVE20" />
          </Form.Item>

          <Form.Item
            label="Discount (%)"
            name="discount"
            rules={[{ required: true, message: "Enter discount percentage" }]}
          >
            <InputNumber
              placeholder="e.g., 20"
              min={1}
              max={100}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Expiration Date"
            name="expiration_date"
            rules={[{ required: true, message: "Select expiration date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddCoupon;
