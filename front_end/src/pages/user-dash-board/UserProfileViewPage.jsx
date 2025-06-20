import React, { useState, useEffect } from 'react';
// Using the same icons you imported in your home page
import { FaEdit, FaMapMarkerAlt, FaUserFriends, FaStore, FaEnvelope, FaPhone, FaUserCheck, FaExclamationTriangle, FaCalendarAlt, FaBullseye } from 'react-icons/fa';
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
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance"
import { GoFileMedia } from "react-icons/go";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LuMessageSquareText } from "react-icons/lu";
import UserProfileViewPageShimmer from '../../components/shimmer-ui-component/UserProfileViewPageShimmer';
import { showToast } from '../../components/toast-notification/CustomToast';
import { showInfoAlert } from '../../components/SweetAlert/showInfoAlert';

function UserProfileViewPage() {
    //useNavigate set up 
    const navigate = useNavigate();
    // Id from the previous page  while navigating
    const { userId } = useParams();
    //loading shimmer set up 
    const [loading, setLoading] = useState(false)

    //select the user data from the redux state
    const userData = useSelector((state) => state.user.user)

    //local state for store the user details to show in the respctive profile
    const [user, setUser] = useState({})
    // store the userId from redux store for further usage
    const loggedInUserId = userData?.id

    const goToChatPage = () => {
        navigate("/user-dash-board/farmer-single-chat/", {
            state: {
                receiverId: user?.id, // send the displayed user id to the next page 
                username: user.username,
                profile_picture: user.profile_picture,
            }
        })
    }

    //format the phone number 
    const formatPhoneNumber = (number) => {
        if (!number || number.length < 12) return number;
        const countryCode = '+' + number.slice(0, 2);
        const mainNumber = number.slice(2);
        return `${countryCode} ${mainNumber}`;
    };

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await AuthenticatedAxiosInstance.get(`/users/get-user-profile-data/${userId}/`);
            setUser(response.data);
            console.log("user data :: ", response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);


    // display shimmer UI while fetching the data 
    if (loading) {
        return <UserProfileViewPageShimmer />
    }

    // Send conenction request to the user form thire profile page 
    const handleConnect = async (receiverId, receiverUsername) => {
        try {
            const response = await AuthenticatedAxiosInstance.post('/connections/send-connection-request/', {
                receiver_id: receiverId,
            })

            showToast(`Connection request send to ${receiverUsername}.`, "success")
            // Refresh profile page 
            await fetchUserData();
        } catch (error) {
            console.error("Error sending connection request:", error);
            // Try to extract specific error message from response
            if (error.response && error.response.data && error.response.data.error) {
                // Show the error message returned from the backend
                showToast(error.response.data.error, "error");
            } else {
                // Fallback generic error
                showToast("Something went wrong while sending the connection request.", "error");
            }
        }
    };

    // show alert if connection request cancelled  
    const handleTryAgainClick = async () => {
        await showInfoAlert({
            title: "Connection Cancelled",
            text: "You have cancelled this request. A new request can be submitted after 3 days.",
            confirmButtonText: "Okay",
            cancelButtonText: null // Hides the cancel button
        });
    };

    const handlePendingClick = async (username) => {
        await showInfoAlert({
            title: "Pending Request",
            text: `You’ve already sent a connection request. Please wait until it is accepted or rejected by '${username}'.`,
            confirmButtonText: "Okay",
        });
    };




    return (
        <>
            {/* for scroll set up */}
            <CustomScrollToTop />

            <div className="lg:w-full space-y-4 mt-4 mb-11 ">
                {/* Cover Photo and Profile Summary */}
                <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
                    {/* Cover Photo */}
                    <div className="h-36 bg-green-100 dark:bg-green-900 overflow-hidden relative">
                        <img
                            src={BannerImage}
                            alt="Farm cover"
                            className="w-full h-full object-cover"
                        />
                        {userId == loggedInUserId &&
                            <button className="absolute  bottom-4 right-4 bg-white dark:bg-zinc-800 text-green-700 dark:text-green-400 p-2 rounded-full shadow-md hover:bg-green-50 dark:hover:bg-zinc-700 ">
                                <FaEdit className="text-xl" />
                            </button>
                        }
                    </div>

                    {/* Profile Info Bar */}
                    <div className="flex flex-col md:flex-row px-4 py-4 relative">
                        {/* Profile Picture */}
                        <div className="relative">
                            <div className="absolute -top-16 left-4 md:left-8 h-32 w-32 rounded-full border-4 border-white dark:border-zinc-900  bg-white dark:bg-zinc-900 overflow-hidden">
                                <img
                                    src={user?.profile_picture || defaultUserImage}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {userId == loggedInUserId &&
                                <div className="absolute dark:hover:bg-zinc-700 cursor-pointer top-[15px] md:left-[135px] left-[120px]  p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md ">
                                    <FaEdit className="text-green-700 dark:text-green-400" />
                                </div>
                            }
                        </div>

                        {/* Name and Basic Info */}
                        <div className="mt-16 md:ml-40 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-200">{user?.username || "no data"}</h1>
                                    <p className="text-green-700 dark:text-green-400 font-medium">{user?.farming_type || "no data"} farmer</p>
                                    <div className="flex items-center text-gray-600 dark:text-zinc-400 mt-1">
                                        <FaMapMarkerAlt className="mr-1" />
                                        <span>{user?.address?.full_location || "not data "}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {userId == loggedInUserId ? (
                                    <div className="mt-4 md:mt-0 flex space-x-3">
                                        <button className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center">
                                            <FaEdit className="mr-2" /> Edit Profile
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-4 md:mt-0 flex space-x-3">
                                        {user?.connection_status === 'connected' ? (
                                            <button onClick={goToChatPage} className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center">
                                                <LuMessageSquareText className="mr-2 text-xl" /> Message
                                            </button>
                                        ) : user?.connection_status === 'pending_sent' ? (
                                            <div onClick={() => handlePendingClick(user?.username)} className="inline-block">
                                                <button

                                                    className="bg-gray-400 text-white px-6 py-2 rounded-md flex items-center hover:bg-gray-500"
                                                >
                                                    <FaUserFriends className="mr-2 text-xl" /> Pending
                                                </button>
                                            </div>
                                        ) : user?.connection_status === 'pending_received' ? (
                                            <Link to="/user-dash-board/connection-management/pending-requests" classNmae="inline-block">
                                                <button className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center">
                                                    <FaUserCheck className="mr-2 text-xl" /> Accept
                                                </button>
                                            </Link>
                                        ) : user?.connection_status === 'can_reconnect' ? (
                                            <button onClick={() => handleConnect(userId, user?.username)} className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center">
                                                <FaUserFriends className="mr-2 text-xl" /> Connect
                                            </button>
                                        ) : user?.connection_status === 'wait_to_reconnect' ? (
                                            <div onClick={handleTryAgainClick} className="inline-block">
                                                <button
                                                    className="bg-gray-400 text-white px-6 py-2 rounded-md flex items-center hover:bg-gray-400"
                                                >
                                                    <FaUserFriends className="mr-2 text-xl" /> Connect
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleConnect(userId, user?.username)} className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center">
                                                <FaUserFriends className="mr-2 text-xl" /> Connect
                                            </button>
                                        )}
                                    </div>
                                )}

                            </div>


                            {/* Stats */}
                            <div className="mt-4 flex flex-wrap gap-6 ">
                                <div className="flex items-center p-2 rounded-md shadow-lg dark:shadow-black ">
                                    <div className=" rounded-full p-2 mr-2 shadow-md bg-green-100 dark:bg-green-900 dark:shadow-black
                                    ">
                                        <FaUserFriends className="text-green-600 dark:text-green-400 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 dark:text-green-400 font-bold">{user?.connection_count || "0"}</p>
                                        <p className="text-xs text-gray-600 dark:text-zinc-400">Connections</p>
                                    </div>

                                </div>
                                <div className="flex items-center p-2 rounded-md shadow-lg dark:shadow-black">
                                    <div className=" rounded-full p-2 mr-2 shadow-md bg-green-100 dark:bg-green-900 dark:shadow-black">
                                        <CgCommunity className="text-green-600 dark:text-green-400  text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 dark:text-green-400 font-bold">{user?.community_count || "0"}</p>
                                        <p className="text-xs text-gray-600 dark:text-zinc-400">Communities</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-2 rounded-md shadow-lg dark:shadow-black">
                                    <div className="flex items-center">
                                        <div className=" rounded-full p-2 mr-2 shadow-md bg-green-100 dark:bg-green-900 dark:shadow-black">
                                            <GoFileMedia className="text-green-600 dark:text-green-400 text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 dark:text-green-400 font-bold">27</p>
                                            <p className="text-xs text-gray-600 dark:text-zinc-400">Posts</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center p-2 rounded-md shadow-lg dark:shadow-black">
                                    <div className=" rounded-full p-2 mr-2 shadow-md  dark:shadow-black bg-green-100 dark:bg-green-900 ">
                                        <FaStore className="text-green-600 dark:text-green-400 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 dark:text-green-400 font-bold">8</p>
                                        <p className="text-xs text-gray-600 dark:text-zinc-400">Products</p>
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
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg text-gray-800 dark:text-zinc-200">About</h2>
                            </div>
                            <div className="break-words lg:max-w-96">
                                <p className="text-gray-700 dark:text-zinc-300">{user?.bio || "not data found"}</p>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-6 space-y-3">
                                <h3 className="font-semibold text-gray-800 dark:text-zinc-200">Contact Information</h3>
                                <div className="flex items-center text-gray-700 dark:text-zinc-300">
                                    <FaPhone className="mr-2 text-green-600 dark:text-green-400" />
                                    <span>{formatPhoneNumber(user?.phone_number) || "no data found"}</span>
                                </div>
                                <div className="flex items-center text-gray-700 dark:text-zinc-300">
                                    <FaEnvelope className="mr-2 text-green-600 dark:text-green-400" />
                                    <span>{user?.email || "no data found"}</span>
                                </div>

                            </div>
                        </div>

                        {/* Communities Section */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg text-gray-800 dark:text-zinc-200">Communities</h2>
                                <span className="text-blue-500 dark:text-blue-400 text-sm cursor-pointer">See All</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                                        <img src={defaultGroupImage} alt="Community" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-zinc-200">Organic Farmers Group</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400">324 members</p>
                                    </div>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                                        <img src={defaultGroupImage} alt="Community" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-zinc-200">Maharashtra Farmers Alliance</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400">1,245 members</p>
                                    </div>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                                        <img src={defaultGroupImage} alt="Community" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-zinc-200">Sustainable Agriculture</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400">512 members</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Center content - Posts and Activities */}
                    <div className="lg:w-2/3 space-y-4">
                        {/* Tab Navigation */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
                            <div className="flex border-b dark:border-zinc-700">
                                <button className="flex-1 py-3 px-4 font-medium text-green-700 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400">
                                    Posts
                                </button>
                                <button className="flex-1 py-3 px-4 font-medium text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400">
                                    Products
                                </button>
                                <button className="flex-1 py-3 px-4 font-medium text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400">
                                    Photos
                                </button>
                                <button className="flex-1 py-3 px-4 font-medium text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400">
                                    Events
                                </button>
                            </div>
                        </div>

                        {/* Post 1 */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 border rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                                        <img src={defaultUserImage} alt="User profile" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-700 dark:text-green-400">Rajesh Kumar</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400">Posted 3 days ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-800 dark:text-zinc-300">Just harvested the first batch of organic tomatoes this season! The new irrigation system has really improved the yield. These will be available at the local farmers market this weekend. 🍅</p>
                            </div>
                            <div className="mb-4 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                                <img src={tomatoImage} alt="Tomato harvest" className="w-full object-cover" />
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-zinc-400 pb-3 border-b dark:border-zinc-700">
                                <span>42 likes</span>
                                <span>12 comments</span>
                            </div>
                            <div className="flex justify-around pt-3">
                                <button className="flex items-center text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                    </svg>
                                    Like
                                </button>
                                <button className="flex items-center text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                    </svg>
                                    Comment
                                </button>
                                <button className="flex items-center text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                    </svg>
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Post 2 - Product Listing */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 border rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                                        <img src={defaultUserImage} alt="User profile" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-700 dark:text-green-400">Rajesh Kumar</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400">Posted 1 week ago</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Card */}
                            <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden mb-4">
                                <div className="bg-green-50 dark:bg-green-900 p-2 text-green-700 dark:text-green-300 font-medium flex items-center">
                                    <FaStore className="mr-2" /> Product for Sale
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-zinc-200">Organic Tomatoes - Fresh Harvest</h3>
                                    <p className="text-green-700 dark:text-green-400 font-bold mt-1">₹60/kg</p>
                                    <p className="text-gray-600 dark:text-zinc-400 mt-2">Freshly harvested organic tomatoes. No pesticides used. Perfect for salads and cooking. Available for local pickup or delivery within 10km.</p>

                                    <div className="mt-4 flex justify-between">
                                        <button className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors">
                                            Contact Seller
                                        </button>
                                        <button className="border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 px-4 py-2 rounded-md hover:bg-green-50 dark:hover:bg-green-900 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between text-gray-600 dark:text-zinc-400 pb-3 border-b dark:border-zinc-700">
                                <span>15 likes</span>
                                <span>3 comments</span>
                            </div>
                            <div className="flex justify-around pt-3">
                                <button className="flex items-center text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                    </svg>
                                    Like
                                </button>
                                <button className="flex items-center text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                    </svg>
                                    Comment
                                </button>
                                <button className="flex items-center text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                    </svg>
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg text-gray-800 dark:text-zinc-200">Upcoming Events</h2>
                                <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
                                    <FaEdit className="mr-1" /> Add Event
                                </button>
                            </div>
                            <ul className="space-y-3">
                                <li className="border-l-4 border-green-500 dark:border-green-400 pl-3 py-2 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-700 dark:text-zinc-300">Organic Farming Workshop</p>
                                        <div className="flex items-center text-sm text-gray-600 dark:text-zinc-400">
                                            <BsCalendarEvent className="mr-1" />
                                            <span>May 15, 2025, 10:00 AM</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">Hosting a workshop on organic pest control methods</p>
                                    </div>
                                    <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
                                        Details
                                    </button>
                                </li>
                                <li className="border-l-4 border-blue-500 dark:border-blue-400 pl-3 py-2 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-700 dark:text-zinc-300">Nashik Farmers Market</p>
                                        <div className="flex items-center text-sm text-gray-600 dark:text-zinc-400">
                                            <BsCalendarEvent className="mr-1" />
                                            <span>May 22, 2025, 8:00 AM</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">Participating in the weekly farmers market</p>
                                    </div>
                                    <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
                                        Details
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default UserProfileViewPage;