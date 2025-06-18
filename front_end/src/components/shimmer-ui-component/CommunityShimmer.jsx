import React from 'react';

const CommunityShimmer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div 
          key={index} 
          className="dark:bg-zinc-800 bg-white rounded-lg p-5 flex flex-row items-start shadow-xs border border-zinc-300 dark:border-zinc-600 h-full"
        >
          {/* Community Logo Shimmer */}
          <div className=" h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4 flex-shrink-0 mt-1">
            <div className="h-full w-full shimmer shimmer-light shimmer-dark"></div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 min-w-0 w-full">
            {/* Header Section */}
            <div className="flex flex-row items-center justify-between gap-2 mb-3">
              {/* Community Name Shimmer */}
              <div className="h-5 w-32 rounded shimmer shimmer-light shimmer-dark" />
              
              {/* Status Badge Shimmer */}
              <div className="h-6 w-16 rounded shimmer shimmer-light shimmer-dark" />
            </div>
            
            {/* Description Shimmer - Multiple lines */}
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full rounded shimmer shimmer-light shimmer-dark" />
              <div className="h-4 w-4/5 rounded shimmer shimmer-light shimmer-dark" />
              <div className="h-4 w-3/5 rounded shimmer shimmer-light shimmer-dark" />
            </div>
            
            {/* Footer Section */}
            <div className="flex justify-between items-center">
              {/* Members Count Shimmer */}
              <div className="h-4 w-20 rounded shimmer shimmer-light shimmer-dark" />
              
              {/* Join Button Shimmer */}
              <div className="h-8 w-16 rounded-full shimmer shimmer-light shimmer-dark" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityShimmer;