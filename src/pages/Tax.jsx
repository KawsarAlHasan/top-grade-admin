import React, { useState } from "react";
import { API, useServicesFee } from "../api/api";
import {
  Card,
  Form,
  Input,
  Button,
  Spin,
  message,
  Typography,
  Skeleton,
  Alert,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function Tax() {
  const [form] = Form.useForm();
  const [editingType, setEditingType] = useState(null);

  // University services data
  const {
    singleServices: universityServices,
    isLoading: universityServicesLoading,
    isError: universityServicesIsError,
    error: universityServicesError,
    refetch: universityServicesRefetch,
  } = useServicesFee("university");

  // School services data
  const {
    singleServices: schoolServices,
    isLoading: schoolServicesLoading,
    isError: schoolServicesIsError,
    error: schoolServicesError,
    refetch: schoolServicesRefetch,
  } = useServicesFee("School");

  const handleEdit = (type) => {
    setEditingType(type);
    const services =
      type === "university" ? universityServices : schoolServices;
    form.setFieldsValue({
      percentage: services?.percentage,
      title: services?.title,
    });
  };

  const handleCancel = () => {
    setEditingType(null);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await API.put(`/services-fee/${editingType}`, {
        percentage: values.percentage,
        title: values.title,
      });

      message.success(
        `${
          editingType === "university" ? "University" : "School"
        } services fee updated successfully`
      );

      if (editingType === "university") {
        universityServicesRefetch();
      } else {
        schoolServicesRefetch();
      }

      setEditingType(null);
    } catch (error) {
      message.error("Failed to update services fee");
      console.error(error);
    }
  };

  if (universityServicesLoading || schoolServicesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (universityServicesIsError || schoolServicesIsError) {
    if (error?.response?.status === 404) {
      return (
        <div className="p-4">
          <Alert
            message="No Data"
            description="No Data found."
            type="info"
            showIcon
          />
        </div>
      );
    }

    return (
      <div className="p-4">
        <Alert
          message="Error"
          description={
            universityServicesError?.message ||
            schoolServicesError?.message ||
            "Something went wrong"
          }
          type="error"
          showIcon
          action={
            <Button
              danger
              icon={<ReloadOutlined />}
              onClick={schoolServicesRefetch || universityServicesRefetch}
              className="flex items-center"
            >
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Title level={3} className="mb-6">
        Services Fees Management
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* University Services Card */}
        <Card
          title="University Services Fee"
          className="shadow-md"
          extra={
            editingType === "university" ? (
              <div className="flex space-x-2">
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  className="flex items-center"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  className="flex items-center"
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit("university")}
                className="flex items-center"
              >
                Edit
              </Button>
            )
          }
        >
          {editingType === "university" ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                percentage: universityServices?.percentage,
                title: universityServices?.title,
              }}
            >
              <Form.Item
                name="percentage"
                label="Percentage"
                rules={[
                  { required: true, message: "Please input percentage" },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Please input a valid number",
                  },
                ]}
              >
                <Input addonAfter="%" />
              </Form.Item>
              <Form.Item
                name="title"
                label="Description"
                rules={[
                  { required: true, message: "Please input description" },
                ]}
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </Form>
          ) : (
            <div>
              <div className="mb-4">
                <Text strong>Percentage:</Text>
                <Text className="ml-2">{universityServices?.percentage}%</Text>
              </div>
              <div>
                <Text strong>Description:</Text>
                <Text className="ml-2">{universityServices?.title}</Text>
              </div>
            </div>
          )}
        </Card>

        {/* School Services Card */}
        <Card
          title="School Services Fee"
          className="shadow-md"
          extra={
            editingType === "school" ? (
              <div className="flex space-x-2">
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  className="flex items-center"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  className="flex items-center"
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit("school")}
                className="flex items-center"
              >
                Edit
              </Button>
            )
          }
        >
          {editingType === "school" ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                percentage: schoolServices?.percentage,
                title: schoolServices?.title,
              }}
            >
              <Form.Item
                name="percentage"
                label="Percentage"
                rules={[
                  { required: true, message: "Please input percentage" },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Please input a valid number",
                  },
                ]}
              >
                <Input addonAfter="%" />
              </Form.Item>
              <Form.Item
                name="title"
                label="Description"
                rules={[
                  { required: true, message: "Please input description" },
                ]}
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </Form>
          ) : (
            <div>
              <div className="mb-4">
                <Text strong>Percentage:</Text>
                <Text className="ml-2">{schoolServices?.percentage}%</Text>
              </div>
              <div>
                <Text strong>Description:</Text>
                <Text className="ml-2">{schoolServices?.title}</Text>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Tax;
