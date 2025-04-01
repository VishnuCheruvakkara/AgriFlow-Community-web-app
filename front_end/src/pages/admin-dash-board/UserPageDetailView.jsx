import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSeedling, FaCalendarAlt, FaIdCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import AdminAuthenticatedAxiosInstance from '../../axios-center/AdminAuthenticatedAxiosInstance';
import UserDefaultImage from '../../assets/images/user-default.png'

function UserPageDetailView() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

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

    // formate the updated and created with time 
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


    useEffect(() => {

        const fetchUserDetails = async () => {
            try {
                const response = await AdminAuthenticatedAxiosInstance.get(`/users/admin/get-user/${userId}/`)
                setUser(response.data)
            } catch (error) {
                console.log("Error fetching user details : ", error)
            }
        }
        fetchUserDetails();
    }, [userId])

    return (
        <>
            <div className="bg-white  border-l-4 border-r-4 border-green-500 0 p-4  shadow-lg mb-5">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2 text-gray-600 font-bold">
                        <li>
                            <Link to="/admin/users-management" className="text-green-500 hover:text-green-700">Farmers</Link>
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
                                <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                    <span className="text-gray-600">Aadhaar Verified</span>
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
        </>
    );
}

export default UserPageDetailView;