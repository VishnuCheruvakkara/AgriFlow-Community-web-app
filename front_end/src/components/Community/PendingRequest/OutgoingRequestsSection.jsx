
import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaUserClock } from 'react-icons/fa';
import DefaultCommunityIcon from "../../../assets/images/user-group-default.png";
import AuthenticatedAxiosInstance from '../../../axios-center/AuthenticatedAxiosInstance';
import { showConfirmationAlert } from '../../SweetAlert/showConfirmationAlert';
import { showToast } from '../../toast-notification/CustomToast';

function OutgoingRequestsSection({ expanded, toggleSection }) {


    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Fetch outgoing requests
        const fetchRequests = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get('community/requested-join-community/');
                console.log("requested to join community ::: ", response.data)
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching outgoing requests:", error);
            }
        };

        fetchRequests();
    }, []);

    const handleCancelRequest = async (communityId, communityName) => {
        const result = await showConfirmationAlert({
            title: 'Cancell request?',
            text: `Are you sure you want to cancel your request to join "${communityName}"?`,
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No, ignore',
        });
        if (result) {
            try {
                // Send a PATCH request to update the status to "cancelled"
                await AuthenticatedAxiosInstance.patch(`/community/cancel-join-request/${communityId}/`);
                setRequests((prev) => prev.filter(req => req.community_id !== communityId));  // Remove the cancelled request from the list
                showToast(`Request to join the community "${communityName}" cancelled successfully`, "success")
            } catch (error) {
                showToast("Error happen try again", "error")
                console.error("Error cancelling request:", error);
            }
        }
    };



    return (
        <div className="mb-6 rounded-lg shadow-lg">
            <div
                className={`ripple-parent ripple-white bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${expanded ? 'rounded-t-lg' : 'rounded-lg'}`}
                onClick={() => toggleSection('outgoingRequests')}
            >
                <div className="flex items-center">
                    <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                        <FaUserClock className="text-green-600 text-xl" />
                    </div>

                    <h2 className="text-md font-semibold text-white">Your Requests to Join Communities</h2>
                    <span className="ml-3 px-2 py-1 border border-green-600 bg-white text-green-600 font-semibold text-xs rounded-full">
                        {requests.length || "0"}
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
                <div className="p-3 border-t-0 border rounded-b-lg border-gray-300 dark:border-zinc-700 dark:bg-zinc-900">

                    <div className="space-y-3">
                        {requests.length === 0 ? (
                            <div className="text-center border-2 border-dashed border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 py-5 px-4 bg-gray-100 dark:bg-zinc-800 rounded-md">
                                <p className="text-md font-semibold ">No pending requests at the moment.</p>
                                <p className="text-xs text-gray-500 dark:text-zinc-500">Check after sometime...</p>
                            </div>
                        ) : (
                            requests.map((req, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border border-gray-300 dark:border-zinc-700 p-3 bg-white dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                                >
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 border border-gray-300 dark:border-zinc-600">
                                            <img
                                                src={req.community_logo || DefaultCommunityIcon}
                                                alt={req.community_name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800 dark:text-zinc-200">{req.community_name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-zinc-400">
                                                Request sent on {new Date(req.sent_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm transition">Pending...</span>
                                        <button
                                            onClick={() => handleCancelRequest(req.community_id, req.community_name)}
                                            className="px-3 py-1.5 bg-gray-300 dark:bg-zinc-500 text-gray-700 dark:text-zinc-300 rounded-md text-sm hover:bg-gray-500 hover:text-white dark:hover:bg-zinc-600 transition"
                                        >
                                            Cancel
                                        </button>

                                    </div>
                                </div>
                            ))
                        )}
                    </div>



                </div>
            </div>
        </div>
    );
}

export default OutgoingRequestsSection;