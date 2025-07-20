import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { ImCancelCircle } from 'react-icons/im';
import { FaChevronRight } from 'react-icons/fa';
import DefaultUserImage from "../../assets/images/user-default.png";
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import Pagination from '../../components/Common-Pagination/UserSidePagination';
import debounce from 'lodash.debounce';
import SearchNotFound from "../../assets/images/connection_no_search_found.png";
import SelectCommunityCreateEventShimmer from '../../components/shimmer-ui-component/SelectCommunityCreateEventShimmer';
import { FaEye, FaUserSlash } from 'react-icons/fa';
import { showToast } from '../../components/toast-notification/CustomToast';
import { showConfirmationAlert } from '../../components/SweetAlert/showConfirmationAlert';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function MyConnections() {
    const [connections, setConnections] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchConnections = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const response = await AuthenticatedAxiosInstance.get(`/connections/get-my-connections/?page=${page}&search=${search}`);
            setConnections(response.data.results);
            setCurrentPage(page);
            setTotalPages(Math.ceil(response.data.count / 6));

        } catch (error) {
            // console.error("Failed to fetch connections:", error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useCallback(
        debounce((value) => {
            fetchConnections(1, value);
        }, 500),
        []
    );

    useEffect(() => {
        fetchConnections();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedFetch(value);
    };

    const handlePageChange = (page) => {
        fetchConnections(page, searchTerm);
    };

    const clearSearch = () => {
        setSearchTerm('');
        fetchConnections(1, '');
    };

    // block user section  
    const handleBlockUser = async (userId, userName) => {
        const result = await showConfirmationAlert({
            title: 'Block User?',
            text: `Are you sure you want to block the user "${userName}"? They will no longer be able to contact you or view your profile.`,
            confirmButtonText: 'Yes, Block',
            cancelButtonText: 'No, Cancel',
            iconComponent: (
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-2 border-red-600">
                    <FaExclamationTriangle className="text-red-600 text-3xl" />
                </div>
            )
        });

        if (result) {
            try {
                const response = await AuthenticatedAxiosInstance.post('/connections/block-user/', {
                    user_id: userId
                });
                showToast(`Blocked farmer : '${userName}'`, "success")
                fetchConnections(currentPage, searchTerm);
            } catch (error) {
                // console.error("Error blocking user:", error.response?.data);
                const errorMessage = error.response?.data?.user_id?.[0] || "Failed to block user.";
                showToast(errorMessage, "error");
            }
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-lg font-medium text-gray-800 mb-3 dark:text-zinc-200">My Connections</h2>

            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search connections..."
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                transition duration-500 ease-in-out
                bg-white text-gray-800 placeholder-gray-400 
                dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:border-zinc-700"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-400" size={20} />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
                    >
                        <ImCancelCircle size={20} />
                    </button>
                )}
            </div>

            {/* Connections List */}
            <div className="overflow-hidden rounded-lg">
                {loading ? (
                    <SelectCommunityCreateEventShimmer />
                ) : connections.length > 0 ? (
                    connections.map((connection) => (
                        <div
                            key={connection.id}
                            className="flex items-center p-4 mb-2 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer rounded-lg gap-4 bg-white dark:bg-zinc-900"
                        >
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 mr-3 flex-shrink-0">
                                <img
                                    src={connection.other_user?.profile_picture || DefaultUserImage}
                                    alt="User Avatar"
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 dark:text-zinc-100 truncate">
                                    {connection.other_user?.username || 'No name'}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 capitalize">
                                    {connection.other_user?.farming_type || 'Unknown'} farmer
                                </p>
                            </div>
                            <Link
                                to={`/user-dash-board/user-profile-view/${connection.other_user?.id}`}
                                className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-2 hover:bg-green-300 border border-green-400 cursor-pointer tooltip tooltip-left dark:bg-green-900 dark:border-green-700 dark:hover:bg-green-800"
                                data-tip="View"
                            >
                                <FaEye className="text-green-600 text-xl hover:text-green-800 dark:text-green-400 dark:hover:text-green-200" />
                            </Link>
                            <div
                                onClick={() => handleBlockUser(connection.other_user?.id, connection.other_user?.username)}
                                className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-2 hover:bg-red-300 border border-red-400 cursor-pointer tooltip tooltip-left dark:bg-red-900 dark:border-red-700 dark:hover:bg-red-800"
                                data-tip="Block User"
                            >
                                <FaUserSlash className="text-red-600 text-xl hover:text-red-800 dark:text-red-400 dark:hover:text-red-200" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md 
                dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300">
                        <img
                            src={SearchNotFound}
                            alt="No Connections"
                            className="mx-auto w-64 object-contain"
                        />
                        <p className="text-lg font-semibold dark:text-zinc-100">
                            {searchTerm ? "No Connections Found!" : "No Connections Yet!"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                            {searchTerm
                                ? "Try using a different search keyword."
                                : "You haven't connected with anyone yet."}
                        </p>
                    </div>
                )}
            </div>
            {/* Pagination */}
            {!loading && totalPages >= 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    hasPrev={currentPage > 1}
                    hasNext={currentPage < totalPages}
                />
            )}
        </div>
    );
}

export default MyConnections;
