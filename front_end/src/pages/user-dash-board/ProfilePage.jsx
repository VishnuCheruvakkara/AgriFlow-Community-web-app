import React, { useState } from "react";
import { FaUser, FaHome, FaEnvelope, FaTractor, FaSeedling, FaMapMarkerAlt } from "react-icons/fa";
import AadharImageUploads from "../../components/user-dash-board/AadharImageUploads";
import ProfileImageSelector from "../../components/user-dash-board/ProfileImageSelector";
import "react-datepicker/dist/react-datepicker.css";
import UserLocation from "../../components/user-dash-board/UserLocation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { IoIosArrowDropdown } from "react-icons/io";
import DateOfBirthPicker from "../../components/user-dash-board/DateOfBirthPicker";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import { showToast } from "../../components/toast-notification/CustomToast";
import { useSelector } from "react-redux";

function ProfilePage() {

  const user=useSelector((state)=>state.auth.user)

  // setup for the form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: user?.name|| "",
    phone: "",
    email: user?.email || "",
    date_of_birth: "", // Store dob in 'yyyy-mm-dd'
    location: {},
    homeAddress: "",
    farmingExperience: "",
    farmingType: "",
    bio_data: "",
    profileImage: null,
    aadhaarImage: null,
  });

  console.log("Updated form datas debugg :::::::<><>::::", formData)
  // Handle profile image of user
  const handleProfileImageSelect = (file) => {
    setFormData((prevData) => ({
      ...prevData,
      profileImage: file,
    }));
  }

  // Handle Aadhaar Image Selection
  const handleAadhaarImageSelect = (file) => {
    setFormData((prevData) => ({
      ...prevData,
      aadhaarImage: file,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("first_name", formData.firstName);
    formDataToSend.append("last_name", formData.lastName);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("phone_number", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("date_of_birth", formData.date_of_birth);
    formDataToSend.append("home_address", formData.homeAddress);
    formDataToSend.append("experience", formData.farmingExperience);
    formDataToSend.append("farming_type", formData.farmingType);
    formDataToSend.append("bio", formData.bio_data);

    // Append location fields separately
    if (formData.location) {
      formDataToSend.append("location", JSON.stringify(formData.location));
    }

    // Append files only if selected
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }
    if (formData.aadhaarImage) {
      formDataToSend.append("aadhaarImage", formData.aadhaarImage);
    }

    try {
      // Send request to the backend
      const response = await AuthenticatedAxiosInstance.post("/users/profile-update/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Success:", response.data);
      showToast("Profile updated successfully!","success")
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile!","error")
    }
  };




  return (

    <div className="container mx-auto max-w-full px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8">

        <form onSubmit={handleSubmit}>

          <div className="flex flex-col items-center justify-center  py-10">
            <h2 className="text-xl font-semibold mb-4">Upload Profile Image</h2>
            <ProfileImageSelector onImageSelect={handleProfileImageSelect} />
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
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">

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
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              {/* Date of Birth */}
              <DateOfBirthPicker formData={formData} setFormData={setFormData} />
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
                  Phone Number
                </label>
                <PhoneInput
                  country={"us"} // Default country
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  inputProps={{
                    name: "phone",
                    required: true,
                    className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500",
                  }}
                  containerStyle={{ width: "100%" }}
                  inputStyle={{ width: "100%", paddingLeft: "48px" }} // Adjust padding for flag & country code
                />
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full pl-10 px-4 py-3 border text-gray-600 bg-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">

              {/* Location Input */}
              <UserLocation formData={formData} setFormData={setFormData} />
              {/* Home Address  */}
              <div className="w-full">
                <label htmlFor="homeAddress" className="block text-gray-700 font-medium mb-2">
                  Home Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <FaHome size={20} /> {/* Home icon */}
                  </span>
                  <input
                    id="homeAddress"
                    type="text"
                    value={formData.homeAddress}
                    onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                    placeholder="Enter your home address"
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
              <AadharImageUploads onImageSelect={handleAadhaarImageSelect} />
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
                  value={formData.farmingExperience}
                  onChange={(e) => setFormData({ ...formData, farmingExperience: e.target.value })}
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
                {/* Icon */}
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaSeedling size={20} />
                </span>
                {/* Select Dropdown */}
                <select
                  id="farmingType"
                  value={formData.farmingType}
                  onChange={(e) => setFormData({ ...formData, farmingType: e.target.value })}
                  defaultValue="" // ✅ Fix: Use defaultValue instead of selected on <option>
                  className="w-full appearance-none pl-10 pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700 cursor-pointer"
                >
                  <option value="" disabled>
                    Select farming type
                  </option>
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
                {/* Dropdown Arrow */}
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none">
                  <IoIosArrowDropdown size={25} />
                </span>
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
                  value={formData.bio_data}
                  onChange={(e) => setFormData({ ...formData, bio_data: e.target.value })}
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
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-semibold text-md"
            >
              Submit Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;