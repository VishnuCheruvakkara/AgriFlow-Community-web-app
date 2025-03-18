import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.adminAuth);

    return isAuthenticated ? <Outlet /> : <Navigate to="/admin-login" />;
};

export default AdminProtectedRoute;
