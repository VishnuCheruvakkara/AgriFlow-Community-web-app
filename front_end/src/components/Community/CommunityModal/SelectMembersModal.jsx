import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { AiOutlineCheck } from 'react-icons/ai';
import { FaRegCircleCheck } from "react-icons/fa6";
import { ImCancelCircle } from "react-icons/im";
import { PulseLoader } from 'react-spinners';
import { showConfirmationAlert } from '../../SweetAlert/showConfirmationAlert';
import ButtonLoader from '../../LoaderSpinner/ButtonLoader';
import DefaultUserImage from "../../../assets/images/user-default.png";
import AuthenticatedAxiosInstance from '../../../axios-center/AuthenticatedAxiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

function SelectMembersModal({
    isOpen,
    onClose,
    onSubmit,
    buttonId = "CommunityCreation",
    modalTitle = "Select Group Members",  // Dynamic modal title
    submitButtonText = "Submit Members & Create",  // Dynamic button text
    actionType = "select",
    communityId,
}) {
    // State management
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const debounceTimeout = useRef(null);
    const listContainerRef = useRef(null); // Added reference for the scroll container
    console.log("The  communty Id is :::::::: ", communityId)
    // Handle close modal with confirmation
    const handleCloseModal = () => {
        onClose();             // Simply close the modal
        setSearchQuery('');    // Clear the search query
        setSelectedMembers([]); // Clear selected members
    };


    // Toggle member selection
    const handleToggleMember = (id) => {
        setSelectedMembers(prev =>
            prev.includes(id)
                ? prev.filter(memberId => memberId !== id)
                : [...prev, id]
        );
    };

    // Handle modal submission
    const handleModalSubmit = () => {
        onSubmit(selectedMembers);
    };

    // Fetch members who are not part of the current community
    const fetchMembers = async (pageNum = 1, query = searchQuery) => {
        if (!hasMore && pageNum > 1) return; // Don't fetch if we know there's no more data

        try {
            setLoading(true);
            // Build the URL differently based on whether we have a communityId
            let url = `/community/get-users-create-community/?page=${pageNum}&search=${query}`;

            // Only append community_id parameter if it exists
            if (communityId) {
                url += `&community_id=${communityId}`;
            }

            const response = await AuthenticatedAxiosInstance.get(url);

            const newMembers = response.data.results;
            console.log(`Fetched page ${pageNum}, got ${newMembers.length} results`);
            console.log(`Next page: ${response.data.next}`);

            if (pageNum === 1) {
                setMembers(newMembers); // First page: reset list
            } else {
                setMembers((prev) => [...prev, ...newMembers]); // Append next pages
            }

            // Check if there are more pages
            setHasMore(response.data.next !== null);
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle scroll event
    const handleScroll = () => {
        if (!listContainerRef.current || loading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = listContainerRef.current;

        // Detect when user has scrolled to bottom (with a small buffer)
        if (scrollHeight - scrollTop <= clientHeight + 20) {
            console.log("Reached bottom, loading more...");
            setPage(prevPage => prevPage + 1);
        }
    };

    // Effect to fetch data when page changes
    useEffect(() => {
        if (page > 1) {
            fetchMembers(page);
        }
    }, [page]);

    // Debounce search query
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Set a new debounce timer
        debounceTimeout.current = setTimeout(() => {
            setPage(1); // Reset to page 1 on new search
            fetchMembers(1, searchQuery, communityId); // Fetch using current search query
        }, 500); // 500ms debounce delay

        return () => {
            clearTimeout(debounceTimeout.current); // Cleanup on unmount or change
        };
    }, [searchQuery]);

    // Initialize data when modal opens
    useEffect(() => {
        if (isOpen) {
            setPage(1);
            setMembers([]);
            fetchMembers(1, '', communityId);
        }
    }, [isOpen, communityId]);

    if (!isOpen) return null;

    return (
       <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 180, damping: 18 } }}
                    exit={{ opacity: 0, scale: 0.85, y: 40, transition: { duration: 0.2 } }}

                    className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-[90%] max-w-md overflow-hidden">
                    {/* Green Header */}
                    <div className="bg-gradient-to-r from-green-700 to-green-400 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">{modalTitle || "Select Group Members"}</h2>
                        <button
                            onClick={handleCloseModal}
                            className="text-white hover:bg-green-700 rounded-full p-1 transition-colors duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Search Input */}
                        <div className="relative mb-5">
                            <div className="relative w-full">
                                {/* Search Icon on the left */}
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500" size={18} />

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name or location..."
                                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg focus:border-green-500 dark:focus:border-green-400 outline-none transition-colors duration-300 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500"
                                />

                                {/* Clear button on the right */}
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
                                    >
                                        <ImCancelCircle size={20} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Members List */}
                        {loading && members.length === 0 ? (
                            <div className="flex flex-col justify-center items-center py-28">
                                <PulseLoader color="#16a34a" speedMultiplier={1} />
                                <p className="mt-4 text-sm text-gray-500 dark:text-zinc-400">Loading farmers, please wait...</p>
                            </div>
                        ) : (
                            <div>
                                {members.length === 0 ? (
                                    <div className="text-center border-2 border-dashed border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-zinc-400 py-10 px-4 bg-gray-100 dark:bg-zinc-900 rounded-md">
                                        <p className="text-lg font-semibold">No farmers found!</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-500">Try using a different search keyword.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-3 px-3">
                                            <label htmlFor="select-all" className="relative flex items-center gap-2 cursor-pointer p-1">
                                                <input
                                                    id="select-all"
                                                    type="checkbox"
                                                    checked={members.length > 0 && selectedMembers.length === members.length}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedMembers(members.map((m) => m.id));
                                                        } else {
                                                            setSelectedMembers([]);
                                                        }
                                                    }}
                                                    className="peer relative h-5 w-5 appearance-none rounded-full border border-green-600 dark:border-green-500 shadow-sm transition-all bg-white dark:bg-zinc-700
                   before:absolute before:top-1/2 before:left-1/2 before:h-12 before:w-12 before:-translate-y-1/2 before:-translate-x-1/2 
                   before:rounded-full before:bg-green-400 before:opacity-0 before:transition-opacity 
                   checked:border-green-600 checked:bg-green-600 checked:before:bg-green-400 hover:before:opacity-10"
                                                />

                                                {/* React Icon inside checkbox */}
                                                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                    <AiOutlineCheck className="font-bold text-xs" />
                                                </span>

                                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 pl-1">Select All</span>
                                            </label>
                                        </div>

                                        {/* Member List with Scroll Event */}
                                        <div
                                            ref={listContainerRef}
                                            className="max-h-60 overflow-y-auto border-2 border-t-green-500 border-b-green-500  dark:border-l-zinc-700 dark:border-r-zinc-700 mb-3 scrollbar-hide"
                                            onScroll={handleScroll}
                                        >
                                            <div >
                                                {members.map((member) => (
                                                    <label
                                                        key={member.id}
                                                        className=" border m-2 border-gray-300 dark:border-zinc-600  flex items-center justify-between  px-2 py-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-md cursor-pointer transition duration-500 ease-in-out"
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <img
                                                                src={member.profile_picture || DefaultUserImage}
                                                                alt="farmers"
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />

                                                            {/* Wrap text in a vertical flex container */}
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-800 dark:text-zinc-200 font-medium">
                                                                    {member.username}
                                                                </span>
                                                                <p className="text-xs text-gray-500 dark:text-zinc-400">
                                                                    {member.location ? `${member.location.location_name}-${member.location.country}` : "No location"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="relative mr-3 mt-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedMembers.includes(member.id)}
                                                                onChange={() => handleToggleMember(member.id)}
                                                                className="peer appearance-none h-5 w-5 rounded-full border border-green-600 dark:border-green-500 bg-white dark:bg-zinc-900
                  checked:bg-green-600 checked:border-green-600 cursor-pointer transition relative"
                                                            />
                                                            <span className="pointer-events-none absolute top-[10px] left-1/2 -translate-x-1/2 -translate-y-1/2 
                text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                                <AiOutlineCheck className="text-xs" />
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}

                                                {/* Loading indicator at bottom while loading more */}
                                                {loading && members.length > 0 && (
                                                    <div className="flex justify-center py-2">
                                                        <PulseLoader color="#16a34a" size={8} speedMultiplier={0.7} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Selected Count */}
                                        <div className="text-right text-sm text-gray-600 dark:text-zinc-400 px-3">
                                            {selectedMembers.length} selected
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer with Actions */}
                    <div className="bg-gray-100 dark:bg-zinc-700 px-6 py-2 flex justify-end gap-3 border-t border-gray-200 dark:border-zinc-600">
                        <button
                            className="px-4 py-3 bg-gray-400 dark:bg-zinc-600 hover:bg-gray-500 dark:hover:bg-zinc-500 text-gray-800 dark:text-zinc-200 rounded-md transition-colors font-medium flex items-center gap-2"
                            onClick={handleCloseModal}
                        >
                            <ImCancelCircle />
                            Cancel
                        </button>
                        <ButtonLoader
                            buttonId={buttonId}
                            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium flex items-center gap-2"
                            onClick={handleModalSubmit}
                            disabled={selectedMembers.length === 0}
                        >
                            <FaRegCircleCheck />
                            {submitButtonText || "Submit Members & Create"}
                        </ButtonLoader>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default SelectMembersModal;