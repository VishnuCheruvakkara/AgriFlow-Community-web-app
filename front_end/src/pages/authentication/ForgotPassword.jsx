import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicAxiosInstance from "../../axios-center/PublicAxiosInstance";
import { showToast } from '../../components/toast-notification/CustomToast';
import agriFlowLogo from '../../assets/images/agriflowlogo.png'
import ButtonLoader from '../../components/LoaderSpinner/ButtonLoader'
import { showButtonLoader, hideButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';
import { useDispatch } from 'react-redux';
import ThemeToggle from '../../components/ThemeController/ThemeToggle';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const buttonId = "forgotPassword"
        dispatch(showButtonLoader(buttonId)) //showloader

        if (!email) {
            showToast("Please enter your email address", "warn");
            return;
        }

        setIsLoading(true);
        try {
            // Replace with your actual API endpoint for password reset
            const response = await PublicAxiosInstance.post("/users/forgot-password/", {
                email: email
            });

            showToast("OTP sent to your email", "success");

            // Navigate to OTP verification page with email
            navigate("/forgot-password-otp", { state: { email } });
        } catch (error) {
            showToast(error.response?.data?.email[0] || "Failed to send reset email", "error");
        } finally {
            dispatch(hideButtonLoader(buttonId)); //Hide loader after process
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-zinc-950">
            {/* Common theme toggler   */}
            <div className="bg-green-500 absolute top-8 right-11 rounded-lg p-[1px]">
                <ThemeToggle />
            </div>
            {/* Right side form panel */}
            <div className="w-full lg:w-1/2 lg:ml-auto overflow-y-auto h-screen scrollbar-hide">
                <div className="bg-white  dark:bg-zinc-950 flex justify-center items-center p-6 lg:p-12 h-screen">
                    <div className="sm:bg-white  dark:bg-zinc-800 p-8 rounded-xl sm:shadow-2xl w-full max-w-md">
                        {/* Mobile logo (visible only on small screens) */}
                        <Link to="/" className="lg:hidden flex justify-center mb-2">
                            <img src={agriFlowLogo} alt="AgriFlow logo" className="w-20 " />
                        </Link>

                        <h2 className="text-2xl font-bold text-center text-green-700 mb-2 dark:text-green-500">Forgot Password</h2>
                        <p className="text-gray-600 text-center mb-8 dark:text-zinc-400">
                            Enter your email address and we'll send you an OTP to reset your password
                        </p>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1 dark:text-zinc-200">Email</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-white dark:bg-zinc-900 text-black dark:text-white w-full pl-10 px-4 py-3 border border-gray-300  dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <ButtonLoader
                                buttonId="forgotPassword"
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-lg flex justify-center items-center"
                            >
                                Send Reset OTP
                            </ButtonLoader>
                        </form>

                        <p className="mt-6 text-center text-gray-600 dark:text-zinc-500">
                            Remember your password? <Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;