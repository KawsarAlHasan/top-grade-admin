import { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState({
    visible: false,
    status: null,
    message: "",
    table: "",
    id: null,
    modelTitle: "",
    statusName: [],
    defaultStatus: "",
    refetch: null,
  });

  const showModal = (data) => {
    setModalData({
      visible: true,
      status: data.status,
      message: data.message,
      table: data.table,
      id: data.id,
      modelTitle: data.modelTitle,
      statusName: data.statusName || [],
      defaultStatus: data.defaultStatus,
      refetch: data.refetch,
    });
  };

  const hideModal = () => {
    setModalData((prev) => ({ ...prev, visible: false }));
  };

  const updateStatus = (newStatus) => {
    setModalData((prev) => ({ ...prev, status: newStatus }));
  };

  return (
    <ModalContext.Provider
      value={{ modalData, showModal, hideModal, updateStatus }}
    >
      {children}
    </ModalContext.Provider>
  );
};
