import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaMapMarkerAlt, FaIdCard, FaInfoCircle, FaPhoneAlt } from 'react-icons/fa';
import { MdEmail, MdOutlineDescription } from 'react-icons/md';
import { GiFarmTractor, GiWheat } from 'react-icons/gi';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
//import location part 
import LocationAutocomplete from '../../components/user-dash-board/LocationAutoCompletion';
//taked data like username and email from the redux store 
import { useSelector, useDispatch } from "react-redux";
//import image uploader 
import ImageUploader from '../../components/ImageUploadInterFace/ImageUploader';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
//import the common button loader and redux reducers
import ButtonLoader from '../../components/LoaderSpinner/ButtonLoader';
import { showButtonLoader, hideButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';
//set up toast messages
import { showToast } from '../../components/toast-notification/CustomToast';
// Import Formik and Yup for validation
import { Formik, Form, Field, ErrorMessage } from 'formik';
import userProfileValidationSchema from '../../components/user-dash-board/userProfileValidationSchema'
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../redux/slices/AuthSlice';


const UserProfileForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const user = auth.user;
    const wrapperRef = useRef(null);
    
    const [profileImage, setProfileImage] = useState(null);
    const [aadharImage, setAadharImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const farmingTypes = [
        { id: 1, name: 'Organic Farming', description: 'Farming without synthetic pesticides or fertilizers' },
        { id: 2, name: 'Conventional Farming', description: 'Traditional farming using modern techniques' },
        { id: 3, name: 'Mixed Farming', description: 'Combination of crops and livestock' },
        { id: 4, name: 'Dairy Farming', description: 'Focused on milk production' },
        { id: 5, name: 'Poultry Farming', description: 'Raising birds for meat or eggs' },
        { id: 6, name: 'Other', description: 'Specialized or alternative farming methods' }
    ];

    const initialValues = {
        firstName: "",
        lastName: "",
        username: user?.name || "",
        email: user?.email || "",
        location: "",
        address: "",
        experience: "",
        farmingType: null,
        cropsGrown: "",
        bio: "",
        phone_number: "",
    };

    // Calculate profile completion
    const calculateProfileCompletion = (values) => {
        let completedFields = 0;
        let totalFields = 9; // Adjust based on required fields

        // Check each required field
        if (values.firstName) completedFields++;
        if (values.lastName) completedFields++;
        if (values.username) completedFields++;
        if (values.phone_number) completedFields++;
        if (values.location) completedFields++;
        if (values.address) completedFields++;
        if (values.experience) completedFields++;
        if (values.farmingType) completedFields++;
        if (profileImage) completedFields++;

        // Optional: Add aadhar verification as a bonus
        if (aadharImage) {
            totalFields++;
            completedFields++;
        }

        // Calculate percentage
        return Math.round((completedFields / totalFields) * 100);
    };

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

    // Handle profile image upload
    const handleProfileImageUpload = (file) => {
        setProfileImage(file);
    };

    // Handle aadhar image upload
    const handleAadharImageUpload = (file) => {
        setAadharImage(file);
    };

    // Submit form handler
    const handleSubmit = async (values, { setSubmitting }) => {
        const buttonId = "profileUpdateButton";
        dispatch(showButtonLoader(buttonId)); //show-loader

        try {
            // Create FormData object
            const formDataToSend = new FormData();

            // Append basic text fields
            formDataToSend.append("firstName", values.firstName);
            formDataToSend.append("lastName", values.lastName);
            formDataToSend.append("username", values.username);
            formDataToSend.append("email", values.email);
            formDataToSend.append("bio", values.bio || "");
            formDataToSend.append("experience", values.experience || "");
            formDataToSend.append("cropsGrown", values.cropsGrown || "");
            formDataToSend.append("address", values.address || "");
            formDataToSend.append("phone_number", values.phone_number || "");

            // Handle Location - Convert to JSON string for proper serialization
            if (values.location) {
                formDataToSend.append("location", JSON.stringify(values.location));
            }

            // Handle Farming Type - Convert to JSON string for proper serialization
            if (values.farmingType) {
                formDataToSend.append("farmingType", JSON.stringify(values.farmingType));
            }

            // Append images
            if (profileImage) {
                formDataToSend.append("profileImage", profileImage);
            }
            if (aadharImage) {
                formDataToSend.append("aadharImage", aadharImage);
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
            dispatch(loginSuccess({
                profile_completed: response.data.profile_completed  // Updates only profile_completed
            }));
            showToast("Profile updated successfully!", "success");
            navigate("/user-dash-board");
            console.log(response.data);

        } catch (error) {
            console.error("Error updating profile:", error);
            showToast("Please resolve the error to proceed further.", "error");
        } finally {
            dispatch(hideButtonLoader(buttonId)); // Hide loader after process
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4 mt-4 mb-11">
            <Formik
                initialValues={initialValues}
                validationSchema={userProfileValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-6">
                        {/* Profile Completion Header */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
                            <p className="text-gray-600">Please complete your profile to access all features of AgriFlow</p>

                            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                                    id="profile-progress"
                                    style={{ width: `${calculateProfileCompletion(values)}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Profile completion: {calculateProfileCompletion(values)}%</p>
                        </div>

                        {/* Basic Info Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center mb-4">
                                <FaUser className="text-green-600 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="firstName">First Name</label>
                                    <Field
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                            errors.firstName && touched.firstName ? ' focus:ring-red-500' : ''
                                        }`}
                                        placeholder="Enter your first name"
                                    />
                                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="lastName">Last Name</label>
                                    <Field
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                            errors.lastName && touched.lastName ? ' focus:ring-red-500' : ''
                                        }`}
                                        placeholder="Enter your last name"
                                    />
                                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
                                    <Field
                                        type="text"
                                        id="username"
                                        name="username"
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                            errors.username && touched.username ?  ' focus:ring-red-500' : ''
                                        }`}
                                        placeholder="Choose a username"
                                        autoComplete="new-password"
                                    />
                                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                                    <p className="text-xs text-gray-500 mt-1 italic flex items-center">
                                        <FaInfoCircle className="mr-1" />This name will visible to others
                                    </p>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                                    <div className="relative">
                                        <Field
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="w-full p-3 border text-gray-500 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
                                            placeholder="Your email address"
                                            readOnly
                                            autoComplete="new-password"
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
                                            country="in"
                                            value={values.phone_number}
                                            inputProps={{
                                                id: "phone_number",
                                                name: "phone_number",
                                            }}
                                            onChange={(value) => setFieldValue("phone_number", value)}
                                            containerClass="w-full"
                                            inputClass={`w-full h-12 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 ${
                                                errors.phone_number && touched.phone_number ? ' focus:ring-red-500' : ''
                                            }`}
                                            buttonClass="border-r-0 h-12"
                                            dropdownClass="border rounded-lg"
                                            placeholder="Your phone number"
                                        />
                                    </div>
                                    <ErrorMessage name="phone_number" component="div" className="text-red-500 text-sm mt-1" />
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
                                {/* Location Autocomplete */}
                                <div>
                                    <LocationAutocomplete
                                        value={values.location ? values.location.display_name : ''}
                                        onChange={(location) => setFieldValue("location", location)}
                                        placeholder="Search for your village or city"
                                        label="Village/City Name"
                                        className={errors.location && touched.location ? ' focus:ring-red-500' : ''}
                                    />
                                    <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="address">Full Address</label>
                                    <Field
                                        type="text"
                                        id="address"
                                        name="address"
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                            errors.address && touched.address ? ' focus:ring-red-500' : ''
                                        }`}
                                        placeholder="Your complete address"
                                        autoComplete="new-password"
                                    />
                                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
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
                                {/* Years of Experience */}
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="experience">Years of Experience</label>
                                    <Field
                                        type="number"
                                        id="experience"
                                        name="experience"
                                        min="0"
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                            errors.experience && touched.experience ? ' focus:ring-red-500' : ''
                                        }`}
                                        placeholder="Enter years of farming experience"
                                        autoComplete="new-password"
                                    />
                                    <ErrorMessage name="experience" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Farming Type */}
                                <div className="relative" ref={wrapperRef}>
                                    <label className="block text-gray-700 mb-2" htmlFor="farming-type">
                                        Farming Type
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="farming-type"
                                            className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.farmingType && touched.farmingType ? ' focus:ring-red-500' : ''
                                            }`}
                                            placeholder="Select your farming type"
                                            value={values.farmingType ? values.farmingType.name : ''}
                                            onClick={() => setIsOpen(!isOpen)}
                                            readOnly
                                            autoComplete="new-password"
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
                                    <ErrorMessage name="farmingType" component="div" className="text-red-500 text-sm mt-1" />

                                    {isOpen && (
                                        <div className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                                            <ul className="py-2">
                                                {farmingTypes.map((type) => (
                                                    <li
                                                        key={type.id}
                                                        className="px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors flex items-start"
                                                        onClick={() => {
                                                            setFieldValue("farmingType", type);
                                                            setIsOpen(false);
                                                        }}
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

                                {/* Crops Grown */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 mb-2" htmlFor="cropsGrown">
                                        <div className="flex items-center">
                                            <GiWheat className="text-green-600 mr-2" />
                                            <span>Crops Grown</span>
                                        </div>
                                    </label>
                                    <Field
                                        as="textarea"
                                        id="cropsGrown"
                                        name="cropsGrown"
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                            errors.cropsGrown && touched.cropsGrown ? ' focus:ring-red-500' : ''
                                        }`}
                                        placeholder="Enter crops you grow (comma separated e.g., Wheat, Rice, Cotton)"
                                        rows="3"
                                        autoComplete="new-password"
                                    />
                                    <ErrorMessage name="cropsGrown" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Bio */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 mb-2" htmlFor="bio">
                                        <div className="flex items-center">
                                            <MdOutlineDescription className="text-green-600 mr-2" />
                                            <span>Bio</span>
                                        </div>
                                    </label>
                                    <Field
                                        as="textarea"
                                        id="bio"
                                        name="bio"
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                            errors.bio && touched.bio ? ' focus:ring-red-500' : ''
                                        }`}
                                        placeholder="Tell us about yourself and your farming journey"
                                        rows="4"
                                        autoComplete="new-password"
                                    />
                                    <ErrorMessage name="bio" component="div" className="text-red-500 text-sm mt-1" />
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
                            <ButtonLoader
                                buttonId="profileUpdateButton"
                                type="submit"
                                className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
                                disabled={isSubmitting}
                            >
                                Complete Profile
                            </ButtonLoader>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UserProfileForm;