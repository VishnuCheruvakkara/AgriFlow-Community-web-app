import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaShoppingBag,
  FaPeopleCarry,
  FaCalendarAlt,
  FaBook,
  FaBell,
  FaSignOutAlt,
  FaChartLine,
  FaBars,
  FaTimes
} from "react-icons/fa";
import AgriFlowWhiteLogo from '../../assets/images/agriflowwhite.png';

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarRef = useRef(null);

  // Function to handle toggling via icon click
  const toggleSidebar = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (onToggle) onToggle(newIsOpen); // Pass state up to parent component
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
        if (onToggle) onToggle(false);
      }
    };

    // Add event listener to entire document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div
      ref={sidebarRef}
      className={`${isOpen ? 'w-64' : 'w-20'} h-screen bg-green-700 text-white transition-all duration-300 ease-in-out fixed left-0 top-0 shadow-lg z-40`}
    >
      {/* Logo Header - Centered */}
      <div className="flex items-center justify-center p-3 border-b border-green-600 relative">
        {isOpen && (
          <h2 className="text-xl font-bold text-white opacity-100 transition-opacity duration-300 text-center">AgriFlow</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 bg-green-600 rounded-full hover:bg-green-800 transition-colors duration-300 absolute -right-3 top-5 shadow-md z-10 flex items-center justify-center w-6 h-6"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <FaTimes className="text-white text-sm" />
          ) : (
            <FaBars className="text-white text-sm" />
          )}
        </button>
      </div>

      <div className="px-2 py-4 border-b border-green-600">
        <div 
          className={`flex items-center ${isOpen ? 'px-3' : 'justify-center'} cursor-pointer`}
          onClick={toggleSidebar}
        >
          <img
            src={AgriFlowWhiteLogo}
            alt="Profile"
            className={`${isOpen ? 'h-16' : 'h-10 w-10'} rounded-full object-cover`}
          />

          {isOpen && (
            <div className="ml-3 transition-opacity duration-300">
              <p className="font-medium">Admin Portal</p>
              <p className="text-xs text-green-200">Manage your agriculture platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation with overflow scrolling and hidden scrollbar */}
      <div className="mt-2 overflow-y-auto max-h-[calc(100vh-200px)] hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
        <div className="pb-20"> {/* Extra padding at bottom to ensure last items are visible */}
          <Link to="/admin/" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-3 mx-2 my-1 text-white rounded-md hover:bg-green-500 hover:shadow-md transition-all duration-200 group`}>
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaHome />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Dashboard</div>
                <div className="text-xs text-green-200 group-hover:text-white">Overview & statistics</div>
              </div>
            )}
          </Link>

          <Link to="/admin/users-management" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-3 mx-2 my-1 text-white rounded-md hover:bg-green-500 hover:shadow-md transition-all duration-200 group`}>
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaUsers />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Farmers</div>
                <div className="text-xs text-green-200 group-hover:text-white">Manage farmer profiles</div>
              </div>
            )}
          </Link>

          <Link to="/admin/products-management" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-3 mx-2 my-1 text-white rounded-md hover:bg-green-500 hover:shadow-md transition-all duration-200 group`}>
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaShoppingBag />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Products</div>
                <div className="text-xs text-green-200 group-hover:text-white">Inventory & listings</div>
              </div>
            )}
          </Link>

          <Link to="/admin/community" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-3 mx-2 my-1 text-white rounded-md hover:bg-green-500 hover:shadow-md transition-all duration-200 group`}>
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaPeopleCarry />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Community</div>
                <div className="text-xs text-green-200 group-hover:text-white">Forums & discussions</div>
              </div>
            )}
          </Link>

          <Link to="/admin/events" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-3 mx-2 my-1 text-white rounded-md hover:bg-green-500 hover:shadow-md transition-all duration-200 group`}>
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaCalendarAlt />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Events</div>
                <div className="text-xs text-green-200 group-hover:text-white">Workshops & training</div>
              </div>
            )}
          </Link>

          <Link to="/admin/knowledge" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-3 mx-2 my-1 text-white rounded-md hover:bg-green-500 hover:shadow-md transition-all duration-200 group`}>
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaBook />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Knowledge Hub</div>
                <div className="text-xs text-green-200 group-hover:text-white">Resources & guides</div>
              </div>
            )}
          </Link>

          <Link to="/admin/analytics" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-3 mx-2 my-1 text-white rounded-md hover:bg-green-500 hover:shadow-md transition-all duration-200 group`}>
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaChartLine />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Analytics</div>
                <div className="text-xs text-green-200 group-hover:text-white">Reports & insights</div>
              </div>
            )}
          </Link>

          <Link to="/admin/notifications" className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-3 mx-2 my-1 text-white rounded-md hover:bg-green-500 hover:shadow-md transition-all duration-200 group`}>
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaBell />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Notifications</div>
                <div className="text-xs text-green-200 group-hover:text-white">Alerts & messages</div>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Logout section clearly separated at bottom */}
      <div className="absolute bottom-0 w-full border-t border-green-600 bg-green-700">
        <Link
          to="/logout"
          className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-4 mx-2 my-2 text-white rounded-md hover:bg-red-600 transition-all duration-200 group hover:shadow-md`}
        >
          <div className="flex items-center justify-center w-6 h-6 text-lg text-red-200 group-hover:scale-110 transition-transform">
            <FaSignOutAlt />
          </div>
          {isOpen && (
            <div className="transition-opacity duration-300">
              <div className="font-medium">Sign Out</div>
              <div className="text-xs text-red-200">Exit admin portal</div>
            </div>
          )}
        </Link>
      </div>

      {/* Add global styles to hide scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;