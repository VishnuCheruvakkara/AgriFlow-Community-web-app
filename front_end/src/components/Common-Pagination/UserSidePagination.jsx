// components/common/Pagination.jsx

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, hasPrev, hasNext }) => {
  return (
    <div className="p-2 flex justify-between items-center mt-6 border border-gray-300 rounded-md">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev || currentPage === 1}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-900 transition-colors duration-300"
      >
        Previous
      </button>

      <span className="text-gray-700 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext || currentPage === totalPages}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-900 transition-colors duration-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
