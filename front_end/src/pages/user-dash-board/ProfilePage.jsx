import React, { useState } from "react";
import { FaUser, FaHome, FaEnvelope, FaTractor, FaSeedling, FaMapMarkerAlt, FaIdCard } from "react-icons/fa";
//import the addhar submission component for submit adhar if any deffect found by admin 
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
import { TbInfoTriangleFilled } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/AuthSlice";
import { useNavigate } from 'react-router-dom'
//import the common button loader and redux reducers 
import ButtonLoader from "../../components/LoaderSpinner/ButtonLoader";
import { showButtonLoader, hideButtonLoader } from "../../redux/slices/LoaderSpinnerSlice";
//import the refresh button from react icons 
import { IoMdRefreshCircle } from "react-icons/io";
import { setUserDetails } from "../../redux/slices/userSlice";



////////////////////////////////  This page is no thte actual  profile page is For collect the user correct data if they want to use the applicaiton |||| 
/////////////////////////////// the correct user page where user can see thire data add post is set here =====>>>( UserProfileviewPage )
function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user)
  // take data from the redux store authSlice named as users
  const userData = useSelector((state) => state.user.user)
  const [resubmissionAadhaarImage, setResubmissionAadhaarImage] = useState(null);

  // setup for the form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: user?.name || "",
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

  const [errors, setErrors] = useState({});

  console.log("Updated form datas debugg :::::::<><>::::", formData)
  // Handle profile image of user
  const handleProfileImageSelect = (file) => {
    setFormData((prevData) => ({
      ...prevData,
      profileImage: file,
    }));
  }

  // Handle Aadhaar Image Selection
  const handleAadhaarImageSelect = (file, purpose) => {
    if (purpose === "form") {
      setFormData((prevData) => ({
        ...prevData,
        aadhaarImage: file,
      }));
    } else if (purpose === "resubmission") {
      // Store separately for resubmission
      setResubmissionAadhaarImage(file);
    }
  };

  const submitAadhaarResubmission = async () => {
    if (!resubmissionAadhaarImage) {
      showToast("Please select an Aadhaar image", "error");
      return;
    }

    const aadharformData = new FormData();
    aadharformData.append("aadhaarImage", resubmissionAadhaarImage);

    const buttonId = "aadhaarResubmissionButton";
    dispatch(showButtonLoader(buttonId)); //show-loader

    try {
      const response = await AuthenticatedAxiosInstance.patch(
        `/users/aadhaar-resubmission/`, // No userId needed
        aadharformData,
      );
      showToast("Aadhaar image resubmitted successfully", "success");
      dispatch(setUserDetails({
        ...userData,
        aadhar_resubmission_message: null,
      }));
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      showToast("Error uploading Aadhaar image", "error");
    } finally {
      dispatch(hideButtonLoader(buttonId)); // Hide loader afeter process
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const buttonId = "profileUpdation";
    dispatch(showButtonLoader(buttonId)); //show-loader

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
      dispatch(loginSuccess({
        profile_completed: response.data.profile_completed  // Updates only profile_completed
      }));
      showToast("Profile updated successfully!", "success")
      setErrors({});
      navigate("/user-dash-board");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data); // Store backend validation errors
        console.log("debug the erros ::::::<><><>:::::", error.response.data)
      }
      showToast("Profile update failed. Please review your information and try again.", "error");
    }
    finally {
      dispatch(hideButtonLoader(buttonId)); // Hide loader afeter process
    }
  };


  /////////  Set up for the all conditional statement to show the ui part (For debug friendly approach...) ////////////////////

  let content;

  if (!user?.profile_completed) {
    content = (

      <>
        {/*  Profile form section here */}
        <div className="bg-white shadow-lg rounded-lg p-8 dark:bg-zinc-800">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center py-10">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Upload Profile Image</h2>
              <ProfileImageSelector onImageSelect={handleProfileImageSelect} />
              {<errors className="profile"></errors> && <p className="text-red-500 text-sm mt-2">{errors.profileImage}</p>}
            </div>


            {/* Personal Information Section */}
            <section className="mb-8">
              <h2 className="text-md font-bold dark:text-green-500 text-green-700 mb-6 border-b pb-2 dark:border-zinc-600">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2 dark:text-zinc-300">First Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <FaUser size={20} />
                    </span>
                    <input
                      required
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter first name"
                      className={`bg-white text-black w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.first_name ? " focus:ring-red-500" : "focus:ring-green-500"
                        } transition duration-500 ease-in-out dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:placeholder-zinc-400`}

                    />
                  </div>
                  {errors.first_name && <p className="text-red-500 text-sm mt-2">{errors.first_name}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2 dark:text-zinc-300">Last Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <FaUser size={20} />
                    </span>
                    <input
                      required
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter last name"
                      className={`bg-white text-black w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.last_name ? " focus:ring-red-500" : "focus:ring-green-500"
                        } transition duration-500 ease-in-out dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:placeholder-zinc-400`}
                    />
                  </div>
                  {errors.last_name && <p className="text-red-500 text-sm mt-2">{errors.last_name}</p>}

                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                {/* Username */}
                <div className="w-full">
                  <label htmlFor="username" className="block text-gray-700 font-medium mb-2 dark:text-zinc-300">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <FaUser size={20} />
                    </span>
                    <input
                      required
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Enter username"
                      className={`bg-white text-black w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.username ? " focus:ring-red-500" : "focus:ring-green-500"
                        } transition duration-500 ease-in-out dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:placeholder-zinc-400`}
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username}</p>}
                </div>
                {/* Date of Birth */}
                <DateOfBirthPicker formData={formData} setFormData={setFormData} errors={errors.date_of_birth} />
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2 dark:text-zinc-300">
                    Phone Number
                  </label>
                  <PhoneInput
                    required
                    country={"in"} // Default country
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                    inputProps={{
                      name: "phone",
                      required: true,
                      className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-int-out dark:bg-zinc-900 dark:text-white dark:border-zinc-600",
                    }}
                    containerStyle={{ width: "100%" }}
                    inputStyle={{ width: "100%", paddingLeft: "48px" }} // Adjust padding for flag & country code
                  />
                  {errors.phone_number && <p className="text-red-500 text-sm mt-2">{errors.phone_number}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2 dark:text-zinc-300">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <FaEnvelope size={20} />
                    </span>
                    <input
                      required
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                      readOnly
                      className={`bg-gray-200 text-gray-500 w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.email ? " focus:ring-red-500" : "focus:ring-green-500"
                        } transition duration-500 ease-in-out dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-600`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}

                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                {/* Location Input */}
                <UserLocation formData={formData} setFormData={setFormData} errors={errors.location} />

                {/* Home Address  */}
                <div className="w-full">
                  <label htmlFor="homeAddress" className="block text-gray-700 font-medium mb-2 dark:text-zinc-300">
                    Home Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <FaHome size={20} /> {/* Home icon */}
                    </span>
                    <input
                      required
                      id="homeAddress"
                      type="text"
                      value={formData.homeAddress}
                      onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                      placeholder="Enter your home address"
                      className={`bg-white text-black w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.home_address ? " focus:ring-red-500" : "focus:ring-green-500"
                        } transition duration-500 ease-in-out dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:placeholder-zinc-400`}
                    />
                  </div>
                  {errors.home_address && <p className="text-red-500 text-sm mt-2">{errors.home_address}</p>}

                </div>
              </div>
            </section>

            {/* Identity Verification Section */}
            <section className="mb-8">
              <h2 className="text-md font-bold dark:text-green-500 text-green-700 mb-6 border-b pb-2 dark:border-zinc-600">Identity Verification</h2>

              <div className="bg-green-100 border-l-4 border-green-700 p-4 mb-6 dark:bg-green-900 dark:border-green-600">
                <p className="text-green-700 font-medium flex items-center gap-4 dark:text-green-200">
                  <TbInfoTriangleFilled className="w-5 h-5 flex-shrink-0 " />
                  <p className="sm:text-sm text-xs">Our team will verify your details, including Aadhaar verification, within 24 hours. Ensure all information is accurate to avoid delays in the process.
                  </p>
                </p>
              </div>


              {/* Aadhaar/ID Upload */}

              <div className="flex flex-col items-center justify-center py-10">
                <AadharImageUploads onImageSelect={handleAadhaarImageSelect} purpose="form" />
                {errors.aadhaarImage && <p className="text-red-500 text-sm mt-2">{errors.aadhaarImage}</p>}
              </div>

            </section>

            {/* Farming Details Section */}
            <section>
              <h2 className="text-md font-bold dark:text-green-500 text-green-700 mb-6 border-b pb-2 dark:border-zinc-600">Farming Information</h2>

              {/* Farming Experience */}
              <div className="mb-6">
                <label htmlFor="farmingExperience" className="block text-gray-700 font-medium mb-2 dark:text-zinc-300">Years of Farming Experience</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                    <FaTractor size={20} />
                  </span>
                  <input
                    required
                    id="farmingExperience"
                    type="number"
                    value={formData.farmingExperience}
                    onChange={(e) => setFormData({ ...formData, farmingExperience: e.target.value })}
                    placeholder="Enter years of experience"
                    className={`bg-white text-black w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.experience ? " focus:ring-red-500" : "focus:ring-green-500"
                      } transition duration-500 ease-in-out dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:placeholder-zinc-400`}
                  />
                </div>
                {errors.experience && <p className="text-red-500 text-sm mt-2">{errors.experience}</p>}
              </div>

              {/* Farming Type */}
              <div className="mb-6">
                <label htmlFor="farmingType" className="block text-gray-700 font-medium mb-2 dark:text-zinc-300">
                  Select Farming Type
                </label>
                <div className="relative">
                  {/* Icon */}
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                    <FaSeedling size={20} />
                  </span>
                  {/* Select Dropdown */}
                  <select
                    required
                    id="farmingType"
                    value={formData.farmingType}
                    onChange={(e) => setFormData({ ...formData, farmingType: e.target.value })}
                    defaultValue="" // Fix: Use defaultValue instead of selected on <option>
                    className={`bg-white text-black w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.farming_type ? " focus:ring-red-500" : "focus:ring-green-500"
                      } transition duration-500 ease-in-out dark:bg-zinc-900 dark:text-white dark:border-zinc-600`}
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
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none dark:text-zinc-500">
                    <IoIosArrowDropdown size={25} />
                  </span>
                </div>
                {errors.farming_type && <p className="text-red-500 text-sm mt-2">{errors.farming_type}</p>}
              </div>

              {/* Farming Bio */}
              <div>
                <label htmlFor="farmingBio" className="block text-gray-700 font-medium mb-2 dark:text-zinc-300">About Your Farming Experience</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pt-3 pl-3 text-gray-400 dark:text-zinc-500">
                    <FaTractor size={20} />
                  </span>
                  <textarea
                    required
                    id="farmingBio"
                    value={formData.bio_data}
                    onChange={(e) => setFormData({ ...formData, bio_data: e.target.value })}
                    placeholder="Share a brief description of your farming background"
                    className={`bg-white text-black w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.bio ? " focus:ring-red-500" : "focus:ring-green-500"
                      } transition duration-500 ease-in-out dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:placeholder-zinc-400`}
                    rows="4"
                  ></textarea>
                </div>
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>
            </section>

            {/* Submit Button */}
            <div className="mt-8">
              <ButtonLoader
                buttonId="profileUpdation"
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-semibold text-md dark:bg-green-500 dark:hover:bg-green-600"
              >
                Submit Profile
              </ButtonLoader>
            </div>
          </form>
        </div>
      </>
    );
  } else if (userData?.aadhar_resubmission_message == null) {
    content = (
      <>
        {/*  Aadhaar verification in progress UI */}

        <div className="bg-white shadow-lg rounded-lg p-8 text-center dark:bg-zinc-800">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="mb-6 text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">Verification In Progress</h2>

            <div className=" bg-yellow-100 border-l-4 border-yellow-500 p-5 shadow-lg flex items-center space-x-3 mb-8 dark:bg-yellow-900 dark:border-yellow-600">
              {/* Warning Icon */}
              <svg className="h-6 w-6 text-yellow-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>

              {/* Text */}
              <p className="text-xs sm:text-sm text-yellow-700 flex-1 dark:text-yellow-200 ">
                Your Aadhaar verification is currently under review. This process typically takes up to 24 hours to complete.
              </p>
            </div>
            <p className="text-gray-600 mb-6 dark:text-zinc-400 text-sm">
              We will notify you through email once the verification is complete.
            </p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-zinc-600">
              <div className="bg-yellow-500 h-2.5 rounded-full w-3/4"></div>
            </div>
            <button
              onClick={() => window.location.reload()}
              data-tip="Refresh the page"
              className="tooltip tooltip-right px-2 py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition duration-300 dark:bg-yellow-500 dark:hover:bg-yellow-600"
            >
              <IoMdRefreshCircle size={30} />
            </button>
          </div>
        </div>
      </>
    );
  } else if (userData?.aadhar_resubmission_message !== null) {
    content = (
      <>
        {/* Aadhaar resubmission UI (upload image, resubmit, etc.) */}
        <div className="bg-white shadow-lg rounded-lg p-8 text-center dark:bg-zinc-800">
          <div className="flex flex-col items-center justify-center py-">
            {/* Reason for Resubmission */}
            <div className="mb-8 w-full max-w-full mx-auto shadow-lg">
              <div className="border-l-4 border-red-500  bg-red-100 p-4 shadow-sm dark:bg-zinc-700 dark:border-red-600">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-red-700 font-bold text-lg dark:text-red-400">Resubmission Required</h3>
                </div>

                <div className="border-t border-red-700 pt-2 dark:border-red-600">
                  <p className="text-xs sm:text-sm text-red-700 flex-1 break-words whitespace-pre-wrap dark:text-red-400">
                    We found an issue with the uploaded Aadhaar during the verification process.
                    <b> Please review the reason provided </b> and resubmit the corrected Aadhaar for verification.
                    <br />
                    <b className="text-red-800 dark:text-red-300">If not updated within 24 hours, your access will be blocked.</b>
                  </p>

                  <p className=" border-t mt-4 pt-3 border-red-700 text-red-700 font-bold mb-1 dark:border-red-600 dark:text-red-400">Reason:</p>
                  <p className="text-red-700 text-xs sm:text-sm break-words whitespace-pre-wrap overflow-hidden dark:text-red-400 ">
                    {userData?.aadhar_resubmission_message ||
                      "The Aadhaar image is blurry or partially visible. Please ensure it's clear and fully legible."}
                  </p>
                </div>
              </div>
            </div>
            {/* Aadhaar Upload */}
            <AadharImageUploads onImageSelect={handleAadhaarImageSelect} purpose="resubmission" />

            {/* Submit Button */}
            <ButtonLoader
              buttonId="aadhaarResubmissionButton"
              type="submit"
              onClick={submitAadhaarResubmission}
              className="mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-200 dark:bg-red-500 dark:hover:bg-red-600"
            >
              <span className="flex items-center gap-2">
                <FaIdCard size={25} />
                Resubmit Aadhaar
              </span>
            </ButtonLoader >

          </div>
        </div>
      </>
    );
  }

  return (

    <div className="container mx-auto max-w-full px-4 py-8 ">
      {/* Welcome Box */}
      <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg border-2 border-dashed  border-green-700 text-green-900">
        <h2 className="text-xl font-semibold dark:text-green-100 ">Hello, {user?.name} ...</h2>
        <p className="mt-2 text-xs sm:text-sm dark:text-green-100 ">Complete your profile to gain full access to AgriFlow. Providing accurate and complete details is essential for authentication and security. Ensure that all required fields, including personal information, contact details, and verification documents, are correctly filled in to avoid any restrictions on your access. Your information will be securely processed in compliance with our data protection policies.</p>
      </div>

      {/* Dynamically render the conditional based UI parts here...  */}
      {content}

    </div>
  );
}

export default ProfilePage;