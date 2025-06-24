import React from 'react';

const WeatherCardShimmer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-pulse">

      {/* Left: Temperature & Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shimmer shimmer-light shimmer-dark rounded-full"></div>
          <div className="h-6 w-24 shimmer shimmer-light shimmer-dark rounded"></div>
        </div>
        <div className="h-4 w-32 shimmer shimmer-light shimmer-dark rounded"></div>
        <div className="h-4 w-28 shimmer shimmer-light shimmer-dark rounded"></div>
      </div>

      {/* Right: Blur Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1 */}
        <div className="p-4 backdrop-blur-md bg-white/60 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 shimmer shimmer-light shimmer-dark rounded-full"></div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-24 shimmer shimmer-light shimmer-dark rounded"></div>
              <div className="h-4 w-16 shimmer shimmer-light shimmer-dark rounded"></div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 backdrop-blur-md bg-white/60 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 shimmer shimmer-light shimmer-dark rounded-full"></div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-24 shimmer shimmer-light shimmer-dark rounded"></div>
              <div className="h-4 w-16 shimmer shimmer-light shimmer-dark rounded"></div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 backdrop-blur-md bg-white/60 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 shimmer shimmer-light shimmer-dark rounded-full"></div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-24 shimmer shimmer-light shimmer-dark rounded"></div>
              <div className="h-4 w-16 shimmer shimmer-light shimmer-dark rounded"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WeatherCardShimmer;
