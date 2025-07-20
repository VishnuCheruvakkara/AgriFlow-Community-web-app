import React, { useEffect, useState } from 'react';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import { FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import SelectCommunityCreateEventShimmer from '../shimmer-ui-component/SelectCommunityCreateEventShimmer';
import DefaultCommunityImage from "../../assets/images/user-group-default.png"
import SearchNotFound from "../../assets/images/no_result_search.png"

function SelectCommunityCreateEvent({ onCommunitySelect }) {
    const [communities, setCommunities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCommunities, setFilteredCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get('events/get-community-create-event/');
                setCommunities(response.data);
                setFilteredCommunities(response.data);
            } catch (error) {
                // console.error('Error fetching communities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    useEffect(() => {
        const filtered = communities.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCommunities(filtered);
    }, [searchQuery, communities]);

    return (
        <div className="mt-4">
            {/* Alert Box */}
            <div className="bg-red-100 border-l-4 border-red-400 p-4 mb-6  shadow-sm dark:bg-red-950 dark:border-red-600">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <FaInfoCircle className="text-red-700 dark:text-red-400" />
                    </div>
                    <div className="ml-3 space-y-2">
                        <p className="sm:text-sm text-xs text-red-800 dark:text-red-300">
                            You must be an Admin of a group to create a community Event. Select a community below to create an event.
                        </p>
                    </div>
                </div>
            </div>


            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
               transition duration-500 ease-in-out
               bg-white text-gray-800 placeholder-gray-400 
               dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:border-zinc-700"
                />
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-400"
                    size={20}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-300"
                    >
                        <ImCancelCircle size={20} />
                    </button>
                )}
            </div>

            {/* Conditional Messages */}
            {loading ? (
                <SelectCommunityCreateEventShimmer />
            ) : communities.length === 0 ? (
                <div className="text-center py-10 px-4 bg-gray-100 dark:bg-zinc-800 rounded-md border-2 border-dashed border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-300">
                    <p className="text-lg font-semibold mb-2">You are not an admin of any community</p>
                    <p className="text-sm mb-4">To create an event, first create a community.</p>
                    <button
                        onClick={() => navigate('/user-dash-board/farmer-community/create-communities')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        Create Community
                    </button>
                </div>
            ) : filteredCommunities.length === 0 ? (
                <div className="text-center border-2 border-dashed border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-300 py-5 px-4 bg-gray-100 dark:bg-zinc-800 rounded-md">
                    <img
                        src={SearchNotFound}
                        alt="No Events"
                        className="mx-auto w-64 object-contain"
                    />
                    <p className="text-lg font-semibold">No Communities found!</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Try using a different search keyword.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg">
                    {filteredCommunities.map((community) => (
                        <div
                            key={community.id}
                            onClick={() => onCommunitySelect(community)}
                            className="flex items-center p-4 mb-2 border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer rounded-lg gap-4"
                        >
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 mr-3 flex-shrink-0">
                                <img
                                    src={community.logo || DefaultCommunityImage}
                                    alt="Community Logo"
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{community.name}</h3>
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                                        Admin
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {community.members_count} members
                                </p>
                            </div>

                            <FaChevronRight className="text-gray-400 dark:text-gray-300 h-4 w-4 flex-shrink-0" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SelectCommunityCreateEvent;
