import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaChartLine, FaStore, FaScroll, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
//importing base axios instance for axios set up through the AxiosInterceptors
import PublicAxiosInstance from '../../axios-center/PublicAxiosInstance'
//import from react-redux 
import { useDispatch, useSelector } from 'react-redux';
//import from redux-auth-slice 
import { logout } from '../../redux/slices/AuthSlice'
// persitor imported from the redux store to purge the data in the local storage
import { persistor } from '../../redux/Store';
//
import { showToast } from '../toast-notification/CustomToast';
import { Link } from 'react-router-dom';
import defaultUserImage from '../../assets/images/user-default.png'

function SideBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user)

    // common handler for to navigate the user in to the user-profile view page 
    const handleViewProfile = () => {
        navigate(`/user-dash-board/user-profile-view/${user.id}`);
    };

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
        <div className=" mt-4 hidden lg:block md:w-1/2 lg:w-1/4 xl:w-1/5 2xl:w-1/4 lg:sticky lg:top-20 lg:self-start">
            <div className="bg-white rounded-lg shadow-sm mb-4 dark:bg-zinc-800 ">
                {/* User profile section */}
                <div onClick={handleViewProfile} className="flex items-center p-4 border-b ripple-parent ripple-green ">
                    {/* Profile Image Container */}
                    <div className="h-16 w-16 border rounded-full bg-gray-200 overflow-hidden flex-shrink-0 cursor-pointer">
                        <img
                            src={user?.profile_picture || defaultUserImage}
                            alt="User profile"
                            className="h-full w-full object-cover "
                        />
                    </div>

                    {/* User Information */}
                    <div className="ml-4 truncate max-w-[250px] cursor-pointer"> {/* Increased max-width for larger name space */}
                        <h3 className="font-semibold text-green-500 text-ellipsis overflow-hidden whitespace-nowrap">{user?.username || "Farmer"}</h3>
                        <p className="text-sm text-gray-400 truncate text-ellipsis overflow-hidden whitespace-nowrap">{user?.farming_type || "Rice Cultivator"}</p>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <ul className="">
                    <li className="">
                        <Link
                            to="/user-dash-board/"
                            className={`dark:text-zinc-400 ripple-parent ripple-green flex items-center space-x-3 p-3  font-medium ${location.pathname === '/user-dash-board/'
                                ? ' border-l-2 border-r-2 border-green-700 bg-green-100 text-green-700 dark:text-zinc-800 '
                                : 'hover:bg-gray-100 hover:dark:bg-zinc-950 text-gray-700 transition-colors'
                                }`}
                        >
                            <FaHome className="text-xl" />
                            <span>Home</span>
                        </Link>
                    </li>

                    <li className="">
                        <Link
                            to="/user-dash-board/farmer-community/"
                            className={`dark:text-zinc-400 ripple-parent ripple-green flex items-center space-x-3 p-3 font-medium ${location.pathname.startsWith('/user-dash-board/farmer-community')
                                ? ' border-l-2 border-r-2 border-green-700 bg-green-100 text-green-700 dark:text-zinc-800'
                                : 'hover:bg-gray-100 hover:dark:bg-zinc-950 text-gray-700 transition-colors'
                                }`}
                        >
                            <FaUsers className="text-xl" />
                            <span>Community</span>
                        </Link>
                    </li>

                    <li className="">
                        <Link
                            to="/user-dash-board/event-management"
                            className={`dark:text-zinc-400 ripple-parent ripple-green flex items-center space-x-3 p-3  font-medium ${location.pathname.startsWith('/user-dash-board/event-management')
                                ? ' border-l-2 border-r-2 border-green-700 bg-green-100 text-green-700 dark:text-zinc-800'
                                : 'hover:bg-gray-100 hover:dark:bg-zinc-950 text-gray-700 transition-colors'
                                }`}
                        >
                            <FaCalendarAlt className="text-xl" />
                            <span>Events</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/user-dash-board/connection-management"
                            className={`dark:text-zinc-400 ripple-parent ripple-green flex items-center space-x-3 p-3 font-medium ${location.pathname.startsWith('/user-dash-board/connection-management')
                                ? 'border-l-2 border-r-2 border-green-700 bg-green-100 text-green-700 dark:text-zinc-800'
                                : 'hover:bg-gray-100 hover:dark:bg-zinc-950 text-gray-700 transition-colors'
                                }`}
                        >
                            <FaUser className="text-xl" />
                            <span>Connections</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/user-dash-board/products/"
                            className={`dark:text-zinc-400 ripple-parent ripple-green flex items-center space-x-3 p-3 font-medium ${location.pathname.startsWith('/user-dash-board/products')
                                    ? 'border-l-2 border-r-2 border-green-700 bg-green-100 text-green-700 dark:text-zinc-800'
                                    : 'hover:bg-gray-100 hover:dark:bg-zinc-950 text-gray-700 transition-colors'
                                }`}
                        >
                            <FaStore className="text-xl" />
                            <span>Products</span>
                        </Link>
                    </li>




                    <li className="">
                        <a href="#" className="hover:dark:bg-zinc-950 dark:text-zinc-400 flex items-center space-x-3 p-3  hover:bg-gray-100 text-gray-700 transition-colors ">
                            <FaChartLine className="text-xl" />
                            <span>Activity</span>
                        </a>
                    </li>

                    <li className="">
                        <a href="#" className="hover:dark:bg-zinc-950 dark:text-zinc-400 flex items-center space-x-3 p-3  hover:bg-gray-100 text-gray-700 transition-colors">
                            <FaScroll className="text-xl" />
                            <span>Schemes</span>
                        </a>
                    </li>
                </ul>

                {/* Logout Button */}
                <div className="">
                    <li className="list-none  py-3 border-t">
                        <button
                            onClick={handleLogout}
                            className=" flex items-center space-x-3 p-3 hover:bg-red-100 text-red-600 transition duration-500 ease-in-out w-full"
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
