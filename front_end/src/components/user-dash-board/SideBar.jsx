import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaChartLine, FaStore, FaScroll, FaSignOutAlt, } from 'react-icons/fa';
//importing base axios instance for axios set up through the AxiosInterceptors
import PublicAxiosInstance from '../../axios-center/PublicAxiosInstance'
//import from react-redux 
import { useDispatch } from 'react-redux';
//import from redux-auth-slice 
import { logout } from '../../redux/slices/AuthSlice'
// persitor imported from the redux store to purge the data in the local storage
import { persistor } from '../../redux/Store';
//
import { showToast } from '../toast-notification/CustomToast';



function SideBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            console.log("Attempting logout...");

            await PublicAxiosInstance.post("/users/logout/");
            //clear userdata and accesstoken details from the localstorage through the redux-persistor
            console.log("Hoooooo")
            dispatch(logout());
    
            await persistor.purge(); //Clear the persisted state
            showToast(`logout successful`,"success")
            //Redirect to the login page
            navigate("/login")
            console.log("The end")

        } catch (error) {
            console.log("logout failed:", error);
            showToast(`logout failed`,"error")
         
        }
    }

    return (
        <div className="hidden lg:block md:w-1/4 lg:sticky lg:top-20 lg:self-start">
            <div className="bg-white rounded-lg shadow-sm mb-4">
                {/* User profile section */}
                <div className="flex items-center space-x-3 p-4 border-b">
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                        <img src="/api/placeholder/48/48" alt="User profile" className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">John Farmer</h3>
                        <p className="text-sm text-gray-500">Rice Cultivator</p>
                    </div>
                </div>

                {/* Sidebar navigation */}
                <ul className="p-2">
                    <li className="mb-1">
                        <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-green-100 text-green-700 font-medium">
                            <FaHome className="text-xl" />
                            <span>Home</span>
                        </a>
                    </li>
                    <li className="mb-1">
                        <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                            <FaUser className="text-xl" />
                            <span>My Profile</span>
                        </a>
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
