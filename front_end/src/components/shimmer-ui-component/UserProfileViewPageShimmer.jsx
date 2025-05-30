import React from 'react';

const UserProfileViewPageShimmer = () => {
  return (
    <div className="lg:w-full space-y-4 mt-4 mb-11">
      {/* Cover Photo and Profile Summary Shimmer */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
        {/* Cover Photo Shimmer */}
        <div className="h-36 shimmer shimmer-light shimmer-dark" />

        {/* Profile Info Bar Shimmer */}
        <div className="flex flex-col md:flex-row px-4 py-4 relative">
          {/* Profile Picture Shimmer */}
          <div className="relative">
            <div className="absolute -top-16 left-4 md:left-8 h-32 w-32 rounded-full border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="h-full w-full rounded-full shimmer shimmer-light shimmer-dark" />
            </div>
          </div>

          {/* Name and Basic Info Shimmer */}
          <div className="mt-16 md:ml-40 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="space-y-2">
                {/* Name shimmer */}
                <div className="h-8 w-48 rounded shimmer shimmer-light shimmer-dark" />
                {/* Farming type shimmer */}
                <div className="h-5 w-32 rounded shimmer shimmer-light shimmer-dark" />
                {/* Location shimmer */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded shimmer shimmer-light shimmer-dark" />
                  <div className="h-4 w-40 rounded shimmer shimmer-light shimmer-dark" />
                </div>
              </div>

              {/* Action Button Shimmer */}
              <div className="mt-4 md:mt-0">
                <div className="h-10 w-32 rounded-md shimmer shimmer-light shimmer-dark" />
              </div>
            </div>

            {/* Stats Shimmer */}
            <div className="mt-4 flex flex-wrap gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center p-2 rounded-md shadow-lg dark:shadow-black">
                  <div className="h-10 w-10 rounded-full shimmer shimmer-light shimmer-dark mr-2" />
                  <div className="space-y-1">
                    <div className="h-5 w-8 rounded shimmer shimmer-light shimmer-dark" />
                    <div className="h-3 w-16 rounded shimmer shimmer-light shimmer-dark" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with sidebar shimmer */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left sidebar shimmer */}
        <div className="lg:w-1/3 space-y-4">
          {/* About Section Shimmer */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-16 rounded shimmer shimmer-light shimmer-dark" />
              <div className="h-4 w-4 rounded shimmer shimmer-light shimmer-dark" />
            </div>
            
            {/* Bio shimmer */}
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full rounded shimmer shimmer-light shimmer-dark" />
              <div className="h-4 w-3/4 rounded shimmer shimmer-light shimmer-dark" />
              <div className="h-4 w-1/2 rounded shimmer shimmer-light shimmer-dark" />
            </div>

            {/* Contact Info Shimmer */}
            <div className="space-y-3">
              <div className="h-5 w-32 rounded shimmer shimmer-light shimmer-dark" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded shimmer shimmer-light shimmer-dark" />
                <div className="h-4 w-28 rounded shimmer shimmer-light shimmer-dark" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded shimmer shimmer-light shimmer-dark" />
                <div className="h-4 w-36 rounded shimmer shimmer-light shimmer-dark" />
              </div>
            </div>
          </div>

          {/* Communities Section Shimmer */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-24 rounded shimmer shimmer-light shimmer-dark" />
              <div className="h-4 w-12 rounded shimmer shimmer-light shimmer-dark" />
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full shimmer shimmer-light shimmer-dark" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-3/4 rounded shimmer shimmer-light shimmer-dark" />
                    <div className="h-3 w-1/2 rounded shimmer shimmer-light shimmer-dark" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center content shimmer */}
        <div className="lg:w-2/3 space-y-4">
          {/* Tab Navigation Shimmer */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
            <div className="flex border-b dark:border-zinc-700">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex-1 py-3 px-4">
                  <div className="h-5 w-16 rounded shimmer shimmer-light shimmer-dark mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Posts Shimmer */}
          {Array.from({ length: 2 }).map((_, postIndex) => (
            <div key={postIndex} className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
              {/* Post header shimmer */}
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full shimmer shimmer-light shimmer-dark" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 rounded shimmer shimmer-light shimmer-dark" />
                    <div className="h-3 w-20 rounded shimmer shimmer-light shimmer-dark" />
                  </div>
                </div>
              </div>

              {/* Post content shimmer */}
              <div className="mb-4 space-y-2">
                <div className="h-4 w-full rounded shimmer shimmer-light shimmer-dark" />
                <div className="h-4 w-3/4 rounded shimmer shimmer-light shimmer-dark" />
                <div className="h-4 w-1/2 rounded shimmer shimmer-light shimmer-dark" />
              </div>

              {/* Post image shimmer */}
              <div className="mb-4 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <div className="w-full h-64 shimmer shimmer-light shimmer-dark" />
              </div>

              {/* Post stats shimmer */}
              <div className="flex justify-between pb-3 border-b dark:border-zinc-700 mb-3">
                <div className="h-4 w-16 rounded shimmer shimmer-light shimmer-dark" />
                <div className="h-4 w-20 rounded shimmer shimmer-light shimmer-dark" />
              </div>

              {/* Post actions shimmer */}
              <div className="flex justify-around">
                {Array.from({ length: 3 }).map((_, actionIndex) => (
                  <div key={actionIndex} className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded shimmer shimmer-light shimmer-dark" />
                    <div className="h-4 w-12 rounded shimmer shimmer-light shimmer-dark" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Upcoming Events Shimmer */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-32 rounded shimmer shimmer-light shimmer-dark" />
              <div className="h-4 w-20 rounded shimmer shimmer-light shimmer-dark" />
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="border-l-4 border-gray-300 dark:border-zinc-600 pl-3 py-2 flex justify-between items-center">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-48 rounded shimmer shimmer-light shimmer-dark" />
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded shimmer shimmer-light shimmer-dark" />
                      <div className="h-3 w-32 rounded shimmer shimmer-light shimmer-dark" />
                    </div>
                    <div className="h-3 w-64 rounded shimmer shimmer-light shimmer-dark" />
                  </div>
                  <div className="h-4 w-12 rounded shimmer shimmer-light shimmer-dark" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileViewPageShimmer;