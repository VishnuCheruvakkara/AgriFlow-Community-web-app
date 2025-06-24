import React from 'react';

const WeatherCardShimmer = () => {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm  animate-pulse">
     
     
      {/* Weather Icon */}
      <div className="flex items-center justify-center flex-col">
        <div className="h-16 w-16 shimmer shimmer-light shimmer-dark rounded-full mb-2"></div>

        {/* Temperature */}
        <div className="h-6 w-20 shimmer shimmer-light shimmer-dark rounded mb-1"></div>

        {/* Description & Location */}
        <div className="h-4 w-32 shimmer shimmer-light shimmer-dark rounded mb-1"></div>
        <div className="h-3 w-24 shimmer shimmer-light shimmer-dark rounded mb-4"></div>

        {/* Bottom Stats */}
        <div className="flex justify-between w-full text-sm space-x-2">
          <div className="flex-1 text-center">
            <div className="h-3 w-16 shimmer shimmer-light shimmer-dark rounded mx-auto mb-1"></div>
            <div className="h-4 w-12 shimmer shimmer-light shimmer-dark rounded mx-auto"></div>
          </div>
          <div className="flex-1 text-center">
            <div className="h-3 w-16 shimmer shimmer-light shimmer-dark rounded mx-auto mb-1"></div>
            <div className="h-4 w-12 shimmer shimmer-light shimmer-dark rounded mx-auto"></div>
          </div>
          <div className="flex-1 text-center">
            <div className="h-3 w-16 shimmer shimmer-light shimmer-dark rounded mx-auto mb-1"></div>
            <div className="h-4 w-12 shimmer shimmer-light shimmer-dark rounded mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCardShimmer;
