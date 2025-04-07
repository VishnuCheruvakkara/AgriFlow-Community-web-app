import React from 'react'
// Importing necessary icons from react-icons
import { FaCloudSun, FaPlus, FaEllipsisH } from 'react-icons/fa';
import { BsCalendarEvent } from 'react-icons/bs';
import defaultFarmerImage from '../../assets/images/farmer-wheat-icons.png'
import defaultUserImage from '../../assets/images/user-default.png'
import tomatoImage from '../../assets/images/tomato-1.jpg'
import defaultGroupImage from '../../assets/images/user-group-default.png'
import { useSelector } from 'react-redux';
import CustomScrollToTop from '../../components/CustomScrollBottomToTop/CustomScrollToTop';

function Home() {

  const user = useSelector((state) => state.user.user)

  return (
    <>
      {/* for scroll set up  */}
      <CustomScrollToTop />

      <div className="lg:w-10/12 space-y-4 mt-4 mb-11">
        {/* Welcome bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.username || "Farmer"} !</h1>
          <p className="text-gray-600">Stay informed with the latest news and trends in agriculture this season.</p>
        </div>

        {/* Create post card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex space-x-3">

            <div className="h-10 w-10 border rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <img
                src={user?.profile_picture || defaultUserImage}
                alt="User profile"
                className="h-full w-full object-cover"
              />
            </div>


            <div className="flex-1">
              <input
                type="text"
                placeholder="Share something with the community..."
                className="bg-white text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <div className="flex justify-between mt-3">
                <div className="flex space-x-2">
                  <button className="flex items-center text-gray-600 hover:text-green-600 text-sm">
                    <FaPlus className="mr-1" /> Photo
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-green-600 text-sm">
                    <FaPlus className="mr-1" /> Video
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-green-600 text-sm">
                    <FaPlus className="mr-1" /> Event
                  </button>
                </div>
                <button className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition-colors">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 border rounded-full bg-gray-200 overflow-hidden">
                <img src={defaultUserImage} alt="User profile" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-green-700">Sarah Williams</p>
                <p className="text-xs text-gray-500">Posted 2 hours ago</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <FaEllipsisH />
            </button>
          </div>
          <div className="mb-4">
            <p className="text-gray-800">Just harvested my first batch of organic tomatoes! The new irrigation system has really improved the yield this season. 🍅</p>
          </div>
          <div className="mb-4 bg-gray-200 rounded-lg overflow-hidden">
            <img src={tomatoImage} alt="Post image" className=" w-full object-cover" />
          </div>
          <div className="flex justify-between text-gray-600 pb-3 border-b">
            <span>42 likes</span>
            <span>12 comments</span>
          </div>
          <div className="flex justify-around pt-3">
            <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
              </svg>
              Like
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              Comment
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
              Share
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 border rounded-full bg-gray-200 overflow-hidden">
                <img src={defaultUserImage} alt="User profile" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-green-700">Mike Johnson</p>
                <p className="text-xs text-gray-500">Posted yesterday</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <FaEllipsisH />
            </button>
          </div>
          <div className="mb-4">
            <p className="text-gray-800">Anyone dealing with the wheat rust this season? I've been trying a new fungicide that seems to be working well. Happy to share details if anyone is interested!</p>
          </div>
          <div className="flex justify-between text-gray-600 pb-3 border-b">
            <span>18 likes</span>
            <span>23 comments</span>
          </div>
          <div className="flex justify-around pt-3">
            <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
              </svg>
              Like
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              Comment
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Right sidebar - Weather, Suggestions, Events, Schemes */}
      <div className="lg:w-1/3 space-y-4 hidden lg:block">
        {/* Weather card - Moved from left to right */}
        <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800">Weather</h2>
            <span className="text-blue-500 text-sm cursor-pointer">View Forecast</span>
          </div>
          <div className="flex items-center justify-center flex-col">
            <FaCloudSun className="text-5xl text-yellow-500 mb-2" />
            <span className="text-3xl font-bold text-black">28°C</span>
            <p className="text-gray-600">Partly Cloudy</p>
            <div className="flex justify-between w-full mt-4 text-sm text-gray-600">
              <div className="text-center">
                <p>Humidity</p>
                <p className="font-semibold">65%</p>
              </div>
              <div className="text-center">
                <p>Wind</p>
                <p className="font-semibold">12 km/h</p>
              </div>
              <div className="text-center">
                <p>Rainfall</p>
                <p className="font-semibold">30%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800">Suggestions</h2>
            <span className="text-blue-500 text-sm cursor-pointer">See All</span>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src={defaultGroupImage} alt="User profile" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-green-700">Organic Farmers Group</p>
                  <p className="text-xs text-gray-500">324 members</p>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-700">
                <FaPlus />
              </button>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src={defaultGroupImage} alt="User profile" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-green-700">Sustainable Farming</p>
                  <p className="text-xs text-gray-500">512 members</p>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-700">
                <FaPlus />
              </button>
            </li>
          </ul>
        </div>

        {/* Events card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800">Upcoming Events</h2>
            <span className="text-blue-500 text-sm cursor-pointer">See All</span>
          </div>
          <ul className="space-y-3">
            <li className="border-l-4 border-green-500 pl-3 py-1">
              <p className="font-semibold text-gray-600">Seed Distribution</p>
              <div className="flex items-center text-sm text-gray-600">
                <BsCalendarEvent className="mr-1" />
                <span>Tomorrow, 10:00 AM</span>
              </div>
            </li>
            <li className="border-l-4 border-blue-500 pl-3 py-1">
              <p className="font-semibold text-gray-600">Irrigation Workshop</p>
              <div className="flex items-center text-sm text-gray-600">
                <BsCalendarEvent className="mr-1" />
                <span>Mar 15, 2:00 PM</span>
              </div>
            </li>
            <li className="border-l-4 border-yellow-500 pl-3 py-1">
              <p className="font-semibold text-gray-600 ">Community Meeting</p>
              <div className="flex items-center text-sm text-gray-600">
                <BsCalendarEvent className="mr-1" />
                <span>Mar 20, 4:30 PM</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Govt Schemes card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800">Govt Schemes</h2>
            <span className="text-blue-500 text-sm cursor-pointer">View All</span>
          </div>
          <ul className="space-y-3">
            <li className="p-3 bg-green-50 rounded-lg border-l-4 border-green-600">
              <p className="font-semibold text-gray-800">Crop Insurance Scheme</p>
              <p className="text-sm text-gray-600 mt-1">Applications open until Mar 31</p>
              <button className="mt-2 text-sm text-green-600 font-medium hover:text-green-700">Apply Now</button>
            </li>
            <li className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <p className="font-semibold text-gray-800">Solar Pump Subsidy</p>
              <p className="text-sm text-gray-600 mt-1">50% subsidy on installation</p>
              <button className="mt-2 text-sm text-blue-600 font-medium hover:text-blue-700">Check Eligibility</button>
            </li>
          </ul>
        </div>
      </div>


    </>
  )
}

export default Home;
