import React from 'react'
import { FaBell, FaEnvelope, FaSearch } from 'react-icons/fa';
import { IoMdLogOut } from "react-icons/io";
import { useSelector } from "react-redux";
// for lgout section 
import { useNavigate } from 'react-router-dom';
//importing base axios instance for axios set up through the AxiosInterceptors
import PublicAxiosInstance from '../../axios-center/PublicAxiosInstance'
//import from react-redux 
import { useDispatch } from 'react-redux';
//import from redux-auth-slice 
import { logout } from '../../redux/slices/AuthSlice'
// persitor imported from the redux store to purge the data in the local storage
import { persistor } from '../../redux/Store';
//
import { showToast } from '../toast-notification/CustomToast';



function NavBar() {

    const user = useSelector((state) => state.auth.user);
    const profileCompleted = user?.profile_completed;

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <span className="text-xl font-bold">AgriFlow</span>
                    </div>

                    {/* Search Bar */}
                    {profileCompleted &&
                        <div className="hidden md:block flex-1 max-w-xl mx-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for crops, communities, products..."
                                    className="w-full py-2 pl-10 pr-4 rounded-full bg-green-600 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                                <FaSearch className="absolute left-3 top-3 text-green-200" />
                            </div>
                        </div>
                    }

                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-4">
                        {profileCompleted ? (
                            <>
                                {/* Show Other Icons if Profile is Completed */}
                                <button className="relative p-2 rounded-full hover:bg-green-600 transition-colors">
                                    <FaBell className="text-xl" />
                                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
                                </button>
                                <button className="relative p-2 rounded-full hover:bg-green-600 transition-colors">
                                    <FaEnvelope className="text-xl" />
                                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">5</span>
                                </button>
                                <div className="hidden md:block h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                                    <img src="/api/placeholder/32/32" alt="User profile" className="h-full w-full object-cover" />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Show Logout Button if Profile is NOT Completed */}
                                <div className="tooltip tooltip-bottom" data-tip="Logout">
                                        <button onClick={ handleLogout} className="group  relative p-2 rounded-full hover:bg-white transition duration-500 ease-in-out">
                                        <IoMdLogOut className="text-2xl text-white group-hover:text-red-600 transition duration-500 ease-in-out" />
                                    </button>
                                </div>


                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>

    )
}

export default NavBar
