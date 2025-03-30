import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AdminAuthenticatedAxiosInstance from "../../axios-center/AdminAuthenticatedAxiosInstance";
import defaultUserImage from '../../assets/images/user-default.png'
import { RiSearchLine } from "react-icons/ri";

const UsersPage = () => {

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [filter, setFilter] = useState(""); // Store selected filter
  const [searchQuery, setSearchQuery] = useState(""); // Store search input
  const pageSize = 5; // Number of users per page

  useEffect(() => {
    fetchUsers(currentPage, filter, searchQuery);
  }, [currentPage, filter, searchQuery]);

  const fetchUsers = async (page, filter, search) => {
    try {
      const response = await AdminAuthenticatedAxiosInstance.get(`/users/admin/get-all-users-data/`, {
        params: { page: page, page_size: pageSize, filter: filter || undefined, search: search || undefined }
      });

      setUsers(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      console.error("Error while fetching users:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  return (
    <>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-green-600">User Management</h2>

        {/* filter option  */}
        <div className="flex w-full bg-green-100 rounded-lg overflow-hidden shadow-md mt-4">
          <button
            className={`flex-1 py-3 text-center font-medium ${filter === "" ? "bg-green-600" : "bg-green-400"} text-white`}
            onClick={() => handleFilterChange("")}>
            All
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${filter === "profile_not_updated" ? "bg-green-600" : "bg-green-400"} text-white`}
            onClick={() => handleFilterChange("profile_not_updated")}>
            Profile Not Updated
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${filter === "aadhaar_not_verified" ? "bg-green-600" : "bg-green-400"} text-white`}
            onClick={() => handleFilterChange("aadhaar_not_verified")}>
            Aadhaar Not Verified
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1  gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-100  shadow-lg">
            <h3 className="font-bold text-gray-700 mb-4">Available Farmers</h3>

            {/* Search Bar */}
            <div className="flex border-2 my-4 focus-within:border-green-500 items-center w-full bg-white rounded-lg shadow-sm p-3">
              <RiSearchLine className="text-gray-500 text-xl" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full outline-none px-2 text-gray-700"
              />
            </div>


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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Active</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">View</th>
                  </tr>
                </thead>

                {/* Table Body */}
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

                      {/* Status (Verified / Not Verified) */}
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${user.is_verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                        >
                          {user.is_verified ? "Verified" : "Not Verified"}
                        </span>
                      </td>

                      {/* Active Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${user.is_active ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* View Button */}
                      <td className="px-4 py-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 transition">
                          <FaEye size={22} />
                        </button>
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
          </div>


        </div>
      </div>



      {/* Table for unverified users  */}
      <div className="p-6 bg-white rounded-lg shadow-sm mt-6">
        <h2 className="text-2xl font-bold text-green-600">Otp not verified users</h2>



        <div className="mt-8 grid grid-cols-1  gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">


              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                {/* Table Header */}
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Jane Cooper</div>
                        <div className="text-sm text-gray-500">jane.cooper@example.com</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Regional Paradigm Technician</div>
                      <div className="text-sm text-gray-500">Optimization</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">jane.cooper@example.com</td>
                    <td className="px-6  whitespace-nowrap text-md font-medium  gap-3">
                      <button className="text-blue-600 hover:text-blue-800 transition gap-56">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </div>



    </>
  );
};

export default UsersPage;
