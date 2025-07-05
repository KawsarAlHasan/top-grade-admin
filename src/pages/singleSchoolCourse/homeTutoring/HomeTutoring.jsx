import React, { useState } from "react";
import { Table, Button, Modal, message, Avatar } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { API } from "../../../api/api";
import AddHomeTutoring from "./AddHomeTutoring";

const { confirm } = Modal;

function HomeTutoring({ homeTutoringData = [], refetch }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = (id) => {
    confirm({
      title: "Are you sure you want to delete this tutoring record?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, cancel",
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            setLoading(true);
            await API.delete(`/home-tutoring/delete/${id}`);
            message.success("Tutoring record deleted successfully");
            refetch();
            resolve();
          } catch (error) {
            console.log(error);
            message.error("Failed to delete tutoring record");
            reject(error);
          } finally {
            setLoading(false);
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "Teacher",
      dataIndex: "teacher_id",
      key: "teacher",

      render: (_, record) => (
        <div className="flex items-center">
          <Avatar
            src={record.profile_pic || "https://via.placeholder.com/150"}
            size="small"
          >
            {record.first_name?.charAt(0)}
          </Avatar>
          <div className="ml-2">
            <div>{`${record.first_name} ${record.last_name}`}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Rating",
      dataIndex: "average_rating",
      key: "rating",
      render: (_, record) => (
        <span>
          {record.rating || 0}/5 ({record.total_rating || 0} reviews)
        </span>
      ),
    },
    {
      title: "Price/Hour",
      dataIndex: "price_per_hour",
      key: "price",
      render: (price) => `$${price || 0}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status || "Inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          onClick={() => handleDelete(record.home_tutoring_id)}
          loading={loading}
        >
          Remove
        </Button>
      ),
    },
  ];

  // Filter out null or incomplete records
  const filteredData = homeTutoringData.filter(
    (item) => item.first_name && item.last_name
  );

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-6">Home Tutoring Records</h1>
        <AddHomeTutoring refetch={refetch} />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="home_tutoring_id"
        bordered
        pagination={{ pageSize: 50 }}
        scroll={{ x: true }}
      />
    </div>
  );
}

export default HomeTutoring;
