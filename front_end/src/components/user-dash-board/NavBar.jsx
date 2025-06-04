import React, { useState, useRef, useEffect } from 'react'
import { FaBell, FaEnvelope, FaSearch } from 'react-icons/fa';
import { IoMdLogOut } from "react-icons/io";
// for lgout section 
import { useNavigate } from 'react-router-dom';
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
import defaultUserImage from '../../assets/images/user-default.png'
import { FaSignOutAlt, FaCog } from 'react-icons/fa';
import agriFlowLogo from '../../assets/images/agriflowwhite.png'
import ThemeToggle from '../ThemeController/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';

import NoSearchFound from '../../assets/images/no_messages_1.png'


function NavBar() {
    //Get notification from redux 
    const notifications = useSelector((state) => state.notification.notifications)

    //side bar set up for notification and messages 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarType, setSidebarType] = useState(null); // notification and messages 

    const user = useSelector((state) => state.auth.user);
    const AadharVerified = user?.aadhar_verification;
    const userData = useSelector((state) => state.user.user)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

    // side bar handlers 
    //open sidebar
    const openSidebar = (type) => {
        setSidebarType(type);
        setIsSidebarOpen(true);
    };

    //close sidebar 
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Close the dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

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
        <nav className="bg-green-700 text-white fixed top-0 w-full z-30 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    <div className="flex items-center space-x-2">
                        <img src={agriFlowLogo} alt="Logo" className="h-12" />
                        <span className="font-semibold text-xl text-white">AgriFlow</span>
                    </div>

                    {/* Search Bar */}
                    {AadharVerified &&
                        <div className="hidden md:block flex-1 max-w-xl mx-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for crops, communities, products..."
                                    className="w-full py-2 pl-10 pr-4 rounded-full bg-green-600 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                                <FaSearch className="absolute left-3 top-3 text-green-200 " />
                            </div>
                        </div>
                    }

                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-4">



                        {AadharVerified ? (
                            <>
                                {/* Show Other Icons if Profile is Completed */}
                                {/* notification icons part */}
                                <div onClick={() => openSidebar("notifications")} className="relative inline-block tooltip tooltip-bottom " data-tip="Notification">
                                    <button className="relative p-2 rounded-full hover:bg-green-600 transition-colors ripple-parent ripple-white" >
                                        <FaBell className="text-xl" />
                                    </button>
                                    <div class="relative inline-block">
                                        {/*  Ping Animation Circle */}
                                        <span class="absolute -top-8 -right-1 flex h-5 w-5">
                                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                            {/*  Static Bubble with Count */}
                                            <span class="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center z-10">
                                                3
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                {/* Message icons part  */}
                                <div onClick={() => openSidebar("message")} className="relative inline-block tooltip tooltip-bottom" data-tip="Messages">
                                    <button

                                        className="p-2 rounded-full hover:bg-green-600 transition-colors  ripple-parent ripple-white"
                                    >
                                        <FaEnvelope className="text-xl" />
                                    </button>

                                    {/* Message badge outside of ripple-parent */}
                                    <div class="relative inline-block">
                                        {/*  Ping Animation Circle */}
                                        <span class="absolute -top-8 -right-1 flex h-5 w-5">
                                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                            {/*  Static Bubble with Count */}
                                            <span class="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center z-10">
                                                5
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div
                                        className="h-8 w-8 cursor-pointer rounded-full overflow-hidden lg:hidden ripple-parent ripple-white"
                                        onClick={toggleDropdown} // Toggle on click
                                    >
                                        <img
                                            src={userData?.profile_picture || defaultUserImage}
                                            alt="User profile"
                                            className="h-full w-full object-cover "
                                        />
                                    </div>

                                    {/* Dropdown */}
                                    {isDropdownVisible && (
                                        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <ul className="py-2">
                                                <li className="px-4 py-2 text-gray-700 flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                                                    <FaCog className="text-lg" />
                                                    <span>Settings</span>
                                                </li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="px-4 py-2 text-red-500 flex items-center space-x-2 hover:bg-red-50 cursor-pointer w-full text-left"
                                                >
                                                    <FaSignOutAlt className="text-lg" />
                                                    <span>Logout</span>
                                                </button>

                                            </ul>
                                        </div>
                                    )}
                                </div>


                                {/* Theme toggle button here */}
                                <ThemeToggle />


                            </>
                        ) : (
                            <>
                                {/* Show Logout Button if Profile is NOT Completed */}
                                <div className="tooltip tooltip-left" data-tip="Logout">
                                    <button onClick={handleLogout} className="group  relative p-2 rounded-full hover:bg-white transition duration-500 ease-in-out">
                                        <IoMdLogOut className="text-2xl text-white group-hover:text-red-600 transition duration-500 ease-in-out" />
                                    </button>
                                </div>

                                <ThemeToggle />


                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* side bar for notification and messages  */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                        {/* Sidebar */}
                        <motion.div
                            className=" mt-16 rounded-tl-lg fixed top-4 right-0 w-[360px] h-full bg-white dark:bg-zinc-700 shadow-lg"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                        >
                            <div className="flex rounded-tl-lg justify-between items-center p-4 bg-gradient-to-r from-green-700 to-green-400 ">
                                <h2 className="text-lg font-bold ">
                                    {sidebarType === "notifications" ? "Notifications" : "Messages"}
                                </h2>
                                <button
                                    onClick={closeSidebar}
                                    className="text-white hover:bg-green-600 rounded-full p-1"
                                    aria-label="Close modal"
                                >
                                    <AiOutlineClose size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="  overflow-y-auto max-h-[100vh]">
                                {sidebarType === "notifications" ? (
                                    <>
                                        <div className="px-4 py-5 flex item-center space-x-3  bg-gray-100 dark:bg-zinc-900 border-b border-gray-300 dark:border-zinc-500">
                                            <span className="status animate-bounce bg-green-500  mt-4 flex-shrink-0"></span>
                                            <div
                                                className="h-10 w-10 cursor-pointer rounded-full overflow-hidden flex-shrink-0"
                                            >
                                                <img
                                                    src={defaultUserImage}
                                                    alt="User profile"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <span className="text-gray-500 text-sm flex-1 dark:text-zinc-200">
                                                You have a new update from your crop community!
                                            </span>
                                        </div>
                                        <div className="px-4 py-5 flex item-center space-x-3  bg-gray-100 dark:bg-zinc-900 border-b border-gray-300 dark:border-zinc-500">
                                            <span className="status animate-bounce bg-green-500  mt-4 flex-shrink-0"></span>
                                            <div
                                                className="h-10 w-10 cursor-pointer rounded-full overflow-hidden flex-shrink-0"
                                            >
                                                <img
                                                    src={defaultUserImage}
                                                    alt="User profile"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <span className="text-gray-500 text-sm flex-1 dark:text-zinc-200">
                                                You have a new update from your crop community!
                                            </span>
                                        </div>


                                    </>
                                ) : (
                                    <>
                                        {notifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-500 dark:text-zinc-400">
                                                <img
                                                    src={NoSearchFound}
                                                    alt="No Notifications"
                                                    className="w-36 h-36 mb-4 object-contain"
                                                />
                                                <p className="text-md font-medium">No messages found</p>
                                            </div>
                                        ) :
                                            (notifications.map((messages, index) => (
                                                <div key={index} className="px-4 py-5 flex item-center space-x-3  bg-gray-100 dark:bg-zinc-900 border-b border-gray-300 dark:border-zinc-500">
                                                    <span className="status animate-bounce bg-green-500  mt-4 flex-shrink-0"></span>
                                                    <div
                                                        className="h-10 w-10 cursor-pointer rounded-full overflow-hidden flex-shrink-0"
                                                    >
                                                        <img
                                                            src={defaultUserImage}
                                                            alt="User profile"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-gray-500 text-sm flex-1 dark:text-zinc-200">
                                                        You have a new update from your crop community!
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </nav>

    )
}

export default NavBar
