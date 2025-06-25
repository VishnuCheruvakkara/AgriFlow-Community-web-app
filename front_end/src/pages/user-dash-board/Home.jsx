import React, { useState, useEffect, useRef } from 'react'
// Importing necessary icons from react-icons
import { FaCloudSun, FaPlus, FaEllipsisH, FaHeart, FaRegComment, FaShare, FaRegHeart, FaPaperPlane } from 'react-icons/fa';
import { BsCalendarEvent } from 'react-icons/bs';
import defaultFarmerImage from '../../assets/images/farmer-wheat-icons.png'
import defaultUserImage from '../../assets/images/user-default.png'
import tomatoImage from '../../assets/images/tomato-1.jpg'
import defaultGroupImage from '../../assets/images/user-group-default.png'
import { useSelector } from 'react-redux';
import CustomScrollToTop from '../../components/CustomScrollBottomToTop/CustomScrollToTop';
import { MdPostAdd } from "react-icons/md";
import PostCreationModalButton from '../../components/post-creation/PostCreationModalButton';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import PostShimmer from '../../components/shimmer-ui-component/PostShimmer';
import { FiShare2 } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import ShareButton from '../../components/post-creation/ShareButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WeatherCardShimmer from '../../components/shimmer-ui-component/WeatherCardShimmer';
import { FaWind, FaWater, FaCloud, FaMapMarkerAlt } from "react-icons/fa";
import PostNotFoundImage from "../../assets/images/no-product-user-profile.png"
import { Search } from 'lucide-react';
import { ImCancelCircle } from 'react-icons/im';

import { Link } from 'react-router-dom';

function Home() {

  const navigate = useNavigate()
  const user = useSelector((state) => state.user.user)
  //state for store the post from backend
  const [posts, setPosts] = useState([]);
  //inifine scroll set up 
  const [loading, setLoading] = useState(true);
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

  //Weather tracking card
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [hasTriedFetchingWeather, setHasTriedFetchingWeather] = useState(false);

  //for infinite scroll
  const observer = useRef();

  const lastPostRef = (node) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  //fetch posts
  const fetchPosts = async (customPage = page) => {
    setLoading(true);
    try {
      let url = `/posts/get-all-posts/?page=${customPage}`;

      if (searchQuery.trim() !== '') {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      if (filterType === 'image') {
        url += `&filter=image`;
      } else if (filterType === 'video') {
        url += `&filter=video`;
      }

      const res = await AuthenticatedAxiosInstance.get(url);
      console.log("Post data in Home :::",res.data.results)
      if (res.data.results.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev =>
          customPage === 1 ? res.data.results : [...prev, ...res.data.results]
        );
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      if (err.response?.status === 404) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [searchQuery, filterType]);

  useEffect(() => {
    console.log("Fetching page:", page);
    fetchPosts();
  }, [page]);

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



  //get the weather data for card 
  useEffect(() => {
    const fetchWeather = async () => {
      if (!user?.address?.latitude || !user?.address?.longitude) return;

      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${user.address.latitude}&lon=${user.address.longitude}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        setWeather(res.data);
      } catch (err) {
        console.error("Failed to fetch weather", err);
      } finally {
        setWeatherLoading(false);
        setHasTriedFetchingWeather(true);
      }
    };

    fetchWeather();
  }, [user]);





  return (
    <>
      {/* for scroll set up  */}
      <CustomScrollToTop />


      <div className="w-[100%] space-y-4 mt-4 mb-11 " >



        {/* Welcome bar with Weather & Forecast Link */}
        <div className="h-auto rounded-lg shadow-lg p-4 mb-4 bg-white dark:bg-zinc-800 relative overflow-hidden">
          <div className="relative z-10 text-zinc-800 dark:text-white space-y-4">

            {/* Top Row: Welcome + Forecast Link */}
            <div className="flex justify-between items-center">
              <h1 className="text-md font-bold">
                Welcome back, {user?.username || "Farmer"}!
              </h1>
              <button
                onClick={() => navigate("/user-dash-board/weather-page")}
                className="text-sm text-green-600 dark:text-green-300 font-medium hover:underline"
              >
                View Weather Forecast
              </button>
            </div>

            {/* Underline both headings */}
            <div className="flex justify-between border-b border-gray-300 dark:border-zinc-600 " />
            {/* Weather Info Section */}
            {weatherLoading ? (
              <WeatherCardShimmer />
            ) : weather ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                {/* Left: Temperature & Location */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaCloudSun className="text-3xl text-yellow-400 shrink-0" />
                    <span className="text-2xl font-bold text-zinc-800 dark:text-white">
                      {Math.round(weather.main.temp)}°C
                    </span>
                  </div>
                  <p className="capitalize text-sm text-zinc-700 dark:text-zinc-300">
                    {weather.weather[0].description}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <FaMapMarkerAlt className="text-green-500" />
                    {weather.name}
                  </p>
                </div>

                {/* Right: Weather Stats in Blur Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  {/* Air Moisture */}
                  <div className="flex items-center gap-3 p-3 backdrop-blur-md bg-white/60 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md min-w-0 overflow-hidden">
                    <FaWater className="text-blue-500 text-xl shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm text-zinc-600 dark:text-zinc-300 truncate">Air Moisture</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                        {weather.main.humidity}%
                      </span>
                    </div>
                  </div>

                  {/* Wind */}
                  <div className="flex items-center gap-3 p-3 backdrop-blur-md bg-white/60 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md min-w-0 overflow-hidden">
                    <FaWind className="text-cyan-500 text-xl shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm text-zinc-600 dark:text-zinc-300 truncate">Wind</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                        {weather.wind.speed} km/h
                      </span>
                    </div>
                  </div>

                  {/* Cloud Cover */}
                  <div className="flex items-center gap-3 p-3 backdrop-blur-md bg-white/60 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md min-w-0 overflow-hidden">
                    <FaCloud className="text-gray-400 text-xl shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm text-zinc-600 dark:text-zinc-300 truncate">Cloud Cover</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                        {weather.clouds.all}%
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ) : hasTriedFetchingWeather ? (
              <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 dark:bg-zinc-800 dark:border-zinc-600 dark:text-gray-300 rounded-md">
                <p className="text-md font-semibold">Weather data not available</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Please try again later or check your connection.</p>
              </div>
            ) : null}



          </div>
        </div>



        {/* Create post card */}

        <PostCreationModalButton user={user} />

        {/* search section  */}
        <div className="relative  w-full  mx-auto">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg py-3 pl-12 pr-10 border border-gray-300 dark:border-zinc-600  bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition duration-300 ease-in-out"
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

        {/* Posts */}
        {loading && hasMore ? (
          //  Show shimmer loader while loading
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
                  <Link  to={`/user-dash-board/user-profile-view/${post.author?.id}`} className="flex items-center space-x-4">
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
                  </Link>

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



        {!hasMore && !hasMore && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            🎉 You've reached the end of the posts.
          </p>
        )}


      </div>



    </>
  )
}

export default Home;
