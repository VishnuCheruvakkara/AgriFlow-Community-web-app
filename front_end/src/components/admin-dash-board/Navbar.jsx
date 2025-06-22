import React from "react";
import { FaBell, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import PublicAxiosInstance from '../../axios-center/PublicAxiosInstance';
import { showToast } from "../toast-notification/CustomToast";
import { useDispatch } from "react-redux";
import { persistor } from '../../redux/Store';
import { adminLogout } from "../../redux/slices/AdminAuthSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await PublicAxiosInstance.post("users/admin/logout/"); // Ensure this is your logout endpoint
      if (response.status === 200) {
        showToast("Admin logged out successfully!","success");

        // Remove all stored authentication data
        persistor.purge();
        dispatch(adminLogout());

        // Redirect to login page
        navigate("/admin-login");
      }
    } catch (error) {
      showToast("Logout failed. Try again.","error");
    }
  };



  return (
    <div className="navbar fixed top-0 z-40  bg-white border-b  dark:border-green-500 w-full px-4 justify-between dark:bg-zinc-800">
      <div className="flex-1">
        <h1 className="text-lg font-bold text-green-600 ml-[91px]">Welcome, Admin!</h1>
      </div>

      <div className="flex-none">
        <div className="flex items-center gap-4">

       
          {/* Messages Button with Tooltip */}
          <div className="tooltip tooltip-bottom " data-tip="Messages">
            <button className="btn btn-ghost btn-circle hover:bg-gray-200">
              <FaEnvelope className="h-5 w-5 text-green-600" />
            </button>
          </div>

          {/* Notifications Button with Tooltip */}
          <div className="tooltip tooltip-bottom" data-tip="Notifications">
            <button className="btn btn-ghost btn-circle hover:bg-gray-200">
              <FaBell className="h-5 w-5 text-green-600" />
            </button>
          </div>

          {/* Logout Button with Tooltip */}
          <div className="tooltip tooltip-bottom" data-tip="Logout">
            <button className="btn btn-ghost btn-circle hover:bg-gray-200"
             onClick={handleLogout}>
              <FaSignOutAlt className="h-5 w-5 text-green-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
