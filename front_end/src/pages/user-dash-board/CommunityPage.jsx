import React from 'react'
// Importing necessary icons from react-icons
import { FaSearch,FaGlobe,FaLock,FaChevronRight,FaCamera } from 'react-icons/fa';

function CommunityPage() {
    return (

        <>

            {/* Main container */}
            <div className="container mx-auto  py-4 max-w-full">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Communities</h1>
                    <p className="text-gray-600">Connect with fellow farmers, share knowledge, and grow together</p>

                    {/* Tab navigation */}
                    <div className="flex border-b mt-4">
                        <button
                            className="py-3 px-6 border-b-2 border-green-600 text-green-600 font-medium"
                        >
                            Discover Communities
                        </button>
                        <button
                            className="py-3 px-6 text-gray-600"
                        >
                            My Communities
                        </button>
                        <button
                            className="py-3 px-6 text-gray-600"
                        >
                            Create Community
                        </button>
                        <button
                            className="py-3 px-6 text-gray-600"
                        >
                            Pending Requests
                        </button>
                    </div>

                    {/* Discover Communities Content */}
                    <div className="mt-6">
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search communities..."
                                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Community Card 1 */}
                            <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                                <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                    <img src="https://via.placeholder.com/100" alt="Community" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <h3 className="font-semibold text-green-700">Organic Farmers Group</h3>
                                        <FaGlobe className="ml-2 text-gray-500 text-sm" />
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">A community for farmers practicing organic farming methods</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500">324 members</span>
                                        <button className="px-4 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition">
                                            Join
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Community Card 2 */}
                            <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                                <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                    <img src="https://via.placeholder.com/100" alt="Community" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <h3 className="font-semibold text-green-700">Sustainable Farming</h3>
                                        <FaGlobe className="ml-2 text-gray-500 text-sm" />
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Focused on sustainable agricultural practices and innovations</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500">512 members</span>
                                        <button className="px-4 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition">
                                            Join
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Community Card 3 */}
                            <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                                <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                    <img src="https://via.placeholder.com/100" alt="Community" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <h3 className="font-semibold text-green-700">Local Farmer Market</h3>
                                        <FaLock className="ml-2 text-gray-500 text-sm" />
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Connect with farmers selling produce directly to consumers</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500">189 members</span>
                                        <button className="px-4 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition">
                                            Request to Join
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button className="px-6 py-2 text-green-600 font-medium hover:text-green-700">
                                Load More Communities
                            </button>
                        </div>
                    </div>

                    {/* My Communities Content (Hidden by default) */}
                    <div className="mt-6 hidden">
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* My Community Card 1 */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-start">
                                    <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                        <img src="https://via.placeholder.com/100" alt="Community" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-green-700">Rice Farmers Association</h3>
                                        <div className="flex mt-1">
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                Admin
                                            </span>
                                            <span className="text-xs text-gray-500 px-2 py-1">
                                                156 members
                                            </span>
                                        </div>

                                        <div className="flex justify-between mt-4">
                                            <button className="text-green-600 text-sm font-medium flex items-center">
                                                View Community <FaChevronRight className="ml-1 text-xs" />
                                            </button>

                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                                5 pending requests
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-2">
                                    <button className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                        Manage Members
                                    </button>
                                    <button className="px-3 py-2 text-sm border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                                        Edit Community
                                    </button>
                                </div>
                            </div>

                            {/* My Community Card 2 */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-start">
                                    <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                        <img src="https://via.placeholder.com/100" alt="Community" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-green-700">Agricultural Innovation</h3>
                                        <div className="flex mt-1">
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                Member
                                            </span>
                                            <span className="text-xs text-gray-500 px-2 py-1">
                                                278 members
                                            </span>
                                        </div>

                                        <div className="flex justify-between mt-4">
                                            <button className="text-green-600 text-sm font-medium flex items-center">
                                                View Community <FaChevronRight className="ml-1 text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 border-t pt-4">
                                    <button className="px-3 py-2 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition w-full">
                                        Leave Community
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Create Community Content (Hidden by default) */}
                    <div className="mt-6 hidden">
                        <form className="space-y-6">
                            {/* Community cover preview */}
                            <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-gray-400">Community cover image</span>
                                </div>
                                <label className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md cursor-pointer">
                                    <FaCamera className="text-gray-600" />
                                    <input type="file" className="hidden" accept="image/*" />
                                </label>
                            </div>

                            {/* Basic information */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Community Name</label>
                                <input
                                    type="text"
                                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter your community name"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Description</label>
                                <textarea
                                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Describe what your community is about"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Community Location (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter location (village, district, state)"
                                />
                            </div>

                            {/* Privacy settings */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Privacy Settings</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border border-green-500 bg-green-50 rounded-lg p-4 cursor-pointer">
                                        <div className="flex items-center">
                                            <FaGlobe className="text-green-500 mr-2" />
                                            <h3 className="font-medium">Public Community</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">Anyone can see and join this community</p>
                                    </div>

                                    <div className="border border-gray-300 rounded-lg p-4 cursor-pointer">
                                        <div className="flex items-center">
                                            <FaLock className="text-gray-400 mr-2" />
                                            <h3 className="font-medium">Private Community</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">Admin approval required to join</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Tags</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="flex-1 py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Add relevant tags (e.g., organic, rice, livestock)"
                                    />
                                    <button
                                        type="button"
                                        className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full flex items-center">
                                        organic
                                        <button type="button" className="ml-2 text-green-600 hover:text-green-800">
                                            &times;
                                        </button>
                                    </span>
                                    <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full flex items-center">
                                        farming
                                        <button type="button" className="ml-2 text-green-600 hover:text-green-800">
                                            &times;
                                        </button>
                                    </span>
                                </div>
                            </div>

                            {/* Community rules */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Community Rules (Optional)</label>
                                <textarea
                                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Set guidelines for community members"
                                    rows="3"
                                ></textarea>
                            </div>

                            {/* Submit button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition"
                                >
                                    Create Community
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Pending Requests Content (Hidden by default) */}
                    <div className="mt-6 hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Communities You've Requested to Join</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Pending Request 1 */}
                            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                        <img src="https://via.placeholder.com/100" alt="Community" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-green-700">Corn Growers Network</h3>
                                        <p className="text-xs text-gray-500">
                                            Request sent on April 2, 2025
                                        </p>
                                    </div>
                                </div>
                                <button className="px-4 py-1 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-50 transition">
                                    Cancel Request
                                </button>
                            </div>

                            {/* Pending Request 2 */}
                            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                        <img src="https://via.placeholder.com/100" alt="Community" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-green-700">Irrigation Techniques</h3>
                                        <p className="text-xs text-gray-500">
                                            Request sent on April 5, 2025
                                        </p>
                                    </div>
                                </div>
                                <button className="px-4 py-1 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-50 transition">
                                    Cancel Request
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Member Requests for Your Communities</h2>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden mr-4">
                                            <img src="https://via.placeholder.com/100" alt="Community" className="h-full w-full object-cover" />
                                        </div>
                                        <h3 className="font-semibold text-green-700">Rice Farmers Association</h3>
                                    </div>
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">5 pending requests</span>
                                </div>

                                <div className="space-y-3">
                                    {/* Member Request 1 */}
                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                                <img src="https://via.placeholder.com/100" alt="User" className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Ravi Kumar</p>
                                                <p className="text-xs text-gray-500">Requested 2 days ago</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                                                Accept
                                            </button>
                                            <button className="px-3 py-1 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-50 transition">
                                                Decline
                                            </button>
                                        </div>
                                    </div>

                                    {/* Member Request 2 */}
                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                                <img src="https://via.placeholder.com/100" alt="User" className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Priya Sharma</p>
                                                <p className="text-xs text-gray-500">Requested 3 days ago</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                                                Accept
                                            </button>
                                            <button className="px-3 py-1 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-50 transition">
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
            </div>

        </>

    )
}

export default CommunityPage
