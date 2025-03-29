import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaChartLine, FaStore, FaScroll, FaSignOutAlt, } from 'react-icons/fa';
//importing base axios instance for axios set up through the AxiosInterceptors
import PublicAxiosInstance from '../../axios-center/PublicAxiosInstance'
//import from react-redux 
import { useDispatch,useSelector } from 'react-redux';
//import from redux-auth-slice 
import {logout } from '../../redux/slices/AuthSlice'
// persitor imported from the redux store to purge the data in the local storage
import { persistor } from '../../redux/Store';
//
import { showToast } from '../toast-notification/CustomToast';
import { Link } from 'react-router-dom';
import defaultUserImage from '../../assets/images/user-default.png'

function SideBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.user.user)

    const handleLogout = async () => {
        try {


            await PublicAxiosInstance.post("/users/logout/");
            //clear userdata and accesstoken details from the localstorage through the redux-persistor

            dispatch(logout());

            await persistor.purge(); //Clear the persisted state
            showToast(`logout successful`, "success")
            //Redirect to the login page
            navigate("/login")


        } catch (error) {
            console.log("logout failed:", error);
            showToast(`logout failed`, "error")
        }
    }
    
    return (
        <div className="hidden lg:block md:w-1/2 lg:w-1/4 xl:w-1/5 2xl:w-1/4 lg:sticky lg:top-20 lg:self-start">
        <div className="bg-white rounded-lg shadow-sm mb-4">
            {/* User profile section */}
            <div className="flex items-center p-4 border-b">
                {/* Profile Image Container */}
                <div className="h-16 w-16 border rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img
                        src={ user?.profile_picture|| defaultUserImage}
                        alt="User profile"
                        className="h-full w-full object-cover"
                    />
                </div>
    
                {/* User Information */}
                <div className="ml-4 truncate max-w-[250px]"> {/* Increased max-width for larger name space */}
                        <h3 className="font-semibold text-gray-800 text-ellipsis overflow-hidden whitespace-nowrap">{ user?.username || "Farmer"}</h3>
                    <p className="text-sm text-gray-500 truncate text-ellipsis overflow-hidden whitespace-nowrap">{ user?.farming_type|| "Rice Cultivator"}</p>
                </div>
            </div>
    
            {/* Sidebar Navigation */}
            <ul className="p-2">
                <li className="mb-1">
                    <Link to="/user-dash-board/" className="flex items-center space-x-3 p-3 rounded-lg bg-green-100 text-green-700 font-medium">
                        <FaHome className="text-xl" />
                        <span>Home</span>
                    </Link>
                </li>
    
                <li className="mb-1">
                    <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                        <FaUsers className="text-xl" />
                        <span>Community</span>
                    </a>
                </li>
                <li className="mb-1">
                    <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                        <FaChartLine className="text-xl" />
                        <span>Activity</span>
                    </a>
                </li>
                <li className="mb-1">
                    <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                        <FaStore className="text-xl" />
                        <span>Products</span>
                    </a>
                </li>
                <li className="mb-1">
                    <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                        <FaScroll className="text-xl" />
                        <span>Schemes</span>
                    </a>
                </li>
            </ul>
    
            {/* Logout Button */}
            <div className="p-2 pt-0">
                <li className="list-none mt-3 pt-3 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors w-full"
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span>Logout</span>
                    </button>
                </li>
            </div>
        </div>
    </div>
        )
}

export default SideBar
