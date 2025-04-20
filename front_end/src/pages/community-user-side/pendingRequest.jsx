import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaUserPlus, FaUserCheck, FaUserClock, FaUsers } from 'react-icons/fa';
import DefaultCommunityIcon from "../../assets/images/user-group-default.png";
import DefaultUserIcon from "../../assets/images/user-default.png";

function CommunityRequests() {
    // State to track which sections are expanded
    const [expandedSections, setExpandedSections] = useState({
        outgoingRequests: false,
        incomingRequests: false,
        adminInvites: false,
        pendingApprovals: false
    });

    // Toggle section visibility
    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    return (
        <div className=" mx-auto">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Pending Requests</h2>

            {/* Section 1: Your Requests to Join Communities */}
            {/* Section 1: Your Requests to Join Communities */}
            <div className="mb-6 rounded-lg shadow-lg">
                <div
                    className={`bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${expandedSections.outgoingRequests ? 'rounded-t-lg' : 'rounded-lg'}`}
                    onClick={() => toggleSection('outgoingRequests')}
                >
                    <div className="flex items-center">
                        <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                            <FaUserClock className="text-green-600 text-xl" />
                        </div>

                        <h2 className="text-md font-semibold text-white">Your Requests to Join Communities</h2>
                        <span className="ml-3 px-2 py-1 border border-green-600 bg-white text-green-600 font-semibold text-xs rounded-full">2</span>
                    </div>
                    <div className="transition-transform duration-300 ease-in-out">
                        {expandedSections.outgoingRequests ?
                            <FaChevronUp className="text-white" /> :
                            <FaChevronDown className="text-white" />
                        }
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.outgoingRequests ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 border-t-0 border rounded-b-lg border-gray-300">
                        <div className="space-y-3">
                            {/* Request Item 1 */}
                            <div className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-lg overflow-hidden mr-4">
                                        <img src={DefaultCommunityIcon} alt="Corn Growers Network" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Corn Growers Network</h3>
                                        <p className="text-xs text-gray-500">Request sent on April 2, 2025</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">

                                    <span className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm transition">Pending...</span>

                                    <button className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition">
                                        Cancell
                                    </button>
                                </div>
                            </div>

                            {/* Request Item 2 */}
                            <div className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-lg overflow-hidden mr-4">
                                        <img src={DefaultCommunityIcon} alt="Corn Growers Network" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Corn Growers Network</h3>
                                        <p className="text-xs text-gray-500">Request sent on April 2, 2025</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">

                                    <span className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm transition">Pending...</span>

                                    <button className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition">
                                        Cancell
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-lg overflow-hidden mr-4">
                                        <img src={DefaultCommunityIcon} alt="Corn Growers Network" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Corn Growers Network</h3>
                                        <p className="text-xs text-gray-500">Request sent on April 2, 2025</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">

                                    <span className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm transition">Pending...</span>

                                    <button className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition">
                                        Cancell
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Member Requests for Your Communities */}
            <div className="mb-6 rounded-lg shadow-lg">
                <div
                    className={`bg-gradient-to-r from-blue-700 to-blue-400 flex justify-between items-center p-4 cursor-pointer ${expandedSections.incomingRequests ? 'rounded-t-lg' : 'rounded-lg'}`}
                    onClick={() => toggleSection('incomingRequests')}
                >
                    <div className="flex items-center">
                        <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                            <FaUserPlus className="text-blue-600 text-xl" />
                        </div>
                        <h2 className="text-md font-semibold text-white">Member Requests for Your Communities</h2>
                        <span className="ml-3 px-2 py-1 border border-blue-600 bg-white text-blue-600 font-semibold text-xs rounded-full">5</span>
                    </div>
                    <div className="transition-transform duration-300 ease-in-out">
                        {expandedSections.incomingRequests ?
                            <FaChevronUp className="text-white" /> :
                            <FaChevronDown className="text-white" />
                        }
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.incomingRequests ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 border-t-0 border rounded-b-lg border-gray-300">
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-lg overflow-hidden mr-4 border border-gray-200">
                                    <img src={DefaultCommunityIcon} alt="Rice Farmers Association" className="h-full w-full object-cover" />
                                </div>
                                <h3 className="font-semibold text-gray-800">Rice Farmers Association</h3>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Member Request 1 */}
                            <div className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                                        <img src={DefaultUserIcon} alt="Ravi Kumar" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Ravi Kumar</p>
                                        <p className="text-xs text-gray-500">Requested 2 days ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
                                        Accept
                                    </button>
                                    <button className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition">
                                        Decline
                                    </button>
                                </div>
                            </div>

                            {/* Member Request 2 */}
                            <div className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                                        <img src={DefaultUserIcon} alt="Priya Sharma" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Priya Sharma</p>
                                        <p className="text-xs text-gray-500">Requested 3 days ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
                                        Accept
                                    </button>
                                    <button className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Community Invitations for You */}
            <div className="mb-6 rounded-lg shadow-lg">
                <div
                    className={`bg-gradient-to-r from-purple-700 to-purple-400 flex justify-between items-center p-4 cursor-pointer ${expandedSections.adminInvites ? 'rounded-t-lg' : 'rounded-lg'}`}
                    onClick={() => toggleSection('adminInvites')}
                >
                    <div className="flex items-center">
                        <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                            <FaUsers className="text-purple-600 text-xl" />
                        </div>
                        <h2 className="text-md font-semibold text-white">Community Invitations for You</h2>
                        <span className="ml-3 px-2 py-1 border border-purple-600 bg-white text-purple-600 font-semibold text-xs rounded-full">3</span>
                    </div>
                    <div className="transition-transform duration-300 ease-in-out">
                        {expandedSections.adminInvites ?
                            <FaChevronUp className="text-white" /> :
                            <FaChevronDown className="text-white" />
                        }
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.adminInvites ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 border-t-0 border rounded-b-lg border-gray-300">
                        <div className="space-y-3">
                            {/* Invitation 1 */}
                            <div className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 border border-gray-200">
                                        <img src={DefaultCommunityIcon} alt="Organic Farming Practices" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Organic Farming Practices</h3>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <span>Invited by Admin: </span>
                                            <div className="h-4 w-4 rounded-full overflow-hidden mx-1 border border-gray-200">
                                                <img src={DefaultUserIcon} alt="Admin" className="h-full w-full object-cover" />
                                            </div>
                                            <span>Rajesh Verma • 1 day ago</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition">
                                        Accept
                                    </button>
                                    <button className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition">
                                        Ignore
                                    </button>
                                </div>
                            </div>

                            {/* Invitation 2 */}
                            <div className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 border border-gray-200">
                                        <img src={DefaultCommunityIcon} alt="Wheat Farmers Alliance" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Wheat Farmers Alliance</h3>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <span>Invited by Admin: </span>
                                            <div className="h-4 w-4 rounded-full overflow-hidden mx-1 border border-gray-200">
                                                <img src={DefaultUserIcon} alt="Admin" className="h-full w-full object-cover" />
                                            </div>
                                            <span>Sanjay Patil • 3 days ago</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition">
                                        Accept
                                    </button>
                                    <button className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition">
                                        Ignore
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4: Your Pending Admin Approvals */}
            <div className="mb-6 rounded-lg shadow-lg">
                <div
                    className={`bg-gradient-to-r from-amber-700 to-amber-400 flex justify-between items-center p-4 cursor-pointer ${expandedSections.pendingApprovals ? 'rounded-t-lg' : 'rounded-lg'}`}
                    onClick={() => toggleSection('pendingApprovals')}
                >
                    <div className="flex items-center">
                        <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                            <FaUserCheck className="text-amber-600 text-xl" />
                        </div>
                        <h2 className="text-md font-semibold text-white">Your Pending Admin Approvals</h2>
                        <span className="ml-3 px-2 py-1 border border-amber-600 bg-white text-amber-600 font-semibold text-xs rounded-full">2</span>
                    </div>
                    <div className="transition-transform duration-300 ease-in-out">
                        {expandedSections.pendingApprovals ?
                            <FaChevronUp className="text-white" /> :
                            <FaChevronDown className="text-white" />
                        }
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.pendingApprovals ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 border-t-0 border rounded-b-lg border-gray-300">
                        <div className="space-y-4">
                            {/* Community 1 */}
                            <div className="bg-white border border-gray-300 rounded-lg">
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 border border-gray-200">
                                                <img src={DefaultCommunityIcon} alt="Mango Growers Association" className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">Mango Growers Association</h3>
                                                <p className="text-xs text-gray-500">3 pending member approvals</p>
                                            </div>
                                        </div>
                                        <button className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                                            Manage All
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {/* User 1 */}
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                                                <img src={DefaultUserIcon} alt="Ankit Joshi" className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">Ankit Joshi</p>
                                                <p className="text-xs text-gray-500">Waiting since April 10, 2025</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 transition">
                                                Approve
                                            </button>
                                            <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition">
                                                Deny
                                            </button>
                                        </div>
                                    </div>

                                    {/* User 2 */}
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                                                <img src={DefaultUserIcon} alt="Neha Patel" className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">Neha Patel</p>
                                                <p className="text-xs text-gray-500">Waiting since April 12, 2025</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 transition">
                                                Approve
                                            </button>
                                            <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition">
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Empty State (if needed) */}
            {false && (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaUsers className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Pending Requests</h3>
                    <p className="text-gray-500 mb-4">You don't have any pending requests or invitations at the moment.</p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
                        Find Communities
                    </button>
                </div>
            )}
        </div>
    );
}

export default CommunityRequests;