import React from 'react';
import { FaChevronDown, FaChevronUp, FaUserCheck } from 'react-icons/fa';
import DefaultCommunityIcon from "../../../assets/images/user-group-default.png";
import DefaultUserIcon from "../../../assets/images/user-default.png";

function AdminApprovalsSection({ expanded, toggleSection }) {
    return (
        <div className="mb-6 rounded-lg shadow-lg">
            <div
                className={`bg-gradient-to-r from-amber-700 to-amber-400 flex justify-between items-center p-4 cursor-pointer ${expanded ? 'rounded-t-lg' : 'rounded-lg'}`}
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
                    {expanded ?
                        <FaChevronUp className="text-white" /> :
                        <FaChevronDown className="text-white" />
                    }
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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
    );
}

export default AdminApprovalsSection;