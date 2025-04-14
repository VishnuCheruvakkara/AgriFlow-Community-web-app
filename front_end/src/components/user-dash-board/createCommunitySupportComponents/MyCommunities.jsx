import React, { useEffect, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import AuthenticatedAxiosInstance from '../../../axios-center/AuthenticatedAxiosInstance';
import { Search, Globe, Lock } from 'lucide-react';

function MyCommunities() {
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get('/community/get-my-communities/');
                setCommunities(response.data);
                console.log("Fetched communities:", response.data);
            } catch (error) {
                console.error("Error fetching communities", error);
            }
        };

        fetchCommunities();
    }, []);

    return (
        <div className="mt-4">
            <h2 className="text-lg font-medium text-gray-800 mb-3">My Communities</h2>
            {/* search space  */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search communities..."
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-500 ease-in-out"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                {communities.length === 0 ? (
                    <div className="p-4 text-gray-500 text-sm">
                        You haven't joined any communities yet.
                    </div>
                ) : (
                    communities.map((item, index) => {
                        const isAdmin = item?.is_admin;
                        const notificationCount = item?.unread_notifications || 0;

                        return (
                            <div
                                key={index}
                                className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            >
                                {/* Community Avatar */}
                                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 mr-3 flex-shrink-0">
                                    <img src={item.logo} alt="Community Logo" className="h-12 w-12 rounded-full object-cover" />
                                </div>

                                {/* Community Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center">
                                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                            {isAdmin ? "Admin" : "Member"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.members_count || 0} members
                                    </p>
                                </div>

                                {/* Notification Badge */}
                                {notificationCount > 0 && (
                                    <div className="flex-shrink-0 mr-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-600">
                                            {notificationCount}
                                        </span>
                                    </div>
                                )}

                                {/* Chevron Icon */}
                                <FaChevronRight className="text-gray-400 h-4 w-4 flex-shrink-0" />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default MyCommunities;
