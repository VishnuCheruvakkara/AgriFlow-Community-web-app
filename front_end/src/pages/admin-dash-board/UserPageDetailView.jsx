import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSeedling, FaCalendarAlt, FaIdCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function UserPageDetailView() {
  return (
    <div className="max-w-full mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Header with background */}
      <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b border-gray-200">
          <div className="relative">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile Picture"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
              <FaCheckCircle className="text-lg" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">John Doe</h2>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-center md:justify-start text-gray-600">
                <FaEnvelope className="mr-2 text-green-500" />
                <span>johndoe@example.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-gray-600">
                <FaPhone className="mr-2 text-green-500" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-gray-600">
                <FaCalendarAlt className="mr-2 text-green-500" />
                <span>DOB: January 15, 1985</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Address */}
          <div className="bg-gray-50 rounded-lg p-4 shadow-md">
            <div className="flex items-center mb-3">
              <FaMapMarkerAlt className="text-xl text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-700">Address</h3>
            </div>
            <div className="pl-7">
              <p className="text-gray-600 mb-1">123, Green Street, New York</p>
              <p className="text-gray-600 mb-1">Country: United States</p>
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <span className="mr-3">Lat: 40.712776</span>
                <span>Long: -74.005974</span>
              </div>
            </div>
          </div>

          {/* Farming Details */}
          <div className="bg-gray-50 rounded-lg p-4 shadow-md">
            <div className="flex items-center mb-3">
              <FaSeedling className="text-xl text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-700">Farming Details</h3>
            </div>
            <div className="pl-7">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">Organic Farming</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">5 years</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-gray-600 text-sm italic">
                  "I'm passionate about sustainable farming practices and have been growing organic vegetables for the local market."
                </p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-gray-50 rounded-lg p-4 shadow-md md:col-span-2">
            <div className="flex items-center mb-3">
              <FaIdCard className="text-xl text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-700">Verification Status</h3>
            </div>
            <div className="pl-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                <span className="text-gray-600">Profile Completed</span>
                <div className="flex items-center text-green-500">
                  <FaCheckCircle className="mr-1" />
                  <span className="font-medium">Yes</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                <span className="text-gray-600">Email Verified</span>
                <div className="flex items-center text-green-500">
                  <FaCheckCircle className="mr-1" />
                  <span className="font-medium">Yes</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                <span className="text-gray-600">Phone Verified</span>
                <div className="flex items-center text-green-500">
                  <FaCheckCircle className="mr-1" />
                  <span className="font-medium">Yes</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                <span className="text-gray-600">Aadhaar Verified</span>
                <div className="flex items-center text-green-500">
                  <FaCheckCircle className="mr-1" />
                  <span className="font-medium">Yes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
          <div>Created: Apr 01, 2023</div>
          <div>Last Updated: Mar 15, 2025</div>
        </div>
      </div>
    </div>
  );
}

export default UserPageDetailView;