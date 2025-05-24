import React,{useState,useEffect} from 'react';
// Using the same icons you imported in your home page
import { FaEdit, FaMapMarkerAlt, FaUserFriends, FaStore, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { BsCalendarEvent } from 'react-icons/bs';
import { CgCommunity } from 'react-icons/cg';
import { GiWheat, GiFarmTractor } from 'react-icons/gi';
import defaultFarmerImage from '../../assets/images/farmer-wheat-icons.png';
import defaultUserImage from '../../assets/images/user-default.png';

import tomatoImage from '../../assets/images/tomato-1.jpg';
import defaultGroupImage from '../../assets/images/user-group-default.png';
import CustomScrollToTop from '../../components/CustomScrollBottomToTop/CustomScrollToTop';
//import default banner image 
import BannerImage from "../../assets/images/banner_default_user_profile.png"
//get the user data here from redux 
import { useSelector } from 'react-redux';


function UserProfileViewPage() {
    //select the user data from the redux state
    const user = useSelector((state) => state.user.user)
    // Dummy data for demonstration
    const isOwnProfile = true; // Toggle this for edit functionality visibility
    const profileData = {
        username: "Rajesh Kumar",
        role: "Organic Farmer",
        location: "Nashik, Maharashtra",
        bio: "Passionate organic farmer with 15 years of experience. Specializing in tomatoes, onions, and organic herbs. Always looking to connect with like-minded farmers.",
        memberSince: "March 2022",
        phone: "+91 98765 43210",
        email: "rajesh.kumar@agriflow.com",
        profilePicture: defaultUserImage,

        connections: 145,
        communities: 3,
        posts: 27,
        products: 8
    };

    return (
        <>
            {/* for scroll set up */}
            <CustomScrollToTop />

            <div className="lg:w-full space-y-4 mt-4 mb-11 ">
                {/* Cover Photo and Profile Summary */}
                <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Cover Photo */}
                    <div className="h-36 bg-green-100 overflow-hidden relative">
                        <img
                            src={BannerImage}
                            alt="Farm cover"
                            className="w-full h-full object-cover"
                        />
                        {isOwnProfile && (
                            <button className="absolute bottom-4 right-4 bg-white text-green-700 p-2 rounded-full shadow-md hover:bg-green-50">
                                <FaEdit className="text-xl" />
                            </button>
                        )}
                    </div>

                    {/* Profile Info Bar */}
                    <div className="flex flex-col md:flex-row px-4 py-4 relative">
                        {/* Profile Picture */}
                        <div className="absolute -top-16 left-4 md:left-8 h-32 w-32 rounded-full border-4 border-white shadow-lg shadow-gray-400 bg-white overflow-hidden">
                            <img
                                src={user?.profile_picture}
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                            {isOwnProfile && (
                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                                    <FaEdit className="text-green-700" />
                                </div>
                            )}
                        </div>

                        {/* Name and Basic Info */}
                        <div className="mt-16 md:ml-40 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{profileData.username}</h1>
                                    <p className="text-green-700 font-medium">{profileData.role}</p>
                                    <div className="flex items-center text-gray-600 mt-1">
                                        <FaMapMarkerAlt className="mr-1" />
                                        <span>{profileData.location}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 md:mt-0 flex space-x-3">
                                    {isOwnProfile ? (
                                        <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
                                            <FaEdit className="mr-2" /> Edit Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                                Connect
                                            </button>
                                            <button className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors">
                                                Message
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-4 flex flex-wrap gap-6">
                                <div className="flex items-center">
                                    <FaUserFriends className="text-green-600 mr-2" />
                                    <div>
                                        <p className="text-gray-900 font-bold">{profileData.connections}</p>
                                        <p className="text-xs text-gray-600">Connections</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <CgCommunity className="text-green-600 mr-2 text-xl" />
                                    <div>
                                        <p className="text-gray-900 font-bold">{profileData.communities}</p>
                                        <p className="text-xs text-gray-600">Communities</p>
                                    </div>
                                </div>
                                <div className="flex items-center">

                                    <div>
                                        <p className="text-gray-900 font-bold">{profileData.posts}</p>
                                        <p className="text-xs text-gray-600">Posts</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaStore className="text-green-600 mr-2" />
                                    <div>
                                        <p className="text-gray-900 font-bold">{profileData.products}</p>
                                        <p className="text-xs text-gray-600">Products</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content area with sidebar */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Left sidebar - About and Details */}
                    <div className="lg:w-1/3 space-y-4">
                        {/* About Section */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg text-gray-800">About</h2>
                                {isOwnProfile && (
                                    <button className="text-green-600 hover:text-green-700">
                                        <FaEdit />
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-700">{profileData.bio}</p>

                            {/* Contact Info */}
                            <div className="mt-6 space-y-3">
                                <h3 className="font-semibold text-gray-800">Contact Information</h3>
                                <div className="flex items-center text-gray-700">
                                    <FaPhone className="mr-2 text-green-600" />
                                    <span>{profileData.phone}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <FaEnvelope className="mr-2 text-green-600" />
                                    <span>{profileData.email}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <FaCalendarAlt className="mr-2 text-green-600" />
                                    <span>Member since {profileData.memberSince}</span>
                                </div>
                            </div>
                        </div>

                        {/* Expertise/Crops */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg text-gray-800">Expertise & Crops</h2>
                                {isOwnProfile && (
                                    <button className="text-green-600 hover:text-green-700">
                                        <FaEdit />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Organic Farming</span>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Tomatoes</span>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Onions</span>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Herbs</span>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Sustainable Practices</span>
                            </div>

                            {/* Farm Size & Type */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-gray-700">
                                    <div className="flex items-center">
                                        <GiFarmTractor className="mr-2 text-green-600 text-xl" />
                                        <span>Farm Size</span>
                                    </div>
                                    <span className="font-medium">5 Acres</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-700">
                                    <div className="flex items-center">
                                        <GiWheat className="mr-2 text-green-600 text-xl" />
                                        <span>Farm Type</span>
                                    </div>
                                    <span className="font-medium">Organic</span>
                                </div>
                            </div>
                        </div>

                        {/* Communities Section */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg text-gray-800">Communities</h2>
                                <span className="text-blue-500 text-sm cursor-pointer">See All</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                                        <img src={defaultGroupImage} alt="Community" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Organic Farmers Group</p>
                                        <p className="text-xs text-gray-500">324 members</p>
                                    </div>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                                        <img src={defaultGroupImage} alt="Community" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Maharashtra Farmers Alliance</p>
                                        <p className="text-xs text-gray-500">1,245 members</p>
                                    </div>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                                        <img src={defaultGroupImage} alt="Community" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Sustainable Agriculture</p>
                                        <p className="text-xs text-gray-500">512 members</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Center content - Posts and Activities */}
                    <div className="lg:w-2/3 space-y-4">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="flex border-b">
                                <button className="flex-1 py-3 px-4 font-medium text-green-700 border-b-2 border-green-600">
                                    Posts
                                </button>
                                <button className="flex-1 py-3 px-4 font-medium text-gray-600 hover:text-green-600">
                                    Products
                                </button>
                                <button className="flex-1 py-3 px-4 font-medium text-gray-600 hover:text-green-600">
                                    Photos
                                </button>
                                <button className="flex-1 py-3 px-4 font-medium text-gray-600 hover:text-green-600">
                                    Events
                                </button>
                            </div>
                        </div>

                        {/* Post 1 */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 border rounded-full bg-gray-200 overflow-hidden">
                                        <img src={profileData.profilePicture} alt="User profile" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-700">{profileData.username}</p>
                                        <p className="text-xs text-gray-500">Posted 3 days ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-800">Just harvested the first batch of organic tomatoes this season! The new irrigation system has really improved the yield. These will be available at the local farmers market this weekend. 🍅</p>
                            </div>
                            <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
                                <img src={tomatoImage} alt="Tomato harvest" className="w-full object-cover" />
                            </div>
                            <div className="flex justify-between text-gray-600 pb-3 border-b">
                                <span>42 likes</span>
                                <span>12 comments</span>
                            </div>
                            <div className="flex justify-around pt-3">
                                <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                    </svg>
                                    Like
                                </button>
                                <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                    </svg>
                                    Comment
                                </button>
                                <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                    </svg>
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Post 2 - Product Listing */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 border rounded-full bg-gray-200 overflow-hidden">
                                        <img src={profileData.profilePicture} alt="User profile" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-700">{profileData.username}</p>
                                        <p className="text-xs text-gray-500">Posted 1 week ago</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Card */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                                <div className="bg-green-50 p-2 text-green-700 font-medium flex items-center">
                                    <FaStore className="mr-2" /> Product for Sale
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800">Organic Tomatoes - Fresh Harvest</h3>
                                    <p className="text-green-700 font-bold mt-1">₹60/kg</p>
                                    <p className="text-gray-600 mt-2">Freshly harvested organic tomatoes. No pesticides used. Perfect for salads and cooking. Available for local pickup or delivery within 10km.</p>

                                    <div className="mt-4 flex justify-between">
                                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                            Contact Seller
                                        </button>
                                        <button className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between text-gray-600 pb-3 border-b">
                                <span>15 likes</span>
                                <span>3 comments</span>
                            </div>
                            <div className="flex justify-around pt-3">
                                <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                    </svg>
                                    Like
                                </button>
                                <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                    </svg>
                                    Comment
                                </button>
                                <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                    </svg>
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg text-gray-800">Upcoming Events</h2>
                                {isOwnProfile && (
                                    <button className="text-green-600 hover:text-green-700 flex items-center">
                                        <FaEdit className="mr-1" /> Add Event
                                    </button>
                                )}
                            </div>
                            <ul className="space-y-3">
                                <li className="border-l-4 border-green-500 pl-3 py-2 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-700">Organic Farming Workshop</p>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <BsCalendarEvent className="mr-1" />
                                            <span>May 15, 2025, 10:00 AM</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Hosting a workshop on organic pest control methods</p>
                                    </div>
                                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                        Details
                                    </button>
                                </li>
                                <li className="border-l-4 border-blue-500 pl-3 py-2 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-700">Nashik Farmers Market</p>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <BsCalendarEvent className="mr-1" />
                                            <span>May 22, 2025, 8:00 AM</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Participating in the weekly farmers market</p>
                                    </div>
                                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                        Details
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserProfileViewPage;