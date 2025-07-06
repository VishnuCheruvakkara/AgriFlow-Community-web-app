import React, { useEffect, useState, useCallback } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { ImCancelCircle } from 'react-icons/im';
import { PulseLoader } from 'react-spinners';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaUser,
  FaComments,
  FaLock,
  FaGlobe,
  FaTags,
  FaEdit,
  FaTrash,
  FaCrown,
  FaShieldAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminAuthenticatedAxiosInstance from '../../axios-center/AdminAuthenticatedAxiosInstance';
import NoCommunityFoundImage from "../../assets/images/no-community-imagef-found.png"
import AdminSidePagination from '../../components/Common-Pagination/AdminSidePagination';
import { debounce } from 'lodash';

function CommunityPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  //state for input search field
  const [inputValue, setInputValue] = useState("");

  //search set up 
  const [searchCommunity, setSearchCommunity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //filter status 
  const [filterStatus, setFilterStatus] = useState("");

  const handleFilterChange = (status) => {
    setCurrentPage(1);
    setFilterStatus(status);
  }


  const getCommunityData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AdminAuthenticatedAxiosInstance.get(`/community/admin/get-all-community/`, {
        params: {
          page: currentPage,
          search: searchCommunity.trim() !== "" ? searchCommunity : undefined,
          status: filterStatus || "",
        },
      });

      setCommunities(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5));
      console.log("Community data admin side:", response.data);
    } catch (error) {
      console.error("Get community error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchCommunity, filterStatus]);

  //Debounce for community search 
  const debouncedSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      setSearchCommunity(value);
    }, 300), []
  )

  useEffect(() => {
    getCommunityData();
  }, [getCommunityData])


  return (
    <div className="mb-4 max-w-full bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
        <h1 className="text-2xl font-bold">Community Management</h1>
      </div>

      {/* Filter Options */}
      <div className="my-4 mx-2 px-2">
        <div className="flex flex-col sm:flex-row bg-green-100 dark:bg-zinc-600 rounded-lg overflow-hidden shadow-md">

          <button className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "" ? "bg-green-600" : "bg-green-400"
            } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("")}>
            All Communities
          </button>

          <button className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "public" ? "bg-green-600" : "bg-green-400"
            } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("public")}>
            Public
          </button>

          <button className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "private" ? "bg-green-600" : "bg-green-400"
            } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("private")}>
            Private
          </button>

          <button className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "deleted" ? "bg-green-600" : "bg-green-400"
            } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("deleted")}>
            Deleted
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="pb-4 bg-white dark:bg-zinc-800 px-4 py-2 border-t border-zinc-300 dark:border-zinc-600 shadow-lg">

          <h3 className="font-bold text-gray-700 dark:text-zinc-200 mt-4 ">Community List</h3>


          {/* Search Bar */}
          <div className="flex items-center border border-zinc-300 my-4 focus-within:border-green-500 dark:focus-within:border-green-500 dark:border-zinc-700 w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm px-3 py-2 transition duration-300 ease-in-out">
            {/* Search Icon */}
            <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />

            {/* Input */}
            <input
              type="text"
              placeholder="Search Community..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="flex-1 outline-none px-2 py-1 text-gray-700 dark:text-zinc-200 bg-transparent placeholder-gray-500 dark:placeholder-zinc-400"
            />

            {/* Cancel Button */}
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue('');
                  debouncedSearch('');
                }}
                className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                aria-label="Clear search"
              >
                <ImCancelCircle size={18} />
              </button>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-28">
              <PulseLoader color="#16a34a" speedMultiplier={1} />
            </div>
          ) : communities.length > 0 ? (

            <div className="overflow-x-auto overflow-y-hidden border border-gray-300 dark:border-zinc-600 rounded-lg">
              <table className="w-full bg-white dark:bg-zinc-800 shadow-md">
                <thead className="bg-gray-100 border-b dark:bg-zinc-900 dark:border-zinc-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Logo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Community</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Created By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Members</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Privacy</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">View
                        
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-gray-200 dark:divide-zinc-600 ">
                  {communities.map((community, index) => (
                    <tr
                      key={community.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
                    >
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-zinc-300">
                        {(currentPage - 1) * 5 + index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-12 w-12 border dark:border-zinc-500 rounded-md overflow-hidden bg-gray-200 dark:bg-zinc-600">
                          <img
                            src={community.community_logo}
                            alt={community.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-zinc-100">
                        <div className="flex items-center gap-2">
                          <span>{community.name}</span>

                        </div>
                        <div className="text-xs text-gray-500 dark:text-zinc-400 truncate w-28">
                          {community.description}
                        </div>
                      </td>
                      <Link to={`/admin/users-management/user-details/${community.created_by_id}`} className="px-4 py-3 text-sm text-gray-700 dark:text-zinc-300">
                        <button
                          className="flex items-center gap-2   px-2 py-1 rounded transition"
                          title="View Creator Profile"
                        >
                          <img
                            src={community.created_by_profile_picture || "https://via.placeholder.com/40"}
                            alt={community.created_by_username}
                            className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-zinc-600 shrink-0"
                          />
                          <span className="font-medium hover:text-green-400">{community.created_by_username}</span>
                        </button>
                      </Link>

                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="flex items-center gap-1">
                          <FaUser className="text-green-500 w-3 h-3" />
                          <span className="font-medium">{community.members_count}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap ${community.is_private
                            ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            } px-2 py-2`}
                        >
                          {community.is_private ? (
                            <>
                              <FaLock className="w-3 h-3" />
                              Private
                            </>
                          ) : (
                            <>
                              <FaGlobe className="w-3 h-3" />
                              Public
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-zinc-300">
                        {community.is_deleted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-2">
                            <FaTimesCircle className="text-red-600 dark:text-red-400 w-4 h-3" />
                            Deleted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-2">
                            <FaCheckCircle className="text-green-600 dark:text-green-400 w-4 h-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/admin/community-management/community-details/${community.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                          >
                            <button>
                              <FaEye size={22} />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-10 px-4 bg-gray-100 rounded-md dark:bg-zinc-900 dark:border-zinc-700 mt-6">
              <img
                src={NoCommunityFoundImage}
                alt="No Community"
                className="mx-auto w-64 object-contain"
              />
              <p className="text-lg font-semibold dark:text-zinc-400">No Community Found</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Try adjusting your search or filter criteria.
              </p>

              <button
                    onClick={() => setSearchCommunity("")
                      
                }
                className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
              >
                Clear Filters
              </button>

            </div>
          )}
          {/* Pagination  */}
          <AdminSidePagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasPrev={currentPage > 1}
            hasNext={currentPage < totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />

        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
