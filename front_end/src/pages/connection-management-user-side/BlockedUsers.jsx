import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { ImCancelCircle } from 'react-icons/im';
import { FaEye, FaUserPlus, FaExclamationTriangle } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import DefaultUserImage from "../../assets/images/user-default.png";
import SearchNotFound from "../../assets/images/connection_no_search_found.png";
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import Pagination from '../../components/Common-Pagination/UserSidePagination';
import SelectCommunityCreateEventShimmer from '../../components/shimmer-ui-component/SelectCommunityCreateEventShimmer';
import { CgUnblock } from "react-icons/cg";
import { showToast } from '../../components/toast-notification/CustomToast';
import { showConfirmationAlert } from '../../components/SweetAlert/showConfirmationAlert';

function BlockedUsers() {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 6;

    const totalPages = Math.ceil(totalCount / pageSize);

    const fetchBlockedUsers = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const response = await AuthenticatedAxiosInstance.get('/connections/get-blocked-users/', {
                params: {
                    page,
                    search,
                },
            });

            setBlockedUsers(response.data.results);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
            setTotalCount(response.data.count);
            setError('');
        } catch (err) {
            console.error('Error fetching blocked users:', err);
            setError('Failed to load blocked users.');
        } finally {
            setLoading(false);
        }
    };

    // Debounced function
    const debouncedUpdateSearchTerm = useMemo(() =>
        debounce((value) => {
            setDebouncedSearchTerm(value);
        }, 500), []);  // empty dependency array to create the function only once

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedUpdateSearchTerm(value);  // this triggers the debounced effect
        setCurrentPage(1);  // reset to first page when searching
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Fetch data whenever page or debouncedSearchTerm changes
    useEffect(() => {
        fetchBlockedUsers(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm]);

    // unblock user set up 
    const unblockUser = async (userId, userName) => {
        const result = await showConfirmationAlert({
            title: 'Unblock User?',
            text: `Are you sure you want to unblock the user "${userName}"? You will be able to see and reconnect with them after 3 days.`,
            confirmButtonText: 'Yes, Unblock',
            cancelButtonText: 'No, Cancel',
            iconComponent: (
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-2 border-red-600">
                    <FaExclamationTriangle className="text-red-600 text-3xl" />
                </div>
            )
        });

        if (result) {
            try {
                const response = await AuthenticatedAxiosInstance.post('/connections/unblock-user/', {
                    user_id: userId,
                });
                console.log(response.data.message);
                showToast("Unblocked the user successfully.", "success")
                // Optionally refetch the blocked user list
                fetchBlockedUsers(currentPage, debouncedSearchTerm);
            } catch (error) {
                console.error("Error unblocking user:", error.response?.data || error.message);
                showToast("Failed to unblock user, Try again.", "error")
            }
        }
    };


    return (
        <div className="mt-4">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Blocked Users</h2>

            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search blocked users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-500 ease-in-out"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                    <button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                        onClick={handleClearSearch}
                    >
                        <ImCancelCircle size={20} />
                    </button>
                )}
            </div>

            {/* Blocked Users List */}
            <div className="overflow-hidden rounded-lg">
                {loading ? (
                    <SelectCommunityCreateEventShimmer />
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : blockedUsers.length === 0 ? (
                    <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300">
                        <img src={SearchNotFound} alt="No Blocked Users" className="mx-auto w-64 object-contain" />
                        <p className="text-lg font-semibold dark:text-zinc-100">No Blocked Users Found!</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                            You haven't blocked anyone yet.
                        </p>
                    </div>
                ) : (
                    blockedUsers.map(({ id, blocked, blocked_at }) => (
                        <div
                            key={id}
                            className="flex items-center px-4 py-2 mb-2 border border-gray-300 hover:bg-gray-50 cursor-pointer rounded-lg gap-4"
                        >
                            <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                    src={blocked.profile_picture || DefaultUserImage}
                                    alt={blocked.username}
                                    className="h-12 w-12 object-cover"
                                    onError={(e) => (e.currentTarget.src = DefaultUserImage)}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">{blocked.username}</h3>
                                <p className="text-xs text-gray-500 capitalize">
                                    Farming Type: {blocked.farming_type || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Blocked at: {new Date(blocked_at).toLocaleString()}
                                </p>
                            </div>

                            {/* View Profile */}
                            <div
                                className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-2 hover:bg-gray-200 border border-gray-300 cursor-pointer tooltip tooltip-left dark:bg-zinc-800 dark:border-zinc-600 dark:hover:bg-zinc-700"
                                data-tip="View Profile"
                            >
                                <FaEye className="text-gray-600 text-xl hover:text-gray-800 dark:text-zinc-300 dark:hover:text-white" />
                            </div>

                            {/* Unblock User */}
                            <div
                                className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-2 hover:bg-red-300 border border-red-400 cursor-pointer tooltip tooltip-left dark:bg-red-900 dark:border-red-700 dark:hover:bg-red-800"
                                data-tip="Unblock User"
                                onClick={() => unblockUser(blocked.id, blocked.username)}
                            >
                                <CgUnblock className="text-red-600 text-xl hover:text-red-800 dark:text-red-400 dark:hover:text-red-200" />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {!loading && blockedUsers.length > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    hasPrev={!!prevPage}
                    hasNext={!!nextPage}
                />
            )}
        </div>
    );
}

export default BlockedUsers;
