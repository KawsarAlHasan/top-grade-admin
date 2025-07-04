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

const { Search } = Input;
const { confirm } = Modal;

function Packages(packagesData, refetch) {
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [preValue, setPreValue] = useState(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredData = packagesData?.packagesData?.filter((item) =>
    item?.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  // course_details_id;
  // duration;
  // price;
  // title;

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
          loading={deleteLoading}
          onClick={() => showDeleteConfirm(record.id)}
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

      {/* <EditCourses
        preValue={preValue}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />

      <StatusUpdateModal
        visible={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={selectedCourse?.status}
        onUpdate={handleStatusUpdate}
        statusOptions={["Active", "Deactivated"]}
        title="Update Course Status"
      /> */}
    </div>
  );
}

export default Packages;
