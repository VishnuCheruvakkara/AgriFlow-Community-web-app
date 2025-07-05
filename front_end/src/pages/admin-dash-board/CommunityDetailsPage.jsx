import React from 'react';
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
  MdApproval
} from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaTimesCircle, FaCrown, FaUsers, FaLock, FaGlobe } from "react-icons/fa";
import { RiMessage3Fill, RiHashtag } from "react-icons/ri";
import { ImCheckmark2 } from "react-icons/im";

const CommunityDetailsPage = () => {
  return (
    <div className="min-h-screen w-full mb-4">
      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <span className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 cursor-pointer">
              Community Management
            </span>
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
          <button className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-300" aria-label="Close">
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Community Logo Section */}
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {/* Main Logo */}
                <div className="relative bg-gray-100 dark:bg-zinc-700 rounded-lg overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop"
                    alt="Tech Innovators Hub"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                    Logo
                  </div>
                </div>

                {/* Community Stats */}
                <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4 shadow-sm border border-green-400">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200 mb-3">
                    Community Statistics
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-zinc-300">Total Members</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-zinc-300">Active Members</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">892</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-zinc-300">Pending Requests</span>
                      <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-zinc-300">Messages Today</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">156</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Information */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="border-b border-gray-200 dark:border-zinc-600 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
                    Tech Innovators Hub
                  </h2>
                  <p className="text-gray-600 dark:text-zinc-200 mb-3">
                    A vibrant community of technology enthusiasts, developers, and innovators sharing knowledge, collaborating on projects, and building the future together. Join us to connect with like-minded individuals and stay updated with the latest tech trends.
                  </p>

                  {/* Community Type & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center justify-between p-3 border border-green-400 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">Status:</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-2">
                        <FaCheckCircle className="text-green-600 dark:text-green-400 w-3 h-3" />
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-blue-400 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">Type:</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-2">
                        <FaGlobe className="text-blue-600 dark:text-blue-400 w-3 h-3" />
                        Public
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-purple-400 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">ID:</span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">#12847</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                      <RiHashtag className="w-3 h-3" />
                      Technology
                    </span>
                    <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                      <RiHashtag className="w-3 h-3" />
                      Innovation
                    </span>
                    <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs">
                      <RiHashtag className="w-3 h-3" />
                      Programming
                    </span>
                    <span className="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full text-xs">
                      <RiHashtag className="w-3 h-3" />
                      Startup
                    </span>
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
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">1,247</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-zinc-300">Admins</span>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-zinc-300">Active This Week</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">623</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-zinc-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '72%'}}></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">72% member engagement rate</p>
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
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-zinc-300">Messages This Week</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1,234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-zinc-300">Total Messages</span>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">45,678</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">
                        <strong>Last message:</strong> 5 minutes ago
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
                        <div className="flex items-center space-x-3 mb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-lg p-2 transition-colors">
                          <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                            alt="John Doe"
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          />
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                              John Doe
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-zinc-200">
                              Creator ID: #4521
                            </p>
                            <div className="flex items-center mt-1">
                              <MdVerified className="w-3 h-3 text-green-500 mr-1" />
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                Verified Creator
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <MdEmail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-xs text-gray-700 dark:text-zinc-300">
                            john.doe@example.com
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MdPhone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-xs text-gray-700 dark:text-zinc-300">
                            +91 9876543210
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MdLocationOn className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-xs text-gray-700 dark:text-zinc-300">
                            Bangalore, India
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Members */}
                <div className="bg-zinc-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                  <div className="flex items-center p-3 border-b border-green-400">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                      <MdPeople className="text-green-600 dark:text-green-400 w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                      Recent Members
                    </h3>
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-3 p-2 bg-white dark:bg-zinc-600 rounded-lg">
                        <img
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b5b4?w=40&h=40&fit=crop&crop=face"
                          alt="Sarah Wilson"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="text-xs font-semibold text-gray-800 dark:text-zinc-200">Sarah Wilson</h5>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">Joined 2 hours ago</p>
                        </div>
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">Active</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-white dark:bg-zinc-600 rounded-lg">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                          alt="Mike Johnson"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="text-xs font-semibold text-gray-800 dark:text-zinc-200">Mike Johnson</h5>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">Joined 1 day ago</p>
                        </div>
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">Pending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 py-4 border-t border-gray-200 dark:border-zinc-600">
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button className="bg-green-500 hover:bg-green-600 rounded-full text-white p-1 flex items-center space-x-2 transition-colors duration-200 shadow-md">
                <div className="bg-green-100 rounded-full p-2">
                  <MdApproval className="text-green-500 text-lg" />
                </div>
                <span className="text-sm pr-4 pl-2">Approve Pending Members</span>
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 rounded-full text-white p-1 flex items-center space-x-2 transition-colors duration-200 shadow-md">
                <div className="bg-blue-100 rounded-full p-2">
                  <RiMessage3Fill className="text-blue-500 text-lg" />
                </div>
                <span className="text-sm pr-4 pl-2">View Messages</span>
              </button>
              <button className="bg-red-500 hover:bg-red-600 rounded-full text-white p-1 flex items-center space-x-2 transition-colors duration-200 shadow-md">
                <div className="bg-red-100 rounded-full p-2">
                  <MdDelete className="text-red-500 text-lg" />
                </div>
                <span className="text-sm pr-4 pl-2">Delete Community</span>
              </button>
            </div>
          </div>

          {/* Footer Timestamps */}
          <div className="pt-4 border-t border-gray-200 dark:border-zinc-600">
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 dark:text-zinc-100">
              <div className="flex items-center mb-1 sm:mb-0">
                <MdAccessTime className="w-4 h-4 mr-1" />
                <span>
                  <strong>Created:</strong> March 15, 2023 at 10:30 AM
                </span>
              </div>
              <div className="flex items-center">
                <MdUpdate className="w-4 h-4 mr-1" />
                <span>
                  <strong>Last Updated:</strong> July 4, 2025 at 2:45 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailsPage;