import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Switch,
  notification,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { API } from "../../api/api";
import dayjs from "dayjs";

function EditCoupon({ couponData, refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);

    form.setFieldsValue({
      title: couponData.title,
      code: couponData.code,
      discount: couponData.discount,
      expiration_date: dayjs(couponData.expiration_date),
      is_active: couponData.is_active,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        expiration_date: values.expiration_date.format("YYYY-MM-DD"),
      };

      await API.put(`/coupon/update/${couponData.id}`, payload);
      refetch(); // optional: update parent list
      notification.success({ message: "Coupon updated successfully!" });
      setIsModalOpen(false);
    } catch (error) {
      notification.error({
        message: "Failed to update coupon",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        size="small"
        icon={<EditOutlined />}
        onClick={showModal}
      >
        Edit
      </Button>

      <Modal
        title="Edit Coupon"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Update"
        cancelText="Cancel"
        confirmLoading={loading}
        className="rounded-lg"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label="Coupon Title"
            name="title"
            rules={[{ required: true, message: "Please enter coupon title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Coupon Code"
            name="code"
            rules={[{ required: true, message: "Please enter coupon code" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Discount (%)"
            name="discount"
            rules={[{ required: true, message: "Enter discount percentage" }]}
          >
            <InputNumber min={1} max={100} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Expiration Date"
            name="expiration_date"
            rules={[{ required: true, message: "Select expiration date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EditCoupon;
