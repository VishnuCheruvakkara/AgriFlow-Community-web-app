import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import { showConfirmationAlert } from '../../components/SweetAlert/showConfirmationAlert';
import { showToast } from '../../components/toast-notification/CustomToast';
import DefaultUserIcon from "../../assets/images/user-default.png";

function PendingRequests() {
    // State to track which sections are expanded
    const [expandedSections, setExpandedSections] = useState({
        sentRequests: false,
        receivedRequests: false
    });

    // State for sent and received requests
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);

    // Toggle section visibility
    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    useEffect(() => {
        // Fetch sent connection requests
        const fetchSentRequests = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get('/connections/sent-requests/');
                console.log("Sent connection requests: ", response.data);
                setSentRequests(response.data);
            } catch (error) {
                console.error("Error fetching sent connection requests:", error);
            }
        };

        // Fetch received connection requests
        const fetchReceivedRequests = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get('/connections/received-requests/');
                console.log("Received connection requests: ", response.data);
                setReceivedRequests(response.data);
            } catch (error) {
                console.error("Error fetching received connection requests:", error);
            }
        };

        fetchSentRequests();
        fetchReceivedRequests();
    }, []);

    const handleCancelRequest = async (requestId, userName) => {
        const result = await showConfirmationAlert({
            title: 'Cancel request?',
            text: `Are you sure you want to cancel your connection request to ${userName}?`,
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No, keep it',
        });
        
        if (result) {
            try {
                await AuthenticatedAxiosInstance.delete(`/connections/cancel-request/${requestId}/`);
                setSentRequests((prev) => prev.filter(req => req.request_id !== requestId));
                showToast(`Connection request to ${userName} cancelled successfully`, "success");
            } catch (error) {
                showToast("Error occurred, please try again", "error");
                console.error("Error cancelling request:", error);
            }
        }
    };

    const handleAcceptRequest = async (requestId, userName) => {
        try {
            await AuthenticatedAxiosInstance.patch(`/connections/accept-request/${requestId}/`);
            setReceivedRequests((prev) => prev.filter(req => req.request_id !== requestId));
            showToast(`You are now connected with ${userName}`, "success");
        } catch (error) {
            showToast("Error occurred, please try again", "error");
            console.error("Error accepting request:", error);
        }
    };

    const handleRejectRequest = async (requestId, userName) => {
        const result = await showConfirmationAlert({
            title: 'Reject connection?',
            text: `Are you sure you want to reject the connection request from ${userName}?`,
            confirmButtonText: 'Yes, Reject',
            cancelButtonText: 'No, keep it',
        });
        
        if (result) {
            try {
                await AuthenticatedAxiosInstance.delete(`/connections/reject-request/${requestId}/`);
                setReceivedRequests((prev) => prev.filter(req => req.request_id !== requestId));
                showToast(`Connection request from ${userName} rejected`, "success");
            } catch (error) {
                showToast("Error occurred, please try again", "error");
                console.error("Error rejecting request:", error);
            }
        }
    };

    return (
        <div className="mx-auto">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Pending Connections</h2>
            
            {/* Sent Connection Requests Section */}
            <div className="mb-6 rounded-lg shadow-lg">
                <div
                    className={`bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${expandedSections.sentRequests ? 'rounded-t-lg' : 'rounded-lg'}`}
                    onClick={() => toggleSection('sentRequests')}
                >
                    <div className="flex items-center">
                        <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                            <FaUserPlus className="text-blue-600 text-xl" />
                        </div>
                        <h2 className="text-md font-semibold text-white">Sent Connection Requests</h2>
                        <span className="ml-3 px-2 py-1 border border-blue-600 bg-white text-blue-600 font-semibold text-xs rounded-full">
                            {sentRequests.length || "0"}
                        </span>
                    </div>
                    <div className="transition-transform duration-300 ease-in-out">
                        {expandedSections.sentRequests ?
                            <FaChevronUp className="text-white" /> :
                            <FaChevronDown className="text-white" />
                        }
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.sentRequests ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 border-t-0 border rounded-b-lg border-gray-300">
                        <div className="space-y-3">
                            {sentRequests.length === 0 ? (
                                <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md">
                                    <p className="text-md font-semibold">No pending sent requests.</p>
                                    <p className="text-xs text-gray-500">Your sent connection requests will appear here.</p>
                                </div>
                            ) : (
                                sentRequests.map((req) => (
                                    <div
                                        key={req.request_id}
                                        className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                                                <img
                                                    src={req.recipient_photo || DefaultUserIcon}
                                                    alt={req.recipient_name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">{req.recipient_name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    Sent on {new Date(req.sent_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm transition">Pending</span>
                                            <button
                                                onClick={() => handleCancelRequest(req.request_id, req.recipient_name)}
                                                className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition"
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

            {/* Received Connection Requests Section */}
            <div className="mb-6 rounded-lg shadow-lg">
                <div
                    className={`bg-gradient-to-r from-purple-700 to-purple-400 flex justify-between items-center p-4 cursor-pointer ${expandedSections.receivedRequests ? 'rounded-t-lg' : 'rounded-lg'}`}
                    onClick={() => toggleSection('receivedRequests')}
                >
                    <div className="flex items-center">
                        <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                            <FaUserCheck className="text-purple-600 text-xl" />
                        </div>
                        <h2 className="text-md font-semibold text-white">Received Connection Requests</h2>
                        <span className="ml-3 px-2 py-1 border border-purple-600 bg-white text-purple-600 font-semibold text-xs rounded-full">
                            {receivedRequests.length || "0"}
                        </span>
                    </div>
                    <div className="transition-transform duration-300 ease-in-out">
                        {expandedSections.receivedRequests ?
                            <FaChevronUp className="text-white" /> :
                            <FaChevronDown className="text-white" />
                        }
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.receivedRequests ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 border-t-0 border rounded-b-lg border-gray-300">
                        <div className="space-y-3">
                            {receivedRequests.length === 0 ? (
                                <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md">
                                    <p className="text-md font-semibold">No pending received requests.</p>
                                    <p className="text-xs text-gray-500">Requests from other users will appear here.</p>
                                </div>
                            ) : (
                                receivedRequests.map((req) => (
                                    <div
                                        key={req.request_id}
                                        className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                                                <img
                                                    src={req.sender_photo || DefaultUserIcon}
                                                    alt={req.sender_name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">{req.sender_name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    Received on {new Date(req.sent_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleAcceptRequest(req.request_id, req.sender_name)}
                                                className="px-3 py-1.5 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 transition"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(req.request_id, req.sender_name)}
                                                className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PendingRequests;