import React from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { ImCancelCircle } from 'react-icons/im';
import { FaCheckCircle, FaTimesCircle, FaEye, FaUser, FaComments, FaLock, FaGlobe, FaTags, FaEdit, FaTrash, FaCrown, FaShieldAlt } from 'react-icons/fa';

function CommunityPage() {
  return (
    <div className="mb-4 max-w-full bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
        <h1 className="text-2xl font-bold">Community Management</h1>
      </div>

      {/* Filter Options */}
      <div className="my-4 mx-2 px-2">
        <div className="flex flex-col sm:flex-row bg-green-100 dark:bg-zinc-600 rounded-lg overflow-hidden shadow-md">
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-600 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            All Communities
          </button>
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-400 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            Public
          </button>
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-400 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            Private
          </button>
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-400 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            Deleted
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="pb-4 bg-white dark:bg-zinc-800 px-4 py-2 border-t border-zinc-300 dark:border-zinc-600 shadow-lg">
          <div className="flex justify-between items-center my-4">
            <h3 className="font-bold text-gray-700 dark:text-zinc-200">Community Management</h3>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300">
              + Add Community
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center border border-zinc-300 my-4 focus-within:border-green-500 dark:focus-within:border-green-500 dark:border-zinc-700 w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm px-3 py-2 transition duration-300 ease-in-out">
            <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />
            <input
              type="text"
              placeholder="Search Communities..."
              className="flex-1 outline-none px-2 py-1 text-gray-700 dark:text-zinc-200 bg-transparent placeholder-gray-500 dark:placeholder-zinc-400"
            />
            <button className="text-gray-500 hover:text-red-500 transition-colors duration-300">
              <ImCancelCircle size={18} />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-300 dark:border-zinc-600 rounded-lg">
            <table className="w-full bg-white dark:bg-zinc-800 shadow-md">
              <thead className="bg-gray-100 border-b dark:bg-zinc-900 dark:border-zinc-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Logo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Community</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Created By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Members</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Messages</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Privacy</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Created</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-600">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition">
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-zinc-300">1</td>
                  <td className="px-4 py-4">
                    <div className="h-12 w-12 border dark:border-zinc-500 rounded-md overflow-hidden bg-gray-200 dark:bg-zinc-600">
                      <img
                        src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
                        alt="Tech Innovators"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-zinc-100">
                    <div className="flex items-center gap-2">
                      <span>Tech Innovators</span>
                      <FaCrown className="text-yellow-500 w-3 h-3" title="Premium Community" />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">A community for technology enthusiasts and developers</div>
                    <div className="flex items-center gap-1 mt-1">
                      <FaTags className="text-green-500 w-3 h-3" />
                      <span className="text-xs text-gray-500 dark:text-zinc-400">Technology, Programming, Innovation</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-blue-500 w-3 h-3" title="Admin" />
                      <span>john_doe_tech</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">john@techworld.com</div>
                    <div className="text-xs text-green-600 dark:text-green-400">Community Creator</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                    <div className="flex items-center gap-1">
                      <FaUser className="text-blue-500 w-3 h-3" />
                      <span className="font-medium">1,245</span>
                    </div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">45 pending</div>
                    <div className="text-xs text-green-600 dark:text-green-400">1,200 approved</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                    <div className="flex items-center gap-1">
                      <FaComments className="text-green-500 w-3 h-3" />
                      <span className="font-medium">2,890</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">Today: 23</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1">
                      <FaGlobe className="text-green-600 dark:text-green-400 w-3 h-3" />
                      Public
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1">
                      <FaCheckCircle className="text-green-600 dark:text-green-400 w-3 h-3" />
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                    <div className="font-medium">Jan 15, 2024</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">6 months ago</div>
                  </td>
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition" title="View Details">
                        <FaEye size={16} />
                      </button>
                      <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition" title="Edit">
                        <FaEdit size={16} />
                      </button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition" title="Delete">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;