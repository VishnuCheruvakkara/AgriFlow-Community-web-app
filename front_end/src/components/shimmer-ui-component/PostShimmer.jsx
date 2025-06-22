

const PostShimmer = () => (
  <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4 animate-pulse space-y-4 border border-gray-200 dark:border-zinc-700">
    
    {/* Author info */}
    <div className="flex justify-between mb-4 border-b border-gray-200 dark:border-zinc-600 pb-3">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full shimmer shimmer-light shimmer-dark" />
        <div className="space-y-2">
          <div className="h-3 w-32 shimmer shimmer-light shimmer-dark rounded" />
          <div className="h-2 w-20 shimmer shimmer-light shimmer-dark rounded" />
        </div>
      </div>
      <div className="h-4 w-4 shimmer shimmer-light shimmer-dark rounded-full" />
    </div>

    {/* Post content */}
    <div className="space-y-2">
      <div className="h-3 w-full shimmer shimmer-light shimmer-dark rounded" />
      <div className="h-3 w-5/6 shimmer shimmer-light shimmer-dark rounded" />
    </div>
        
    
    {/* Post image/video placeholder */}
    <div className="h-48 w-full shimmer shimmer-light shimmer-dark rounded-md" />

    {/* Buttons */}
    <div className="flex justify-around border-t pt-4 dark:border-zinc-600">
      <div className="h-6 w-20 shimmer shimmer-light shimmer-dark rounded" />
      <div className="h-6 w-20 shimmer shimmer-light shimmer-dark rounded" />
      <div className="h-6 w-20 shimmer shimmer-light shimmer-dark rounded" />
    </div>
  </div>
);

export default PostShimmer;
