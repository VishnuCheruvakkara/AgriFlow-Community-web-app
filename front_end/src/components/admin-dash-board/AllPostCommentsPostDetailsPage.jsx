import React, { useState, useMemo } from "react";
import { RiMessage3Fill, RiSearchLine } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";
import FormattedDateTime from "../common-date-time/FormattedDateTime";
import DefaultUserImage from "../../assets/images/user-default.png"
import NoCommentsFoundImage from "../../assets/images/no-product-user-profile.png"

const AllPostCommentsPostDetailsPage = ({ comments = [] }) => {
  const [inputValue, setInputValue] = useState("");


  // Filter comments based on search input
  const filteredComments = useMemo(() => {
    const query = inputValue.toLowerCase();
    return comments.filter((comment) => {
      const contentMatch = comment.content?.toLowerCase().includes(query);
      const usernameMatch = comment.user?.username
        ?.toLowerCase()
        .includes(query);
      return contentMatch || usernameMatch;
    });
  }, [comments, inputValue]);

  return (
    <div className="mt-6 bg-gray-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-green-400">
        <div className="flex items-center">
          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
            <RiMessage3Fill className="text-green-500 w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
            All Comments ({filteredComments.length})
          </h3>
        </div>
      </div>

      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-zinc-700 border-b border-green-400 p-3">
        <div className="flex items-center border bg-white dark:bg-zinc-800 border-zinc-300 focus-within:border-green-500 dark:focus-within:border-green-500 dark:border-zinc-700 rounded-md shadow-sm px-3 py-1 transition duration-300 ease-in-out">
          <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />
          <input
            type="text"
            placeholder="Search Comments..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 outline-none px-2 py-1 text-gray-700 dark:text-zinc-200 bg-transparent placeholder-gray-500 dark:placeholder-zinc-400"
          />
          {inputValue && (
            <button
              onClick={() => setInputValue("")}
              className="text-gray-500 hover:text-red-500 transition-colors duration-300"
              aria-label="Clear search"
            >
              <ImCancelCircle size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Comments */}
      <div className="max-h-80 overflow-y-auto p-3 space-y-3">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-600"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={
                    comment.user?.profile_picture ||
                    DefaultUserImage
                  }
                  alt="Commenter"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                      {comment.user?.username || "Anonymous"}
                    </h5>
                    <span className="text-xs text-gray-500 dark:text-zinc-400">
                      <FormattedDateTime date={comment.created_at} />
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-zinc-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className=" text-center border-2 border-dashed border-gray-300 text-gray-600 py-8 px-4 bg-gray-100 rounded-md dark:bg-zinc-800 dark:border-zinc-700">
            <img
  src={NoCommentsFoundImage}
  alt="No Comments"
  className="max-w-[150px] h-auto mx-auto mb-3 opacity-80"
/>
            <p className="text-sm font-semibold dark:text-zinc-300 mb-1">
              No Comments Found
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-3">
              Try adjusting your search.
            </p>
            <button
              onClick={() => setInputValue("")}
              className="mt-2 px-3 py-1.5 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 text-xs font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPostCommentsPostDetailsPage;
