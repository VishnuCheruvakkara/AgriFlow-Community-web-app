import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicAxiosInstance from '../../axios-center/PublicAxiosInstance';
import { showToast } from '../../components/toast-notification/CustomToast';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/AuthSlice';
import agriFlowLogo from '../../assets/images/agriflowlogo.png';
import ButtonLoader from '../../components/LoaderSpinner/ButtonLoader';
import { showButtonLoader, hideButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';
// logo and images 
import AgriFlowWhiteLogo from '../../assets/images/agriflowwhite.png'

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const buttonId = "adminLoginButton";
        dispatch(showButtonLoader(buttonId));

        try {
            const response = await PublicAxiosInstance.post("/admin/login/", formData);
            const { user, access_token } = response.data;

            // Verify admin role before proceeding
            if (user.role !== 'admin') {
                showToast("Access denied. Admin privileges required.", "error");
                return;
            }

            dispatch(loginSuccess({ user, token: access_token, isAdmin: true }));
            showToast(`Welcome Admin ${user.name}! Login successful`, "success");
            navigate("/admin-dashboard");
        } catch (error) {
            console.error("Admin login failed:", error.response?.data || error.message);
            showToast("Admin login failed. Please check your credentials.", "error");
        } finally {
            dispatch(hideButtonLoader(buttonId));
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            {/* Left side - Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-green-600 flex-col justify-center items-center p-12 fixed h-screen top-0 left-0 relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/admin-login-background.jpg')",
                        filter: "brightness(0.9)"
                    }}
                ></div>

                {/* Additional dark overlay for text readability */}
                <div className="absolute inset-0 bg-black opacity-40"></div>

                {/* Content */}
                <div className="relative z-10 text-center">
                    <Link to='/'>
                        <img
                            src={ AgriFlowWhiteLogo}
                            alt="AgriFlow logo"
                            className="w-24 h-24 mx-auto mb-8"
                        />
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4">AgriFlow Admin</h1>
                    <p className="text-xl text-white opacity-90">
                        Dashboard access for agricultural management
                    </p>

                    <div className="mt-12 bg-white/20 backdrop-blur-sm p-6 rounded-lg">
                        <p className="text-white text-lg italic">
                            "AgriFlow's analytics helped us reduce water usage by 28% while improving crop yields across our entire operation."
                        </p>
                        <p className="text-white mt-4 font-semibold">- Sarah Johnson, Green Valley Agricultural</p>
                    </div>
                </div>
            </div>


            {/* Right side form panel */}
            <div className="w-full lg:w-1/2 lg:ml-auto overflow-y-auto h-screen scrollbar-hide">
                <div className="bg-white flex justify-center items-center p-6 lg:p-12">
                    <div className="sm:bg-white p-8 rounded-xl sm:shadow-2xl w-full max-w-md">
                        {/* Mobile logo (visible only on small screens) */}
                        <div className="lg:hidden flex justify-center mb-2">
                            <img src={agriFlowLogo} alt="AgriFlow logo" className="w-20" />
                        </div>
                        <h2 className="text-2xl font-bold text-center text-green-700 mb-2">Admin Portal</h2>
                        <p className="text-gray-600 text-center mb-8">Sign in to access administrative controls</p>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        This area is restricted to authorized administrators only.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Admin Email</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-white text-black w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
                                        placeholder="admin@agriflow.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="bg-white text-black w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <span
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        )}
                                    </span>
                                </div>
                            </div>

                           
                            <ButtonLoader
                                buttonId="adminLoginButton"
                                type="submit"
                                className=" w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-lg "
                            >
                                Sign In to Admin
                            </ButtonLoader>
                        </form>

                        <p className="mt-6 text-center text-gray-600">
                            <Link to="/login" className="text-green-600 font-medium hover:underline">Return to Farmer login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;