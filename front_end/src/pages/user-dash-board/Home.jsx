import React, { useState, useEffect, useRef } from 'react'
// Importing necessary icons from react-icons
import { FaCloudSun, FaPlus, FaEllipsisH, FaHeart, FaRegComment, FaShare } from 'react-icons/fa';
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

function Home() {

  const user = useSelector((state) => state.user.user)
  //state for store the post from backend
  const [posts, setPosts] = useState([]);
  //inifine scroll set up 
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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


  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await AuthenticatedAxiosInstance.get(`/posts/get-all-posts/?page=${page}`);
      if (res.data.results.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...res.data.results]);
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
    console.log("Fetching page:", page);
    fetchPosts();
  }, [page]);

  return (
    <>
      {/* for scroll set up  */}
      <CustomScrollToTop />

      <div className="lg:w-10/12 space-y-4 mt-4 mb-11 " >
        {/* Welcome bar with ThemeToggle */}

        <div
          className=" h-32 rounded-lg shadow-sm p-4 mb-4 bg-gradient-to-r from-green-700 via-green-500 to-green-400 bg-[length:200%_200%] relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/farmer_land_doodle.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative z-10 flex justify-between items-center text-white ">

            <div>
              <h1 className="text-2xl text-zinc-800/80 font-bold">
                Welcome back, {user?.username || "Farmer"}!
              </h1>

            </div>
          </div>
        </div>


        {/* Create post card */}

        <PostCreationModalButton user={user} />



        {/* Posts */}
        {/* Posts */}
        {posts.map((post, index) => {
          const isLastPost = index === posts.length - 1;
          return (
            <div
              key={post.id}
              ref={isLastPost ? lastPostRef : null}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4"
            >
              {/* Author Info */}
              <div className="flex justify-between mb-4 border-b border-zinc-300 pb-3 dark:border-zinc-600">
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
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <FaEllipsisH />
                </button>
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
                <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  <FaHeart className="mr-2" /> Like
                </button>
                <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  <FaRegComment className="mr-2" /> Comment
                </button>
                <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <FaShare className="mr-2" /> Share
                </button>
              </div>
            </div>
          );
        })}

        {/* Show shimmer loader while loading */}
        {loading && hasMore && (
          <>
            <PostShimmer />
            <PostShimmer />
            <PostShimmer />
          </>
        )}

        {!hasMore && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            🎉 You've reached the end of the posts.
          </p>
        )}


      </div>

      {/* Right sidebar - Weather, Suggestions, Events, Schemes */}
      <div className="lg:w-1/3 space-y-4 hidden lg:block">
        {/* Weather card - Moved from left to right */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">Weather</h2>
            <span className="text-blue-500 dark:text-blue-400 text-sm cursor-pointer">View Forecast</span>
          </div>
          <div className="flex items-center justify-center flex-col">
            <FaCloudSun className="text-5xl text-yellow-500 mb-2" />
            <span className="text-3xl font-bold text-black dark:text-white">28°C</span>
            <p className="text-gray-600 dark:text-gray-300">Partly Cloudy</p>
            <div className="flex justify-between w-full mt-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="text-center">
                <p>Humidity</p>
                <p className="font-semibold">65%</p>
              </div>
              <div className="text-center">
                <p>Wind</p>
                <p className="font-semibold">12 km/h</p>
              </div>
              <div className="text-center">
                <p>Rainfall</p>
                <p className="font-semibold">30%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions card */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">Suggestions</h2>
            <span className="text-blue-500 dark:text-blue-400 text-sm cursor-pointer">See All</span>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                  <img src={defaultGroupImage} alt="User profile" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">Organic Farmers Group</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">324 members</p>
                </div>
              </div>
              <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                <FaPlus />
              </button>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                  <img src={defaultGroupImage} alt="User profile" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">Sustainable Farming</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">512 members</p>
                </div>
              </div>
              <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                <FaPlus />
              </button>
            </li>
          </ul>
        </div>

        {/* Events card */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">Upcoming Events</h2>
            <span className="text-blue-500 dark:text-blue-400 text-sm cursor-pointer">See All</span>
          </div>
          <ul className="space-y-3">
            <li className="border-l-4 border-green-500 pl-3 py-1">
              <p className="font-semibold text-gray-600 dark:text-gray-300">Seed Distribution</p>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <BsCalendarEvent className="mr-1" />
                <span>Tomorrow, 10:00 AM</span>
              </div>
            </li>
            <li className="border-l-4 border-blue-500 pl-3 py-1">
              <p className="font-semibold text-gray-600 dark:text-gray-300">Irrigation Workshop</p>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <BsCalendarEvent className="mr-1" />
                <span>Mar 15, 2:00 PM</span>
              </div>
            </li>
            <li className="border-l-4 border-yellow-500 pl-3 py-1">
              <p className="font-semibold text-gray-600 dark:text-gray-300">Community Meeting</p>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <BsCalendarEvent className="mr-1" />
                <span>Mar 20, 4:30 PM</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Govt Schemes card */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">Govt Schemes</h2>
            <span className="text-blue-500 dark:text-blue-400 text-sm cursor-pointer">View All</span>
          </div>
          <ul className="space-y-3">
            <li className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
              <p className="font-semibold text-gray-800 dark:text-gray-200">Crop Insurance Scheme</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Applications open until Mar 31</p>
              <button className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300">Apply Now</button>
            </li>
            <li className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600">
              <p className="font-semibold text-gray-800 dark:text-gray-200">Solar Pump Subsidy</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">50% subsidy on installation</p>
              <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">Check Eligibility</button>
            </li>
          </ul>
        </div>
      </div>

    </>
  )
}

export default Home;
