import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
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

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await AuthenticatedAxiosInstance.get(`/posts/get-single-post/${postId}/`);
        setPost(res.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  if (loading) {
    return <SinglePostShimmer />;
  }

  if (!post) {
    return (
      <div className="p-4 text-center text-red-600">
        Post not found.
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
          <button
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
          >
            <FaRegHeart className="mr-2" /> Like
          </button>
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
