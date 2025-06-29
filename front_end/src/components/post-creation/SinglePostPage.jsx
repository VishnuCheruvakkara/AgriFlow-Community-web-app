import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";
import ShareButton from "./ShareButton";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import defaultUserImage from "../../assets/images/user-default.png";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import SinglePostShimmer from "../shimmer-ui-component/SinglePostShimmer";

const SinglePostPage = () => {

  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // state for the like set up 
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0)
  const [heartAnimation, setHeartAnimation] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await AuthenticatedAxiosInstance.get(`/posts/get-single-post/${postId}/`);
        setPost(res.data);
        console.log("Liked data :::",res.data)
        setIsLiked(res.data.is_liked);
        setLikeCount(res.data.like_count);

      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  //trigger heart animation 
  const triggerHeartAnimation = () => {
    setHeartAnimation(true);
    setTimeout(() => {
      setHeartAnimation(false);
    }, 1000); // Duration of the animation
  };
  //handle the like button toggle
  const handleLikeClick = async (postId) => {
    try {
      // Optimistic UI update
      if (isLiked) {
        setLikeCount(likeCount - 1);
      } else {
        setLikeCount(likeCount + 1);
        triggerHeartAnimation();
      }
      setIsLiked(!isLiked);

      // Send like/unlike request
       await AuthenticatedAxiosInstance.post("/posts/toggle-like/", { post_id: postId });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };


  if (loading) {
    return <SinglePostShimmer />;
  }

  if (!post) {
    return (
      <div className="p-4 text-center text-red-600">
        Post not found
      </div>
    );
  }

  return (
    <div className="w-full    mt-4 mb-14">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4">
        {/* Author Info */}
        <div className="flex justify-between mb-4 border-b border-zinc-300 pb-3 dark:border-zinc-600">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 border rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
              <img
                src={post.author?.profile_picture || defaultUserImage}
                alt="User profile"
                className="h-full w-full object-cover"
                onError={(e) => { e.target.src = defaultUserImage; }}
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
          <Link
            onClick={() => navigate(-1)}
            className="border hover:border-transparent text-zinc-500  hover:bg-gray-200  rounded-full p-2 transition-colors duration-300 tooltip tooltip-left" data-tip="Go back"
          >
            <RxCross2 className='text-2xl' />
          </Link>
        </div>

        {/* Post Text */}
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
        </div>

        {/* Image */}
        {post.image_url && (
          <div className="relative mb-4 overflow-hidden border-t border-b border-green-500">
            <div
              className="absolute inset-0 bg-center bg-cover filter blur-3xl scale-110 z-0"
              style={{ backgroundImage: `url(${post.image_url})` }}
            />
            <div className="relative z-10 flex justify-center items-center">
              <img
                src={post.image_url}
                alt="Post media"
                className="max-w-full h-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Video */}
        {post.video_url && (
          <div className="relative mb-4 overflow-hidden border-t border-b border-green-500">
            <div
              className="absolute inset-0 bg-center bg-cover filter blur-md scale-110 z-0"
              style={{ backgroundImage: `url(${post.image_url || "/fallback-thumbnail.jpg"})` }}
            />
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
          {/* Like Button */}
          <div className="relative">
            <button
              onClick={() => handleLikeClick(post.id)}
              className={`flex items-center w-24 transition-colors duration-300 ${isLiked
                ? "text-green-500 hover:text-green-700"
                : "text-gray-600 dark:text-gray-400 hover:text-green-500"
                }`}
            >
              <span className="mr-2">{likeCount}</span>
              {isLiked ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
              {isLiked ? "Liked" : "Like"}
            </button>

            {/* Flying Heart Animation */}
            {heartAnimation && (
              <div className="flying-heart-wrapper pointer-events-none">
                <div className="flying-heart heart1">💚</div>
                <div className="flying-heart heart2">💚</div>
                <div className="flying-heart heart3">💚</div>
              </div>
            )}
          </div>

          {/* Comment Button */}
          <button
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
          >
            <FaRegComment className="mr-2" /> Comment
          </button>

          <ShareButton postId={post.id} />
        </div>

      </div>
    </div>
  );
};

export default SinglePostPage;
