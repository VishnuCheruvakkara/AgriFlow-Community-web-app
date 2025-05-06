
import React from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { Search } from 'lucide-react';


function MyEvents() {
  return (
    <div className="space-y-6">

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search communities..."


          className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-500 ease-in-out"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

        <button

          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-300"
        >
          <ImCancelCircle size={20} />
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <p className="text-gray-500">You haven’t joined any events yet.</p>
      </div>
    </div>
  );
}

export default MyEvents;
