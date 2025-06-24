import React from "react";

const WeatherPageShimmer = () => {
  const shimmerBox = (
    <div className="border rounded-lg p-4 shadow-md dark:bg-zinc-900 dark:border-zinc-600 space-y-4">
      <div className="h-4 w-1/3 shimmer shimmer-light shimmer-dark rounded" />
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <div className="h-3 w-24 shimmer shimmer-light shimmer-dark rounded" />
          <div className="h-3 w-10 shimmer shimmer-light shimmer-dark rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-3 w-28 shimmer shimmer-light shimmer-dark rounded" />
          <div className="h-3 w-12 shimmer shimmer-light shimmer-dark rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-3 w-28 shimmer shimmer-light shimmer-dark rounded" />
          <div className="h-3 w-14 shimmer shimmer-light shimmer-dark rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-2 text-green-800 dark:text-green-200 space-y-6 animate-pulse">
      {/* Title Section */}
      <div className="flex items-center space-x-4 border p-4 rounded-lg shadow-md dark:border-zinc-600 dark:bg-zinc-900">
        <div className="h-10 w-10 shimmer shimmer-light shimmer-dark rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-32 shimmer shimmer-light shimmer-dark rounded" />
          <div className="h-3 w-20 shimmer shimmer-light shimmer-dark rounded" />
        </div>
      </div>

      {/* Grid of Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shimmerBox}
        {shimmerBox}
        {shimmerBox}
        {/* Sunlight box has 2 rows only */}
        <div className="border rounded-lg p-4 shadow-md dark:bg-zinc-900 dark:border-zinc-600 space-y-4">
          <div className="h-4 w-1/3 shimmer shimmer-light shimmer-dark rounded" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 shimmer shimmer-light shimmer-dark rounded" />
              <div className="h-3 w-16 shimmer shimmer-light shimmer-dark rounded" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 shimmer shimmer-light shimmer-dark rounded" />
              <div className="h-3 w-16 shimmer shimmer-light shimmer-dark rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPageShimmer;
