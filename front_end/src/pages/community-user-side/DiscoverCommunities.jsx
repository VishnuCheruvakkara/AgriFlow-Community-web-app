import React, { useState, useEffect } from 'react';
import { Search, Globe, Lock } from 'lucide-react';
import DefaultCommunityIcon from "../../assets/images/user-group-default.png";
import DeafaultUserImage from '../../assets/images/user-default.png'
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import { debounce } from 'lodash';
import { PulseLoader } from 'react-spinners';
import Pagination from '../../components/Common-Pagination/UserSidePagination';
import { AiOutlineClose } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im'
// importing framer motion for animation
import { motion, AnimatePresence } from 'framer-motion';

import { FaInfoCircle } from 'react-icons/fa';
import { showToast } from '../../components/toast-notification/CustomToast';

import CommunityShimmer from '../../components/shimmer-ui-component/CommunityShimmer';
import CommunityDataNotFoundImage from "../../assets/images/no-community-imagef-found.png"

function DiscoverCommunities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  //local loading set up join community
  const [joinCommunityLoading, setJoinCommunityLoading] = useState(false);

  // Modal data setup
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  // Modal setup
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounced function for search
  const debouncedSearch = debounce(async (query) => {
    try {
      setLoading(true);
      const response = await AuthenticatedAxiosInstance.get(`/community/get-communities?page=${currentPage}&search=${query}`);
      console.log("Get data::::", response.data);  // Fixed typo here
      const data = response.data;
      setCommunities(data.results || []);
      setNextPageUrl(data.next);
      setPrevPageUrl(data.previous);
      setTotalPages(Math.ceil(data.count / 5));  // Calculate total pages from count and page_size (5 in this case)
    } catch (error) {
      console.error("Failed to fetch communities", error);
    } finally {
      setLoading(false);
    }
  }, 1000); // Delay of 1000ms after user stops typing

  // Effect to call debounced search when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      fetchCommunities(currentPage); //show all communities
    } else {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (searchQuery) {
      debouncedSearch(searchQuery); // Trigger debounced search if search query is active
    } else {
      fetchCommunities(page); // If there's no search, directly fetch communities for the selected page
    }
  };

  // Fetch communities without search (for pagination)
  const fetchCommunities = async (page) => {
    try {
      setLoading(true);
      const response = await AuthenticatedAxiosInstance.get(`/community/get-communities?page=${page}&search=${searchQuery}`);
      const data = response.data;
      setCommunities(data.results || []);
      setNextPageUrl(data.next);
      setPrevPageUrl(data.previous);
      setTotalPages(Math.ceil(data.count / 5));
    } catch (error) {
      console.error("Failed to fetch communities", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger page change when currentPage changes
  useEffect(() => {
    fetchCommunities(currentPage);
  }, [currentPage]);

  // Open modal with selected community data
  const handleOpenModal = (community) => {
    setSelectedCommunity(community);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCommunity(null);  // Clear selected community
  };

  const handleJoinCommunity = async () => {
    setJoinCommunityLoading(true);
    try {
      const response = await AuthenticatedAxiosInstance.patch(`community/join-community/${selectedCommunity.id}/`);
      if (selectedCommunity.is_private) {
        showToast("Request sent! Wait for admin approval.", "success")
      } else {
        showToast("You’ve joined the community successfully!", "success")
      }
      // Remove joined community from the current list
      setCommunities(prev => prev.filter(comm => comm.id !== selectedCommunity.id));

      handleCloseModal();
    } catch (error) {
      console.error("Join error", error);
      showToast(error.response?.data?.detail || "Failed to join community.", "error");
    } finally {
      setJoinCommunityLoading(false);
    }
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h2 className="text-lg font-medium text-gray-800 mb-3 dark:text-zinc-200 ">Discover Communities</h2>
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search communities..."
          className="w-full py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition duration-300 ease-in-out "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-300"
          >
            <ImCancelCircle size={18} />
          </button>
        )}
      </div>

      {loading ? (
        <CommunityShimmer />
      ) : communities.length === 0 ? (
        <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-10 px-4 bg-gray-100 rounded-md dark:bg-zinc-900 dark:border-zinc-700 ">
          <img
            src={CommunityDataNotFoundImage}
            alt="No Events"
            className="mx-auto w-64 object-contain"
          />
          <p className="text-lg font-semibold dark:text-zinc-400">No Communities found!</p>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Try using a different search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {communities.map((community) => (
            <div key={community.id} className="dark:bg-zinc-900 bg-white rounded-lg p-5 flex lex-row items-start shadow-xs border border-gray-30f0 hover:shadow-lg transition-shadow duration-300 h-full">
              <div className=" border border-gray-300 h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4 flex-shrink-0 mt-1 ">
                <img
                  src={community.community_logo || DefaultCommunityIcon}
                  alt={community.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-row items-center justify-between gap-2">
                  <h3 className="font-semibold text-green-700 truncate max-w-full">
                    {community.name}
                  </h3>
                  <div
                    className={`border flex items-center px-2 py-1 rounded text-xs font-medium whitespace-nowrap self-start ${community.is_private
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-green-500 bg-green-50 text-green-600'
                      }`}
                  >
                    {community.is_private ? (
                      <>
                        <Lock className="mr-1 h-3 w-3" />
                        <span>Private</span>
                      </>
                    ) : (
                      <>
                        <Globe className="mr-1 h-3 w-3" />
                        <span>Public</span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 break-words line-clamp-3 overflow-hidden truncate ">
                  {community.description}
                </p>
                <div className="flex justify-between items-center ">
                  <span className="text-xs text-gray-500">
                    {community.members_count} members
                  </span>
                  <button
                    className="px-4 py-1.5 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition font-medium whitespace-nowrap"
                    onClick={() => handleOpenModal(community)} // Pass selected community to modal
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && selectedCommunity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 180, damping: 18 } }}
              exit={{ opacity: 0, scale: 0.85, y: 40, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-zinc-900 w-[90%] max-w-md rounded-lg shadow-xl overflow-hidden">

              {/* loader set up  */}
              {joinCommunityLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-80 z-20 flex justify-center items-center">
                  <div className="flex flex-col items-center">
                    <PulseLoader color="#16a34a" size={12} />
                    {selectedCommunity.is_private ?
                      <p className="mt-4 text-black font-medium">Requesting to join community...</p>
                      :
                      <p className="mt-4 text-black font-medium">Joining community...</p>}
                  </div>
                </div>
              )}
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-700 to-green-400 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Community Info</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-green-600 rounded-full p-1"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 text-gray-700 space-y-4 max-h-[450px] overflow-y-auto scrollbar-hide">

                <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaInfoCircle className="text-yellow-700" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        {selectedCommunity.is_private ? (
                          <>
                            This is a <span className="font-semibold">private community</span>. You can send a request to join, and once approved by the admin, you’ll be able to participate.
                          </>
                        ) : (
                          <>
                            This is a <span className="font-semibold">public community</span>. You can join instantly and start engaging with other members right away.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Community Image Centered */}
                <div className="flex justify-center">
                  <div className="w-28 h-28 rounded-full border-2 border-gray-400 hover:border-green-700 border-dashed flex items-center justify-center">
                    <img
                      src={selectedCommunity.community_logo || DefaultCommunityIcon}
                      alt={selectedCommunity.name}
                      className="h-24 w-24 object-cover rounded-full border-gray-300"
                    />
                  </div>
                </div>

                {/* Name and Description */}
                <p>
                  <span className="font-semibold">Community:</span> {selectedCommunity.name}
                </p>
                <p>
                  <span className="font-semibold">Description:</span> {selectedCommunity.description}
                </p>

                {/* Privacy Status */}
                <div
                  className={`border flex items-center px-2 py-1 rounded text-xs font-medium w-fit ${selectedCommunity.is_private
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-green-500 bg-green-50 text-green-600'
                    }`}
                >
                  {selectedCommunity.is_private ? (
                    <>
                      <Lock className="mr-1 h-3 w-3" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Globe className="mr-1 h-3 w-3" />
                      <span>Public</span>
                    </>
                  )}
                </div>

                {/* Members List */}
                <div>
                  {selectedCommunity.sample_members && selectedCommunity.sample_members.length > 0 && (
                    <>
                      <h3 className="font-semibold mb-2 text-gray-700">Members:</h3>
                      <div>
                        {selectedCommunity.sample_members.map((member) => (
                          <div key={member.id} className="flex items-center gap-3 border border-gray-300 rounded-md my-2.5 p-2">
                            <img
                              src={member.profile_picture || DeafaultUserImage}
                              alt={member.username}
                              className="w-10 h-10 rounded-full object-cover border ml-3"
                            />
                            <span className="text-gray-800 font-medium">{member.username}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-2.5 bg-gray-100 border-t">
                <div>
                  <button
                    onClick={handleJoinCommunity}
                    className={`px-4 py-2 rounded-md text-white font-medium transition ${selectedCommunity.is_private ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'
                      }`}
                  >
                    {selectedCommunity.is_private ? 'Request to Join' : 'Join Community'}
                  </button>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        hasPrev={!!prevPageUrl}
        hasNext={!!nextPageUrl}
      />
    </div>
  );
}

export default DiscoverCommunities;
