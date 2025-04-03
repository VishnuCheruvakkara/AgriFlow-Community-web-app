import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


const UserProtectedRoute = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const location = useLocation();
 

    // Call logout API only when authentication fails (no useEffect needed)
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If profile is NOT completed, always redirect to "/user-dash-board/farmer-profile"
    if (!user?.profile_completed) {
        return location.pathname === "/user-dash-board/farmer-profile"
            ? <Outlet /> // Allow access only to profile completion page
            : <Navigate to="/user-dash-board/farmer-profile" replace />;
    }

    // If profile IS completed, prevent access to "/user-dash-board/farmer-profile"
    if (user?.profile_completed && location.pathname === "/user-dash-board/farmer-profile") {
        return <Navigate to="/user-dash-board" replace />;
    }

    return <Outlet />; // Allow access to other pages
};

export default UserProtectedRoute;
