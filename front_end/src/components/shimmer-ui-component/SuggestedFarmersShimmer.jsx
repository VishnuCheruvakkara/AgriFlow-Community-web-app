import React from 'react';

const SuggestedFarmersShimmer = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border dark:border-zinc-700 overflow-hidden flex flex-col h-full">
          {/* Banner Image Shimmer */}
          <div className="h-24 w-full relative shimmer shimmer-light shimmer-dark" />
          
          <div className="p-5 pt-12 relative flex-1">
            {/* Profile Image Shimmer - Positioned to overlap the banner */}
            <div className="absolute -top-10 left-5 w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800">
              <div className="w-full h-full shimmer shimmer-light shimmer-dark"></div>
            </div>
            
            <div className="flex flex-col">
              {/* Username Shimmer */}
              <div className="h-5 w-1/2 rounded shimmer shimmer-light shimmer-dark" />
              
              {/* Location Shimmer */}
              <div className="h-4 w-3/4 rounded shimmer shimmer-light shimmer-dark mt-3" />
              
              {/* Farming Type Shimmer */}
              <div className="h-4 w-2/3 rounded shimmer shimmer-light shimmer-dark mt-3" />
            </div>
          </div>
          
          {/* Connect Button Shimmer */}
          <div className="p-4 pt-0">
            <div className="w-full h-10 rounded-lg shimmer shimmer-light shimmer-dark" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestedFarmersShimmer;