import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdPerson, MdEmail, MdPhone, MdAccessTime, MdUpdate, MdDelete, MdVerified, MdComment, MdThumbUp, MdImage, MdVideoLibrary } from 'react-icons/md';
import { FaCheckCircle, FaTimesCircle, FaPlay } from 'react-icons/fa';
import { ImCheckmark2 } from 'react-icons/im';
import { RiMessage3Fill } from 'react-icons/ri';
import { BiSolidLike } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import AdminAuthenticatedAxiosInstance from '../../axios-center/AdminAuthenticatedAxiosInstance';
import FormattedDateTime from '../../components/common-date-time/FormattedDateTime';
import AllPostCommentsPostDetailsPage from '../../components/admin-dash-board/AllPostCommentsPostDetailsPage';
import DefaultUserImage from "../../assets/images/user-default.png"
import DefaultPostImage from "../../assets/images/banner_default_user_profile.png"
import { showToast } from '../../components/toast-notification/CustomToast';
import { showConfirmationAlert } from '../../components/SweetAlert/showConfirmationAlert';


function PostDetailsPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSinglePostData = async () => {
        try {
            const response = await AdminAuthenticatedAxiosInstance.get(`/posts/admin/get-single-post-data/${postId}`)
            console.log("Arrived single post:", response.data)
            setPost(response.data);
        } catch (error) {
            console.error("Error fetching data :", error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSinglePostData();
    }, [postId])


    // toggle delete post status 
    const toggleDeleteStatus = async (postId, currentStatus) => {
        const newStatus = !currentStatus;
        const actionText = newStatus ? "mark as deleted" : "mark as available";

        // Show confirmation alert before proceeding
        const result = await showConfirmationAlert({
            title: `Confirm Action`,
            text: `Are you sure you want to ${actionText} this post?\n\n(Current status: ${currentStatus ? "Deleted" : "Available"})`,
            confirmButtonText: `Yes, ${newStatus ? "Delete" : "Make Available"}`,
        });
        if (result) {
            try {
                const response = await AdminAuthenticatedAxiosInstance.patch(
                    `/posts/admin/toggle-delete-status/${postId}/`,
                    { is_deleted: !currentStatus }
                );

                console.log("Delete Status updated", response.data);

                // Update local state immediately
                setPost((prev) => ({
                    ...prev,
                    is_deleted: !currentStatus,
                }));

                // Proper message depending on new status
                const newStatus = !currentStatus;
                const message = newStatus
                    ? "Post status marked as deleted."
                    : "Post status marked as available.";

                showToast(message, "success");
            } catch (error) {
                console.error("Failed to toggle delete status", error);
                showToast("Failed to update post status.", "error");
            }
        }
    };

    return (
        <div className="min-h-screen w-full mb-4">
            {/* Breadcrumb */}
            <div className="breadcrumbs text-sm">
                <ul>
                    <li>
                        <Link
                            to="/admin/post-management/"
                            className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                            Post Management
                        </Link>
                    </li>
                    <li>
                        <span className="text-gray-500 dark:text-zinc-400 cursor-default">
                            Post Details
                        </span>
                    </li>
                </ul>
            </div>

            {/* Main Container */}
            <div className="w-full mx-auto bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
                    <h1 className="text-xl font-bold">Post Details</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-300"
                        aria-label="Close"
                    >
                        <IoClose className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Media Section */}
                        <div className="lg:col-span-1">
                            <div className="space-y-3">
                                {/* Main Media Display */}
                                <div className="relative bg-gray-100 dark:bg-zinc-700 rounded-lg overflow-hidden shadow-md">
                                    {post?.image_url ? (
                                        <div className="relative cursor-pointer">
                                            <img
                                                src={post.image_url || DefaultPostImage}
                                                alt="Post media"
                                                className="w-full h-64 object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                                <MdImage className="w-3 h-3" />
                                                Image
                                            </div>
                                        </div>
                                    ) : post?.video_url ? (
                                        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-black">
                                            <video
                                                className="w-full h-full object-contain"
                                                controls
                                            >
                                                <source src={post.video_url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                                <MdVideoLibrary className="w-3 h-3" />
                                                Video
                                            </div>
                                        </div>

                                    ) : (
                                        <div className="flex items-center justify-center h-64 text-gray-500">
                                            No media available
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* Post Information */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {/* Basic Info */}
                                <div className="border-b border-gray-200 dark:border-zinc-600 pb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                                            Post Content
                                        </h2>

                                    </div>

                                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4 mb-4">
                                        <p className="text-gray-700 dark:text-zinc-200 leading-relaxed">
                                            {post?.content || "No content available."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className={`flex items-center justify-between p-3 border  ${post?.is_deleted ? "border-red-400" : "border-green-400"} rounded-lg`}>
                                            <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                                                Status:
                                            </span>
                                            {post?.is_deleted ? (
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
                                        </div>

                                        <div className="flex items-center justify-between p-3 border border-green-400 rounded-lg">
                                            <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                                                Visibility:
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-2">
                                                <FaCheckCircle className="text-green-600 dark:text-green-400 w-4 h-3" />
                                                Public
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Statistics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Engagement Stats */}
                                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                                        <div className="flex items-center p-3 border-b border-green-400">
                                            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                                                <BiSolidLike className="text-green-500 w-4 h-4" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                                                Engagement
                                            </h3>
                                        </div>
                                        <div className="p-3 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <MdThumbUp className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm text-gray-600 dark:text-zinc-300">Likes</span>
                                                </div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">{post?.likes_count || "0"}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <MdComment className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm text-gray-600 dark:text-zinc-300">Comments</span>
                                                </div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">{post?.comment_count || "0"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Author Information */}
                                    <div className="bg-zinc-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                                        <div className="flex items-center p-3 border-b border-green-400">
                                            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                                                <MdPerson className="text-green-600 dark:text-green-400 w-4 h-4" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                                                Author Information
                                            </h3>
                                        </div>

                                        <div className="p-3">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
                                                {/* Avatar and name */}
                                                <div className="flex items-center space-x-3 flex-shrink-0">
                                                    <img
                                                        src={
                                                            post?.author?.profile_picture ||
                                                            DefaultUserImage
                                                        }
                                                        alt={post?.author?.username || "Author"}
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                                    />
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200 truncate">
                                                            {post?.author?.username || "Unknown User"}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 dark:text-zinc-200 truncate">
                                                            User ID: #{post?.id || "N/A"}
                                                        </p>
                                                        <div className="flex items-center mt-1">
                                                            <MdVerified className="w-3 h-3 text-green-500 mr-1" />
                                                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                                Verified
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Contact info */}
                                                <div className="flex flex-col space-y-2 min-w-0">
                                                    <div className="flex items-center">
                                                        <MdEmail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                        <span className="text-xs text-gray-700 dark:text-zinc-300 break-all">
                                                            {/* You can replace this with a real email if you have it */}
                                                            {post?.author?.email || "Not provided"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MdPhone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                        <span className="text-xs text-gray-700 dark:text-zinc-300 break-all">
                                                            {/* You can replace this with a real phone if you have it */}
                                                            {post?.author?.phone_number || "Not provided"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>


                                </div>




                                {/* Recent Comments Section */}

                                <AllPostCommentsPostDetailsPage comments={post?.all_comments || []} />

                            </div>
                        </div>
                    </div>



                    {/* Action Buttons */}
                    <div className="mt-6 py-4 border-t border-gray-200 dark:border-zinc-600">
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            {/* Toggle Delete / Restore */}
                            {post?.is_deleted ? (
                                <button
                                    onClick={() => toggleDeleteStatus(post.id, post.is_deleted)}
                                    className="bg-green-500 hover:bg-green-600 rounded-full text-white p-1 flex items-center space-x-2 transition-colors duration-200 shadow-md"
                                >
                                    <div className="bg-green-100 rounded-full p-2">
                                        <ImCheckmark2 className="text-green-500 text-lg " />
                                    </div>
                                    <span className="text-sm pr-4 pl-2">Mark as Available</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => toggleDeleteStatus(post.id, post.is_deleted)}
                                    className="bg-red-500 hover:bg-red-600 rounded-full text-white p-1 flex items-center space-x-2 transition-colors duration-200 shadow-md"
                                >
                                    <div className="bg-red-100 rounded-full p-2">
                                        <MdDelete className="text-red-500 text-lg" />
                                    </div>
                                    <span className="text-sm pr-4 pl-2">Mark as Deleted</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer Timestamps */}
                    <div className="pt-4 border-t border-gray-200 dark:border-zinc-600">
                        <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 dark:text-zinc-100">
                            <div className="flex items-center mb-1 sm:mb-0">
                                <MdAccessTime className="w-4 h-4 mr-1" />
                                <span>
                                    <strong>Created:</strong> <FormattedDateTime date={post?.created_at} />
                                </span>
                            </div>
                            <div className="flex items-center">
                                <MdUpdate className="w-4 h-4 mr-1" />
                                <span>
                                    <strong>Last Updated:</strong> <FormattedDateTime date={post?.updated_at} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetailsPage;