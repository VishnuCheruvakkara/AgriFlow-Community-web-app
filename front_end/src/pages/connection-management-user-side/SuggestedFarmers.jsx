import React, { useEffect, useState } from 'react';
import { AppleIcon, Search } from 'lucide-react';
import { FaMapMarkerAlt, FaSeedling, FaUserPlus } from 'react-icons/fa';
import DefaultUserImage from "../../assets/images/user-default.png"
import DefaultBannerImage from "../../assets/images/banner_default_user_profile.png"
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import { ImCancelCircle } from 'react-icons/im';
import Pagination from "../../components/Common-Pagination/UserSidePagination"
import SuggestedFarmersShimmer from '../../components/shimmer-ui-component/SuggestedFarmersShimmer';
import SearchNotFound from "../../assets/images/connection_no_search_found.png"
import { showToast } from '../../components/toast-notification/CustomToast';
import { MdOutlineCancel } from "react-icons/md";
import { Link } from 'react-router-dom';

const SuggestedFarmers = () => {

    const [farmers, setFarmers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    const fetchSuggestedFarmers = async () => {
        try {
            setLoading(true);
            const response = await AuthenticatedAxiosInstance.get('/connections/get-suggested-farmers/', {
                params: {
                    page: page,
                    search: search
                }
            });

            setFarmers(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 6)); // Match backend pagination page_size
        } catch (error) {
            console.error("Error fetching suggested farmers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestedFarmers();
    }, [page, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 when searching
    };

    const clearSearch = () => {
        setSearch('');
        setPage(1);
    };

    const handleConnect = async (receiverId, receiverUsername) => {
        try {
            const response = await AuthenticatedAxiosInstance.post('/connections/send-connection-request/', {
                receiver_id: receiverId,
            })

            showToast(`Connection request send to ${receiverUsername}.`, "success")
            fetchSuggestedFarmers(); // refresh suggestions
        } catch (error) {
            console.error("Error sending connection request:", error);
            // Try to extract specific error message from response
            if (error.response && error.response.data && error.response.data.error) {
                // Show the error message returned from the backend
                showToast(error.response.data.error, "error");
            } else {
                // Fallback generic error
                showToast("Something went wrong while sending the connection request.", "error");
            }
        }
    };

    // get the notificatiokn in the fornt-end side 
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get('/notifications/get-connection-accpeted/');
                setNotifications(response.data);
                console.log("Notification accpeted ::", response.data)
            } catch (error) {
                console.error('Error fetching notifications:', error);

            }
        };

        fetchNotifications();
    }, []);

    // clear notification 
    const handleClearNotification = async (notificationId) => {
        try {
            await AuthenticatedAxiosInstance.patch(`/notifications/mark-read/${notificationId}/`);
            setNotifications((prev) =>
                prev.filter((notif) => notif.id !== notificationId)
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };



    return (
        <div>

            {notifications.length > 0 && (
                <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-100 mb-3">
                    Request accepted by
                </h2>
            )}

            {notifications.map((notif) => (
                <div key={notif.id} className="overflow-hidden rounded-lg ">
                    <div className="flex items-center px-4 py-3 mb-2 border dark:hover:bg-zinc-900 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100  cursor-pointer rounded-lg gap-4 transition-colors duration-200">
                        <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-700 dark:text-green-300 mr-3 flex-shrink-0">
                            <img
                                src={notif.sender.profile_picture || DefaultUserImage}
                                alt="User Avatar"
                                className="h-12 w-12 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                {notif.sender.username}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 capitalize">
                                {notif.message}
                            </p>
                        </div>
                        <div
                            onClick={() => handleClearNotification(notif.id)}
                            className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-2 hover:bg-red-300 dark:hover:bg-red-800 border border-red-400 dark:border-red-700 cursor-pointer tooltip tooltip-left"
                            data-tip="Clear"
                        >
                            <MdOutlineCancel className="text-red-600 dark:text-red-400 text-xl hover:text-red-800 dark:hover:text-red-200" />
                        </div>
                    </div>
                </div>
            ))}



            <h2 className="text-lg font-medium text-gray-800 mb-3 dark:text-zinc-200">Suggested Farmers</h2>

            {/* Search Bar */}
            <div className="relative mb-5">
                <input
                    type="text"
                    placeholder="Search farmers, location, farming type..."
                    value={search}
                    onChange={handleSearchChange}
                    className=" w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
               transition duration-500 ease-in-out
               bg-white text-gray-800 placeholder-gray-400 
               dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:border-zinc-700"
                />
                <Search className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-400" size={20} />
                {search && (
                    <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500">
                        <ImCancelCircle size={20} />
                    </button>
                )}
            </div>

            {/* Farmer Cards Grid */}
            {loading ? (
                < SuggestedFarmersShimmer />
            ) : farmers.length === 0 ? (
                <div className=" col-span-3 text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md 
                    dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300">
                    <img
                        src={SearchNotFound}
                        alt="No Events"
                        className="mx-auto w-64 object-contain"
                    />
                    <p className="text-lg font-semibold dark:text-zinc-100">No Farmers Found!</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                        {search ? "Try using a different search keyword." : "There are currently no suggested farmers available."}
                    </p>
                </div>
            ) : (
                <div className=" grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Card */}
                    {farmers.map((farmer) => (
                        <div key={farmer.id} className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-700 hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
                            {/* Banner Image */}
                            <Link to={`/user-dash-board/user-profile-view/${farmer?.id}`} className="h-24 w-full bg-green-100 dark:bg-green-900 relative">
                                <img
                                    src={DefaultBannerImage}
                                    alt="Farm banner"
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                            <Link to={`/user-dash-board/user-profile-view/${farmer?.id}`} className="p-5 pt-12 relative flex-1">
                                {/* Profile Image - positioned to overlap banner */}
                                <div className="absolute -top-10 left-5 w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-4 border-white dark:border-zinc-900">
                                    <img
                                        src={farmer.profile_picture || DefaultUserImage}
                                        alt="John Smith"
                                        className="w-ful h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-md">{farmer.username || "No data"}</h4>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        <FaMapMarkerAlt className="mr-1" />
                                        <span>{farmer.address?.location_name || "No data found"}, {farmer.address?.country}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-green-600 dark:text-green-400 mt-1">
                                        <FaSeedling className="mr-1" />
                                        <span>{farmer.farming_type || "No data found for "} Farmer </span>
                                    </div>
                                </div>
                            </Link>
                            <div className=" p-4 pt-0">
                                <button onClick={() => handleConnect(farmer.id, farmer.username)} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors">
                                    <FaUserPlus />
                                    <span>Connect</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}



            {/* Pagination */}
            {totalPages > 1 && !loading && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    hasPrev={page > 1}
                    hasNext={page < totalPages}
                />
            )}
        </div >

    );
};

export default SuggestedFarmers;