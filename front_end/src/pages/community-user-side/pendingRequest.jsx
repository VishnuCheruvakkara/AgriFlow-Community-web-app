import React from 'react'
import { FaSearch,FaGlobe,FaLock,FaChevronRight,FaCamera } from 'react-icons/fa';
import DeafultCommunityIcon from "../../assets/images/user-group-default.png"
import DeafaultuserIcon from "../../assets/images/user-default.png"

function PendingRequest() {
    return (
        <>
            {/* Pending Requests Content (Hidden by default) */}
            <div className="mt-6 ">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Communities You've Requested to Join</h2>
                </div>

                <div className="space-y-4">
                    {/* Pending Request 1 */}
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                <img src={DeafultCommunityIcon} alt="Community" className="h-full w-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-700">Corn Growers Network</h3>
                                <p className="text-xs text-gray-500">
                                    Request sent on April 2, 2025
                                </p>
                            </div>
                        </div>
                        <button className="px-4 py-1 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-50 transition">
                            Cancel Request
                        </button>
                    </div>

                    {/* Pending Request 2 */}
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                <img src={DeafultCommunityIcon} alt="Community" className="h-full w-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-700">Irrigation Techniques</h3>
                                <p className="text-xs text-gray-500">
                                    Request sent on April 5, 2025
                                </p>
                            </div>
                        </div>
                        <button className="px-4 py-1 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-50 transition">
                            Cancel Request
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Member Requests for Your Communities</h2>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                    <img src={DeafultCommunityIcon} alt="Community" className="h-full w-full object-cover" />
                                </div>
                                <h3 className="font-semibold text-green-700">Rice Farmers Association</h3>
                            </div>
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">5 pending requests</span>
                        </div>

                        <div className="space-y-3">
                            {/* Member Request 1 */}
                            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                        <img src={DeafaultuserIcon} alt="User" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Ravi Kumar</p>
                                        <p className="text-xs text-gray-500">Requested 2 days ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                                        Accept
                                    </button>
                                    <button className="px-3 py-1 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-50 transition">
                                        Decline
                                    </button>
                                </div>
                            </div>

                            {/* Member Request 2 */}
                            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                        <img src={DeafaultuserIcon} alt="User" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Priya Sharma</p>
                                        <p className="text-xs text-gray-500">Requested 3 days ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                                        Accept
                                    </button>
                                    <button className="px-3 py-1 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-50 transition">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PendingRequest
