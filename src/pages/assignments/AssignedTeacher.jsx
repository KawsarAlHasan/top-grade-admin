import React, { useState } from "react";
import { API, useAllUsers, useServicesFee } from "../../api/api";
import { Button, Modal, Select, Input, Form, message } from "antd";

const { Option } = Select;

function AssignedTeacher({ assignmentData, refetch }) {
  const { allUsers, isLoading: userLoading } = useAllUsers();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const teachers = allUsers?.filter((user) => user.role === "Teacher");

  const {
    singleServices,
    isLoading: servicesLoading,
    isError,
    error,
  } = useServicesFee("university");

  const taxPercentage = singleServices?.percentage || 0;

  // Auto-calculate tax and net_payment when bid_price changes
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await API.post("/bid/create-by-admin", {
        assignment_id: assignmentData.id,
        bid_price: values.bid_price,
        proposal_sender_id: values.teacher_id,
        taxAmount: values.tax,
        net_payment: values.net_payment,
      });
      message.success("Teacher assigned successfully");
      refetch();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to assign teacher");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Assign Teacher
      </Button>

      <Modal
        title="Assign Teacher"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="teacher_id"
            label="Select Teacher"
            rules={[{ required: true, message: "Please select a teacher" }]}
          >
            <Select
              placeholder="Select a teacher"
              loading={userLoading}
              disabled={userLoading}
            >
              {teachers?.map((teacher) => (
                <Option key={teacher?.id} value={teacher?.id}>
                  {teacher?.first_name} {teacher?.last_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="bid_price"
            label="Bid Price"
            rules={[{ required: true, message: "Please enter bid price" }]}
          >
            <Input
              type="number"
              placeholder="Enter bid price"
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginRight: "10px" }}
            >
              Assign
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AssignedTeacher;
