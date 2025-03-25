import React, { useState } from "react";
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaTractor, FaSeedling, FaMapMarkerAlt } from "react-icons/fa";
import AadharImageUploads from "../../components/user-dash-board/AadharImageUploads";
import ProfileImageSelector from "../../components/user-dash-board/ProfileImageSelector";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ProfilePage() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (

    <div className="container mx-auto max-w-full px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8">


        <div className="flex flex-col items-center justify-center  py-10">
          <h2 className="text-xl font-semibold mb-4">Upload Profile Image</h2>
          <ProfileImageSelector />
        </div>



        {/* Personal Information Section */}
        <section className="mb-8">
          <h2 className="text-md font-bold text-green-700 mb-6 border-b pb-2">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaUser size={20} />
                </span>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaUser size={20} />
                </span>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaPhone size={20} />
                </span>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaEnvelope size={20} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Date of Birth */}
            <div className="w-full">
              <label htmlFor="dob" className="block text-gray-700 font-medium mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaCalendarAlt size={20} />
                </span>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  id="dob"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date of birth"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  wrapperClassName="w-full"
                />
              </div>
            </div>

            {/* Username */}
            <div className="w-full">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaUser size={20} />
                </span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>


          <div className="grid md:grid-cols-2 gap-6 mt-6">

            {/* Location Input */}
            <div>
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Location
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaMapMarkerAlt size={20} />
                </span>
                <input
                  id="location"
                  type="text"
                  placeholder="Enter your location"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

          </div>






        </section>

        {/* Identity Verification Section */}
        <section className="mb-8">
          <h2 className="text-md font-bold text-green-700 mb-6 border-b pb-2">Identity Verification</h2>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <p className="text-blue-800 font-medium">
              Our team will verify your details. Account verification typically takes 34-48 hours. Please ensure all information is accurate.
            </p>
          </div>

          {/* Aadhaar/ID Upload */}


          <div className="flex flex-col items-center justify-center py-10">
            <AadharImageUploads />
          </div>





        </section>

        {/* Farming Details Section */}
        <section>
          <h2 className="text-md font-bold text-green-700 mb-6 border-b pb-2">Farming Information</h2>

          {/* Farming Experience */}
          <div className="mb-6">
            <label htmlFor="farmingExperience" className="block text-gray-700 font-medium mb-2">Years of Farming Experience</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaTractor size={20} />
              </span>
              <input
                id="farmingExperience"
                type="number"
                placeholder="Enter years of experience"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Farming Type */}
          <div className="mb-6">
            <label htmlFor="farmingType" className="block text-gray-700 font-medium mb-2">
              Select Farming Type
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaSeedling size={20} />
              </span>
              <select
                id="farmingType"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled selected>Select farming type</option>
                <option value="poultry">Poultry Farming</option>
                <option value="dairy">Dairy Farming</option>
                <option value="organic">Organic Farming</option>
                <option value="aquaculture">Aquaculture (Fish Farming)</option>
                <option value="beekeeping">Beekeeping</option>
                <option value="hydroponics">Hydroponics Farming</option>
                <option value="horticulture">Horticulture</option>
                <option value="livestock">Livestock Farming</option>
                <option value="crop">Crop Farming</option>
                <option value="agribusiness">Agribusiness</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>


          {/* Farming Bio */}
          <div>
            <label htmlFor="farmingBio" className="block text-gray-700 font-medium mb-2">About Your Farming Experience</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pt-3 pl-3 text-gray-400">
                <FaTractor size={20} />
              </span>
              <textarea
                id="farmingBio"
                placeholder="Share a brief description of your farming background"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
              ></textarea>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-semibold text-lg"
          >
            Submit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;