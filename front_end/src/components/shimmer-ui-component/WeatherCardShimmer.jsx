import React from 'react';

const WeatherCardShimmer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-pulse w-full">

      {/* Left: Temperature & Location */}
      <div className="space-y-3 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="h-8 w-8 shimmer shimmer-light shimmer-dark rounded-full"></div>
          <div className="h-6 w-1/3 shimmer shimmer-light shimmer-dark rounded"></div>
        </div>
        <div className="h-4 w-1/2 shimmer shimmer-light shimmer-dark rounded"></div>
        <div className="h-4 w-1/3 shimmer shimmer-light shimmer-dark rounded"></div>
      </div>

      {/* Right: Blur Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-w-0">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="p-4 backdrop-blur-md bg-white/60 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md min-w-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-6 w-6 shimmer shimmer-light shimmer-dark rounded-full flex-shrink-0"></div>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="h-3 w-full shimmer shimmer-light shimmer-dark rounded max-w-[80%]"></div>
                <div className="h-4 w-full shimmer shimmer-light shimmer-dark rounded max-w-[60%]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WeatherCardShimmer;
