import React, { useEffect, useState, useCallback } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { ImCancelCircle } from 'react-icons/im';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaUser,
  FaComments,
  FaThumbsUp,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import AdminAuthenticatedAxiosInstance from '../../axios-center/AdminAuthenticatedAxiosInstance';
import { Link } from "react-router-dom"
import FormattedDateTime from '../../components/common-date-time/FormattedDateTime';
import { debounce } from "lodash";
import { PulseLoader } from 'react-spinners';
import AdminSidePagination from "../../components/Common-Pagination/AdminSidePagination";
import NoPostFound from "../../assets/images/no-product-user-profile.png"
import Select from "react-select";


function PostPage() {
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState("");

  // search set up  
  const [searchPost, setSearchPost] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //filter status 
  const [filterStatus, setFilterStatus] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleFilterChange = (status) => {
    setCurrentPage(1);
    setFilterStatus(status);
  };

  // filter video and image 

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "image", label: "Image Posts" },
    { value: "video", label: "Video Posts" },
  ];

  const getAllPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AdminAuthenticatedAxiosInstance.get(`/posts/admin/get-all-post-admin-side/`, {
        params: {
          page: currentPage,
          search: searchPost.trim() !== "" ? searchPost : undefined,
          status: filterStatus || "",
          type: typeFilter !== "all" ? typeFilter : undefined,
        },
      })
      setPosts(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5));
    } catch (error) {
      // console.error("Error fetching post : ", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchPost, filterStatus,typeFilter])

  // Debounce for search 
  const debouncedSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      setSearchPost(value);
    }, 300),
    [])

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);



  return (
    <div className="mb-4 max-w-full bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
        <h1 className="text-xl font-bold">Post Management</h1>
      </div>

      {/* Filter Options */}
      <div className="my-4 mx-2 px-2">
        <div className="flex flex-col sm:flex-row bg-green-100 dark:bg-zinc-600 rounded-lg overflow-hidden shadow-md">

          <button
            className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "" ? "bg-green-600" : "bg-green-400"
              } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("")}
          >
            All Posts
          </button>


          <button
            className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "active" ? "bg-green-600" : "bg-green-400"
              } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("active")}
          >
            Active
          </button>


          <button
            className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "deleted" ? "bg-green-600" : "bg-green-400"
              } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("deleted")}
          >
            Deleted
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="pb-4 bg-white dark:bg-zinc-800 px-4 py-2 border-t border-zinc-300 dark:border-zinc-600 shadow-lg">
          <div className="flex justify-between items-center my-4">
            <h3 className="font-bold text-gray-700 dark:text-zinc-200">Post Management</h3>

          </div>

          <div className="flex flex-col md:flex-row md:items-center w-full gap-3 mb-4">
            {/* Search Input */}
            <div className="flex items-center border border-zinc-300 focus-within:border-green-500 dark:focus-within:border-green-500 dark:border-zinc-700 w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm px-3 py-2 transition duration-300 ease-in-out">
              <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />

              <input
                type="text"
                placeholder="Search Posts..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="flex-1 outline-none px-2 py-1 text-gray-700 dark:text-zinc-200 bg-transparent placeholder-gray-500 dark:placeholder-zinc-400"
              />

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

            {/* Post Type Filter */}
            <div className="w-full md:w-60">
              <Select
                value={typeOptions.find((o) => o.value === typeFilter)}
                onChange={(selected) => {
                  setCurrentPage(1);
                  setTypeFilter(selected.value);
                }}
                options={typeOptions}
                isSearchable={false}
                classNamePrefix="react-select"
                placeholder="Filter by Type"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "48px",
                  }),
                }}
              />
            </div>
          </div>



          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-28">
              <PulseLoader color="#16a34a" speedMultiplier={1} />
            </div>
          ) : posts.length > 0 ? (
            <div className="overflow-x-auto border border-gray-300 dark:border-zinc-600 rounded-lg">
              <table className="w-full bg-white dark:bg-zinc-800 shadow-md">
                <thead className="bg-gray-100 border-b dark:bg-zinc-900 dark:border-zinc-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase w-56 min-w-[14rem]">Author</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Content</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Media</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Likes</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Comments</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Created</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-600">
                  {/* Sample Row */}


                  {posts.map((post, index) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition">
                      {/* Row number */}
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-zinc-300">
                        {(currentPage - 1) * 5 + index + 1}
                      </td>

                      {/* Author info */}
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-zinc-100">
                        <Link
                          to={`/admin/users-management/user-details/${post.author.id}`}
                          className="flex items-center gap-2"
                        >
                          <img
                            src={post.author.profile_picture}
                            alt={post.author.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="text-xs text-gray-500 dark:text-zinc-400">
                            {post.author.username}
                          </div>
                        </Link>
                      </td>

                      {/* Post Content */}
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300 max-w-xs truncate">
                        {post.content || "--------"}
                      </td>

                      {/* Media */}
                      <td className="px-4 py-4">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt="Post Image"
                            className="h-10 w-10 rounded-md object-cover border dark:border-zinc-500"
                          />
                        ) : post.video_url ? (
                          <video
                            src={post.video_url}
                            className="h-10 w-10 rounded-md object-cover border dark:border-zinc-500"
                            muted
                            playsInline
                            preload="metadata"
                            controls={false}
                            onMouseOver={(e) => e.target.play()}
                            onMouseOut={(e) => e.target.pause()}
                          />
                        ) : (
                          <span className="text-xs text-gray-500 italic">No Media</span>
                        )}
                      </td>

                      {/* Like Count */}
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="flex items-center gap-1">
                          <FaThumbsUp className="text-green-500 w-4 h-4" />
                          {post.like_count ?? "0"}
                        </div>
                      </td>

                      {/* Comment Count */}
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="flex items-center gap-1">
                          <FaComments className="text-green-500 w-4 h-4" />
                          {post.comment_count ?? "0"}
                        </div>
                      </td>

                      {/* Active Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap px-2 py-2
        ${post.is_deleted
                              ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                              : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            }`}
                        >
                          <FaCheckCircle
                            className={`w-3 h-3 ${post.is_deleted
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                              }`}
                          />
                          {post.is_deleted ? "Deleted" : "Active"}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="font-medium">
                          <FormattedDateTime date={post.created_at} />
                        </div>

                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <Link 
                            to={`/admin/post-management/post-details/${post.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                            title="View Details"
                          >
                            <FaEye size={22} />
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
                src={NoPostFound}
                alt="No Products"
                className="mx-auto w-64 object-contain"
              />
              <p className="text-lg font-semibold dark:text-zinc-400">No Posts Found</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Try adjusting your search or filter criteria.
              </p>

              <button
                onClick={() => {
                  setSearchPost("");
                  setInputValue("");

                }}
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

export default PostPage;
