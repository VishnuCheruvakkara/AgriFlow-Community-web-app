import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SignUpLeftSideSection from '../../components/Authentication/SignUpLeftSideSection'

const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [email, setEmail] = useState(''); // This would be passed from previous screen

    // Create refs for each input
    const inputRefs = Array(6).fill(0).map(() => React.createRef());

    useEffect(() => {
        // Focus the first input when component mounts
        inputRefs[0].current.focus();

        // Start the timer
        const intervalId = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(intervalId);
                    setIsResendDisabled(false);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        // Cleanup
        return () => clearInterval(intervalId);
    }, []);

    // Format email to show only first 3 characters + domain
    const formatEmail = (email) => {
        if (!email) return '';
        const [username, domain] = email.split('@');
        if (!domain) return email;
        return `${username.substring(0, 3)}${'*'.repeat(username.length - 3)}@${domain}`;
    };

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return; // Only allow numbers

        // Update the OTP array
        const newOtp = [...otp];
        newOtp[index] = value.substring(0, 1); // Only take the first character
        setOtp(newOtp);

        // Auto-focus next input if value is entered
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

        const newOtp = [...otp];
        for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        // Focus the appropriate input
        if (pastedData.length < 6) {
            inputRefs[pastedData.length].current.focus();
        } else {
            inputRefs[5].current.focus();
        }
    };

    const handleResendOTP = () => {
        // Reset timer
        setTimer(60);
        setIsResendDisabled(true);

        // Clear OTP fields
        setOtp(['', '', '', '', '', '']);

        // Focus the first input
        inputRefs[0].current.focus();

        // Start the timer again
        const intervalId = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(intervalId);
                    setIsResendDisabled(false);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        // Implement resend OTP logic here
        console.log("Resending OTP...");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            alert("Please enter a complete 6-digit OTP");
            return;
        }

        // Implement verify OTP logic here
        console.log("Verifying OTP:", otpValue);
        // On success, redirect to dashboard or home
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            {/* Left side image panel */}
            <SignUpLeftSideSection />

            {/* Right side OTP panel */}
            <div className="w-full lg:w-1/2 lg:ml-auto overflow-y-auto h-screen scrollbar-hide">
                <div className="bg-white flex justify-center items-center p-6 lg:p-12 ">
                    <div className="sm:bg-white p-8 rounded-xl sm:shadow-2xl w-full max-w-md">
                        {/* Mobile logo (visible only on small screens) */}
                        <div className="md:hidden flex justify-center mb-8">
                            <img src="/api/placeholder/80/80" alt="AgriFlow logo" className="w-16 h-16" />
                        </div>

                        <h2 className="text-2xl font-bold text-center text-green-700 mb-2">Verify Your Email</h2>
                        <p className="text-gray-600 text-center mb-8">
                            We've sent a verification code to {formatEmail(email || 'your@email.com')}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="flex justify-center space-x-2 w-full">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={inputRefs[index]}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleChange(index, e)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={index === 0 ? handlePaste : null} // Only attach paste handler to first input
                                            className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    Didn't receive the code?
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={isResendDisabled}
                                        className={`ml-1 font-medium ${isResendDisabled ? 'text-gray-400' : 'text-green-600 hover:underline'}`}
                                    >
                                        {isResendDisabled ? `Resend in ${timer}s` : 'Resend OTP'}
                                    </button>
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-lg"
                            >
                                Verify & Continue
                            </button>

                            <div className="text-center">
                                <p className="text-gray-600">
                                    <Link to="/signup" className="text-green-600 font-medium hover:underline">
                                        Change email address
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;