import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSeedling, FaCalendarAlt, FaIdCard, FaCheckCircle, FaTimesCircle, FaTimes, FaFileAlt, FaEye, FaArrowsAlt } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import AdminAuthenticatedAxiosInstance from '../../axios-center/AdminAuthenticatedAxiosInstance';
import UserDefaultImage from '../../assets/images/user-default.png';
import { showToast } from '../../components/toast-notification/CustomToast';
//redux disptach for handle the buttonloader 
import { useDispatch } from 'react-redux';
//import the common button loader and redux reducers
import ButtonLoader from '../../components/LoaderSpinner/ButtonLoader';
import { showButtonLoader, hideButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';
// import sweet alert
import Swal from "sweetalert2";
//To make the modal draggable 
import { motion, useDragControls } from "framer-motion";
import { FiAlertCircle, FiSend } from 'react-icons/fi';


function UserPageDetailView() {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [showAadharModal, setShowAadharModal] = useState(false);
    const [showInputField, setShowInputField] = useState(false);
    const [resubmissionMessage, setResubmissionMessage] = useState('');

    const dragControls = useDragControls();

    const startDrag = (event) => {
        dragControls.start(event);
    };

    //for resubmission button set up
    const handleSubmitResubmissionRequest = async () => {
        // Show confirmation alert before proceeding
        const result = await Swal.fire({
            title: "Send Aadhaar Resubmission Request?",
            text: "Are you sure you want to send a resubmission request to the user for their Aadhaar verification?",
            showCancelButton: true,
            confirmButtonText: "Yes, Send request!",
            cancelButtonText: "Cancel",
            showClass: {
                popup: "swal-fade-in",
            },
            hideClass: {
                popup: "swal-fade-out",
            },
            customClass: {
                popup: "my-swal-popup",
                title: "my-swal-title",
                confirmButton: "my-swal-confirm",
                cancelButton: "my-swal-cancel",
            }
        });

        // If the user cancels, exit function
        if (!result.isConfirmed) {
            return;
        }

        try {
            const response = await AdminAuthenticatedAxiosInstance.patch(`/users/update-aadhar-resubmission-message/${userId}/`, { aadhar_resubmission_message: resubmissionMessage });
            console.log('Resubmission request sent successfully:', response.data);
            showToast("Resubmission request sent successfully...", "success")
            cancelRequest();
        } catch (error) {
            console.error('Error sending resubmission message:', error.response?.data || error.message);
            showToast("Error happend while sending the message...", "error")

        }
    };

    const cancelRequest = () => {
        setResubmissionMessage('');
        setShowInputField(false);
    };
    // Function to calculate age based on date of birth
    const calculateAge = (dateString) => {
        const birthDate = new Date(dateString);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDifference = currentDate.getMonth() - birthDate.getMonth();
        const dayDifference = currentDate.getDate() - birthDate.getDate();

        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }

        return age;
    };

    // Format Date of Birth
    const dateOfBirth = new Date(user && user.date_of_birth || '');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateOfBirth.toLocaleDateString('en-US', options);

    // Calculate Age
    const age = user && user.date_of_birth ? calculateAge(user.date_of_birth) : null;

    // Format the updated and created with time 
    const formatDate = (dateString) => {
        const date = new Date(dateString); // No need to handle empty string here
        if (isNaN(date)) {
            return "Invalid Date"; // Return a fallback message for invalid date
        }

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true  // To get AM/PM format
        };

        // Return both date and time in the desired format
        return date.toLocaleString('en-US', options);
    };

    // Open Aadhar modal
    const openAadharModal = () => {
        setShowAadharModal(true);
    };

    // Close Aadhar modal
    const closeAadharModal = () => {
        setShowAadharModal(false);
    };

    useEffect(() => {
        // Fetch user details function, can be called anytime
        const fetchUserDetails = async () => {
            try {
                const response = await AdminAuthenticatedAxiosInstance.get(`/users/admin/get-user/${userId}/`);
                setUser(response.data);
            } catch (error) {
                console.log("Error fetching user details : ", error);
            }
        };

        fetchUserDetails();

    }, [userId]);

    const handleVerifyAadhaar = async (userId) => {
        //for button loader when click the button...
        const buttonId = "verifyAadhaar"

        // Show confirmation alert before proceeding
        const result = await Swal.fire({
            title: "Verify Aadhaar?",
            text: "Have you verified that the uploaded Aadhaar is correct and matches the user's profile details?",
            showCancelButton: true,
            confirmButtonText: "Yes, verify it!",
            cancelButtonText: "Cancel",
            showClass: {
                popup: "swal-fade-in",
            },
            hideClass: {
                popup: "swal-fade-out",
            },
            customClass: {
                popup: "my-swal-popup",
                title: "my-swal-title",
                content: "my-swal-content",
                confirmButton: "my-swal-confirm",
                cancelButton: "my-swal-cancel",
            }
        });

        // If the user cancels, exit function
        if (!result.isConfirmed) {
            return;
        }

        dispatch(showButtonLoader(buttonId))
        try {
            const response = await AdminAuthenticatedAxiosInstance.patch(`/users/verify-aadhaar/${userId}/`);
            showToast("Aadhar successfully verified!")
            setUser((prevUser) => ({
                ...prevUser,
                is_aadhar_verified: true,
            }))
            setShowAadharModal(false);
        } catch (error) {
            console.log("Error verifying Aadhar : ", error)
            showToast("Failed to verify Aadhaar.")
            setShowAadharModal(false);
        } finally {
            dispatch(hideButtonLoader(buttonId));
        }
    }

    return (
        <>
            <div className="bg-white border-l-4 border-r-4 border-green-500 0 p-4 shadow-lg mb-5">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2 text-gray-600 font-bold">
                        <li>
                            <Link to="/admin/users-management" className="text-green-500 hover:text-green-700">Farmers Management</Link>
                        </li>
                        <li>
                            <span className="text-gray-500"> /</span>
                        </li>
                        <li>
                            <span className="text-gray-500">Farmers Details</span>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="max-w-full mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                {/* Header with background */}
                <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
                    <h1 className="text-2xl font-bold">Farmer Details</h1>
                </div>

                {/* Main content */}
                <div className="p-6">
                    {/* Profile header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b border-gray-200">
                        <div className="relative">
                            <img
                                src={user && user.profile_picture || UserDefaultImage}
                                alt="Profile Picture"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                                <FaCheckCircle className="text-lg" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-800">{user && user.username || "Farmer"}</h2>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center justify-center md:justify-start text-gray-600">
                                    <FaEnvelope className="mr-2 text-green-500" />
                                    <span>{user && user?.email || "farmer@gmail.com"}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start text-gray-600">
                                    <FaPhone className="mr-2 text-green-500" />
                                    <span>{user && user?.phone_number || "Not available"}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start text-gray-600">
                                    <FaCalendarAlt className="mr-2 text-green-500" />
                                    <span>
                                        <span className="text-green-500 font-bold">DOB: </span>{formattedDate || "No data"}
                                        {age !== null && (
                                            <span className="ml-4 text-gray-500">({age} years old)</span>
                                        )}
                                    </span>
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
                                <p className="text-gray-600 mb-1"><span className="text-green-500 font-bold">Home Address :</span>  {user && user?.address?.home_address || "No data found"}</p>
                                <p className="text-gray-600 mb-1"> <span className="text-green-500 font-bold">Location : </span>{user && user?.address?.full_location || "No data found"}</p>
                                <div className="mt-2 text-xs text-gray-500 flex items-center font-bold">
                                    <span className="mr-3 ">Latitude: {user && user?.address?.latitude || "No data found"}</span>
                                    <span>Longitude: {user && user?.address?.longitude || "No data found"}</span>
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
                                    <span className="text-gray-600"><span className="text-green-500 font-bold">Farming Type :</span> {user && user?.farming_type || "No data found"}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-600"><span className="text-green-500 font-bold">Year of Experience :</span> {user && user?.experience || "0"} years</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                    {/* Ensure the bio text doesn't overflow */}
                                    <span className="text-green-500 font-bold">About Farmer :</span>
                                    <p className="text-gray-600 text-sm italic break-words mt-2">
                                        {user && user?.bio || "No data found"}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Profile Completed */}
                                <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                    <span className="text-gray-600">Profile Completed</span>
                                    <div className="flex items-center">
                                        {user && user?.profile_completed ? (
                                            <div className="flex items-center text-green-500">
                                                <FaCheckCircle className="mr-1" />
                                                <span className="font-medium">Yes</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-red-500">
                                                <FaTimesCircle className="mr-1" />
                                                <span className="font-medium">No</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email Verified */}
                                <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                    <span className="text-gray-600">Email Verified (OTP verification)</span>
                                    <div className="flex items-center">
                                        {user && user?.is_verified ? (
                                            <div className="flex items-center text-green-500">
                                                <FaCheckCircle className="mr-1" />
                                                <span className="font-medium">Yes</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-red-500">
                                                <FaTimesCircle className="mr-1" />
                                                <span className="font-medium">No</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Phone Verified */}
                                <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                    <span className="text-gray-600">Farmer status Active</span>
                                    <div className="flex items-center">
                                        {user && user?.is_active ? (
                                            <div className="flex items-center text-green-500">
                                                <FaCheckCircle className="mr-1" />
                                                <span className="font-medium">Yes</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-red-500">
                                                <FaTimesCircle className="mr-1" />
                                                <span className="font-medium">No</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Aadhaar Verified */}
                                {user?.profile_completed && (

                                    <div
                                        className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 cursor-pointer hover:bg-gray-100"
                                        onClick={openAadharModal}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-gray-600">Aadhaar Verified</span>

                                        </div>
                                        <div className="flex items-center">
                                            {user && user?.is_aadhar_verified ? (
                                                <div className="flex items-center text-green-500">
                                                    <FaCheckCircle className="mr-1" />
                                                    <span className="font-medium">Yes</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-red-500">
                                                    <FaTimesCircle className="mr-1" />
                                                    <span className="font-medium">No</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                )}

                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="mt-6 pt-4 font-bold border-t border-gray-200 text-sm text-gray-500 flex justify-between">
                        <div>Created : {user && formatDate(user.created_at) || ""}</div>
                        <div>Last Updated : {user && formatDate(user.updated_at) || ""}</div>
                    </div>
                </div>
            </div>


            {showAadharModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 overflow-hidden scrollbar-hide">
                    <motion.div
                        drag
                        dragControls={dragControls}
                        dragListener={false} // disables default drag behavior
                        dragTransition={{ power: 0, timeConstant: 0 }}
                    >
                        <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-lg scrollbar-hide relative">

                            {/* Modal Header */}
                            <div className="border-b px-4 py-3 flex items-center justify-between 
                        bg-gradient-to-r from-green-700 to-green-400 
                        sticky top-0 z-10 w-full rounded-t-lg">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <FaIdCard className="mr-2" /> Aadhaar Details
                                </h3>
                                <div className="flex items-center gap-7">
                                    {/* Drag Handle Button */}
                                    <button
                                        onPointerDown={startDrag}
                                        className="text-white hover:text-gray-200 cursor-move"
                                        title="Drag Modal"
                                    >
                                        <FaArrowsAlt className="text-xl" />
                                    </button>
                                    <button
                                        onClick={closeAadharModal}
                                        className="text-white hover:text-gray-200"
                                    >
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                {user && user?.is_aadhar_verified ? (
                                    <div className="space-y-4">
                                        {/* Aadhaar Image Preview */}


                                        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300">
                                            <h4 className="font-bold text-gray-700 mb-4">Uploaded Aadhaar Image</h4>

                                            {user?.aadhar_card ? (
                                                <div className="flex justify-center border-2 border-gray-300 rounded-lg p-2 bg-gray-100">
                                                    <img
                                                        src={user.aadhar_card}
                                                        alt="Aadhaar"
                                                        className="w-full max-w-sm h-auto object-contain rounded-md"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 flex items-center justify-center border-2 border-gray-300 rounded-lg">
                                                    <span className="text-gray-500">Image not available</span>
                                                </div>
                                            )}
                                        </div>


                                        {/* Status Badge */}
                                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full inline-flex items-center">
                                            <span className="text-green-500 mr-2"><FaCheckCircle className="mr-1" /></span> Verified
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="text-center">
                                            <FaTimesCircle className="text-red-500 text-5xl  mx-auto" />
                                            <h4 className="text-lg font-bold text-red-700 py-4">Aadhaar Not Verified</h4>

                                            <div className="bg-red-50 border-l-4 border-red-400 p-5 shadow-lg flex items-center space-x-3 mb-8">
                                                {/* Warning Icon */}
                                                <svg className="h-6 w-6 text-red-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>

                                                {/* Text */}
                                                <p className="text-sm text-red-700 flex-1">
                                                    Please verify the user's Aadhaar manually. If any issue, request resubmission.
                                                </p>
                                            </div>

                                        </div>

                                        {/* Aadhaar Image Preview */}
                                        {user?.aadhar_card && (
                                            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300">
                                                <h4 className="font-bold text-gray-700 mb-4">Uploaded Aadhaar Image</h4>
                                                <div className="flex justify-center border-2 mb-4">
                                                    <img
                                                        src={user.aadhar_card}
                                                        alt="Aadhaar"
                                                        className="w-full max-w-sm h-auto object-contain rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Buttons */}
                                        <div className="flex flex-col  gap-6">

                                            <ButtonLoader
                                                buttonId="verifyAadhaar"
                                                onClick={() => { handleVerifyAadhaar(user.id) }}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-md shadow-md mt-4"
                                            >< FaIdCard className="text-lg" />
                                                Verify Aadhaar
                                            </ButtonLoader>

                                            {!showInputField ? (
                                                <button
                                                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-md shadow-md"
                                                    onClick={() => setShowInputField(true)}
                                                >
                                                    <FiAlertCircle className="text-lg" />
                                                    Request Resubmission
                                                </button>
                                            ) : (
                                                <div className="border rounded-md p-4 bg-white shadow-md">
                                                    <div className="mb-3">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Reason for resubmission:
                                                        </label>
                                                        <textarea
                                                            className=" text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
                                                            placeholder="Please explain why the user needs to resubmit their Aadhaar..."
                                                            value={resubmissionMessage}
                                                            onChange={(e) => setResubmissionMessage(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                                            onClick={cancelRequest}
                                                        >
                                                            <FaTimesCircle />
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                                                            onClick={handleSubmitResubmissionRequest}
                                                            disabled={!resubmissionMessage.trim()}
                                                        >
                                                            <FiSend />
                                                            Send Request
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t px-4 py-3 flex justify-end bg-gray-50">
                                <button onClick={closeAadharModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            )}




        </>
    );
}

export default UserPageDetailView;