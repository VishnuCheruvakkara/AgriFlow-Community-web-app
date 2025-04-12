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
    fetchUsers(currentPage, filter, searchQuery);
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
    

    if (result.isConfirmed) {
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

      <div className="max-w-full  bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
          <h1 className="text-2xl font-bold">Farmers Management</h1>
        </div>

        {/* filter option  */}
        <div className="mt-4 px-4"> {/* Added px-4 for spacing on the sides */}
          <div className="flex bg-green-100 rounded-lg overflow-hidden shadow-md">
            <button
              className={`flex-1 py-3 text-center font-medium ${filter === "" ? "bg-green-600" : "bg-green-400"}
      text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
              onClick={() => handleFilterChange("")}>
              All
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${filter === "profile_not_updated" ? "bg-green-600" : "bg-green-400"}
      text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
              onClick={() => handleFilterChange("profile_not_updated")}>
              Profile Not Updated
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${filter === "aadhaar_not_verified" ? "bg-green-600" : "bg-green-400"}
      text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
              onClick={() => handleFilterChange("aadhaar_not_verified")}>
              Aadhaar Not Verified
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${filter === "active" ? "bg-green-600" : "bg-green-400"}
      text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
              onClick={() => handleFilterChange("active")}>
              Active
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${filter === "blocked" ? "bg-green-600" : "bg-green-400"}
      text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
              onClick={() => handleFilterChange("blocked")}>
              Blocked
            </button>
          </div>
        </div>
        {/* Filters */}


        <div className="mt-8 grid grid-cols-1  gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-100  shadow-lg">
            <h3 className="font-bold text-gray-700 mb-4">Available Farmers</h3>

            {/* Search Bar */}
            <div className="flex border-2 my-4 focus-within:border-green-500 items-center w-full bg-white rounded-lg shadow-sm p-3 transition duration-300 ease-in-out">
              <RiSearchLine className="text-gray-500 text-xl" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full outline-none px-2 text-gray-700"
              />
            </div>

            {/* Parent Container is Required for Ternary */}
            {loading ? (
              <div className="flex justify-center items-center py-28">
                <PulseLoader color="#16a34a" speedMultiplier={1} />
              </div>

            ) : users.length > 0 ? (
              <>


                {/* User Table */}
                <div className="overflow-x-auto">
                  <table className="w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                    {/* Table Header */}
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aadhar</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">View</th>
                      </tr>
                    </thead>

                    {/* Table Body (Conditional Rendering) */}
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user, index) => (
                        <tr
                          key={user.id}
                          className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                        >
                          {/* Numbering */}
                          <td className="px-4 py-4 text-sm text-gray-500">{index + 1 + (currentPage - 1) * pageSize}</td>

                          {/* User Image */}
                          <td className="px-4 py-4">
                            <div className="h-10 w-10 border rounded-full bg-gray-200 overflow-hidden">
                              <img
                                src={user.profile_picture || defaultUserImage}
                                alt="User"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>

                          {/* User Name */}
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>

                          {/* Location */}
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {user.address_details?.location_name || "N/A"}
                            <div className="text-sm text-gray-500">{user.address_details?.country || "Unknown"}</div>
                          </td>

                          {/*Active or Inactive status handling */}
                          <td className="px-4 py-4">
                            <span data-tip="Click here to change Status!"
                              className={`tooltip tooltip-top inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap cursor-pointer 
                              ${user.is_active ? "bg-green-100 text-green-800 px-2 py-2" : "bg-red-100 text-red-800 px-2 py-2"}`}
                              onClick={() => handleStatusToggle(user.id, user.is_active)}
                            >
                              {user.is_active ? (
                                <>
                                  <FaCheckCircle className="text-green-600 w-4 h-3" />Active
                                </>
                              ) : (
                                <>
                                  <FaTimesCircle className="text-red-600 w-4 h-3" /> Blocked
                                </>
                              )}
                            </span>
                          </td>

                          {/* Adhar Status */}

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap 
                              ${user.is_aadhar_verified ? "bg-green-100 text-green-800 px-2 py-2" : "bg-red-100 text-red-800 px-2 py-2"}`}
                            >
                              {user.is_aadhar_verified ? (
                                <>
                                  <FaCheckCircle className="text-green-600 w-4 h-3" /> Verified
                                </>
                              ) : (
                                <>
                                  <FaTimesCircle className="text-red-600 w-4 h-3" /> Not Verified
                                </>
                              )}
                            </span>
                          </td>


                          {/* View Button */}
                          <td className="px-4 py-4 text-center">
                            <Link to={`/admin/users-management/user-details/${user.id}`} className="text-blue-600 hover:text-blue-800 transition">
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
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-900 transition-colors duration-300"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-900 transition-colors duration-300"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div class="flex justify-center  w-full">
                <div class="bg-red-100 text-red-700 p-6 rounded-lg shadow-md text-center max-w-md border border-red-200 transform transition-all duration-300 ">
                  <svg class="w-12 h-12 mx-auto text-red-500 mb-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-xl font-bold mb-2">No Users Found</p>
                  <p class="text-sm text-red-600">Try adjusting your search or filter criteria.</p>
                  <button onClick={() => setSearchQuery("")} class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium">
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>



      </div >
    </>
  );
};

export default UsersPage;
