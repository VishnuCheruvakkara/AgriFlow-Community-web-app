import React, { useState, useRef, useEffect } from 'react';
import { FiShare2, FiCopy } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { showToast } from '../../components/toast-notification/CustomToast';

const ShareButton = ({ postId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // For Copy Link
  const staticPostUrl = `${window.location.origin}/user-dash-board/posts/${postId}`;

  // For Dynamic Sharing
  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(staticPostUrl);
    showToast("Link copied to clipboard!", "success");
    setShowMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition"
      >
        <FiShare2 className="mr-2 text-lg" /> Share
      </button>

      {showMenu && (
        <div className="absolute z-50 right-0 bottom-full mb-2 w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg shadow-md p-2 space-y-2">

          {/* Copy Link uses static URL */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm"
          >
            <FiCopy className="mr-2" /> Copy Link
          </button>

          {/* Share Links use current URL */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm"
          >
            <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm"
          >
            <FaFacebookF className="mr-2 text-blue-600" /> Facebook
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
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
