import React from 'react'
import { FaSearch,FaGlobe,FaLock,FaChevronRight,FaCamera } from 'react-icons/fa';
import DeafultCommunityIcon from "../../../assets/images/user-group-default.png"

function MyCommunities() {
    return (
        <>
            {/* My Communities Content (Hidden by default) */}
            <div className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                    {/* My Community Card 1 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                <img src={DeafultCommunityIcon} alt="Community" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-700">Rice Farmers Association</h3>
                                <div className="flex mt-1">
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                        Admin
                                    </span>
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        156 members
                                    </span>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <button className="text-green-600 text-sm font-medium flex items-center">
                                        View Community <FaChevronRight className="ml-1 text-xs" />
                                    </button>

                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                        5 pending requests
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-2">
                            <button className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                Manage Members
                            </button>
                            <button className="px-3 py-2 text-sm border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                                Edit Community
                            </button>
                        </div>
                    </div>

                    {/* My Community Card 2 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                <img src={DeafultCommunityIcon} alt="Community" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-700">Agricultural Innovation</h3>
                                <div className="flex mt-1">
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                        Member
                                    </span>
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        278 members
                                    </span>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <button className="text-green-600 text-sm font-medium flex items-center">
                                        View Community <FaChevronRight className="ml-1 text-xs" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <button className="px-3 py-2 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition w-full">
                                Leave Community
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </>
    )
}

export default MyCommunities
