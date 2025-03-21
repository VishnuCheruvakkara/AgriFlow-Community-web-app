import React from 'react';
import { FaUser, FaMapMarkerAlt, FaIdCard, FaLeaf, FaInfoCircle, FaFileUpload, FaCheckCircle } from 'react-icons/fa';
import { MdEmail, MdOutlineDescription } from 'react-icons/md';
import { GiFarmTractor, GiWheat } from 'react-icons/gi';

const UserProfileForm = () => {
  return (
    <div className="lg:w-10/12 space-y-4 mt-4 mb-11">
      {/* Profile Completion Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
        <p className="text-gray-600">Please complete your profile to access all features of AgriFlow</p>
        
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-green-600 h-2.5 rounded-full w-0" id="profile-progress"></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Profile completion: 0%</p>
      </div>

      {/* Profile Form */}
      <form className="space-y-6">

{/* Basic Info Section */}
<div className="bg-white rounded-lg shadow-sm p-6">
  <div className="flex items-center mb-4">
    <FaUser className="text-green-600 mr-2" />
    <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* First Name */}
    <div>
      <label className="block text-gray-700 mb-2" htmlFor="first-name">First Name</label>
      <input
        type="text"
        id="first-name"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your first name"
      />
    </div>

    {/* Last Name */}
    <div>
      <label className="block text-gray-700 mb-2" htmlFor="last-name">Last Name</label>
      <input
        type="text"
        id="last-name"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your last name"
      />
    </div>

    {/* Username */}
    <div>
      <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Choose a username"
      />
    </div>

    {/* Email */}
    <div>
      <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
      <div className="relative">
        <input
          type="email"
          id="email"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
          placeholder="Your email address"
        />
        <MdEmail className="absolute left-3 top-3.5 text-gray-500" />
      </div>
    </div>

    {/* Profile Picture */}
    <div className="md:col-span-2">
      <label className="block text-gray-700 mb-2" htmlFor="profile-picture">Profile Picture</label>
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          <img src="/api/placeholder/80/80" alt="Profile" className="h-full w-full object-cover hidden" id="profile-preview" />
          <FaUser className="text-gray-400 text-3xl" id="profile-placeholder" />
        </div>
        <div className="flex-1">
          <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <FaFileUpload className="text-gray-400 mr-2" />
            <span className="text-gray-500">Upload picture</span>
            <input type="file" className="hidden" id="profile-picture" accept="image/*" />
          </label>
        </div>
      </div>
    </div>
  </div>
</div>

              

        
        {/* Location Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Location Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="location-name">Village/City Name</label>
              <input
                type="text"
                id="location-name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your village or city"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="address">Full Address</label>
              <input
                type="text"
                id="address"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your complete address"
              />
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-3">Click the button below to automatically detect your location</p>
              <button
                type="button"
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <FaMapMarkerAlt className="mr-2" />
                Detect My Location
              </button>
            </div>
          </div>
        </div>
        
        {/* Farming Experience Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <GiFarmTractor className="text-green-600 mr-2 text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">Farming Experience</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="experience">Years of Experience</label>
              <input
                type="number"
                id="experience"
                min="0"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter years of farming experience"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="farming-type">Farming Type</label>
              <select
                id="farming-type"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select your farming type</option>
                <option value="Organic">Organic Farming</option>
                <option value="Conventional">Conventional Farming</option>
                <option value="Mixed">Mixed Farming</option>
                <option value="Dairy">Dairy Farming</option>
                <option value="Poultry">Poultry Farming</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2" htmlFor="crops-grown">
                <div className="flex items-center">
                  <GiWheat className="text-green-600 mr-2" />
                  <span>Crops Grown</span>
                </div>
              </label>
              <textarea
                id="crops-grown"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter crops you grow (comma separated e.g., Wheat, Rice, Cotton)"
                rows="3"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2" htmlFor="bio">
                <div className="flex items-center">
                  <MdOutlineDescription className="text-green-600 mr-2" />
                  <span>Bio</span>
                </div>
              </label>
              <textarea
                id="bio"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tell us about yourself and your farming journey"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Aadhar Verification Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FaIdCard className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Aadhar Verification</h2>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600">Verifying your Aadhar will give you access to government schemes and subsidies</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="aadhar-card">Upload Aadhar Card Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center">
                  <FaFileUpload className="text-gray-400 text-3xl mb-2" />
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">Only JPG, PNG files are supported</p>
                </div>
                <input type="file" className="hidden" id="aadhar-card" accept="image/*" />
              </label>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <FaInfoCircle className="text-yellow-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-yellow-700">
                    Your Aadhar details will be securely stored and verified by our team. 
                    This process may take up to 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Section */}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
          >
            Save as Draft
          </button>
          
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Complete Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;