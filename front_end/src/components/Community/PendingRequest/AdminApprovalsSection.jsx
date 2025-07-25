import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaUserCheck } from 'react-icons/fa';
import DefaultCommunityIcon from "../../../assets/images/user-group-default.png";
import DefaultUserIcon from "../../../assets/images/user-default.png";
import AuthenticatedAxiosInstance from '../../../axios-center/AuthenticatedAxiosInstance';
import { showConfirmationAlert } from '../../SweetAlert/showConfirmationAlert';
import { showToast } from '../../toast-notification/CustomToast';
import { Link } from 'react-router-dom';

function AdminApprovalsSection({ expanded, toggleSection }) {

    const [joinRequest, setJoinRequest] = useState([]);


    const fetchRequest = async () => {
        try {
            const response = await AuthenticatedAxiosInstance.get('community/pending-admin-join-request/');
            setJoinRequest(response.data);
        } catch (error) {
            // console.error("Error fetching data:", error);
        }
    };

    const handleCancel = async (communityId, userId, username) => {
        const result = await showConfirmationAlert({
            title: 'Cancell request?',
            text: `Are you sure you want to Cancel this request to "${username}"?`,
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No, ignore',
        });
        if (result) {
            try {
                await AuthenticatedAxiosInstance.patch('community/cancel-request/', {
                    community_id: communityId,
                    user_id: userId
                });
                showToast("Cancelled the request successfully")
                fetchRequest(); // Refresh the list after cancel
            } catch (error) {
                // console.error("Error cancelling request:", error);
                showToast("Error happened, Try agian", "error")
            }
        }
    };


    useEffect(() => {
        fetchRequest();
    }, []);

    const visibleCommunities = joinRequest.filter(community => community.pending_users.length > 0);



    return (
        <div className="mb-6 rounded-lg shadow-lg">
            <div
                className={`ripple-parent ripple-white bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${expanded ? 'rounded-t-lg' : 'rounded-lg'}`}
                onClick={() => toggleSection('pendingApprovals')}
            >
                <div className="flex items-center">
                    <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                        <FaUserCheck className="text-green-600 text-xl" />
                    </div>
                    <h2 className="text-md font-semibold text-white">Your Pending Admin Request </h2>
                    <span className="ml-3 px-2 py-1 border border-green-600 bg-white  text-green-600  font-semibold text-xs rounded-full">
                        {visibleCommunities.length || "0"}
                    </span>

                </div>
                <div className="transition-transform duration-300 ease-in-out">
                    {expanded ?
                        <FaChevronUp className="text-white" /> :
                        <FaChevronDown className="text-white" />
                    }
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-3 border-t-0 border rounded-b-lg border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 max-h-96 overflow-y-auto scrollbar-hide ">
                    <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-hide">

                        {/* Community 1 */}

                        {visibleCommunities.length > 0 ? (
                            visibleCommunities
                                .filter(community => community.pending_users.length > 0)
                                .map((community, index) => (
                                    <div key={index} className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg">
                                        <div className="p-3 border-b rounded-t-lg border-gray-200 dark:border-zinc-600 bg-gray-200 dark:bg-zinc-700">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 ">
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 border border-gray-300 dark:border-zinc-600">
                                                        <img src={community.community_logo || DefaultCommunityIcon} alt={community.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-800 dark:text-zinc-200">Community : {community.name}</h3>
                                                        <p className="text-xs text-gray-500 dark:text-zinc-400">Waiting for {community.pending_users.length} farmers to join to your community</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="divide-y divide-gray-100 dark:divide-zinc-700">
                                            {community.pending_users.map((user, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                                                    <div className="flex items-center gap-4 ml-2">
                                                        <Link to={`/user-dash-board/user-profile-view/${user.user_id}`}>
                                                            <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-gray-200 dark:border-zinc-600">
                                                                <img src={user.profile_picture || DefaultUserIcon} alt={user.username} className="h-full w-full object-cover" />
                                                            </div>
                                                        </Link>

                                                        <div>
                                                            <p className="font-medium text-gray-800 dark:text-zinc-200">{user.username}</p>
                                                            <p className="text-xs text-gray-500 dark:text-zinc-400">
                                                                send on • {new Date(user.invited_at).toLocaleString('en-IN', {
                                                                    dateStyle: 'medium',
                                                                    timeStyle: 'short'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleCancel(community.id, user.user_id, user.username)}
                                                            className="px-3 py-2 bg-gray-300 dark:bg-zinc-500 text-gray-700 dark:text-zinc-300 rounded-md text-sm hover:bg-gray-500 hover:text-white dark:hover:bg-zinc-600 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="text-center border-2 border-dashed border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 py-5 px-4 bg-gray-100 dark:bg-zinc-800 rounded-md">
                                <p className="text-md font-semibold ">No pending requests at the moment.</p>
                                <p className="text-xs text-gray-500 dark:text-zinc-500">Check after sometime...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminApprovalsSection;