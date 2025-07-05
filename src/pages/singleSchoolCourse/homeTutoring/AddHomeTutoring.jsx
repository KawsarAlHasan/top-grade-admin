import React, { useState } from "react";
import {
  Button,
  Modal,
  Select,
  Avatar,
  Space,
  Spin,
  message,
  InputNumber,
} from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API, useAllUsers } from "../../../api/api";
import { useParams } from "react-router-dom";

const { Option } = Select;

function AddHomeTutoring({ refetch }) {
  const { schoolCoursesID } = useParams();
  const { allUsers, isLoading, isError, error } = useAllUsers();

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
    reset(); // reset form fields
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await API.post("/home-tutoring/create", {
        school_courses_id: schoolCoursesID,
        teacher_id: data.teacher_id.value,
      });

      message.success("Home Tutor added successfully!");
      refetch();
      handleCancel();
    } catch (error) {
      console.log(error);
      message.error("Failed to submit Home Tutor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Spin />;
  if (isError) return <div>Error: {error.message}</div>;

  const teachersOnly = allUsers?.filter((user) => user.role === "Teacher");

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Home Tutor
      </Button>

      <Modal
        title="Add Home Tutor"
        open={isModalVisible}
        onOk={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        confirmLoading={isSubmitting}
      >
        <form className="space-y-4">
          {/* ✅ Teacher Selection */}
          <div>
            <label className="block mb-1 font-medium">Select Teacher</label>
            <Controller
              name="teacher_id"
              control={control}
              rules={{ required: "Please select a teacher" }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelInValue
                  showSearch
                  placeholder="Select a teacher"
                  style={{ width: "100%" }}
                  optionLabelProp="label"
                  filterOption={(input, option) => {
                    const name = option?.label?.toLowerCase();
                    const email = option?.email?.toLowerCase();
                    return (
                      name?.includes(input.toLowerCase()) ||
                      email?.includes(input.toLowerCase())
                    );
                  }}
                  // Custom selected item render
                  dropdownRender={(menu) => menu}
                >
                  {teachersOnly?.map((user) => (
                    <Option
                      key={user.id}
                      value={user.id}
                      label={`${user.first_name} ${user.last_name}`}
                      email={user.email}
                    >
                      <Space>
                        <Avatar
                          src={user.profile_pic}
                          icon={<UserOutlined />}
                          alt={user.first_name}
                        />
                        <div>
                          <div>
                            {user.first_name} {user.last_name}
                          </div>
                          <div style={{ fontSize: 12, color: "#888" }}>
                            {user.email}
                          </div>
                        </div>
                      </Space>
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.teacher_id && (
              <p className="text-red-500 text-sm">
                {errors.teacher_id.message}
              </p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AddHomeTutoring;
