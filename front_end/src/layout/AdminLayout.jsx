import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin-dash-board/Sidebar";
import Navbar from "../components/admin-dash-board/Navbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  return (
    <div className="flex min-h-screen bg-base-200 bg-slate-100 dark:bg-zinc-950">
      {/* Main content - always starts at left edge when sidebar is closed */}
      <div className="flex-1 flex flex-col ">
        <Navbar />

        <div className="px-4 pt-[80px] ml-20">
          <Outlet /> {/* Page Content */}
        </div>
        
      </div>
      
      {/* Sidebar - positioned with fixed, overlaps content when open */}
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Optional overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => handleSidebarToggle(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;