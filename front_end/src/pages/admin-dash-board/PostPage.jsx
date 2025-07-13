import React, { useEffect, useState } from 'react';
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

function PostPage() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await AdminAuthenticatedAxiosInstance.get(`/posts/admin/get-all-post-admin-side/`)
        setPosts(response.data.data);
        console.log("Arrived posts data :", response.data.data)
      } catch (error) {
        console.error("Error fetching post : ", error);
      } finally {
        setLoading(false);
      }
    }
    getAllPosts();
  }, [])

  return (
    <div className="mb-4 max-w-full bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
        <h1 className="text-xl font-bold">Post Management</h1>
      </div>

      {/* Filter Options */}
      <div className="my-4 mx-2 px-2">
        <div className="flex flex-col sm:flex-row bg-green-100 dark:bg-zinc-600 rounded-lg overflow-hidden shadow-md">
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-600 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            All Posts
          </button>
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-400 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            Active
          </button>
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-400 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            Deleted
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="pb-4 bg-white dark:bg-zinc-800 px-4 py-2 border-t border-zinc-300 dark:border-zinc-600 shadow-lg">
          <div className="flex justify-between items-center my-4">
            <h3 className="font-bold text-gray-700 dark:text-zinc-200">Post Management</h3>

          </div>

          {/* Search Bar */}
          <div className="flex items-center border border-zinc-300 my-4 focus-within:border-green-500 dark:focus-within:border-green-500 dark:border-zinc-700 w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm px-3 py-2 transition duration-300 ease-in-out">
            <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />
            <input
              type="text"
              placeholder="Search Posts..."
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
                      {index + 1}
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
                        <FaComments className="text-purple-500 w-4 h-4" />
                        {post.comment_count ?? "0"}
                      </div>
                    </td>

                    {/* Active Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap px-2 py-1
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
                        <FormattedDateTime date={post.created_at}/>
                      </div>
                     
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                          title="View Details"
                        >
                          <FaEye size={22} />
                        </button>
                      </div>
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
