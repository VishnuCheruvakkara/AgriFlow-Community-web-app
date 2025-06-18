import React from 'react';

const ProductDetailsShimmer = () => {
  return (
    <div className="flex flex-col w-full rounded-md bg-white shadow-lg overflow-y-auto no-scrollbar dark:bg-zinc-800 dark:text-zinc-200">
      {/* Header Shimmer */}
      <div className="bg-gradient-to-r  px-4 py-4 flex justify-between items-center dark:bg-zinc-900 ">
        <div className="h-6 w-32 rounded shimmer shimmer-light shimmer-dark bg-white/20" />
        <div className="h-8 w-8 rounded-full shimmer shimmer-light shimmer-dark bg-white/20" />
      </div>

      {/* Product Image Gallery Shimmer */}
      <div className="h-64 w-full shimmer shimmer-light shimmer-dark" />

      {/* Product Title & Actions Shimmer */}
      <div className="bg-white py-4 flex flex-col items-center border-b-2 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="border-b-2 text-center w-full pb-3 dark:border-zinc-800">
          <div className="h-6 w-48 rounded shimmer shimmer-light shimmer-dark mx-auto" />
        </div>

        {/* Edit/Contact Button Shimmer */}
        <div className="mt-5 h-12 w-40 rounded-full shimmer shimmer-light shimmer-dark" />

        {/* Availability Status Shimmer */}
        <div className="flex gap-2 mt-3">
          <div className="h-8 w-20 rounded-full shimmer shimmer-light shimmer-dark" />
        </div>
      </div>

      {/* Product Info Shimmer */}
      <div className="bg-white p-2 space-y-2 border-b dark:bg-zinc-900 dark:border-zinc-800">
        {/* Price Info Shimmer */}
        <div className="flex text-sm px-2 py-4 rounded-sm ">
          <div className="w-48 flex items-center gap-4">
            <div className="h-4 w-4 rounded-full shimmer shimmer-light shimmer-dark" />
            <div className="h-4 w-12 rounded shimmer shimmer-light shimmer-dark" />
          </div>
          
          <div className="h-4 w-16 rounded shimmer shimmer-light shimmer-dark" />
        </div>

        {/* Quantity Info Shimmer */}
        <div className="flex text-sm px-2 py-3 rounded-sm">
          <div className="w-48 flex items-center gap-4">
            <div className="h-4 w-4 rounded shimmer shimmer-light shimmer-dark" />
            <div className="h-4 w-16 rounded shimmer shimmer-light shimmer-dark" />
          </div>
          
          <div className="h-4 w-20 rounded shimmer shimmer-light shimmer-dark" />
        </div>
      </div>

      {/* Details Section Shimmer */}
      <div className="flex flex-col">
        {/* Created Date Shimmer */}
        <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-start">
            <div className="h-4 w-4 rounded mt-1 mr-3 shimmer shimmer-light shimmer-dark" />
            <div className="flex-1">
              <div className="h-4 w-24 rounded shimmer shimmer-light shimmer-dark mb-2" />
              <div className="h-4 w-32 rounded shimmer shimmer-light shimmer-dark" />
            </div>
          </div>
        </div>

        {/* Closing Date Shimmer */}
        <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-start">
            <div className="h-4 w-4 rounded mt-1 mr-3 shimmer shimmer-light shimmer-dark" />
            <div className="flex-1">
              <div className="h-4 w-24 rounded shimmer shimmer-light shimmer-dark mb-2" />
              <div className="h-4 w-32 rounded shimmer shimmer-light shimmer-dark" />
            </div>
          </div>
        </div>

        {/* About Product Shimmer */}
        <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-start">
            <div className="h-4 w-4 rounded mt-1 mr-3 shimmer shimmer-light shimmer-dark" />
            <div className="flex-1">
              <div className="h-4 w-32 rounded shimmer shimmer-light shimmer-dark mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded shimmer shimmer-light shimmer-dark" />
                <div className="h-4 w-4/5 rounded shimmer shimmer-light shimmer-dark" />
                <div className="h-4 w-3/4 rounded shimmer shimmer-light shimmer-dark" />
              </div>
            </div>
          </div>
        </div>

        {/* Location Details Shimmer */}
        <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-start">
            <div className="h-4 w-4 rounded mt-1 mr-3 shimmer shimmer-light shimmer-dark" />
            <div className="flex-1">
              <div className="h-4 w-28 rounded shimmer shimmer-light shimmer-dark mb-2" />
              <div className="h-4 w-48 rounded shimmer shimmer-light shimmer-dark" />
            </div>
          </div>
          
          {/* View Location Button Shimmer */}
          <div className="py-4 pl-7">
            <div className="h-12 w-48 rounded-full shimmer shimmer-light shimmer-dark" />
          </div>
        </div>
      </div>

      {/* Delete Button Shimmer */}
      <div className="flex items-center justify-center gap-2 w-full mt-2 p-4 border-b bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <div className="h-5 w-5 rounded shimmer shimmer-light shimmer-dark" />
        <div className="h-4 w-24 rounded shimmer shimmer-light shimmer-dark" />
      </div>
    </div>
  );
};

export default ProductDetailsShimmer;