const SelectCommunityCreateEventShimmer = () => {
  return (
    <div >
      {/* Community List Shimmer (matching actual layout size) */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center p-4 border border-gray-300 dark:border-zinc-700  rounded-lg gap-4 "
          >
            {/* Logo shimmer (48x48 like actual image) */}
            <div className="h-12 w-12 rounded-full  shimmer shimmer-light shimmer-dark flex-shrink-0" />

            {/* Text shimmer area */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Community name shimmer */}
              <div className="h-4 w-1/2 rounded  shimmer shimmer-light shimmer-dark" />

              {/* Member count shimmer */}
              <div className="h-3 w-1/4 rounded shimmer shimmer-light shimmer-dark" />
            </div>

            {/* Chevron shimmer icon */}
            <div className="h-4 w-4 rounded shimmer shimmer-light shimmer-dark flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectCommunityCreateEventShimmer;
