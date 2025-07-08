import React, { useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, Card, message, Typography } from "antd";
import { API } from "../../api/api";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function ChangePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await API.put("/admin/change-password", {
        old_password: values.oldPassword,
        new_password: values.newPassword,
      });
      message.success("Password changed successfully!");
      form.resetFields();
      navigate("/");
    } catch (error) {
      message.error("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[720px] flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
        <div className="text-center mb-6">
          <Title level={3} className="text-gray-800">
            Change Password
          </Title>
          <p className="text-gray-500">Enter your current and new password</p>
        </div>

        <Form
          form={form}
          name="change_password"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="Current password"
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please input your new password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="New password"
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="Confirm new password"
              className="py-2"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="h-10 font-medium bg-blue-600 hover:bg-blue-700"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ChangePassword;
