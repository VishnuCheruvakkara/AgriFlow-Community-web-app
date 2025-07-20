import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PublicAxiosInstance from "../../axios-center/PublicAxiosInstance";
import { showToast } from '../../components/toast-notification/CustomToast';
import agriFlowLogo from '../../assets/images/agriflowlogo.png';
import ButtonLoader from '../../components/LoaderSpinner/ButtonLoader';
import { showButtonLoader, hideButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/AuthSlice'
import ThemeToggle from '../../components/ThemeController/ThemeToggle';

const SetNewPassword = () => {
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Get email and set that into the email state.
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const buttonId = "forgotPasswordSetNew"

        dispatch(showButtonLoader(buttonId)) //showloader

        setIsLoading(true);
        try {
            // Call API to reset password
            const response = await PublicAxiosInstance.put("/users/forgot-password-set-new-password/", {
                email: email,
                new_password: formData.password,
                confirm_password: formData.confirmPassword,
            });

            dispatch(logout());
            showToast("Password reset successful!,Sign in with new password", "success");
            // Navigate to login page
            navigate("/login");
        } catch (error) {
            // console.error("Failed to reset password:", error.response?.data?.non_field_errors);
            showToast("Failed to reset password", "error");
            setErrors(error.response?.data)
        } finally {
            dispatch(hideButtonLoader(buttonId)); //Hide loader after process
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
                <div className="bg-white dark:bg-zinc-950 flex justify-center items-center p-6 lg:p-12 h-screen">
                    <div className="sm:bg-white dark:sm:bg-zinc-800 p-8 rounded-xl sm:shadow-2xl dark:sm:shadow-zinc-900/20 w-full max-w-md">
                        {/* Mobile logo (visible only on small screens) */}
                        <Link to="/" className="lg:hidden flex justify-center mb-2">
                            <img src={agriFlowLogo} alt="AgriFlow logo" className="w-20 " />
                        </Link>

                        <h2 className="text-2xl font-bold text-center text-green-700 dark:text-green-400 mb-2">Set New Password</h2>
                        <p className="text-gray-600 dark:text-zinc-400 text-center mb-8">
                            Create a new password for your account
                        </p>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-700 dark:text-zinc-300 font-medium mb-1">New Password</label>
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
                                        className={`bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 w-full pl-10 px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 ${errors ? "focus:ring-red-500" : "focus:ring-green-500 dark:focus:ring-green-400"} transition duration-500 ease-in-out`}
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                                    </button>
                                </div>
                                {errors.new_password && errors.new_password.map((error, index) => (
                                    <p key={index} className="text-sm text-red-500 mt-1">{error}</p>
                                ))}
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Password must be at least 8 characters long</p>
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-zinc-300 font-medium mb-1">Confirm Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 w-full pl-10 px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 ${errors ? "focus:ring-red-500" : "focus:ring-green-500 dark:focus:ring-green-400"} transition duration-500 ease-in-out`}
                                        placeholder="Confirm new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
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
                                    </button>
                                </div>
                            </div>

                            <ButtonLoader
                                buttonId="forgotPasswordSetNew"
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-lg flex justify-center items-center"
                            >
                                Reset Password
                            </ButtonLoader>
                        </form>

                        <p className="mt-6 text-center text-gray-600 dark:text-zinc-400">
                            Remember your password? <Link to="/login" className="text-green-600 dark:text-green-400 font-medium hover:underline">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetNewPassword;