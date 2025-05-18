import React from 'react';
import { FaChevronDown, FaUserCheck } from 'react-icons/fa';

function ReceivedRequestsSection() {
    return (
        <div className="mb-6 rounded-lg shadow-lg">
            <div
                className="ripple-parent ripple-white bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer rounded-lg"
            >
                <div className="flex items-center">
                    <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                        <FaUserCheck className="text-green-600 text-xl" />
                    </div>
                    <h2 className="text-md font-semibold text-white">Received Connection Requests</h2>
                    <span className="ml-3 px-2 py-1 border border-green-600 bg-white text-green-600 font-semibold text-xs rounded-full">
                        0
                    </span>
                </div>
                <div className="transition-transform duration-300 ease-in-out">
                    <FaChevronDown className="text-white" />
                </div>
            </div>

            {/* Container for expanded content - add proper visibility classes when implementing functionality */}
            <div className="overflow-hidden transition-all duration-300 ease-in-out max-h-0 opacity-0">
                <div className="p-3 border-t-0 border rounded-b-lg border-gray-300">
                    <div className="space-y-3">
                        {/* Empty state */}
                        <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md">
                            <p className="text-md font-semibold">No pending received requests.</p>
                            <p className="text-xs text-gray-500">Requests from other users will appear here.</p>
                        </div>
                        
                        {/* Request item template (hidden by default) */}
                        <div className="hidden flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        src=""
                                        alt="User"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">User Name</h3>
                                    <p className="text-xs text-gray-500">
                                        Received on Date
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition"
                                >
                                    Accept
                                </button>
                                <button
                                    className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition"
                                >
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

export default ReceivedRequestsSection;
