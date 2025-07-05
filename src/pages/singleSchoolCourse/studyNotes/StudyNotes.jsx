import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  notification,
  Card,
  Tag,
  message,
  Select,
  Form,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API } from "../../../api/api";
import AddStudyNote from "./AddStudyNote";

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

function StudyNotes({ studyNotesData = [], refetch }) {
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudyNote, setEditingStudyNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStudyNote, setSelectedStudyNote] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [form] = Form.useForm();

  const handleEdit = (record) => {
    setEditingStudyNote(record);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      status: record.status,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      
      await API.put(`/study-note/update/${editingStudyNote.id}`, {
        name: values.name,
        price: values.price,
        status: values.status,
      });

      message.success("Study note updated successfully!");
      refetch();
      setIsEditModalOpen(false);
    } catch (error) {
      message.error("Failed to update study note.");
      console.error("Error updating study note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingStudyNote(null);
    form.resetFields();
  };

  const handleStatusChange = async () => {
    if (!selectedStudyNote || !selectedStatus) return;

    try {
      setIsUpdatingStatus(true);
      await API.put(`/study-note/status/${selectedStudyNote.id}`, {
        status: selectedStatus,
      });

      message.success(`Study note status updated to ${selectedStatus}`);
      refetch();
      setIsStatusModalVisible(false);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const showDeleteConfirm = (snID) => {
    confirm({
      title: "Are you sure you want to delete this Study Note?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, cancel",
      onOk() {
        return handleDelete(snID);
      },
    });
  };

  const handleDelete = async (snID) => {
    try {
      setIsDeleting(true);
      await API.delete(`/study-note/delete/${snID}`);
      notification.success({
        message: "Study Note deleted successfully",
      });
      refetch();
    } catch (error) {
      notification.error({
        message: "Failed to Delete Study Note",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Deactive":
        return "orange";
      case "Block":
        return "red";
      case "Pending":
        return "blue";
      default:
        return "gray";
    }
  };

  const statusOptions = ["Active", "Deactive"];

  const triggerModal = (user) => {
    setSelectedStudyNote(user);
    setSelectedStatus(user.status);
    setIsStatusModalVisible(true);
  };

  const filteredData = studyNotesData?.filter((item) =>
    item?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((item, index) => ({
    key: index,
    ...item,
  }));

  const columns = [
    {
      title: "SN",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center">
          <Tag color={getStatusColor(status)}>{status}</Tag>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => triggerModal(record)}
          />
        </div>
      ),
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record.id)}
          loading={isDeleting}
          disabled={isDeleting}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-center text-2xl font-bold ">Study Notes List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Study Notes..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddStudyNote refetch={refetch} />
      </div>
      {data.length === 0 ? (
        <Card>
          <div className="text-center text-gray-500 font-bold">
            No Study Notes available
          </div>
        </Card>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 100 }}
        />
      )}

      {/* Edit Study Note Modal */}
      <Modal
        title="Edit Study Note"
        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={handleModalClose}
        okText="Save Changes"
        cancelText="Cancel"
        confirmLoading={isSubmitting}
        width={700}
      >
        <Form form={form} layout="vertical" className="space-y-4">
          {/* Study Note Name */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter study note name' }]}
          >
            <Input placeholder="Enter study note name" size="large" />
          </Form.Item>

          {/* Price */}
          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: 'Please enter price' },
              { type: 'number', message: 'Please enter a valid number', 
                transform: value => Number(value) },
              { validator: (_, value) => 
                value >= 0 ? Promise.resolve() : Promise.reject('Price cannot be negative') 
              }
            ]}
          >
            <Input
              type="number"
              placeholder="Enter price"
              size="large"
              addonAfter="$"
            />
          </Form.Item>

          {/* Status */}
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status" size="large">
              <Option value="Active">Active</Option>
              <Option value="Deactive">Deactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        title="Change Study Note Status"
        open={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsStatusModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isUpdatingStatus}
            onClick={handleStatusChange}
          >
            Update Status
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-4">
          <p>
            Current Status:{" "}
            <Tag color={getStatusColor(selectedStudyNote?.status)}>
              {selectedStudyNote?.status}
            </Tag>
          </p>
          <Select
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            placeholder="Select new status"
          >
            {statusOptions.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
}

export default StudyNotes;