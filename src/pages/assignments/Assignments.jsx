import React from "react";
import { useAllAssignments } from "../../api/api";
import {
  Table,
  Tag,
  Space,
  Avatar,
  Card,
  Spin,
  Button,
  Tooltip,
  Badge,
  Popover,
  Divider,
  Empty,
  List,
} from "antd";
import {
  FilePdfOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  UserOutlined,
  DollarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import AddAdminAssignment from "./AddAdminAssignment";

function Assignments() {
  const { allAssignments, isLoading, isError, error, refetch } =
    useAllAssignments();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <CloseCircleOutlined className="text-red-500 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              Error loading assignments
            </h3>
            <p className="mt-2 text-sm text-gray-500">{error.message}</p>
            <Button
              type="primary"
              onClick={refetch}
              className="mt-4"
              icon={<SyncOutlined />}
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!allAssignments?.data?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Empty
          description={
            <span className="text-gray-500">No assignments found</span>
          }
        />
      </div>
    );
  }

  const columns = [
    {
      title: "Assignment",
      dataIndex: "courses",
      key: "assignment",
      render: (courses, record) => (
        <div className="flex items-center">
          <Avatar
            src={courses?.image}
            icon={<FilePdfOutlined />}
            className="mr-3"
          />
          <div>
            <p className="font-medium text-gray-900 mb-1">{courses?.title}</p>
            <p className="text-sm text-gray-500">{record.courses_type}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
      render: (student) => (
        <div className="flex items-center">
          <Avatar
            src={student?.profile_pic}
            icon={<UserOutlined />}
            className="mr-3"
          />
          <span>
            {student?.first_name} {student?.last_name}
          </span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <span className="text-gray-600">{date}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let statusProps = {};
        switch (status) {
          case "Pending":
            statusProps = {
              icon: <ClockCircleOutlined />,
              color: "processing",
              text: "Pending",
            };
            break;
          case "Assigned":
            statusProps = {
              icon: <SyncOutlined spin />,
              color: "warning",
              text: "Assigned",
            };
            break;
          case "Delivered":
            statusProps = {
              icon: <CheckCircleOutlined />,
              color: "success",
              text: "Delivered",
            };
            break;
          case "Completed":
            statusProps = {
              icon: <CheckCircleOutlined />,
              color: "success",
              text: "Completed",
            };
            break;
          case "Cancelled":
            statusProps = {
              icon: <CloseCircleOutlined />,
              color: "error",
              text: "Cancelled",
            };
            break;
          default:
            statusProps = {
              icon: <ClockCircleOutlined />,
              color: "default",
              text: status,
            };
        }
        return (
          <Tag icon={statusProps.icon} color={statusProps.color}>
            {statusProps.text}
          </Tag>
        );
      },
    },
    {
      title: "Bids",
      dataIndex: "bid",
      key: "bids",
      render: (bid, record) => (
        <div className="flex items-center">
          {record.is_bid ? (
            <Popover
              content={
                <div className="min-w-48">
                  <div className="font-medium mb-2">Bid Details</div>
                  {bid.map((b, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {b.first_name || "Anonymous"} {b.last_name}
                        </span>
                        <span className="text-green-600">${b.bid_price}</span>
                      </div>
                      {index < bid.length - 1 && <Divider className="my-2" />}
                    </div>
                  ))}
                </div>
              }
              title="Bid Information"
              trigger="hover"
            >
              <Badge count={bid.length} className="mr-2">
                <Tag color="blue" icon={<DollarOutlined />}>
                  ${record.lowest_bid}
                </Tag>
              </Badge>
            </Popover>
          ) : (
            <Tag>No Bids</Tag>
          )}
        </div>
      ),
    },
  ];

  const renderBidWinner = (winner) => (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <TrophyOutlined className="text-yellow-500 text-xl mr-2" />
          <span className="font-medium">Winning Bidder</span>
        </div>
        <Tag color="gold">Winner</Tag>
      </div>
      <div className="flex items-center mt-2">
        <Avatar
          src={winner.profile_pic}
          icon={<UserOutlined />}
          className="mr-3"
        />
        <div>
          <p className="font-medium">
            {winner.first_name} {winner.last_name}
          </p>
          <p className="text-sm text-gray-600">
            Rating: {winner.average_rating}/5 ({winner.total_rating} reviews)
          </p>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-green-600 font-medium">
          ${winner.price_per_hour}/hr
        </span>
      </div>
    </div>
  );

  const renderRecentBids = (bids) => {
    const lastFiveBids = bids.slice(-5).reverse(); // Get last 5 bids and reverse to show latest first
    return (
      <div className="mt-4">
        <h4 className="font-medium mb-3">Recent Bids ({bids.length} total)</h4>
        <List
          itemLayout="horizontal"
          dataSource={lastFiveBids}
          renderItem={(bid) => (
            <List.Item className="!px-0">
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {bid.first_name || "Anonymous"} {bid.last_name}
                  </span>
                  <span className="text-green-600 font-medium">
                    ${bid.bid_price}
                  </span>
                </div>
                {bid.email && (
                  <div className="text-sm text-gray-500 mt-1">{bid.email}</div>
                )}
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        <div className="flex space-x-2">
          <AddAdminAssignment refetch={refetch} />
        </div>
      </div>

      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={allAssignments.data}
          rowKey="id"
          pagination={{
            pageSize: 50,
            showSizeChanger: false,
          }}
          scroll={{ x: true }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Description:</h4>
                <p className="text-gray-700 mb-4">
                  {record.description || "No description provided"}
                </p>

                {console.log("record", record.bid_time_remaining)}

                {record.bid_time_remaining == null ? (
                  <div>Remaining Time: N/A</div>
                ) : (
                  <div>
                    Remaining Time:{" "}
                    {record.bid_time_remaining.minutes +
                      ":" +
                      record.bid_time_remaining.seconds}
                  </div>
                )}

                {/* Show bid winner if exists */}
                {record.winning_bidder > 0 &&
                  record.bid_winner &&
                  renderBidWinner(record.bid_winner)}

                {/* Show recent bids if no winner but bids exist */}
                {!record.winning_bidder &&
                  record.is_bid &&
                  record.bid.length > 0 &&
                  renderRecentBids(record.bid)}
              </div>
            ),
            rowExpandable: (record) =>
              record.description || record.submit_file || record.is_bid,
          }}
        />
      </Card>
    </div>
  );
}

export default Assignments;
