import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaMapMarkerAlt, FaIdCard, FaInfoCircle, FaPhoneAlt } from 'react-icons/fa';
import { MdEmail, MdOutlineDescription } from 'react-icons/md';
import { GiFarmTractor, GiWheat } from 'react-icons/gi';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
//import location part 
import LocationAutocomplete from '../../components/user-dash-board/LocationAutoCompletion';
//taked data like username and email from the redux store 
import { useSelector } from "react-redux";
//import image uploader 
import ImageUploader from '../../components/ImageUploadInterFace/ImageUploader';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const UserProfileForm = () => {

    const [loading, setLoading] = useState(false); // Loading state
    const auth = useSelector((state) => state.auth);
    const user = auth.user;
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: user?.name || "",
        email: user?.email || "",
        location: "",
        address: "",
        experience: "",
        farmingType: "",
        cropsGrown: "",
        bio: "",
        profileImage: null,
        aadharImage: null,
        phone_number: "",
    });

    const [selectedLocation, setSelectedLocation] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const wrapperRef = useRef(null);

    const farmingTypes = [
        { id: 1, name: 'Organic Farming', description: 'Farming without synthetic pesticides or fertilizers' },
        { id: 2, name: 'Conventional Farming', description: 'Traditional farming using modern techniques' },
        { id: 3, name: 'Mixed Farming', description: 'Combination of crops and livestock' },
        { id: 4, name: 'Dairy Farming', description: 'Focused on milk production' },
        { id: 5, name: 'Poultry Farming', description: 'Raising birds for meat or eggs' },
        { id: 6, name: 'Other', description: 'Specialized or alternative farming methods' }
    ];

    // Add this function to calculate the completion percentage
    const calculateProfileCompletion = () => {
        let completedFields = 0;
        let totalFields = 9; // Adjust based on required fields

        // Check each required field
        if (formData.firstName) completedFields++;
        if (formData.lastName) completedFields++;
        if (formData.username) completedFields++;
        if (formData.phone_number) completedFields++;
        if (formData.location) completedFields++;
        if (formData.address) completedFields++;
        if (formData.experience) completedFields++;
        if (formData.farmingType) completedFields++;
        if (formData.profileImage) completedFields++;

        // Optional: Add aadhar verification as a bonus
        if (formData.aadharImage) {
            totalFields++;
            completedFields++;
        }

        // Calculate percentage
        return Math.round((completedFields / totalFields) * 100);
    };

    // Add this useEffect to update the progress bar
    useEffect(() => {
        const percentage = calculateProfileCompletion();

        // Update the progress bar width
        const progressBar = document.getElementById('profile-progress');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        // Update the progress text
        const progressText = document.querySelector('p.text-sm.text-gray-500.mt-1');
        if (progressText) {
            progressText.textContent = `Profile completion: ${percentage}%`;
        }
    }, [formData]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (type) => {
        setSelectedType(type.name);
        setFormData((prevData) => ({
            ...prevData,
            farmingType: {
                id: type.id,
                name: type.name,
                description: type.description
            }
        }));
        setIsOpen(false);
    };

    // Handle location selection
    const handleLocationChange = (location) => {
        setSelectedLocation(location);
        setFormData((prevData) => ({
            ...prevData,
            location: location, // Update formData with selected location
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handlePhoneInputChange = (value) => {
        // Set the phone number value directly in the form data
        setFormData({
            ...formData,
            phone_number: value
        });
    };

    // Image upload handlers
    const handleProfileImageUpload = (file) => {
        setFormData((prevData) => ({
            ...prevData,
            profileImage: file,
        }));
    };

    const handleAadharImageUpload = (file) => {
        setFormData((prevData) => ({
            ...prevData,
            aadharImage: file,
        }));
    };



    console.log("Current form updated ::::: ", formData)

    // Update the handleSubmit function in your UserProfileForm component:
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create FormData object
            const formDataToSend = new FormData();

            // Append basic text fields
            formDataToSend.append("firstName", formData.firstName);
            formDataToSend.append("lastName", formData.lastName);
            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("bio", formData.bio || "");
            formDataToSend.append("experience", formData.experience || "");
            formDataToSend.append("cropsGrown", formData.cropsGrown || "");
            formDataToSend.append("address", formData.address || "");
            formDataToSend.append("phone_number", formData.phone_number || "");

            // Handle Location - Convert to JSON string for proper serialization
            if (selectedLocation) {
                formDataToSend.append("location", JSON.stringify(selectedLocation));
            }

            // Handle Farming Type - Convert to JSON string for proper serialization
            if (formData.farmingType) {
                formDataToSend.append("farmingType", JSON.stringify(formData.farmingType));
            }

            // Append images
            if (formData.profileImage) {
                formDataToSend.append("profileImage", formData.profileImage);
            }
            if (formData.aadharImage) {
                formDataToSend.append("aadharImage", formData.aadharImage);
            }

            // Send Data to Backend API
            const response = await AuthenticatedAxiosInstance.post(
                "/users/update-profile/",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Profile updated successfully!", response.data);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className=" space-y-4 mt-4 mb-11">
            {/* Profile Completion Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
                <p className="text-gray-600">Please complete your profile to access all features of AgriFlow</p>

                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                        id="profile-progress"
                        style={{ width: `${calculateProfileCompletion()}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Profile completion: {calculateProfileCompletion()}%</p>
            </div>

            {/* Profile Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>

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
                                name="firstName"
                                onChange={handleChange}
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
                                name="lastName"
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter your last name"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="username">Username </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Choose a username"
                                autoComplete='new-password'

                            />
                            <p className="text-xs text-gray-500 mt-1 italic flex items-center">
                                <FaInfoCircle className="mr-1" />This name will visible to others
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    className="w-full p-3 border text-gray-500 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
                                    placeholder="Your email address"
                                    readOnly
                                    autoComplete='new-password'
                                />
                                <MdEmail className="absolute left-3 top-3.5 text-gray-500" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 italic flex items-center">
                                <FaInfoCircle className="mr-1" /> Email address cannot be changed
                            </p>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="phone_number">
                                Phone Number
                            </label>
                            <div className="relative">
                                <PhoneInput
                                    country="in" // Set to India as default since you're using Aadhar
                                    value={formData.phone_number}
                                    inputProps={{
                                        id: "phone_number",
                                        name: "phone_number",
                                    }}
                                    onChange={handlePhoneInputChange} // Use the special handler here, not handleChange
                                    containerClass="w-full"
                                    inputClass="w-full h-12 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
                                    buttonClass="border-r-0 h-12"
                                    dropdownClass="border rounded-lg"
                                    placeholder="Your phone number"
                                />

                            </div>
                            <p className="text-xs text-gray-500 mt-1 italic flex items-center">
                                <FaInfoCircle className="mr-1" /> Phone number should include country code
                            </p>
                        </div>




                        {/* Profile Picture */}
                        <div className="md:col-span-2">
                            <ImageUploader
                                onImageSelect={handleProfileImageUpload}
                                label="Profile Picture"
                                aspect={1}
                                maxSizeMB={0.5}
                                previewShape="circle"
                            />
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



                        {/* Using our new LocationAutocomplete Component */}
                        <LocationAutocomplete
                            value={selectedLocation ? selectedLocation.display_name : ''}
                            onChange={handleLocationChange}
                            placeholder="Search for your village or city"
                            label="Village/City Name"
                        />

                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="address">Full Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Your complete address"
                                autoComplete='new-password'
                            />
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
                                name="experience"
                                onChange={handleChange}
                                min="0"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter years of farming experience"
                                autoComplete='new-password'
                            />
                        </div>





                        <div className="relative" ref={wrapperRef}>
                            <label className="block text-gray-700 mb-2" htmlFor="farming-type">
                                Farming Type
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="farming-type"
                                    className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Select your farming type"
                                    value={selectedType}
                                    onChange={() => { }} // Read-only
                                    onClick={() => setIsOpen(!isOpen)}
                                    readOnly
                                    autoComplete='new-password'
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                                    </svg>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>

                            {isOpen && (
                                <div className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                                    <ul className="py-2">
                                        {farmingTypes.map((type) => (
                                            <li
                                                key={type.id}
                                                className="px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors flex items-start"
                                                onClick={() => handleSelect(type)}
                                            >
                                                <div className="text-green-600 mr-2 mt-1 flex-shrink-0">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">{type.name}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-xs">
                                                        {type.description}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
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
                                name="cropsGrown"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter crops you grow (comma separated e.g., Wheat, Rice, Cotton)"
                                rows="3"
                                onChange={handleChange}
                                autoComplete='new-password'
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
                                name="bio"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Tell us about yourself and your farming journey"
                                rows="4"
                                onChange={handleChange}
                                autoComplete='new-password'
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



                        {/* Aadhar Image Upload */}
                        <div>
                            <ImageUploader
                                onImageSelect={handleAadharImageUpload}
                                label="Upload Aadhar Card Image"
                                aspect={1.6}
                                maxSizeMB={1}
                                previewShape="rectangle"
                            />
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
                <div className="flex justify-center">
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