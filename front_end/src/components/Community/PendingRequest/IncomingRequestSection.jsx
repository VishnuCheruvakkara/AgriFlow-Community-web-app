import React from 'react';
import { FaChevronDown, FaChevronUp, FaUserPlus } from 'react-icons/fa';
import DefaultCommunityIcon from "../../../assets/images/user-group-default.png";
import DefaultUserIcon from "../../../assets/images/user-default.png";

function IncomingRequestsSection({ expanded, toggleSection }) {
    return (
        <div className="mb-6 rounded-lg shadow-lg">
            <div
                className={`bg-gradient-to-r from-blue-700 to-blue-400 flex justify-between items-center p-4 cursor-pointer ${expanded ? 'rounded-t-lg' : 'rounded-lg'}`}
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
                    {expanded ?
                        <FaChevronUp className="text-white" /> :
                        <FaChevronDown className="text-white" />
                    }
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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
    );
}

export default IncomingRequestsSection;