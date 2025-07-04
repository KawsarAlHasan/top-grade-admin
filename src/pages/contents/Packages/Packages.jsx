import React, { useState } from "react";
import {
  Skeleton,
  Alert,
  Table,
  Button,
  Image,
  Input,
  Modal,
  notification,
  Card,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";
import AddPackage from "./AddPackage";
import { API } from "../../../api/api";
import EditPackage from "./EditPackage";

const { Search } = Input;
const { confirm } = Modal;

function Packages({ packagesData = [], refetch }) {
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const handleEdit = (record) => {
    setEditingPackage(record);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingPackage(null);
  };

  const showDeleteConfirm = (pID) => {
    confirm({
      title: "Are you sure you want to delete this Package?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, cancel",
      onOk() {
        return handleDelete(pID);
      },
    });
  };

  const handleDelete = async (pID) => {
    try {
      setIsDeleting(true);
      await API.delete(`/content/package/delete/${pID}`);
      notification.success({
        message: "Package deleted successfully",
      });
      refetch();
    } catch (error) {
      notification.error({
        message: "Failed to Delete Package",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredData = packagesData?.filter((item) =>
    item?.title?.toLowerCase().includes(searchText.toLowerCase())
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
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <Link to={`/courses/${record.id}`}>
          <Button size="small" icon={<EyeOutlined />}>
            View
          </Button>
        </Link>
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
      <h2 className="text-center text-2xl font-bold ">Packages List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Packages..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddPackage refetch={refetch} />
      </div>
      {data.length === 0 ? (
        <Card>
          <div className="text-center text-gray-500 font-bold">
            No Course available
          </div>
        </Card>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 100 }}
        />
      )}

      <EditPackage
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        packageData={editingPackage}
        refetch={refetch}
      />
    </div>
  );
}

export default Packages;
