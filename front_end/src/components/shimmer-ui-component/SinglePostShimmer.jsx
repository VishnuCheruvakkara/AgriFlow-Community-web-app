import React from "react";

const SinglePostShimmer = () => {
  return (
    <div className="w-full mt-4 mb-14">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4 animate-pulse">
        {/* Author Info Section */}
        <div className="flex justify-between mb-4 border-b border-zinc-300 pb-3 dark:border-zinc-600">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="h-10 w-10 rounded-full shimmer shimmer-light shimmer-dark" />
            <div>
              {/* Username */}
              <div className="h-4 w-32 shimmer shimmer-light shimmer-dark rounded mb-1" />
              {/* Date and Time */}
              <div className="h-3 w-48 shimmer shimmer-light shimmer-dark rounded" />
            </div>
          </div>
          {/* Close Button */}
          <div className="h-10 w-10 rounded-full shimmer shimmer-light shimmer-dark" />
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <div className="space-y-2">
            <div className="h-4 w-full shimmer shimmer-light shimmer-dark rounded" />
            <div className="h-4 w-11/12 shimmer shimmer-light shimmer-dark rounded" />
            <div className="h-4 w-9/12 shimmer shimmer-light shimmer-dark rounded" />
            <div className="h-4 w-7/12 shimmer shimmer-light shimmer-dark rounded" />
          </div>
        </div>

        {/* Media Section (Image/Video placeholder) */}
        <div className="relative mb-4 overflow-hidden ">
          <div className="h-64 w-full shimmer shimmer-light shimmer-dark" />
        </div>

        {/* Interaction Buttons */}
        <div className="flex justify-around border-t pt-4 dark:border-zinc-600">
          <div className="flex items-center">
            <div className="h-4 w-4 shimmer shimmer-light shimmer-dark rounded mr-2" />
            <div className="h-4 w-8 shimmer shimmer-light shimmer-dark rounded" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 shimmer shimmer-light shimmer-dark rounded mr-2" />
            <div className="h-4 w-16 shimmer shimmer-light shimmer-dark rounded" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 shimmer shimmer-light shimmer-dark rounded mr-2" />
            <div className="h-4 w-12 shimmer shimmer-light shimmer-dark rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePostShimmer;