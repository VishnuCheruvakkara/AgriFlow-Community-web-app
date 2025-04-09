import React from 'react';
import { Search, Globe, Lock } from 'lucide-react';
import DeafultCommunityIcon from "../../../assets/images/user-group-default.png"

function DiscoverCommunities() {
  return (
    <>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search communities..."
          className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Community Card 1 */}
        <div className="bg-gray-50 rounded-lg p-4 flex items-start">
          <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4">
            <img src={DeafultCommunityIcon} alt="Community" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-green-700">Organic Farmers Group</h3>
              <Globe className="ml-2 text-gray-500 text-sm" />
            </div>
            <p className="text-sm text-gray-600 mt-1">A community for farmers practicing organic farming methods</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">324 members</span>
              <button className="px-4 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Community Card 2 */}
        <div className="bg-gray-50 rounded-lg p-4 flex items-start">
          <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4">
            <img src={DeafultCommunityIcon} alt="Community" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-green-700">Sustainable Farming</h3>
              <Globe className="ml-2 text-gray-500 text-sm" />
            </div>
            <p className="text-sm text-gray-600 mt-1">Focused on sustainable agricultural practices and innovations</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">512 members</span>
              <button className="px-4 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Community Card 3 */}
        <div className="bg-gray-50 rounded-lg p-4 flex items-start">
          <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden mr-4">
            <img src={DeafultCommunityIcon} alt="Community" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-green-700">Local Farmer Market</h3>
              <Lock className="ml-2 text-gray-500 text-sm" />
            </div>
            <p className="text-sm text-gray-600 mt-1">Connect with farmers selling produce directly to consumers</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">189 members</span>
              <button className="px-4 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition">
                Request to Join
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button className="px-6 py-2 text-green-600 font-medium hover:text-green-700">
          Load More Communities
        </button>
      </div>
    </>
  );
}

export default DiscoverCommunities;