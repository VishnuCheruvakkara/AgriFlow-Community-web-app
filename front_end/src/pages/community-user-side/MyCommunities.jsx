import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { Search } from 'lucide-react';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import { PulseLoader } from 'react-spinners';
import debounce from 'lodash.debounce';
import { ImCancelCircle } from "react-icons/im";
import { Link } from 'react-router-dom';
import SelectCommunityCreateEventShimmer from '../../components/shimmer-ui-component/SelectCommunityCreateEventShimmer';
import CommunityDataNotFoundImage from "../../assets/images/no-community-imagef-found.png"

function MyCommunities() {
    const [communities, setCommunities] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');

    const observer = useRef();

    // Fetch communities with search support
    const fetchCommunities = async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;
        setLoading(true);

        try {
            const currentPage = reset ? 1 : page;
            const response = await AuthenticatedAxiosInstance.get(
                `/community/get-my-communities/?page=${currentPage}&search=${searchTerm}`
            );
            console.log("Debugging the upcomming data ::::: ", response.data?.results)
            if (reset) {
                setCommunities(response.data.results);
                setPage(2);
            } else {
                setCommunities(prev => {
                    const combined = [...prev, ...response.data.results];
                    const uniqueCommunities = Array.from(
                        new Map(combined.map(c => [c.id, c])).values()
                    );
                    return uniqueCommunities;
                });
                setPage(prev => prev + 1);
            }

            setHasMore(!!response.data.next);
        } catch (error) {
            console.error("Error fetching communities:", error);

            setHasMore(false); // Important: stop pagination on error
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and on search term change
    useEffect(() => {
        setHasMore(true); // Reset hasMore when search term changes
        fetchCommunities(true);
    }, [searchTerm]);

    // Intersection Observer to trigger infinite scroll when last community is in view
    const lastCommunityRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchCommunities(); // Call fetchCommunities directly instead of incrementing page
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    // Debounced search handler
    const debouncedSearch = useMemo(
        () =>
            debounce((value) => {
                setSearchTerm(value);
            }, 500),
        []
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setInputValue(value);         // for UI
        debouncedSearch(value);       // for search
    };

    const clearSearchBar = () => {
        setInputValue('');
        setSearchTerm('');
    }

    return (
        <div className="mt-4">
            <h2 className="text-lg font-medium text-gray-800 mb-3 dark:text-zinc-200">My Communities</h2>

            <div className="relative mb-6">
                <input
                    type="text"
                    value={inputValue}
                    placeholder="Search communities..."
                    onChange={handleSearchChange}
                    className=" w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
               transition duration-500 ease-in-out
               bg-white text-gray-800 placeholder-gray-400 
               dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:border-zinc-700"
                />
                <Search className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
                {searchTerm && (
                    <button
                        onClick={clearSearchBar}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
                    >
                        <ImCancelCircle size={20} />
                    </button>
                )}
            </div>

            <div className="overflow-hidden  rounded-lg ">
                {!loading && communities.length === 0 ? (
                    <div className="text-center border-2 border-dashed border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-zinc-400 py-10 px-4 bg-gray-100 dark:bg-zinc-900 rounded-md">
                        <img
                            src={CommunityDataNotFoundImage}
                            alt="No Events"
                            className="mx-auto w-64 object-contain"
                        />
                        <p className="text-lg font-semibold dark:text-zinc-400">No Communities found!</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">Try using a different search keyword.</p>
                    </div>
                ) : (
                    communities.map((community, index) => {
                        const isAdmin = community?.is_admin;
                        const notificationCount = community?.unread_notifications || 0;
                        const isLast = index === communities.length - 1;

                        return (
                            <Link
                                to={`community-chat/${community.id}`}
                                key={community.id}
                                ref={isLast ? lastCommunityRef : null}
                                className="flex items-center p-4 mb-2 border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg gap-4"
                            >
                                <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 mr-3 flex-shrink-0">
                                    <img
                                        src={community.logo}
                                        alt="Community Logo"
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center">
                                        <h3 className="font-medium text-gray-900 dark:text-zinc-100 truncate">{community.name}</h3>
                                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400">
                                            {isAdmin ? "Admin" : "Member"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                                        {community.members_count || 0} members
                                    </p>
                                </div>

                                {notificationCount > 0 && (
                                    <div className="flex-shrink-0 mr-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 text-xs font-medium text-red-600 dark:text-red-400">
                                            {notificationCount}
                                        </span>
                                    </div>
                                )}
                                <FaChevronRight className="text-gray-400 dark:text-zinc-500 h-4 w-4 flex-shrink-0" />
                            </Link>
                        );
                    })
                )}

                {loading && (
                    <SelectCommunityCreateEventShimmer />
                )}
            </div>
        </div>
    );
}

export default MyCommunities;
