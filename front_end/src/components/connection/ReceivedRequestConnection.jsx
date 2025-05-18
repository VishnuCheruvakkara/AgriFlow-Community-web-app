import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaUserCheck,FaExclamationTriangle } from 'react-icons/fa';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import DefaultUserImage from "../../assets/images/user-default.png"
import { showToast } from '../toast-notification/CustomToast';
import { showConfirmationAlert } from '../SweetAlert/showConfirmationAlert';

function ReceivedRequestsSection() {
    const [isOpen, setIsOpen] = useState(false);
    const [requests, setRequests] = useState([]);

    const fetchReceivedRequests = async () => {
        try {
            const response = await AuthenticatedAxiosInstance.get('/connections/received-connection-request/');
            setRequests(response.data);
            console.log("received connection request::", response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(() => {
        fetchReceivedRequests();
    }, []);

    // accept connection request
    const acceptRequest = async (requestId) => {
        try {
            const response = await AuthenticatedAxiosInstance.patch(`/connections/accept-connection-request/${requestId}/`);
            console.log("Connection request accepted:", response.data);
            showToast("Connection request accepted", "success")
            // update UI
            setRequests(prev => prev.filter(req => req.id !== requestId));
        } catch (error) {
            console.error("Error accepting connection request:", error);
            showToast("Error accepting connection request. Try again", "error")
        }
    };

    // Reject the user connection request 
    const rejectRequest = async (requestId,requestedUsername) => {
        const result = await showConfirmationAlert({
            title: 'Reject Connection Request?',
            text: `Are you sure you want to reject the connection request from "${requestedUsername}"? This action cannot be undone.`,
            confirmButtonText: 'Yes, Reject',
            cancelButtonText: 'No, Keep Request',
            iconComponent: (
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-2 border-red-500">
                    <FaExclamationTriangle className="text-red-600 text-3xl" />
                </div>
            )
        });
        if (result) {
            try {
                const response = await AuthenticatedAxiosInstance.patch(`/connections/reject-connection-request/${requestId}/`);
                console.log("Connection request rejected:", response.data);
                showToast("Connection request rejected", "success");
                // Update UI by removing rejected request
                setRequests(prev => prev.filter(req => req.id !== requestId));
            } catch (error) {
                console.error("Error rejecting connection request:", error);
                showToast("Error rejecting connection request. Try again", "error");
            }
        }
    };



    return (
        <div className="mb-6 rounded-lg shadow-lg">
            {/* Header */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`ripple-parent ripple-white bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
            >
                <div className="flex items-center">
                    <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                        <FaUserCheck className="text-green-600 text-xl" />
                    </div>
                    <h2 className="text-md font-semibold text-white">Received Connection Requests</h2>
                    <span className="ml-3 px-2 py-1 border border-green-600 bg-white text-green-600 font-semibold text-xs rounded-full">
                        {requests.length}
                    </span>
                </div>
                <div className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}>
                    <FaChevronDown className="text-white" />
                </div>
            </div>

            {/* Expandable Content */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-3 border-t-0 border rounded-b-lg border-gray-300 bg-white">
                    <div className="space-y-3">
                        {requests.length === 0 ? (
                            <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md">
                                <p className="text-md font-semibold">No pending received requests.</p>
                                <p className="text-xs text-gray-500">Requests from other users will appear here.</p>
                            </div>
                        ) : (
                            requests.map((request) => (
                                <div
                                    key={request.id}
                                    className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                                            <img
                                                src={request.sender_profile_picture || DefaultUserImage}
                                                alt="User"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">{request.sender_username}</h3>
                                            <p className="text-xs text-gray-500">
                                                Received on • {new Date(request.created_at).toLocaleString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                }).replace(',', ' at')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => acceptRequest(request.id)} className="px-3 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition">
                                            Accept
                                        </button>
                                        <button onClick={() => rejectRequest(request.id,request.sender_username)} className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition">
                                            Reject
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

export default ReceivedRequestsSection;
