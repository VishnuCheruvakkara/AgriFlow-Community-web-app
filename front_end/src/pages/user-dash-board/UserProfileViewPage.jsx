import React, { useState, useEffect, useRef } from 'react';
// Using the same icons you imported in your home page
import { FaEdit, FaMapMarkerAlt, FaUserFriends, FaStore, FaEnvelope, FaPhone, FaUserCheck, FaExclamationTriangle, FaCalendarAlt, FaBullseye, FaRegHeart, FaHeart, FaRegComment, FaPaperPlane } from 'react-icons/fa';
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
import PostShimmer from '../../components/shimmer-ui-component/PostShimmer';

import ShareButton from '../../components/post-creation/ShareButton';
import { AnimatePresence, motion } from 'framer-motion';
import PostNotFoundImage from "../../assets/images/no-product-user-profile.png"
import { Search } from 'lucide-react';
import { ImCancelCircle } from 'react-icons/im';
import { AiFillDelete } from "react-icons/ai";
import { showConfirmationAlert } from '../../components/SweetAlert/showConfirmationAlert';
import EditPostModalButton from '../../components/post-creation/EditPostModalButton';
import EditProfilePictureModal from '../../components/user-dash-board/EditProfilePictureModal';
import ShowEventBannerModal from '../../components/event-management-user-side/ShowEventBannerModal';
import EditBannerImageModal from '../../components/user-dash-board/EditBannerImageModal';
import EditProfileModal from '../../components/user-dash-board/EditProfileModal';

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
    //check if the logged-in user is viewing their own profile
    const isOwnProfile = loggedInUserId === userId;


    //handle post
    //state for store the post from backend
    const [posts, setPosts] = useState([]);
    //inifine scroll set up 
    const [infiniteScrollLoading, setInfiniteScrollLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    //search a post 
    const [searchQuery, setSearchQuery] = useState("");
    //filter option for the image and videos 
    const [filterType, setFilterType] = useState('all');


    // for post like tracking and animation 
    const [likedPosts, setLikedPosts] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [heartAnimations, setHeartAnimations] = useState({});

    // comment handling state 
    const [commentInputs, setCommentInputs] = useState({});
    const [commentSectionsVisible, setCommentSectionsVisible] = useState({});
    const [commentsByPost, setCommentsByPost] = useState({});

    //for infinite scroll
    const observer = useRef();


    // state fpr show image in zoom mode 
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");

    //open modal when click on image 
    const handleProfileImageClick = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setIsImageModalOpen(true);
    };




    const lastPostRef = (node) => {
        if (infiniteScrollLoading || !hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    };

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

    // fetch post conditionally based on the current users id 
    const fetchPosts = async () => {
        setInfiniteScrollLoading(true);

        try {
            let url = `/posts/user-posts/?page=${page}`;

            if (!isOwnProfile) {
                url += `&user_id=${userId}`;
            }

            if (searchQuery.trim() !== "") {
                url += `&search=${encodeURIComponent(searchQuery.trim())}`;
            }

            if (filterType === 'image') {
                url += `&filter=image`;
            } else if (filterType === 'video') {
                url += `&filter=video`;
            }

            const res = await AuthenticatedAxiosInstance.get(url);

            if (res.data.results.length === 0) {
                setHasMore(false);
            } else {
                setPosts(prev => page === 1 ? res.data.results : [...prev, ...res.data.results]);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            if (err.response?.status === 404) {
                setHasMore(false);
            }
        } finally {
            setInfiniteScrollLoading(false);
        }
    };


    // trigger fetch post when page changes 
    useEffect(() => {
        // Reset state when profile changes
        setPosts([]);
        setPage(1);
        setHasMore(true);

        // Fetch new posts
        fetchPosts();
    }, [userId, isOwnProfile, searchQuery, filterType]);



    // liked post 
    const handleLikeClick = async (postId) => {
        // Only trigger animation when liking (not unliking)
        const isCurrentlyLiked = likedPosts[postId] || false;

        if (!isCurrentlyLiked) {
            // Trigger animation only when liking
            setHeartAnimations(prev => ({
                ...prev,
                [postId]: true,
            }));

            setTimeout(() => {
                setHeartAnimations(prev => ({
                    ...prev,
                    [postId]: false,
                }));
            }, 1000);
        }

        // Toggle like state (whether like or unlike)
        setLikedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId],
        }));

        setLikeCounts(prev => ({
            ...prev,
            [postId]: (prev[postId] || 0) + (isCurrentlyLiked ? -1 : 1),
        }));

        //Backend call for toogle the like
        // Backend call
        try {
            await AuthenticatedAxiosInstance.post("/posts/toggle-like/", { post_id: postId });
        } catch (error) {
            console.error("Error toggling like:", error);

            // Revert UI if API fails
            setLikedPosts(prev => ({
                ...prev,
                [postId]: isCurrentlyLiked,
            }));

            setLikeCounts(prev => ({
                ...prev,
                [postId]: (prev[postId] || 0) + (isCurrentlyLiked ? 1 : -1),
            }));
        }
    };

    // Handle comments 
    const toggleComments = async (postId) => {
        setCommentSectionsVisible(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));

        if (!commentsByPost[postId]) {
            try {
                const res = await AuthenticatedAxiosInstance.get(`/posts/get-all-comment/?post=${postId}`);
                console.log("Arrived comments ::", res.data)
                setCommentsByPost(prev => ({
                    ...prev,
                    [postId]: res.data
                }));
            } catch (err) {
                console.error("Failed to fetch comments:", err);
            }
        }
    };

    const handleCommentInputChange = (postId, value) => {
        setCommentInputs(prev => ({
            ...prev,
            [postId]: value
        }));
    };

    const handleCommentSubmit = async (postId) => {
        const content = commentInputs[postId];
        if (!content || content.trim() === "") return;

        try {
            const res = await AuthenticatedAxiosInstance.post("/posts/add-comment/", {
                post: postId,
                content
            });

            setCommentsByPost(prev => ({
                ...prev,
                [postId]: [res.data, ...(prev[postId] || [])]
            }));

            setCommentInputs(prev => ({
                ...prev,
                [postId]: ""
            }));
        } catch (err) {
            console.error("Failed to post comment:", err);
        }
    };

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
            text: `You've already sent a connection request. Please wait until it is accepted or rejected by '${username}'.`,
            confirmButtonText: "Okay",
        });
    };

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    useEffect(() => {
        console.log("Fetching page:", page);
        fetchPosts();
    }, [page]);

    // Get all the liked post status and the count 
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const res = await AuthenticatedAxiosInstance.get("/posts/like-status/");
                console.log("Liked data ::::", res.data)
                const likeStatus = {};
                const likeCounts = {};

                res.data.forEach(item => {
                    likeStatus[item.post_id] = item.liked_by_user;
                    likeCounts[item.post_id] = item.total_likes;
                });

                setLikedPosts(likeStatus);
                setLikeCounts(likeCounts);

            } catch (error) {
                console.error("Failed to fetch like status", error);
            }
        };

        fetchLikeStatus();
    }, []);

    // delete the post 
    const handleDelete = async (postId) => {

        const result = await showConfirmationAlert({
            title: 'Delete Post?',
            text: 'Are you sure you want to delete this post? This action cannot be undone.',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
        });

        if (result) {
            try {
                const res = await AuthenticatedAxiosInstance.delete(`/posts/delete-post/${postId}/`);
                console.log("Post deleted:", res.data);
                showToast("Post deleted successfully.", "success")
                // Optionally remove the deleted post from the list
                setPosts(prev => prev.filter(post => post.id !== postId));
            } catch (err) {
                console.error("Error deleting post:", err);
                showToast("Error happen while deleting the post.", "error");
            }
        }
    };


    return (
        <>
            {loading ? (
                <UserProfileViewPageShimmer />
            ) : (
                <>
                    {/* for scroll set up */}
                    <CustomScrollToTop />

                    <div className="lg:w-full space-y-4 mt-4 mb-11 ">
                        {/* Cover Photo and Profile Summary */}
                        <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
                            {/* Cover Photo */}
                            <div className=" bg-white dark:bg-zinc-900 overflow-hidden relative p-2 rounded-t-lg">
                                <img
                                    src={user?.banner_image || BannerImage}
                                    alt="Farm cover"
                                    className="w-full h-[180px] object-cover rounded-t-md"
                                />
                                {userId == loggedInUserId &&
                                    <EditBannerImageModal
                                        currentBanner={user?.banner_image}
                                        onSuccess={() => fetchUserData()} // Refresh after update
                                    />
                                }
                            </div>

                            {/* Profile Info Bar */}
                            <div className="flex flex-col md:flex-row px-4 py-4 relative">
                                {/* Profile Picture */}
                                <div className="relative">
                                    <div className=" cursor-pointer absolute -top-16 left-4 md:left-8 h-32 w-32 rounded-full border-4 border-white dark:border-zinc-900  bg-white dark:bg-zinc-900 overflow-hidden">
                                        <img
                                            onClick={() => handleProfileImageClick(user?.profile_picture || defaultUserImage)}
                                            src={user?.profile_picture || defaultUserImage}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    {/* show the image zoomed modal for each users */}
                                    {isImageModalOpen && (
                                        <ShowEventBannerModal
                                            imageUrl={selectedImageUrl}
                                            onClose={() => setIsImageModalOpen(false)}
                                        />
                                    )}

                                    {userId == loggedInUserId &&
                                        <EditProfilePictureModal
                                            currentImage={user?.profile_picture}
                                            userId={loggedInUserId}
                                            onSuccess={fetchUserData}
                                        />
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
                                                {/* <button className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center">
                                                    <FaEdit className="mr-2" /> Edit Profile
                                                </button> */}
                                                <EditProfileModal user={user} onSuccess={fetchUserData} />
                                            </div>
                                        ) : (
                                            <div className="mt-4 md:mt-0 flex space-x-3">
                                                {user?.connection_status === 'connected' ? (
                                                    <button onClick={goToChatPage} className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center">
                                                        <LuMessageSquareText className="mr-2 text-xl" /> Message
                                                    </button>
                                                ) : user?.connection_status === 'pending_sent' ? (
                                                    <div onClick={() => handlePendingClick(user?.username)} className="inline-block">
                                                        <button className="bg-gray-400 text-white px-6 py-2 rounded-md flex items-center hover:bg-gray-500">
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
                                                        <button className="bg-gray-400 text-white px-6 py-2 rounded-md flex items-center hover:bg-gray-400">
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
                                            <div className=" rounded-full p-2 mr-2 shadow-md bg-green-100 dark:bg-green-900 dark:shadow-black">
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
                                                    <p className="text-gray-900 dark:text-green-400 font-bold">{user?.post_count || "0"}</p>
                                                    <p className="text-xs text-gray-600 dark:text-zinc-400">Posts</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-2 rounded-md shadow-lg dark:shadow-black">
                                            <div className=" rounded-full p-2 mr-2 shadow-md  dark:shadow-black bg-green-100 dark:bg-green-900 ">
                                                <FaStore className="text-green-600 dark:text-green-400 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-gray-900 dark:text-green-400 font-bold">{user?.product_count || "0"}</p>
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
                            </div>

                            {/* Center content - Posts and Activities */}
                            <div className="lg:w-2/3 space-y-4">
                                {/* search section  */}
                                <div className="relative  w-full  mx-auto">
                                    <input
                                        type="text"
                                        placeholder="Search posts..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full py-3 pl-12 pr-10 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition duration-300 ease-in-out"
                                    />
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-400 h-5 w-5" />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors duration-300"
                                            aria-label="Clear search"
                                        >
                                            <ImCancelCircle size={18} />
                                        </button>
                                    )}
                                </div>
                                {/* Tab Navigation */}
                                <div className="bg-white dark:bg-zinc-900 rounded-t-lg shadow-sm mb-4">
                                    <div className="flex border-b dark:border-zinc-700">
                                        {['all', 'image', 'video'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setFilterType(type)}
                                                className={`ripple-parent ripple-green flex-1 py-3 px-4 font-medium text-center transition-all ${filterType === type
                                                    ? 'text-green-700 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                                                    : 'text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400'
                                                    }`}
                                            >
                                                {type === 'all' ? 'All' : type === 'image' ? 'Images' : 'Videos'}
                                            </button>
                                        ))}
                                    </div>
                                </div>






                                {/* Posts - Note: This section would need to be completed with the rest of your post rendering logic */}
                                {infiniteScrollLoading && hasMore ? (
                                    <>
                                        <PostShimmer />
                                        <PostShimmer />
                                        <PostShimmer />
                                    </>
                                ) : posts.length > 0 ? (
                                    posts.map((post, index) => {
                                        const isLastPost = index === posts.length - 1;
                                        const isLiked = likedPosts[post.id] || false;

                                        return (
                                            <div
                                                key={post.id}
                                                ref={isLastPost ? lastPostRef : null}
                                                className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4"
                                            >
                                                {/* Author Info */}
                                                <div className="flex justify-between mb-4 border-b border-zinc-300 pb-3 dark:border-zinc-600">
                                                    {/* Left: Author Info */}
                                                    <div className="flex items-center space-x-4">
                                                        <div className="h-10 w-10 border rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                                                            <img
                                                                src={post.author?.profile_picture || defaultUserImage}
                                                                onError={(e) => { e.target.src = defaultUserImage }}
                                                                alt="User profile"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-green-700 dark:text-green-400">
                                                                {post.author?.username || "Unknown"}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {new Date(post.created_at).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                })} at {new Date(post.created_at).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true,
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Right: Edit & Delete Icons */}
                                                    <div className="flex items-start space-x-3">
                                                        {/* Edit Icon */}
                                                        {userId == loggedInUserId &&

                                                            <EditPostModalButton post={post} onSuccess={fetchPosts} />

                                                        }

                                                        {/* Delete Icon */}
                                                        {userId == loggedInUserId &&
                                                            <button
                                                                className="p-2 rounded-full border border-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition tooltip tooltip-top" data-tip="Delete"
                                                                onClick={() => handleDelete(post.id)}
                                                                title="Delete Post"
                                                            >
                                                                <AiFillDelete className="text-red-600 dark:text-red-400" size={18} />
                                                            </button>
                                                        }
                                                    </div>
                                                </div>


                                                {/* Post Text Content */}
                                                <div className="mb-4">
                                                    <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
                                                </div>

                                                {/* Post Image or Video */}
                                                {post.image_url && (
                                                    <div className="relative mb-4 overflow-hidden border-t border-b border-green-500">
                                                        <div
                                                            className="absolute inset-0 bg-center bg-cover filter blur-3xl scale-110 z-0"
                                                            style={{ backgroundImage: `url(${post.image_url})` }}
                                                        ></div>
                                                        <div className="relative z-10 flex justify-center items-center">
                                                            <img
                                                                src={post.image_url}
                                                                alt="Post media"
                                                                className="max-w-full h-auto object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {post.video_url && (
                                                    <div className="relative mb-4 overflow-hidden border-t border-b border-green-500">
                                                        <div
                                                            className="absolute inset-0 bg-center bg-cover filter blur-md scale-110 z-0"
                                                            style={{ backgroundImage: `url(${post.image_url || '/fallback-thumbnail.jpg'})` }}
                                                        ></div>
                                                        <div className="relative z-10 flex justify-center items-center">
                                                            <video
                                                                controls
                                                                className="w-full h-auto max-h-[500px]"
                                                                poster={post.image_url}
                                                            >
                                                                <source src={post.video_url} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Interaction Buttons */}
                                                <div className="flex justify-around border-t pt-4 dark:border-zinc-600">


                                                    {/* Like button  */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => handleLikeClick(post.id)} // Attach to post.id
                                                            className={`flex dark:hover:text-green-400  items-center w-20 transition-colors duration-300 ${isLiked
                                                                ? "text-green-500 hover:text-green-700"
                                                                : "text-gray-600 dark:text-gray-400 hover:text-green-500"
                                                                }`}
                                                        >
                                                            <span className="mr-2">{likeCounts[post.id] || 0}</span> {isLiked ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                                                            {isLiked ? "Liked" : "Like"}
                                                        </button>



                                                        {/* Flying Heart inside like button wrapper */}
                                                        {heartAnimations[post.id] && (
                                                            <div className="flying-heart-wrapper">
                                                                <div className="flying-heart heart1">💚</div>
                                                                <div className="flying-heart heart2">💚</div>
                                                                <div className="flying-heart heart3">💚</div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => toggleComments(post.id)}
                                                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                                                    >
                                                        <FaRegComment className="mr-2" /> {commentSectionsVisible[post.id] ? "Hide" : "Comment"}
                                                    </button>
                                                    {/* share button  */}
                                                    <ShareButton postId={post.id} />
                                                </div>

                                                {/* show the comment box and input comment field  */}
                                                <AnimatePresence initial={false}>
                                                    {commentSectionsVisible[post.id] && (
                                                        <motion.div
                                                            key="commentBox"
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden border-t pt-3 dark:border-zinc-600 mt-4"
                                                        >
                                                            <div className=" flex items-center space-x-2 mb-3">
                                                                <input
                                                                    type="text"
                                                                    value={commentInputs[post.id] || ""}
                                                                    onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                                                                    placeholder="Write a comment..."
                                                                    className="w-full p-2 border bg-gray-50 focus:border-green-500 dark:focus:border-green-400 rounded dark:bg-zinc-700 dark:text-white dark:border-zinc-500 transition duration-300 ease-in-out"
                                                                />

                                                                <button
                                                                    onClick={() => handleCommentSubmit(post.id)}
                                                                    className="p-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                                                                    title="Submit Comment"
                                                                >
                                                                    <FaPaperPlane />
                                                                </button>
                                                            </div>

                                                            {/* Scrollable Comment Section */}
                                                            <div className="max-h-[199px] overflow-y-auto custom-scrollbar space-y-2 scrollbar-hide">
                                                                {(commentsByPost[post.id] || []).map((comment) => (
                                                                    <div
                                                                        key={comment.id}
                                                                        className="p-2  bg-green-100 dark:bg-zinc-700 rounded flex items-start space-x-3"
                                                                    >
                                                                        {/* Profile image */}
                                                                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-600 shrink-0">
                                                                            <img
                                                                                src={comment.user?.profile_picture || defaultUserImage}
                                                                                alt="User profile"
                                                                                className="h-full w-full object-cover"
                                                                                onError={(e) => { e.target.src = defaultUserImage }}
                                                                            />
                                                                        </div>

                                                                        {/* Comment content */}
                                                                        <div className="flex flex-col">
                                                                            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                                                                                {comment.user?.username}
                                                                            </p>
                                                                            <p className="text-sm text-gray-700 dark:text-gray-200">
                                                                                {comment.content}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                {new Date(comment.created_at).toLocaleDateString('en-IN', {
                                                                                    day: 'numeric',
                                                                                    month: 'long',
                                                                                    year: 'numeric',
                                                                                })} at {new Date(comment.created_at).toLocaleTimeString('en-US', {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                    hour12: true,
                                                                                })}
                                                                            </p>

                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })) : (
                                    <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-10 px-4 bg-white rounded-md dark:bg-zinc-900 dark:border-zinc-700">
                                        <img
                                            src={PostNotFoundImage}
                                            alt="No Posts"
                                            className="mx-auto w-64 object-contain"
                                        />
                                        <p className="text-lg font-semibold dark:text-zinc-400">No Posts found!</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                                            Try creating a new post or check again later.
                                        </p>
                                    </div>
                                )}



                                {!hasMore && (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                        🎉 You've reached the end of the posts.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default UserProfileViewPage;