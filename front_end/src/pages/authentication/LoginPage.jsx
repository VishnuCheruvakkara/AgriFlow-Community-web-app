import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleAuthButton from '../../components/Authentication/GoogleAuthButton';
import PublicAxiosInstance from '../../axios-center/PublicAxiosInstance';
import { showToast } from '../../components/toast-notification/CustomToast';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/AuthSlice';
import agriFlowLogo from '../../assets/images/agriflowlogo.png'
//import the common button loader and redux reducers
import ButtonLoader from '../../components/LoaderSpinner/ButtonLoader'
import { showButtonLoader, hideButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';
import ThemeToggle from '../../components/ThemeController/ThemeToggle';


const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
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

        const buttonId = "loginButton";
        dispatch(showButtonLoader(buttonId)); //show-loader

        try {
            const response = await PublicAxiosInstance.post("/users/login/", formData)
            // Extract user data and token from the response
            const { user, access_token } = response.data;
            // Dispatch loginSuccess action to store user data in Redux
            dispatch(loginSuccess({ user, token: access_token }));
            //Toast message for success login
            showToast(`Welcome ${user.name} ! Login successful`, "success")

            // Check if the profile is completed and navigate accordingly
            if (user.aadhar_verification) {
                navigate("/user-dash-board"); // Redirect to dashboard
            } else {
                navigate("/user-dash-board/farmer-profile"); // Redirect to home page if profile is incomplete
            }

        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            showToast(error.response?.data?.error || "Incorrect Email or Password, Try again.", "error");
        }
        finally {
            dispatch(hideButtonLoader(buttonId)); // Hide loader afeter process
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-zinc-900">
            {/* Common theme toggler   */}
            <div className="bg-green-500 absolute top-8 right-11 rounded-lg p-[1px]">
                <ThemeToggle />
            </div>

            {/* Right side form panel */}
            <div className="w-full lg:w-1/2 lg:ml-auto overflow-y-auto h-screen scrollbar-hide">
                <div className="bg-white dark:bg-zinc-950 flex justify-center items-center p-6 lg:p-12">
                    <div className="sm:bg-white dark:sm:bg-zinc-800 p-8 rounded-xl sm:shadow-2xl dark:sm:shadow-zinc-900/20 w-full max-w-md">
                        {/* Mobile logo (visible only on small screens) */}
                        <Link to="/" className="lg:hidden flex justify-center mb-2">
                            <img src={agriFlowLogo} alt="AgriFlow logo" className="w-20" />
                        </Link>
                        <h2 className="text-2xl font-bold text-center text-green-700 dark:text-green-400 mb-2">Welcome to AgriFlow</h2>
                        <p className="text-gray-600 dark:text-zinc-400 text-center mb-8">Sign in to your account</p>

                        <div className="space-y-4 mb-6">
                            {/* google sighn in  */}
                            <GoogleAuthButton />
                        </div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-zinc-600"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-3 bg-white dark:sm:bg-zinc-800 dark:bg-zinc-950 text-gray-500 dark:text-zinc-400 text-sm">Or continue with email</span>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>

                            <div>
                                <label className="block text-gray-700 dark:text-zinc-300 font-medium mb-1">Email</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 w-full pl-10 px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition duration-500 ease-in-out"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-zinc-300 font-medium mb-1">Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 w-full pl-10 px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition duration-500 ease-in-out"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <span
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        )}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Must be at least 8 characters</p>
                            </div>

                            <div className="flex justify-end">
                                <Link to='/forgot-password' className="text-md text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition duration-200 ease-in-out hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <ButtonLoader
                                buttonId="loginButton"
                                type="submit"
                                className="w-full bg-green-600 dark:bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition font-medium text-lg"
                            >
                                Sign In
                            </ButtonLoader>
                        </form>

                        <p className="mt-6 text-center text-gray-600 dark:text-zinc-400">
                            Dont have an account? <Link to="/sign-up" className="text-green-600 dark:text-green-400 font-medium hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;