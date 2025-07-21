import React from "react";

const CommunityChatShimmer = () => {
  return (
    <div className="flex mt-4 flex-col w-full border border-gray-200 dark:border-zinc-700 bg-gray-300 dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden lg:h-[80vh] h-[77vh] animate-pulse">
      {/* Header Shimmer */}
      <div className="bg-white dark:bg-zinc-900 border-b dark:border-zinc-700 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded-full shimmer"></div>
          <div className="ml-3">
            <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-700 rounded shimmer"></div>
            <div className="h-3 w-40 mt-2 bg-gray-200 dark:bg-zinc-700 rounded shimmer"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded-full shimmer"></div>
      </div>

      {/* Messages Shimmer */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-zinc-100 dark:bg-zinc-900">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`chat ${i % 2 === 0 ? "chat-start" : "chat-end"}`}>
            <div className="chat-image avatar">
              <div className="w-10 h-10 bg-gray-300 dark:bg-zinc-700 rounded-full shimmer" />
            </div>
            <div className="chat-header h-3 w-20 bg-gray-300 dark:bg-zinc-700 rounded shimmer mb-1"></div>
            <div className="chat-bubble p-3 rounded-xl w-[300px] bg-gray-300 dark:bg-zinc-700 shimmer"></div>
            <div className="chat-footer h-2 w-16 mt-1 bg-gray-300 dark:bg-zinc-700 rounded shimmer"></div>
          </div>
        ))}
      </div>

      {/* Message Input Shimmer */}
      <div className="bg-white dark:bg-zinc-900 p-3 border-t dark:border-zinc-700 flex items-end gap-2">
        <div className="w-8 h-8 mb-2 bg-gray-200 dark:bg-zinc-700 rounded-full shimmer"></div>
        <div className="w-8 h-8 mb-2 bg-gray-200 dark:bg-zinc-700 rounded-full shimmer"></div>
        <div className="flex-1 h-12 bg-gray-200 dark:bg-zinc-700 rounded-2xl shimmer"></div>
        <div className="w-10 h-10 mb-1 bg-gray-300 dark:bg-zinc-700 rounded-full shimmer"></div>
      </div>
    </div>
  );
};

export default CommunityChatShimmer;
