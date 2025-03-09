import React from 'react'

function UserDashBoard() {
  return (
    <div>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Top Navigation Bar */}
        <nav className="bg-green-700 text-white p-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <div className="font-bold text-xl mr-2">FarmConnect</div>
            <div className="hidden md:flex ml-4 bg-green-600 rounded-full px-3 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                className="bg-transparent outline-none placeholder-green-100 w-64"
                placeholder="Search crops, farmers, or topics..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex flex-1 p-4">
          {/* Left Sidebar */}
          <div className="hidden md:block w-56 mr-4">
            <div className="bg-white rounded-lg shadow mb-4 p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="ml-2">
                  <div className="font-semibold">John Farmer</div>
                  <div className="text-xs text-gray-500">Vegetable Grower</div>
                </div>
              </div>

              <ul className="space-y-2">
                <li className="flex items-center p-2 rounded-md cursor-pointer bg-green-100 text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  <span>Home</span>
                </li>
                <li className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  <span>My Network</span>
                </li>
                <li className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>Events</span>
                </li>
                <li className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <span>Messages</span>
                </li>
                <li className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <span>Settings</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Upcoming Events</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="bg-green-100 text-green-700 rounded-md p-2 text-xs font-semibold w-16 text-center">
                    Mar 12
                  </div>
                  <div className="ml-2 text-sm">Farmers Market</div>
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 text-green-700 rounded-md p-2 text-xs font-semibold w-16 text-center">
                    Mar 15
                  </div>
                  <div className="ml-2 text-sm">Sustainable Farming Workshop</div>
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 text-green-700 rounded-md p-2 text-xs font-semibold w-16 text-center">
                    Mar 20
                  </div>
                  <div className="ml-2 text-sm">Community Seed Exchange</div>
                </li>
              </ul>
              <button className="text-green-700 text-sm mt-3 font-semibold">
                View All Events
              </button>
            </div>
          </div>

          {/* Center Content - Feed */}
          <div className="flex-1 max-w-2xl mx-auto">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow mb-4 p-4">
              <div className="flex">
                <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <input
                  className="flex-1 ml-3 bg-gray-100 rounded-full px-4 py-2 outline-none"
                  placeholder="Share farming updates, tips, or questions..."
                />
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t">
                <button className="flex items-center text-gray-600 text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                  Photos
                </button>
                <button className="flex items-center text-gray-600 text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  Event
                </button>
                <button className="flex items-center text-gray-600 text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  Market Prices
                </button>
              </div>
            </div>

            {/* Feed Posts */}
            <div className="bg-white rounded-lg shadow mb-4">
              <div className="p-4">
                <div className="flex items-start">
                  <img src="/api/placeholder/40/40" alt="Sarah Johnson" className="w-10 h-10 rounded-full" />
                  <div className="ml-2 flex-1">
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-xs text-gray-500">
                      Organic Farmer • 2 hours ago
                      <span> • <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mb-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Greenfield County</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <p>Just finished planting our new heirloom tomato varieties! Looking forward to a bountiful harvest this summer. Anyone else trying new varieties this season?</p>
                </div>
                <div className="mt-3">
                  <img src="/api/placeholder/500/300" alt="Post content" className="w-full rounded-md" />
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t text-gray-500 text-sm">
                  <button className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span>24</span>
                  </button>
                  <button className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    <span>8</span>
                  </button>
                  <button className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    <span>3</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-4">
              <div className="p-4">
                <div className="flex items-start">
                  <img src="/api/placeholder/40/40" alt="Michael Rodriguez" className="w-10 h-10 rounded-full" />
                  <div className="ml-2 flex-1">
                    <div className="font-semibold">Michael Rodriguez</div>
                    <div className="text-xs text-gray-500">
                      Cattle Rancher • 5 hours ago
                      <span> • <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mb-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Prairie Hills</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <p>Weather alert: Heavy rain expected this weekend. Make sure to secure your livestock and equipment. Stay safe everyone!</p>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t text-gray-500 text-sm">
                  <button className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span>45</span>
                  </button>
                  <button className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    <span>12</span>
                  </button>
                  <button className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    <span>18</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-64 ml-4">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-semibold mb-3">Weather Forecast</h3>
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold">72°F</div>
                <div className="text-sm">Sunny</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <div>Tomorrow</div>
                  <div>75°F</div>
                </div>
                <div className="flex justify-between">
                  <div>Tuesday</div>
                  <div>68°F</div>
                </div>
                <div className="flex justify-between">
                  <div>Wednesday</div>
                  <div>64°F</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Connections</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <img src="/api/placeholder/40/40" alt="Local Growers Association" className="w-8 h-8 rounded-full" />
                  <div className="ml-2 text-sm flex-1">Local Growers Association</div>
                  <button className="text-xs bg-green-700 text-white rounded-md px-2 py-1">
                    Follow
                  </button>
                </li>
                <li className="flex items-center">
                  <img src="/api/placeholder/40/40" alt="Farm Equipment Exchange" className="w-8 h-8 rounded-full" />
                  <div className="ml-2 text-sm flex-1">Farm Equipment Exchange</div>
                  <button className="text-xs bg-green-700 text-white rounded-md px-2 py-1">
                    Follow
                  </button>
                </li>
                <li className="flex items-center">
                  <img src="/api/placeholder/40/40" alt="County Agriculture Department" className="w-8 h-8 rounded-full" />
                  <div className="ml-2 text-sm flex-1">County Agriculture Department</div>
                  <button className="text-xs bg-green-700 text-white rounded-md px-2 py-1">
                    Follow
                  </button>
                </li>
              </ul>
              <button className="text-green-700 text-sm mt-3 font-semibold">
                See All Connections
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <h3 className="font-semibold mb-3">Market Prices</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <div>Corn (bushel)</div>
                  <div className="font-medium">$4.25</div>
                </div>
                <div className="flex justify-between">
                  <div>Wheat (bushel)</div>
                  <div className="font-medium">$5.80</div>
                </div>
                <div className="flex justify-between">
                  <div>Soybeans (bushel)</div>
                  <div className="font-medium">$12.45</div>
                </div>
              </div>
              <button className="text-green-700 text-sm mt-3 font-semibold">
                View All Prices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashBoard
