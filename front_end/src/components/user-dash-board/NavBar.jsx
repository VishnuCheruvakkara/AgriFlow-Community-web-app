import React, { useState, useRef, useEffect } from 'react'
import { FaBell, FaEnvelope, FaSearch, FaCloudSun, FaRegUserCircle } from 'react-icons/fa';
import { IoMdLogOut } from "react-icons/io";
// for lgout section 
import { useNavigate, Link } from 'react-router-dom';
//importing base axios instance for axios set up through the AxiosInterceptors
import PublicAxiosInstance from '../../axios-center/PublicAxiosInstance'
//import from react-redux 
import { useDispatch, useSelector } from 'react-redux';
//import from redux-auth-slice 
import { logout } from '../../redux/slices/AuthSlice'
// persitor imported from the redux store to purge the data in the local storage
import { persistor } from '../../redux/Store';

import { showToast } from '../toast-notification/CustomToast';
import defaultUserImage from '../../assets/images/user-default.png'
import { FaSignOutAlt, FaCog } from 'react-icons/fa';
import agriFlowLogo from '../../assets/images/agriflowwhite.png'
import ThemeToggle from '../ThemeController/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';


import NoSearchFound from '../../assets/images/no_messages_1.png'
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance"
import { addMessageNotification, deleteMessageNotification } from '../../redux/slices/messageNotificationSlice';
import { addGeneralNotification, markAsRead, deleteNotificationFromRedux } from '../../redux/slices/GeneralNotificationSlice';
import { MdBookmarkAdded } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";

function NavBar() {
    //Get notification from redux 
    const messageNotifications = useSelector((state) => state.messageNotification.notifications);
    const generalNotifications = useSelector((state) => state.generalNotification.notifications);

    //side bar set up for notification and messages 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarType, setSidebarType] = useState(null); // notification and messages 

    const user = useSelector((state) => state.auth.user);
    const AadharVerified = user?.aadhar_verification;
    const userData = useSelector((state) => state.user.user)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // For the dropdown
    const profileContainerRef = useRef(null); // For the profile image + dropdown wrapper

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
    // close drop down out side click 
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                profileContainerRef.current &&
                !profileContainerRef.current.contains(event.target)
            ) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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

    console.log("RAW NOTIFICATIONS", messageNotifications);

    //Get messages form db for private messages
    useEffect(() => {
        getPrivateMessagesFromDb();
    }, []);

    const getPrivateMessagesFromDb = async () => {
        try {
            const response = await AuthenticatedAxiosInstance.get('/notifications/get-private-messages/');
            const data = response.data
            console.log("Saved messages :::", data)
            dispatch(addMessageNotification(data));

        } catch (error) {
            console.error("Failed to fetch private messages:", error);
        }
    }

    // Get general notifications from DB
    useEffect(() => {
        getGeneralNotificationsFromDb();
    }, []);

    const getGeneralNotificationsFromDb = async () => {
        try {
            const response = await AuthenticatedAxiosInstance.get('/notifications/get-general-notifications/');
            const data = response.data;
            console.log("General notifications fetched:", data);
            dispatch(addGeneralNotification(data));
        } catch (error) {
            console.error("Failed to fetch general notifications:", error);
        }
    };


    const goToChatPage = async (message) => {
        closeSidebar();


        if (!message.is_read) {
            try {
                await markNotificationAsRead(message.id);
                await getPrivateMessagesFromDb();
            } catch (error) {
                console.error("Error marking as read:", error);
            }
        }

        navigate("/user-dash-board/farmer-single-chat/", {
            state: {
                receiverId: message?.sender_id, // send the displayed user id to the next page 
                username: message.sender || "Unknown",
                profile_picture: message.image_url,
            }
        })
    }

    const goToCommunityChatPage = async (message) => {
        closeSidebar();

        if (!message.is_read) {
            try {
                await markNotificationAsRead(message.id);
                await getPrivateMessagesFromDb();
            } catch (error) {
                console.error("Error marking as read:", error);
            }
        }
        navigate(`/user-dash-board/farmer-community/my-communities/community-chat/${message.community_id}`);
    }

    //go to prodcut chat page from message side bar notification
    const goToProductChatPage = async (message) => {
        closeSidebar();

        if (!message.is_read) {
            try {
                await markNotificationAsRead(message.id);
                // await getPrivateMessagesFromDb();
            } catch (error) {
                console.error("Error marking as read:", error);
            }
        }

        navigate("/user-dash-board/products/farmer-product-chat/", {
            state: {
                receiverId: message?.sender_id,
                username: message?.sender,
                profilePicture: message?.image_url,
                productId: message?.product_id,
                productName: message?.product_name,
                productImage: message?.product_image,

                receiverId: message?.sender_id, // send the displayed user id to the next page 
                username: message.sender || "Unknown",
                profile_picture: message.image_url,
            }
        })
    };


    // set the notifcation as read when user click over the message 
    const markNotificationAsRead = async (notificationId) => {
        try {
            await AuthenticatedAxiosInstance.patch(`/notifications/mark-as-read-notifications/${notificationId}/`);
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    // Count teh unread community and private messages 
    const totalUnreadCount = messageNotifications.filter(
        (msg) => !msg.is_read
    ).length;

    // handle mark as read for the general notifcation 
    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            dispatch(markAsRead(notificationId));  // update redux store locally
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };
    //get the count of readed notifications from redux 
    const unreadCount = useSelector((state) =>
        state.generalNotification.notifications.filter((notif) => !notif.is_read).length
    );

    //Soft delete the notifications 
    const deleteNotificationByType = async (notificationId, type) => {
        try {
            await AuthenticatedAxiosInstance.patch(`/notifications/soft-delete-notifications/${notificationId}/`);

            if (type === 'private_message' || type === 'community_message' || type === 'product_message') {
                dispatch(deleteMessageNotification(notificationId));
            } else {
                dispatch(deleteNotificationFromRedux(notificationId));
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };




    return (
        <nav className="bg-green-700 text-white fixed top-0 w-full z-30 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    <div className="flex items-center space-x-2">
                        <img src={agriFlowLogo} alt="Logo" className="h-12" />
                        <span className="font-semibold text-xl text-white">AgriFlow</span>
                    </div>

                    {/* Search Bar */}
                    {/* {AadharVerified &&
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
                    } */}

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
                                    <div className="relative inline-block">
                                        {/*  Ping Animation Circle */}
                                        <span className="absolute -top-8 -right-1 flex h-5 w-5">
                                            {unreadCount > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>}
                                            {/*  Static Bubble with Count */}
                                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center z-10">
                                                {unreadCount || '0'}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                {/* Message icons part  */}
                                <div onClick={() => {
                                    openSidebar('message');
                                    getPrivateMessagesFromDb();
                                }}
                                    className="relative inline-block tooltip tooltip-bottom" data-tip="Messages">
                                    <button

                                        className="p-2 rounded-full hover:bg-green-600 transition-colors  ripple-parent ripple-white"
                                    >
                                        <FaEnvelope className="text-xl" />
                                    </button>

                                    {/* Message badge outside of ripple-parent */}
                                    <div className="relative inline-block">
                                        {/*  Ping Animation Circle */}
                                        <span className="absolute -top-8 -right-1 flex h-5 w-5">
                                            {totalUnreadCount > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>}
                                            {/*  Static Bubble with Count */}
                                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center z-10">
                                                {totalUnreadCount || '0'}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <div ref={profileContainerRef} className="relative">
                                    <div
                                        className="h-8 w-8 cursor-pointer rounded-full overflow-hidden lg:hidden ripple-parent ripple-white"
                                        onClick={toggleDropdown}
                                    >
                                        <img
                                            src={userData?.profile_picture || defaultUserImage}
                                            alt="User profile"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {isDropdownVisible && (
                                            <motion.div
                                                ref={dropdownRef}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute -right-16 mt-5 w-36 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-10 lg:hidden"
                                            >
                                                <ul className="py-2">
                                                    <Link
                                                        to={`/user-dash-board/user-profile-view/${userData?.id}`}
                                                        onClick={() => setIsDropdownVisible(false)}
                                                        className="px-4 py-2 text-gray-700 dark:text-gray-200 flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                                                    >
                                                        <FaRegUserCircle className="text-lg" />
                                                        <span> My Profile</span>
                                                    </Link>

                                                    <Link
                                                        to="/user-dash-board/weather-page"
                                                        onClick={() => setIsDropdownVisible(false)}
                                                        className="px-4 py-2 text-gray-700 dark:text-gray-200 flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                                                    >
                                                        <FaCloudSun className="text-lg" />
                                                        <span>Weather</span>
                                                    </Link>

                                                    <button
                                                        onClick={() => {
                                                            setIsDropdownVisible(false);
                                                            handleLogout();
                                                        }}
                                                        className="px-4 py-2 text-red-500 flex items-center space-x-2 hover:bg-red-50 dark:hover:bg-zinc-800 cursor-pointer w-full text-left"
                                                    >
                                                        <FaSignOutAlt className="text-lg" />
                                                        <span>Logout</span>
                                                    </button>
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

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
                            className=" mt-16 rounded-tl-lg  dark:border-zinc-500 dark:border-l dark:border-t fixed top-4 right-0 w-[360px] h-full bg-white dark:bg-zinc-800 shadow-lg"
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
                            {sidebarType === "message" ? (
                                <div className="bg-zinc-200 dark:bg-zinc-700 text-zinc-600 border-b border-t border-zinc-300 dark:text-white text-center text-xs py-1">
                                    {totalUnreadCount || "0"} Unread messages
                                </div>
                            ) : (
                                <div className="bg-zinc-200 dark:bg-zinc-700 text-zinc-600 border-b border-t border-zinc-300 dark:text-white text-center text-xs py-1">
                                    {unreadCount || "0"} Unread messages
                                </div>
                            )}



                            {/* Content */}
                            <div className="  overflow-y-auto max-h-[100vh]">
                                {sidebarType === "notifications" ? (
                                    <>
                                        {generalNotifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-[70vh] text-center text-zinc-500 dark:text-zinc-400">
                                                <img src={NoSearchFound} alt="No Notifications" className="w-36 h-36 mb-4 object-contain" />
                                                <p className="text-md font-medium">No notifications found</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">
                                                    {[...generalNotifications]
                                                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                                        .map((notif, index) => {
                                                            let linkPath = "#"; // Default fallback
                                                            // Set path based on notification type
                                                            if (notif.notification_type === "connection_request") {
                                                                linkPath = "/user-dash-board/connection-management/pending-requests";
                                                            } else if (notif.notification_type === "connection_accepted") {
                                                                linkPath = `/user-dash-board/user-profile-view/${notif.sender_id}`;
                                                            } else if (notif.notification_type === "community_join_request_received") {
                                                                linkPath = "/user-dash-board/farmer-community/pending-request";
                                                            } else if (notif.notification_type === "community_joined") {
                                                                linkPath = `/user-dash-board/user-profile-view/${notif.sender_id}`;
                                                            } else if (notif.notification_type === "community_request_approved_by_admin") {
                                                                linkPath = `/user-dash-board/farmer-community/my-communities/community-chat/${notif.community_id}`;
                                                            } else if (notif.notification_type === "community_invite") {
                                                                linkPath = `/user-dash-board/farmer-community/pending-request`;
                                                            } else if (notif.notification_type === "post_liked") {
                                                                linkPath = `/user-dash-board/user-profile-view/${notif.sender_id}`;
                                                            } else if (notif.notification_type === "event_start_notification") {
                                                                linkPath = `/user-dash-board/event-management/enrolled-events`;
                                                            } else if (notif.notification_type === "post_commented") {
                                                                linkPath = `/user-dash-board/posts/${notif.post_id}`;
                                                                }
                                                                
                                                                return (
                                                                    <div
                                                                        key={`notif-${index}`}
                                                                        className={`px-4 py-3 flex items-start justify-between border-b  border-zinc-300 dark:border-zinc-500 ${!notif.is_read ? "bg-green-200 dark:bg-green-900" : ""
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-start space-x-3">
                                                                            <span className="status animate-bounce mt-4 flex-shrink-0 h-2 w-2 rounded-full bg-green-500"></span>
                                                                            <Link to={linkPath} className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 ">
                                                                                <img
                                                                                    src={notif.image_url || defaultUserImage}
                                                                                    alt="Sender profile"
                                                                                    className="h-full w-full object-cover"
                                                                                />
                                                                            </Link>
                                                                            <div className="text-sm text-gray-700 dark:text-white w-[190px]">
                                                                                <Link
                                                                                    to={linkPath}
                                                                                    className={` block p-2 border-l-2 border-green-500 bg-white dark:bg-gray-900 text-xs break-words w-full max-w-[195px] ${notif.is_read ? "bg-zinc-100 dark:bg-zinc-900" : ""
                                                                                        }`}

                                                                                >
                                                                                    {notif.message || "(Click to see details)"}
                                                                                </Link>

                                                                                <p className="text-xs text-gray-600 dark:text-white mt-1">
                                                                                    {new Date(notif.timestamp).toLocaleDateString("en-IN", {
                                                                                        day: "2-digit",
                                                                                        month: "short",
                                                                                        year: "numeric",
                                                                                    })}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex flex-col items-end text-xs  text-zinc-700 dark:text-white whitespace-nowrap">
                                                                                <span>
                                                                                    {new Date(notif.timestamp).toLocaleTimeString("en-IN", {
                                                                                        hour: "2-digit",
                                                                                        minute: "2-digit",
                                                                                        hour12: true,
                                                                                    })}
                                                                                </span>
                                                                                {!notif.is_read &&
                                                                                    <span onClick={() => handleMarkAsRead(notif.id)} className="p-1 mt-2 cursor-pointer border border-gray-500  rounded-full tooltip tooltip-left hover:border-green-500 group" data-tip="Mark as read">
                                                                                        <MdBookmarkAdded className='text-lg group-hover:text-green-500' />
                                                                                    </span>
                                                                                }

                                                                                <span onClick={() => deleteNotificationByType(notif.id, notif.notification_type)} className="p-1 mt-2 cursor-pointer border border-gray-500 rounded-full tooltip tooltip-left hover:border-red-500 group" data-tip="Delete">
                                                                                    <AiFillDelete className='text-lg group-hover:text-red-500' />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                </div>
                                            </>
                                        )}

                                    </>

                                ) : (

                                    <>
                                        {messageNotifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-[70vh] text-center text-zinc-500 dark:text-zinc-400">
                                                <img src={NoSearchFound} alt="No Notifications" className="w-36 h-36 mb-4 object-contain" />
                                                <p className="text-md font-medium">No messages found</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">
                                                    {[...messageNotifications]
                                                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                                        .map((message, index) => {
                                                            const isPrivate = message.notification_type === "private_message";
                                                            const isCommunity = message.notification_type === "community_message";
                                                            const isProduct = message.notification_type === "product_message";

                                                            return (
                                                                <div
                                                                    key={`message-${index}`}
                                                                    className={`px-4 py-3 flex items-start justify-between border-b border-zinc-300 dark:border-zinc-500  ${!message.is_read ? "bg-green-200 dark:bg-green-900" : ""
                                                                        } ${message.product_is_deleted ? "opacity-60 cursor-not-allowed pointer-events-none" : ""} `}
                                                                >
                                                                    <div className="flex items-start space-x-3">
                                                                        <span
                                                                            className={`status animate-bounce mt-4 flex-shrink-0 h-2 w-2 rounded-full ${isPrivate ? "bg-green-500" : isProduct ? "bg-red-500" : "bg-yellow-500"
                                                                                }`}
                                                                        ></span>
                                                                        <div
                                                                            onClick={() =>
                                                                                isPrivate
                                                                                    ? goToChatPage(message)
                                                                                    : isProduct
                                                                                        ? goToProductChatPage(message)
                                                                                        : goToCommunityChatPage(message)
                                                                            }
                                                                            className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 cursor-pointer">
                                                                            <img
                                                                                src={message.image_url || defaultUserImage}
                                                                                alt={isPrivate ? "User profile" : "Community logo"}
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        </div>

                                                                        <div
                                                                            onClick={() =>
                                                                                isPrivate
                                                                                    ? goToChatPage(message)
                                                                                    : isProduct
                                                                                        ? goToProductChatPage(message)
                                                                                        : goToCommunityChatPage(message)
                                                                            }
                                                                            className="text-sm text-gray-700 dark:text-zinc-200 cursor-pointer"
                                                                        >
                                                                            {isPrivate ? (
                                                                                // Private message layout
                                                                                <p className="truncate w-40">
                                                                                    <b>{message.sender || "System"}</b>: {message.message || "(Click to see details)"}
                                                                                </p>
                                                                            ) : isProduct ? (
                                                                                // Product message layout
                                                                                <div className="w-40 truncate">
                                                                                    <p className="font-bold">{message.product_name || "Product Deal"}</p>

                                                                                    {message.product_is_deleted ? (
                                                                                        <p className="text-xs italic text-red-600 dark:text-red-400">Product removed by seller</p>
                                                                                    ) : (
                                                                                        <p className="text-xs truncate">
                                                                                            <b>{message.sender || "Seller"}</b>: {message.message || "(Click to see details)"}
                                                                                        </p>
                                                                                    )}


                                                                                </div>
                                                                            ) : (
                                                                                // Community message layout
                                                                                <div className="w-40 truncate">
                                                                                    <p className="font-bold">{message.community_name}</p>
                                                                                    <p className="text-xs truncate">
                                                                                        <b>{message.sender || "Unknown"}</b>: {message.message || "(Click to see details)"}
                                                                                    </p>
                                                                                </div>
                                                                            )}

                                                                            <p className="text-xs mb-1 text-gray-500 dark:text-zinc-400 mt-1">
                                                                                {new Date(message.timestamp).toLocaleDateString("en-IN", {
                                                                                    day: "2-digit",
                                                                                    month: "short",
                                                                                    year: "numeric",
                                                                                })}
                                                                            </p>

                                                                            {/* Badge based on type */}
                                                                            {isProduct ? (
                                                                                <span className="mt-5 px-2 py-0.5 bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-100 rounded-full text-[10px] font-semibold">
                                                                                    Product Deal
                                                                                </span>
                                                                            ) : !isPrivate ? (
                                                                                <span className="mt-5 px-2 py-0.5 bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 rounded-full text-[10px] font-semibold">
                                                                                    Community
                                                                                </span>
                                                                            ) : null}
                                                                        </div>



                                                                    </div>
                                                                    <div className="flex flex-col items-end text-xs text-zinc-600 dark:text-zinc-200 whitespace-nowrap pl-4">
                                                                        <span>
                                                                            {new Date(message.timestamp).toLocaleTimeString("en-IN", {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                                hour12: true,
                                                                            })}
                                                                        </span>
                                                                        <span onClick={() => deleteNotificationByType(message.id, message.notification_type)} className="p-1 mt-2 cursor-pointer border border-gray-500 rounded-full tooltip tooltip-left hover:border-red-500 group" data-tip="Delete">
                                                                            <AiFillDelete className='text-lg group-hover:text-red-500' />
                                                                        </span>


                                                                    </div>

                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </>
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
