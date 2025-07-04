import React, { useState, useEffect } from "react";
import { Modal, Select } from "antd";

const StatusUpdateModal = ({
  visible,
  onClose,
  statusOptions = [],
  currentStatus,
  onUpdate,
  title = "Update Status",
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const handleOk = async () => {
    await onUpdate(selectedStatus);
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Update"
    >
      <p>Select new status:</p>
      <Select
        style={{ width: "100%" }}
        value={selectedStatus}
        onChange={(value) => setSelectedStatus(value)}
      >
        {statusOptions.map((status) => (
          <Select.Option key={status} value={status}>
            {status}
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

export default StatusUpdateModal;
