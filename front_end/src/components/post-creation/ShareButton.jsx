// src/components/ShareButton.jsx
import React, { useState } from 'react';
import { FiShare2, FiCopy } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const ShareButton = ({ postId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const postUrl = `${window.location.origin}/posts/${postId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    alert("Link copied to clipboard!");
    setShowMenu(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition"
      >
        <FiShare2 className="mr-2 text-lg" /> Share
      </button>

      {showMenu && (
        <div className="absolute z-50 right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg shadow-md p-2 space-y-2">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm"
          >
            <FiCopy className="mr-2" /> Copy Link
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(postUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm"
          >
            <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm"
          >
            <FaFacebookF className="mr-2 text-blue-600" /> Facebook
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${postUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm"
          >
            <FaTwitter className="mr-2 text-sky-500" /> Twitter
          </a>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
