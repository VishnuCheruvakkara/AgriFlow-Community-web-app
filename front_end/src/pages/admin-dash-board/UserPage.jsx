import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AdminAuthenticatedAxiosInstance from "../../axios-center/AdminAuthenticatedAxiosInstance";
import defaultUserImage from '../../assets/images/user-default.png'
import { RiSearchLine } from "react-icons/ri";
// sweet alert import
import { showConfirmationAlert } from "../../components/SweetAlert/showConfirmationAlert";
import { showToast } from "../../components/toast-notification/CustomToast";
import { Link } from "react-router-dom";
import { PulseLoader } from 'react-spinners';
import Pagination from "../../components/Common-Pagination/UserSidePagination";
//debounce in search 
import debounce from "lodash/debounce";
import UsersNotFound from "../../assets/images/connection_no_search_found.png"
import { ImCancelCircle } from "react-icons/im";

const UsersPage = () => {

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [filter, setFilter] = useState(""); // Store selected filter
  const [searchQuery, setSearchQuery] = useState(""); // Store search input
  const pageSize = 5; // Number of users per page

  useEffect(() => {
    setLoading(true);

    // Debounced fetch function
    const debouncedFetch = debounce(() => {
      fetchUsers(currentPage, filter, searchQuery);
    }, 500); // 500ms debounce

    debouncedFetch();

    // cancel debounce if component unmounts or dependencies change
    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, filter, searchQuery]);

  const fetchUsers = async (page, filter, search) => {
    try {
      const response = await AdminAuthenticatedAxiosInstance.get(`/users/admin/get-all-users-data/`, {
        params: { page: page, page_size: pageSize, filter: filter || undefined, search: search.trim() || undefined }
      });

      setUsers(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      console.error("Error while fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setUsers([]);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };


  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const result = await showConfirmationAlert({
      title: "Modify User Status",
      text: "This action will update the user's status. Please confirm to proceed.",
      confirmButtonText: "Yes, change status",
    });


    if (result) {
      try {
        const response = await AdminAuthenticatedAxiosInstance.patch(`/users/change-status/${userId}/`, {
          is_active: newStatus,
        });

        if (response.status === 200) {
          // Update the user's status in the frontend after backend responds
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, is_active: newStatus } : user
            )
          );

          showToast("User status has been changed.", "success");
        } else {
          showToast("User status was not changed..", "error");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        showToast("Something went wrong.", "error");
      }
    }
  };

  return (
    <>

      <div className=" mb-4  max-w-full bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
          <h1 className="text-xl font-bold">Farmers Management</h1>
        </div>

        {/* filter option  */}
        <div className="my-4 mx-2 px-2"> {/* Added px-4 for spacing on the sides */}
          <div className="flex flex-col sm:flex-row bg-green-100 dark:bg-zinc-600 rounded-lg overflow-hidden shadow-md">
            <button
              className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filter === "" ? "bg-green-600" : "bg-green-400 "}
      text-white hover:bg-green-600  hover:brightness-110 transition duration-300 ease-in-out`}
              onClick={() => handleFilterChange("")}>
              All
            </button>
            <button
              className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filter === "profile_not_updated" ? "bg-green-600" : "bg-green-400 "}
      text-white hover:bg-green-600  hover:brightness-110 transition duration-300 ease-in-out`}
              onClick={() => handleFilterChange("profile_not_updated")}>
              <span className="hidden sm:inline">Profile Not Updated</span>
              <span className="sm:hidden">Profile Not Updated</span>
            </button>
            <button
              className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filter === "aadhaar_not_verified" ? "bg-green-600" : "bg-green-400 "}
      text-white hover:bg-green-600  hover:brightness-110 transition duration-300 ease-in-out`}
              onClick={() => handleFilterChange("aadhaar_not_verified")}>
              <span className="hidden sm:inline">Aadhaar Not Verified</span>
              <span className="sm:hidden">Aadhaar Not Verified</span>
            </button>
            <button
              className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filter === "active" ? "bg-green-600" : "bg-green-400 "}
      text-white hover:bg-green-600  hover:brightness-110 transition duration-300 ease-in-out`}
              onClick={() => handleFilterChange("active")}>
              Active
            </button>
            <button
              className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filter === "blocked" ? "bg-green-600" : "bg-green-400 "}
      text-white hover:bg-green-600  hover:brightness-110 transition duration-300 ease-in-out`}
              onClick={() => handleFilterChange("blocked")}>
              Blocked
            </button>
          </div>
        </div>


        {/* Filters */}
        <div className="grid grid-cols-1  gap-6 ">
          <div className="pb-4 bg-white dark:bg-zinc-800 px-4 py-2 border-t border-zinc-300  dark:border-zinc-600 shadow-lg">
            <h3 className="font-bold text-gray-700 dark:text-zinc-200 my-4">Available Farmers</h3>

            {/* Search Bar */}
            <div className="flex items-center border border-zinc-300 my-4 focus-within:border-green-500 dark:focus-within:border-green-500 dark:border-zinc-700 w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm px-3 py-2 transition duration-300 ease-in-out">
              {/* Search Icon */}
              <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />

              {/* Input */}
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="flex-1 outline-none px-2 py-1 text-gray-700 dark:text-zinc-200 bg-transparent placeholder-gray-500 dark:placeholder-zinc-400"
              />

              {/* Cancel Button */}
              {searchQuery && (
                <button
                  onClick={() => {
                    // Clear input and optionally reset results
                    handleSearch({ target: { value: "" } });
                  }}
                  className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                  aria-label="Clear search"
                >
                  <ImCancelCircle size={18} />
                </button>
              )}
            </div>


            {/* Parent Container is Required for Ternary */}
            {loading ? (
              <div className="flex justify-center items-center py-28">
                <PulseLoader color="#16a34a" speedMultiplier={1} />
              </div>

            ) : users.length > 0 ? (
              <>


                {/* User Table */}
                <div className="overflow-x-auto border border-gray-300 dark:border-zinc-600 rounded-lg">
                  <table className="w-full bg-white dark:bg-zinc-800 shadow-md">

                    {/* Table Header */}
                    <thead className="bg-gray-100 border-b dark:bg-zinc-900  dark:border-zinc-600">
                      <tr className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition dark:bg-zinc-900 border-gray-300 dark:border-zinc-600">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Aadhar</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">View</th>
                      </tr>
                    </thead>

                    {/* Table Body (Conditional Rendering) */}
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-600">

                      {users.map((user, index) => (
                        <tr
                          key={user.id}
                          className={`hover:bg-gray-50 dark:hover:bg-zinc-900 transition dark:bg-zinc-900" 
                            }`}
                        >
                          {/* Numbering */}
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-zinc-300">{index + 1 + (currentPage - 1) * pageSize}</td>

                          {/* User Image */}
                          <td className="px-4 py-4">
                            <div className="h-10 w-10 border dark:border-zinc-500 rounded-full bg-gray-200 dark:bg-zinc-600 overflow-hidden">
                              <img
                                src={user.profile_picture || defaultUserImage}
                                alt="User"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>

                          {/* User Name */}
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-zinc-100">{user.username}</div>
                            <div className="text-sm text-gray-500 dark:text-zinc-400">{user.email}</div>
                          </td>

                          {/* Location */}
                          <td className="px-4 py-4 text-sm text-gray-900 dark:text-zinc-100">
                            {user.address_details?.location_name || "N/A"}
                            <div className="text-sm text-gray-500 dark:text-zinc-400">{user.address_details?.country || "Unknown"}</div>
                          </td>

                          {/*Active or Inactive status handling */}
                          <td className="px-4 py-4">
                            <span data-tip="Click here to change Status!"
                              className={`tooltip tooltip-top inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap cursor-pointer 
                              ${user.is_active ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-2" : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-2"}`}
                              onClick={() => handleStatusToggle(user.id, user.is_active)}
                            >
                              {user.is_active ? (
                                <>
                                  <FaCheckCircle className="text-green-600 dark:text-green-400 w-4 h-3" />Active
                                </>
                              ) : (
                                <>
                                  <FaTimesCircle className="text-red-600 dark:text-red-400 w-4 h-3" /> Blocked
                                </>
                              )}
                            </span>
                          </td>

                          {/* Adhar Status */}

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap 
                              ${user.is_aadhar_verified ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-2" : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-2"}`}
                            >
                              {user.is_aadhar_verified ? (
                                <>
                                  <FaCheckCircle className="text-green-600 dark:text-green-400 w-4 h-3" /> Verified
                                </>
                              ) : (
                                <>
                                  <FaTimesCircle className="text-red-600 dark:text-red-400 w-4 h-3" /> Not Verified
                                </>
                              )}
                            </span>
                          </td>


                          {/* View Button */}
                          <td className="px-4 py-4 text-center">
                            <Link to={`/admin/users-management/user-details/${user.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition">
                              <button>
                                <FaEye size={22} />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  hasPrev={currentPage > 1}
                  hasNext={currentPage < totalPages}
                />
              </>
            ) : (

              <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-10 px-4 bg-gray-100 rounded-md dark:bg-zinc-900 dark:border-zinc-700">
                <img
                  src={UsersNotFound}
                  alt="No Events"
                  className="mx-auto w-64 object-contain"
                />
                <p className="text-lg font-semibold dark:text-zinc-400">No Users Found</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Try adjusting your search or filter criteria.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>


            )}
          </div>
        </div>



      </div >
    </>
  );
};

export default UsersPage;
