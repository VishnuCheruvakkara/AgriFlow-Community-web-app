import React, { useEffect, useState } from 'react';
import {
  MdPeople,
  MdVerified,
  MdAccessTime,
  MdUpdate,
  MdLocationOn,
  MdPerson,
  MdEmail,
  MdPhone,
  MdDelete,
  MdBlock,
  MdApproval,
} from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaTimesCircle, FaCrown, FaUsers, FaLock, FaGlobe } from "react-icons/fa";
import { RiMessage3Fill, RiHashtag } from "react-icons/ri";
import { ImCheckmark2 } from "react-icons/im";
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import DefaultUserImage from "../../assets/images/user-default.png";
import AdminAuthenticatedAxiosInstance from "../../axios-center/AdminAuthenticatedAxiosInstance";
import { PulseLoader } from 'react-spinners';
import { showConfirmationAlert } from '../../components/SweetAlert/showConfirmationAlert';
import { showToast } from '../../components/toast-notification/CustomToast';
import FormattedDateTime from '../../components/common-date-time/FormattedDateTime';
import MembersSection from '../../components/admin-dash-board/CommunityMembersSection';

const CommunityDetailsPage = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCommunity = async () => {
      try {
        const response = await AdminAuthenticatedAxiosInstance.get(`/community/admin/get-community-details/${communityId}`);
        setCommunity(response.data);
        console.log("Community data ::", response.data)
      } catch (error) {
        console.error("Error fetching community:", error);
      } finally {
        setLoading(false);
      }
    };
    getCommunity();
  }, []);


  // toggle delete comunity status 
  const toggleDeleteStatus = async (communityId, currentStatus) => {
    const newStatus = !currentStatus;
    const actionText = newStatus ? "mark as deleted" : "mark as active";

    // Show confirmation alert before proceeding
    const result = await showConfirmationAlert({
      title: `Confirm Action`,
      text: `Are you sure you want to ${actionText} this community?\n\n(Current status: ${currentStatus ? "Deleted" : "Available"})`,
      confirmButtonText: `Yes, ${newStatus ? "Delete" : "Make as Active"}`,
    });
    if (result) {
      try {
        const response = await AdminAuthenticatedAxiosInstance.patch(
          `/community/admin/toggle-delete-status/${communityId}/`,
          { is_deleted: !currentStatus }
        );

        // console.log("Delete Status updated", response.data);

        // Update local state immediately
        setCommunity((prev) => ({
          ...prev,
          is_deleted: !currentStatus,
        }));

        // Proper message depending on new status
        const newStatus = !currentStatus;
        const message = newStatus
          ? "Community status marked as deleted."
          : "Community status marked as active.";

        showToast(message, "success");
      } catch (error) {
        // console.error("Failed to toggle delete status", error);
        showToast("Failed to update community status.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen w-full mb-4">
      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link to="/admin/community-management/" className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 cursor-pointer">
              Community Management
            </Link>
          </li>
          <li>
            <span className="text-gray-500 dark:text-zinc-400 cursor-default">
              Community Details
            </span>
          </li>
        </ul>
      </div>

      {/* Main Container */}
      <div className="w-full mx-auto bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
          <h1 className="text-xl font-bold">Community Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-300"
            aria-label="Close"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>


        {loading ? (
          <div className="flex flex-col items-center justify-center h-[510px] space-y-3">
            <PulseLoader color="#16a34a" speedMultiplier={1} />
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Loading Community details...
            </p>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Community Logo Section */}
              <div className="lg:col-span-1">
                <div className="space-y-3">
                  {/* Main Logo */}
                  <div className="relative bg-gray-100 dark:bg-zinc-700 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={community?.community_logo}
                      alt={community?.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                      Logo
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Information */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="border-b border-gray-200 dark:border-zinc-600 ">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
                      {community?.name}
                    </h2>
                    <p className="text-gray-600 dark:text-zinc-200 mb-3">
                      {community?.description}
                    </p>

                    {/* Community Type & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">


                      <div
                        className={`flex items-center justify-between p-3 rounded-lg ${community.is_deleted ? "border-red-400" : "border-green-400"
                          } border`}
                      >
                        <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">Status:</span>

                        {community?.is_deleted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-2">
                            <FaTimesCircle className="text-red-600 dark:text-red-400 w-3 h-3" />
                            Deleted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-2">
                            <FaCheckCircle className="text-green-600 dark:text-green-400 w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>


                      <div
                        className={`flex items-center justify-between p-3 rounded-lg ${community.is_private ? "border-red-400" : "border-green-400"
                          } border`}
                      >
                        <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">Privacy:</span>

                        {community.is_private ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-2">
                            <FaLock className="text-red-600 dark:text-red-400 w-3 h-3" />
                            Private
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-2">
                            <FaGlobe className="text-green-600 dark:text-green-400 w-3 h-3" />
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Community Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Members Overview */}
                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                      <div className="flex items-center p-3 border-b border-green-400">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                          <FaUsers className="text-green-500 w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                          Membership Overview
                        </h3>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-zinc-300">Total Members</span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">{community.total_members}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-zinc-300">Community Admins</span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">{community.total_admins}</span>
                        </div>
                      </div>
                    </div>

                    {/* Activity Overview */}
                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                      <div className="flex items-center p-3 border-b border-green-400">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                          <RiMessage3Fill className="text-green-600 dark:text-green-400 w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                          Activity Overview
                        </h3>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-zinc-300">Messages Today</span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">{community.message_stats?.today}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-zinc-300">Messages This Week</span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">{community.message_stats?.week}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-zinc-300">Total Messages</span>
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{community.message_stats?.total}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                          <strong>Last message :</strong>{" "}
                          <FormattedDateTime date={community.message_stats.last_message} />
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Creator Information */}
                  <div className="bg-zinc-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                    <div className="flex items-center p-3 border-b border-green-400">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                        <FaCrown className="text-green-600 dark:text-green-400 w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                        Community Creator
                      </h3>
                    </div>
                    <div className="p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Link to={`/admin/users-management/user-details/${community.creator?.id}`}  className="flex items-center space-x-3  cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-lg p-2 transition-colors ">
                            <img
                              src={community.creator?.profile_image || DefaultUserImage}
                              alt={community.creator?.username}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md shrink-0"
                            />
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                                {community.creator?.username}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-zinc-200">
                                Creator ID: #{community.creator?.id}
                              </p>
                              {community.creator?.is_verified && (
                                <div className="flex items-center mt-1">
                                  <MdVerified className="w-3 h-3 text-green-500 mr-1" />
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    Verified Creator
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                        <div className="space-y-3  p-3">
                          <div className="flex items-center">
                            <MdEmail className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-xs text-gray-700 dark:text-zinc-300">
                              {community.creator?.email}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MdPhone className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-xs text-gray-700 dark:text-zinc-300">
                              {community.creator?.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Members */}
                  <MembersSection members={community.members} />

                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 py-4 border-t border-gray-200 dark:border-zinc-600">
              <div className="flex flex-col sm:flex-row justify-center gap-3">

                {/* Toggle Delete / Restore */}
                {community?.is_deleted ? (
                  <button
                    onClick={() => toggleDeleteStatus(community.id, community?.is_deleted)}
                    className="bg-green-500 hover:bg-green-600 rounded-full text-white p-1 flex items-center space-x-2 transition-colors duration-200 shadow-md"
                  >
                    <div className="bg-green-100 rounded-full p-2">
                      <ImCheckmark2 className="text-green-500 text-lg " />
                    </div>
                    <span className="text-sm pr-4 pl-2">Mark as Active</span>
                  </button>
                ) : (
                  <button
                    onClick={() => toggleDeleteStatus(community.id, community.is_deleted)}
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
                    <strong>Created:</strong> <FormattedDateTime date={community.created_at} />
                  </span>
                </div>
                <div className="flex items-center">
                  <MdUpdate className="w-4 h-4 mr-1" />
                  <span>
                    <strong>Last Updated:</strong> <FormattedDateTime date={community.updated_at} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetailsPage;
