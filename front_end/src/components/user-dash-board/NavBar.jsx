import React, { useState, useRef, useEffect } from 'react'
import { FaBell, FaEnvelope, FaSearch } from 'react-icons/fa';
import { IoMdLogOut } from "react-icons/io";
// for lgout section 
import { useNavigate } from 'react-router-dom';
//importing base axios instance for axios set up through the AxiosInterceptors
import PublicAxiosInstance from '../../axios-center/PublicAxiosInstance'
//import from react-redux 
import { useDispatch, useSelector } from 'react-redux';
//import from redux-auth-slice 
import { logout } from '../../redux/slices/AuthSlice'
// persitor imported from the redux store to purge the data in the local storage
import { persistor } from '../../redux/Store';
//
import { showToast } from '../toast-notification/CustomToast';
import defaultUserImage from '../../assets/images/user-default.png'
import { FaSignOutAlt, FaCog } from 'react-icons/fa';
import agriFlowLogo from '../../assets/images/agriflowwhite.png'
import ThemeToggle from '../ThemeController/ThemeToggle';


function NavBar() {

    const user = useSelector((state) => state.auth.user);
    const AadharVerified = user?.aadhar_verification;
    const userData = useSelector((state) => state.user.user)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

    // Close the dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {


            await PublicAxiosInstance.post("/users/logout/");
            //clear userdata and accesstoken details from the localstorage through the redux-persistor

            dispatch(logout());

            await persistor.purge(); //Clear the persisted state
            showToast(`logout successful`, "success")
            //Redirect to the login page
            navigate("/login")


        } catch (error) {
            console.log("logout failed:", error);
            showToast(`logout failed`, "error")

        }
    }

    return (
        <nav className="bg-green-700 text-white fixed top-0 w-full z-30 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    <div className="flex items-center space-x-2">
                        <img src={agriFlowLogo} alt="Logo" className="h-12" />
                        <span className="font-semibold text-xl text-white">AgriFlow</span>
                    </div>

                    {/* Search Bar */}
                    {AadharVerified &&
                        <div className="hidden md:block flex-1 max-w-xl mx-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for crops, communities, products..."
                                    className="w-full py-2 pl-10 pr-4 rounded-full bg-green-600 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                                <FaSearch className="absolute left-3 top-3 text-green-200 " />
                            </div>
                        </div>
                    }

                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-4">



                        {AadharVerified ? (
                            <>
                                {/* Show Other Icons if Profile is Completed */}
                                <button className="relative p-2 rounded-full hover:bg-green-600 transition-colors tooltip tooltip-bottom" data-tip="Notification">
                                    <FaBell className="text-xl" />
                                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
                                </button>
                                <button className="relative p-2 rounded-full hover:bg-green-600 transition-colors tooltip tooltip-bottom" data-tip="Messages">
                                    <FaEnvelope className="text-xl" />
                                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">5</span>
                                </button>
                                <div className="relative">
                                    <div
                                        className="h-8 w-8 cursor-pointer rounded-full overflow-hidden lg:hidden "
                                        onClick={toggleDropdown} // Toggle on click
                                    >
                                        <img
                                            src={userData?.profile_picture || defaultUserImage}
                                            alt="User profile"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Dropdown */}
                                    {isDropdownVisible && (
                                        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <ul className="py-2">
                                                <li className="px-4 py-2 text-gray-700 flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                                                    <FaCog className="text-lg" />
                                                    <span>Settings</span>
                                                </li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="px-4 py-2 text-red-500 flex items-center space-x-2 hover:bg-red-50 cursor-pointer w-full text-left"
                                                >
                                                    <FaSignOutAlt className="text-lg" />
                                                    <span>Logout</span>
                                                </button>

                                            </ul>
                                        </div>
                                    )}
                                </div>


                                {/* Put the theme toggle button here */}

                                <ThemeToggle />





                            </>
                        ) : (
                            <>
                                {/* Show Logout Button if Profile is NOT Completed */}
                                <div className="tooltip tooltip-left" data-tip="Logout">
                                    <button onClick={handleLogout} className="group  relative p-2 rounded-full hover:bg-white transition duration-500 ease-in-out">
                                        <IoMdLogOut className="text-2xl text-white group-hover:text-red-600 transition duration-500 ease-in-out" />
                                    </button>
                                </div>

                                <ThemeToggle />


                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>

    )
}

export default NavBar
