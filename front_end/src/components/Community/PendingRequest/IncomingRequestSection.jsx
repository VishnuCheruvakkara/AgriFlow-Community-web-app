import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaUserPlus } from 'react-icons/fa';
import AuthenticatedAxiosInstance from '../../../axios-center/AuthenticatedAxiosInstance';
import DefaultCommunityIcon from "../../../assets/images/user-group-default.png";
import DefaultUserIcon from "../../../assets/images/user-default.png";

function IncomingRequestsSection() {
    const [expanded, setExpanded] = useState(false);
    const [requestsData, setRequestsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleSection = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        fetchIncomingRequests();
    }, []);
    

    const fetchIncomingRequests = async () => {
        try {
            setLoading(true);
            const response = await AuthenticatedAxiosInstance.get('/community/incoming-requests/');
            console.log("incomming data ::::", response.data)
            setRequestsData(response.data);
        } catch (error) {
            console.error('Error fetching incoming requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAction = async (communityId, username, action) => {
        try {
            const response = await AuthenticatedAxiosInstance.patch(
                `/community/update-community/${communityId}/membership/${username}/update/`,
                { status: action }
            );
            console.log('Status updated:', response.data);
            fetchIncomingRequests(); // refresh data
        } catch (error) {
            console.error('Error updating membership status:', error);
        }
    };
    

    const totalPending = requestsData.reduce((acc, community) => acc + community.requested_users.length, 0);

    return (
        <div className="mb-6 rounded-lg shadow-lg">
            <div
                className={`bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${expanded ? 'rounded-t-lg' : 'rounded-lg'}`}
                onClick={toggleSection}
            >
                <div className="flex items-center">
                    <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                        <FaUserPlus className="text-green-600 text-xl" />
                    </div>
                    <h2 className="text-md font-semibold text-white">Member Requests for Your Communities</h2>
                    <span className="ml-3 px-2 py-1 border border-green-600 bg-white text-green-600 font-semibold text-xs rounded-full">
                        {totalPending}
                    </span>
                </div>
                <div className="transition-transform duration-300 ease-in-out">
                    {expanded ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-3 border-t-0 border rounded-b-lg border-gray-300 max-h-[500px] overflow-y-auto scrollbar-hide">
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center text-gray-600">Loading...</div>
                        ) : requestsData.length === 0 || totalPending === 0 ? (
                            <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md">
                                <p className="text-md font-semibold">No pending requests at the moment.</p>
                                <p className="text-xs text-gray-500">Check after sometime...</p>
                            </div>
                        ) : (
                            requestsData.map((community) => (
                                <div key={community.id} className="bg-white border border-gray-300 rounded-lg">
                                    <div className="p-3 border-b rounded-t-lg border-gray-200 bg-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 border border-gray-300">
                                                <img
                                                    src={community.community_logo || DefaultCommunityIcon}
                                                    alt={community.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">Community : {community.name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    Total {community.requested_users.length} member{community.requested_users.length !== 1 && 's'} requested to join
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-gray-100">
                                        {community.requested_users.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 transition">
                                                <div className="flex items-center gap-4 ml-2">
                                                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                                                        <img
                                                            src={user.profile_picture || DefaultUserIcon}
                                                            alt="image"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{user.username}</p>
                                                        <p className="text-xs text-gray-500">requested on • {user.requested_at}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ">
                                                    <button
                                                        onClick={() => handleRequestAction(community.id, user.username, 'approved')}
                                                        className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
                                                    >
                                                        Aprove
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(community.id, user.username, 'ignored')}
                                                        className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition"
                                                    >
                                                        Reject
                                                    </button>

                                                </div>
                                            </div>
                                        ))}
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

export default IncomingRequestsSection;
