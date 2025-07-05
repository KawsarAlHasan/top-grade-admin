import React, { useState } from "react";
import { Button, Modal, Select, Input, Space, Spin, message, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../../api/api";
import { useParams } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

function AddStudyNote({ refetch }) {
  const { schoolCoursesID } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    reset();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await API.post("/study-note/create", {
        school_courses_id: schoolCoursesID,
        name: data.name,
        price: data.price,
        status: data.status,
      });

      message.success("Study note added successfully!");
      refetch();
      handleCancel();
    } catch (error) {
      message.error("Failed to add study note.");
      console.error("Error adding study note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Study Note
      </Button>

      <Modal
        title="Add New Study Note"
        open={isModalVisible}
        onOk={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        confirmLoading={isSubmitting}
        width={700}
      >
        <Form layout="vertical" className="space-y-4">
          {/* Study Note Name */}
          <Form.Item
            label="Name"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter study note name"
                  size="large"
                />
              )}
            />
          </Form.Item>

          {/* Price */}
          <Form.Item
            label="Price"
            validateStatus={errors.price ? "error" : ""}
            help={errors.price?.message}
          >
            <Controller
              name="price"
              control={control}
              rules={{
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter price"
                  size="large"
                  addonAfter="$"
                />
              )}
            />
          </Form.Item>

          {/* Status */}
          <Form.Item
            label="Status"
            validateStatus={errors.status ? "error" : ""}
            help={errors.status?.message}
          >
            <Controller
              name="status"
              control={control}
              defaultValue={"Active"}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select status"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <Option value="Active">Active</Option>
                  <Option value="Deactive">Deactive</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddStudyNote;
