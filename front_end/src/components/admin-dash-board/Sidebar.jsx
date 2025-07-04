import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  FaTimes,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import { BsPostcardHeartFill } from "react-icons/bs";
import { IoArrowForwardCircle } from "react-icons/io5";
import { persistor } from '../../redux/Store';
import AgriFlowWhiteLogo from '../../assets/images/agriflowwhite.png';
import { useDispatch } from "react-redux";
import { showToast } from "../toast-notification/CustomToast";
import PublicAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance'
import { adminLogout } from "../../redux/slices/AdminAuthSlice";
import ThemeToggle from "../ThemeController/ThemeToggle";



const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarRef = useRef(null);
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await PublicAxiosInstance.post("users/admin/logout/"); // Ensure this is your logout endpoint
      if (response.status === 200) {
        showToast("Admin logged out successfully!", "success");

        // Remove all stored authentication data
        persistor.purge();
        dispatch(adminLogout());

        // Redirect to login page
        navigate("/admin-login");
      }
    } catch (error) {
      showToast("Logout failed. Try again.", "error");
    }
  };


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
      <div className="flex items-center justify-center   relative">


        <button
          onClick={toggleSidebar}
          className=" bg-green-600 rounded-full hover:bg-green-800 transition-colors duration-300 absolute -right-3 top-[52px] shadow-md z-10 flex items-center justify-center w-6 h-6"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <FaTimes className="text-white text-sm" />
          ) : (
            <FaRegArrowAltCircleRight className="text-white text-lg" />
          )}
        </button>
      </div>

      <div className="px-2 py-3 border-b border-green-600">
        <div
          className={`flex items-center ${isOpen ? 'px-3' : 'justify-center'} cursor-pointer`}
          onClick={toggleSidebar}
        >
          <img
            src={AgriFlowWhiteLogo}
            alt="Profile"
            className={`${isOpen ? 'h-10' : 'h-10 w-10'} rounded-full object-cover`}
          />

          {isOpen && (
            <div className="ml-3 transition-opacity duration-300">
              <p className="font-medium">Admin Portal</p>

            </div>
          )}
        </div>
      </div>

      {/* Navigation with overflow scrolling and hidden scrollbar */}
      <div className="mt-2 overflow-y-auto max-h-[calc(100vh-200px)] hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
        <div className="pb-20"> {/* Extra padding at bottom to ensure last items are visible */}

          <Link
            to="/admin/"
            className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} 
              px-4 py-3 mx-2 my-1 rounded-md transition-all duration-200 group 
              ${location.pathname === '/admin/'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-white hover:bg-green-500 hover:shadow-md'}
            `}>
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

          <Link to="/admin/users-management"
            className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} 
              px-4 py-3 mx-2 my-1 rounded-md transition-all duration-200 group 
              ${location.pathname.startsWith('/admin/users-management')
                ? 'bg-green-500 text-white shadow-md'
                : 'text-white hover:bg-green-500 hover:shadow-md'}
            `}>
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

          <Link to="/admin/products-management"
            className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} 
              px-4 py-3 mx-2 my-1 rounded-md transition-all duration-200 group 
              ${location.pathname === '/admin/products-management'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-white hover:bg-green-500 hover:shadow-md'}
            `}>
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaShoppingBag />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Products</div>
                <div className="text-xs text-green-200 group-hover:text-white">Mange selling products</div>
              </div>
            )}
          </Link>

          <Link
            to="/admin/community-management"
            className={`flex items-center ${isOpen ? "gap-3" : "justify-center"
              } 
    px-4 py-3 mx-2 my-1 rounded-md transition-all duration-200 group 
    ${location.pathname.startsWith("/admin/community-management")
                ? "bg-green-500 text-white shadow-md"
                : "text-white hover:bg-green-500 hover:shadow-md"
              }`}
          >
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaPeopleCarry />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Communities</div>
                <div className="text-xs text-green-200 group-hover:text-white">
                  Manage Communities
                </div>
              </div>
            )}
          </Link>


          <Link
            to="/admin/event-management"
            className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'
              } 
    px-4 py-3 mx-2 my-1 rounded-md transition-all duration-200 group 
    ${location.pathname.startsWith('/admin/event-management')
                ? 'bg-green-500 text-white shadow-md'
                : 'text-white hover:bg-green-500 hover:shadow-md'
              }
  `}
          >
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <FaCalendarAlt />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Events</div>
                <div className="text-xs text-green-200 group-hover:text-white">Manage Events</div>
              </div>
            )}
          </Link>

          <Link
            to="/admin/post-management"
            className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}
    px-4 py-3 mx-2 my-1 rounded-md transition-all duration-200 group 
    ${location.pathname.startsWith('/admin/post-management')
                ? 'bg-green-500 text-white shadow-md'
                : 'text-white hover:bg-green-500 hover:shadow-md'
              }
  `}
          >
            <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
              <BsPostcardHeartFill />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Posts</div>
                <div className="text-xs text-green-200 group-hover:text-white">Manage Posts</div>
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

          <div
            onClick={() => {
              const themeBtn = document.querySelector(
                '[aria-label="Switch to dark mode"], [aria-label="Switch to light mode"]'
              );
              if (themeBtn) themeBtn.click();
            }}
            className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-3 mx-2 my-1 text-white rounded-md hover:bg-green-500 hover:shadow-md transition-all duration-200 cursor-pointer group`}
          >
            <div className="flex items-center justify-center w-6 h-6 text-lg transition-transform ">
              <ThemeToggle />
            </div>

            {isOpen && (
              <div className="transition-opacity duration-300">
                <div className="font-medium group-hover:text-white">Theme</div>
                <div className="text-xs text-green-200 group-hover:text-white">Switch between modes</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout section clearly separated at bottom */}
      <div
        className="absolute bottom-0 w-full border-t border-green-600 bg-green-700 cursor-pointer"
        onClick={handleLogout} // Calls handleLogout on click
      >
        <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-4 py-4 mx-2 my-2 text-white rounded-md hover:bg-red-600 transition-all duration-200 group hover:shadow-md`}>
          <div className="flex items-center justify-center w-6 h-6 text-lg text-red-200 group-hover:scale-110 transition-transform">
            <FaSignOutAlt />
          </div>
          {isOpen && (
            <div className="transition-opacity duration-300">
              <div className="font-medium">Sign Out</div>
              <div className="text-xs text-red-200">Exit admin portal</div>
            </div>
          )}
        </div>
      </div>

      {/* Add global styles to hide scrollbar */}

    </div>
  );
};

export default Sidebar;