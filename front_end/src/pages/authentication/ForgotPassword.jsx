import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicAxiosInstance from "../../axios-center/PublicAxiosInstance";
import { showToast } from '../../components/toast-notification/CustomToast';
import agriFlowLogo from '../../assets/images/agriflowlogo.png'

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            console.error("Failed to send reset email:", error.response?.data || error.message);
            showToast(error.response?.data?.message || "Failed to send reset email", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            {/* Right side form panel */}
            <div className="w-full lg:w-1/2 lg:ml-auto overflow-y-auto h-screen scrollbar-hide">
                <div className="bg-white flex justify-center items-center p-6 lg:p-12 h-screen">
                    <div className="sm:bg-white p-8 rounded-xl sm:shadow-2xl w-full max-w-md">
                        {/* Mobile logo (visible only on small screens) */}
                        <div className="lg:hidden flex justify-center mb-2">
                            <img src={agriFlowLogo} alt="AgriFlow logo" className="w-20 " />
                        </div>

                        <h2 className="text-2xl font-bold text-center text-green-700 mb-2">Forgot Password</h2>
                        <p className="text-gray-600 text-center mb-8">
                            Enter your email address and we'll send you an OTP to reset your password
                        </p>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Email</label>
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
                                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-lg flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset OTP"
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-gray-600">
                            Remember your password? <Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link>
                        </p>

                     
                      
                       
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;