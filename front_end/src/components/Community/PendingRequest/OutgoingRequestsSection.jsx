
import React,{useState,useRef} from 'react';
import { FaChevronDown, FaChevronUp, FaUserClock } from 'react-icons/fa';
import DefaultCommunityIcon from "../../../assets/images/user-group-default.png";

function OutgoingRequestsSection({ expanded, toggleSection }) {
   

    //Fetch Notification from backend table 
   

    return (
        <div className="mb-6 rounded-lg shadow-lg">
            <div
                className={`bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${expanded ? 'rounded-t-lg' : 'rounded-lg'}`}
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
                    {expanded ?
                        <FaChevronUp className="text-white" /> :
                        <FaChevronDown className="text-white" />
                    }
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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
                                    Cancel
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
                                    Cancel
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
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OutgoingRequestsSection;