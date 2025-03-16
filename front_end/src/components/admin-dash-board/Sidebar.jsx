import React, { useState } from "react";
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
  FaAngleRight,
  FaAngleLeft
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className={`${isOpen ? 'w-64' : 'w-16'} h-screen bg-green-700 text-white transition-all duration-300 relative shadow-lg`}
      onMouseEnter={() => !isOpen && setIsOpen(true)}
      onMouseLeave={() => isOpen && setIsOpen(false)}
    >
      <div className="flex items-center justify-between p-3 border-b border-green-600">
        {isOpen && (
          <h2 className="text-xl font-bold text-white">AgriFlow</h2>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 bg-green-600 rounded-full hover:bg-green-800 absolute -right-3 top-5"
        >
          {isOpen ? (
            <FaAngleLeft className="text-white" />
          ) : (
            <FaAngleRight className="text-white" />
          )}
        </button>
      </div>

      <nav className="mt-6">
        <Link to="/admin/dashboard" className="flex items-center gap-4 px-5 py-3 text-white hover:bg-green-800 transition-all">
          <div className="flex items-center justify-center w-6">
            <FaHome className="text-lg" />
          </div>
          {isOpen && <span>Dashboard</span>}
        </Link>
        
        <Link to="/admin/farmers" className="flex items-center gap-4 px-5 py-3 text-white hover:bg-green-800 transition-all">
          <div className="flex items-center justify-center w-6">
            <FaUsers className="text-lg" />
          </div>
          {isOpen && <span>Farmers</span>}
        </Link>
        
        <Link to="/admin/products" className="flex items-center gap-4 px-5 py-3 text-white hover:bg-green-800 transition-all">
          <div className="flex items-center justify-center w-6">
            <FaShoppingBag className="text-lg" />
          </div>
          {isOpen && <span>Products</span>}
        </Link>
        
        <Link to="/admin/community" className="flex items-center gap-4 px-5 py-3 text-white hover:bg-green-800 transition-all">
          <div className="flex items-center justify-center w-6">
            <FaPeopleCarry className="text-lg" />
          </div>
          {isOpen && <span>Community</span>}
        </Link>
        
        <Link to="/admin/events" className="flex items-center gap-4 px-5 py-3 text-white hover:bg-green-800 transition-all">
          <div className="flex items-center justify-center w-6">
            <FaCalendarAlt className="text-lg" />
          </div>
          {isOpen && <span>Events</span>}
        </Link>
        
        <Link to="/admin/knowledge" className="flex items-center gap-4 px-5 py-3 text-white hover:bg-green-800 transition-all">
          <div className="flex items-center justify-center w-6">
            <FaBook className="text-lg" />
          </div>
          {isOpen && <span>Knowledge Hub</span>}
        </Link>
        
        <Link to="/admin/notifications" className="flex items-center gap-4 px-5 py-3 text-white hover:bg-green-800 transition-all">
          <div className="flex items-center justify-center w-6">
            <FaBell className="text-lg" />
          </div>
          {isOpen && <span>Reviews & Notifications</span>}
        </Link>
      </nav>
      
      <div className="absolute bottom-0 w-full border-t border-green-600">
        <Link to="/logout" className="flex items-center gap-4 px-5 py-4 text-white hover:bg-green-800 transition-all">
          <div className="flex items-center justify-center w-6">
            <FaSignOutAlt className="text-lg" />
          </div>
          {isOpen && <span>Sign Out</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;