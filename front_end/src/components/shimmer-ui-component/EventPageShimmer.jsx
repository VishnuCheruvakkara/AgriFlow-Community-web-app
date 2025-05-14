const EventPageShimmer = () => (
  <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-gray-300 dark:border-zinc-700 flex flex-col h-full space-y-3">
    <div className="w-full h-40 shimmer shimmer-light shimmer-dark rounded-md" />
    <div className="h-4 shimmer shimmer-light shimmer-dark rounded w-3/4" />
    <div className="h-3 shimmer shimmer-light shimmer-dark rounded w-1/2" />
    <div className="h-3 shimmer shimmer-light shimmer-dark rounded w-full" />
    <div className="h-3 shimmer shimmer-light shimmer-dark rounded w-2/3" />
    <div className="mt-3 h-10 shimmer shimmer-light shimmer-dark rounded w-full" />
  </div>
);

export default EventPageShimmer;