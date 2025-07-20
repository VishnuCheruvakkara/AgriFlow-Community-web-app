import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaUserPlus, FaExclamationTriangle } from 'react-icons/fa';
import DefaultUserImage from "../../assets/images/user-default.png"
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import { showToast } from '../toast-notification/CustomToast';
import { showConfirmationAlert } from '../SweetAlert/showConfirmationAlert';

function SentRequestsSection() {
    const [isOpen, setIsOpen] = useState(false);
    const [sentRequests, setSentRequests] = useState([]);

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchSendRequest = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get('connections/get-sent-requests/');
                setSentRequests(response.data);
            } catch (error) {
                // console.error('Error fetching sent requests:', error);
            }
        };
        fetchSendRequest();
    }, []);

    //cancell connection request logic
    const handleCancelRequest = async (requestId, receiverUsername) => {
        const result = await showConfirmationAlert({
            title: 'Cancel Connection Request?',
            text: `If you cancel this connection request, you won’t be able to send another one to farmer : "${receiverUsername}" for the next 3 days. Are you sure you want to proceed?`,
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No, Go Back',
            iconComponent: (
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-2 border-red-500">
                    <FaExclamationTriangle className="text-red-600 text-3xl" />
                </div>
            )
        });

        if (result) {
            try {
                await AuthenticatedAxiosInstance.patch(`connections/cancel-request/${requestId}/`);
                // Remove the cancelled request from state
                setSentRequests(prev => prev.filter(req => req.id !== requestId));
                showToast("request cancelled successfully.", "success")
            } catch (error) {
                // console.error('Error cancelling request:', error);
                showToast("Failed to cancel the request. Try again", "error")
            }
        }
    };


    return (
        <div className="mb-6 rounded-lg shadow-lg">
            {/* Header Section */}
            <div
                onClick={toggleSection}
                className={`ripple-parent ripple-white bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
            >
                <div className="flex items-center">
                    <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                        <FaUserPlus className="text-green-600 text-xl" />
                    </div>
                    <h2 className="text-md font-semibold text-white">Requests You Sent</h2>
                    <span className="ml-3 px-2 py-1 border border-green-600 bg-white text-green-600 font-semibold text-xs rounded-full">
                        {sentRequests.length || "0"}
                    </span>
                </div>
                <div className="transition-transform duration-300 ease-in-out">
                    {isOpen ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
                </div>
            </div>

            {/* Expandable Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>

                <div className="p-3 border-t-0 border rounded-b-lg border-gray-300 dark:border-zinc-700 max-h-96 overflow-y-auto scrollbar-hide bg-white dark:bg-zinc-900">
                    <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-hide">
                        {sentRequests.length === 0 ? (
                            <div className="text-center border-2 border-dashed border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-300 py-5 px-4 bg-gray-100 dark:bg-zinc-800 rounded-md">
                                <p className="text-md font-semibold">No pending sent requests.</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Your sent connection requests will appear here.</p>
                            </div>
                        ) : (
                            sentRequests.map((request) => {
                                const formattedDate = new Date(request.sent_at).toLocaleString('en-IN', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                });

                                return (
                                    <div
                                        key={request.id}
                                        className="flex items-center justify-between border border-gray-300 dark:border-zinc-700 p-3 bg-white dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                                    >
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-full overflow-hidden mr-4 shrink-0">
                                                <img
                                                    src={request.profile_picture || DefaultUserImage}
                                                    alt="User"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800 dark:text-gray-100">{request.receiver_username}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Sent on • {formattedDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="px-3 py-2 bg-green-500 text-white rounded-md text-sm transition">
                                                Pending...
                                            </span>
                                            <button
                                                onClick={() => handleCancelRequest(request.id, request.receiver_username)}
                                                className="px-3 py-2 bg-gray-300 dark:bg-zinc-600 text-gray-700 dark:text-gray-200 rounded-md text-sm hover:bg-gray-500 dark:hover:bg-zinc-500 hover:text-white transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SentRequestsSection;
