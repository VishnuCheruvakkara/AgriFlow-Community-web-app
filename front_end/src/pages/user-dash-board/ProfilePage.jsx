import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaMapMarkerAlt, FaIdCard, FaInfoCircle, FaFileUpload } from 'react-icons/fa';
import { MdEmail, MdOutlineDescription } from 'react-icons/md';
import { GiFarmTractor, GiWheat } from 'react-icons/gi';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
//import location part 
import LocationAutocomplete from '../../components/user-dash-board/LocationAutoCompletion';
//taked data like username and email from the redux store 
import { useSelector } from "react-redux";
//import image uploader 
import ImageUploader from '../../components/ImageUploadInterFace/ImageUploader';


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
    });

    const [selectedLocation, setSelectedLocation] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const wrapperRef = useRef(null);

    const farmingTypes = [
        { id: 'organic', name: 'Organic Farming', description: 'Farming without synthetic pesticides or fertilizers' },
        { id: 'conventional', name: 'Conventional Farming', description: 'Traditional farming using modern techniques' },
        { id: 'mixed', name: 'Mixed Farming', description: 'Combination of crops and livestock' },
        { id: 'dairy', name: 'Dairy Farming', description: 'Focused on milk production' },
        { id: 'poultry', name: 'Poultry Farming', description: 'Raising birds for meat or eggs' },
        { id: 'other', name: 'Other', description: 'Specialized or alternative farming methods' }
    ];

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

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true); // Set loading state

        try {
            console.log("Submitting Form Data:", formData);

            // Send Data to Backend API with Axios
            const response = await AuthenticatedAxiosInstance.post(
                "/users/update-profile/", // Update with your API URL
                formData,
            );

            console.log("Profile updated successfully!", response.data);
            alert("Profile updated successfully!");

        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Something went wrong. Please try again.");

        } finally {
            setLoading(false); // Stop loading state
        }
    };


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
                                />
                                <MdEmail className="absolute left-3 top-3.5 text-gray-500" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 italic flex items-center">
                                <FaInfoCircle className="mr-1" /> Email address cannot be changed
                            </p>
                        </div>

                        {/* Profile Picture */}



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