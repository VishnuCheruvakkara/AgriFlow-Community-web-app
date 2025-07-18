import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, hasPrev, hasNext }) => {
  const renderPages = () => {
    const pages = [];
    
    // If total pages is 3 or less, show all pages
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage;
        pages.push(
          <li key={i}>
            <button
              onClick={() => onPageChange(i)}
              className={`w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border transition-colors duration-200
                ${isActive
                  ? 'text-white bg-green-600 border-green-600 dark:bg-green-600 dark:border-green-700'
                  : 'text-zinc-600 bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white'}
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {i}
            </button>
          </li>
        );
      }
    } else {
      // For more than 3 pages, show ellipsis pattern
      if (currentPage === 1) {
        // First page: show [1] ... [last]
        pages.push(
          <li key={1}>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border transition-colors duration-200 text-white bg-green-600 border-green-600 dark:bg-green-600 dark:border-green-700"
              aria-current="page"
            >
              1
            </button>
          </li>
        );
        
        pages.push(
          <li key="ellipsis">
            <span className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              ...
            </span>
          </li>
        );
        
        pages.push(
          <li key={totalPages}>
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border transition-colors duration-200 text-zinc-600 bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {totalPages}
            </button>
          </li>
        );
      } else if (currentPage === totalPages) {
        // Last page: show [1] ... [last]
        pages.push(
          <li key={1}>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border transition-colors duration-200 text-zinc-600 bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              1
            </button>
          </li>
        );
        
        pages.push(
          <li key="ellipsis">
            <span className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              ...
            </span>
          </li>
        );
        
        pages.push(
          <li key={totalPages}>
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border transition-colors duration-200 text-white bg-green-600 border-green-600 dark:bg-green-600 dark:border-green-700"
              aria-current="page"
            >
              {totalPages}
            </button>
          </li>
        );
      } else {
        // Middle pages: show [1] ... [current] ... [last]
        pages.push(
          <li key={1}>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border transition-colors duration-200 text-zinc-600 bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              1
            </button>
          </li>
        );
        
        pages.push(
          <li key="ellipsis1">
            <span className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              ...
            </span>
          </li>
        );
        
        pages.push(
          <li key={currentPage}>
            <button
              onClick={() => onPageChange(currentPage)}
              className="w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border transition-colors duration-200 text-white bg-green-600 border-green-600 dark:bg-green-600 dark:border-green-700"
              aria-current="page"
            >
              {currentPage}
            </button>
          </li>
        );
        
        pages.push(
          <li key="ellipsis2">
            <span className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              ...
            </span>
          </li>
        );
        
        pages.push(
          <li key={totalPages}>
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border transition-colors duration-200 text-zinc-600 bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {totalPages}
            </button>
          </li>
        );
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-green-500 px-2">
      {/* Left: Page info */}
      <div className="text-sm text-zinc-600 dark:text-zinc-300">
        Page {currentPage} of {totalPages}
      </div>
      {/* Right: Pagination */}
      <nav aria-label="Page navigation">
        <ul className="flex items-center gap-2 text-base">
          {/* Previous */}
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrev || currentPage === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center border text-zinc-600 bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg className="w-3 h-3 rtl:rotate-180" fill="none" viewBox="0 0 6 10">
                <path d="M5 1 1 5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </li>
          {/* Page Numbers */}
          {renderPages()}
          {/* Next */}
          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNext || currentPage === totalPages}
              className="w-10 h-10 rounded-full flex items-center justify-center border text-zinc-600 bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg className="w-3 h-3 rtl:rotate-180" fill="none" viewBox="0 0 6 10">
                <path d="m1 9 4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination ;
