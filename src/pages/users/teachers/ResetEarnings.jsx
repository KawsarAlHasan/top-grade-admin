import { Button, Modal, Form, Input, message } from "antd";
import React, { useState } from "react";
import { API } from "../../../api/api";

function ResetEarnings({ teacher, refetch }) {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setVisible(true);
    // Initialize form with current values
    form.setFieldsValue({
      total_net_payment: teacher.total_net_payment,
      total_tax: teacher.total_tax,
      total_total_amount: teacher.total_total_amount,
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await API.put(`/teacher/resetEarnings/${teacher.id}`, {
        total_net_payment: 0,
        total_tax: 0,
        total_total_amount: 0,
      });
      message.success("Earnings reset to zero successfully");
      refetch();
      setVisible(false);
    } catch (error) {
      message.error("Failed to reset earnings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await API.put(`/teacher/resetEarnings/${teacher.id}`, values);
      message.success("Earnings updated successfully");
      refetch();
      setVisible(false);
    } catch (error) {
      if (error.errorFields) {
        return; // Form validation errors
      }
      console.log(error);
      message.error("Failed to update earnings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" className="w-full" onClick={showModal}>
        Reset Earnings
      </Button>

      <Modal
        title="Reset Teacher Earnings"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="reset" danger onClick={handleReset} loading={loading}>
            Reset to Zero
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            Update Values
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="total_net_payment"
            label="Net Payment"
            rules={[{ required: true, message: "Please input net payment!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="total_tax"
            label="Tax"
            rules={[{ required: true, message: "Please input tax!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="total_total_amount"
            label="Total Amount"
            rules={[{ required: true, message: "Please input total amount!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ResetEarnings;
