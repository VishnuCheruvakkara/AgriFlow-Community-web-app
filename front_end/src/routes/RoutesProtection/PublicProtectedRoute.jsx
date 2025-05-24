import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicProtectedRoute = () => {
    const { isAuthenticated: userAuth } = useSelector((state) => state.auth);
    const { isAuthenticated: adminAuth } = useSelector((state) => state.adminAuth);

    // If user is authenticated, redirect them to the user dashboard
    if (userAuth) return <Navigate to="/user-dash-board" />;

    // If admin is authenticated, redirect them to the admin dashboard
    if (adminAuth) return <Navigate to="/admin" />;

    // Otherwise, allow access to login, signup, etc.
    return <Outlet />;
};

export default PublicProtectedRoute;
