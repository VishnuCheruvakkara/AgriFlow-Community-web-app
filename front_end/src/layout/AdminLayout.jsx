import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin-dash-board/Sidebar";
import Navbar from "../components/admin-dash-board/Navbar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-base-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <Outlet /> {/* Page Content */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
