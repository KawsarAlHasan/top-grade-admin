import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminProfile } from "../api/api";
import { Spin } from "antd";
import Loading from "../components/Loading";

const PrivateRoute = ({ children }) => {
  const { admin, isLoading, isError, error } = useAdminProfile();

  const location = useLocation();
  const token = localStorage.getItem("token");

  if (isLoading) {
    return <Loading />
  }

  if (isError || error || !admin || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
