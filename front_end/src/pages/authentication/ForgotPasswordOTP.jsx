import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PublicAxiosInstance from "../../axios-center/PublicAxiosInstance";
import { showToast } from '../../components/toast-notification/CustomToast';
import agriFlowLogo from '../../assets/images/agriflowlogo.png'
//import the common button loader and redux reducers
import ButtonLoader from '../../components/LoaderSpinner/ButtonLoader';
import { showButtonLoader, hideButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';
import { useDispatch } from 'react-redux';

const ForgotPasswordOTP = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(300); // 5 minutes
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [email, setEmail] = useState('');

    // Create refs for each input
    const inputRefs = Array(6).fill(0).map(() => React.createRef());

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state])


    useEffect(() => {
        // Focus the first input field
        inputRefs[0].current.focus();

        // Check if there's a record of timer status in localStorage
        const timerStatusJSON = localStorage.getItem("otpTimerStatus");

        if (timerStatusJSON) {
            const timerStatus = JSON.parse(timerStatusJSON);

            // If the timer was active when the page was last open
            if (timerStatus.isActive) {
                const expiryTimestamp = parseInt(timerStatus.expiryTime, 10);
                const currentTime = Date.now();
                const remainingTime = Math.floor((expiryTimestamp - currentTime) / 1000);

                if (remainingTime > 0) {
                    // Timer still valid
                    setTimer(remainingTime);
                    setIsResendDisabled(true);
                } else {
                    // Timer expired, don't restart it automatically
                    localStorage.setItem("otpTimerStatus", JSON.stringify({
                        isActive: false,
                        expiryTime: 0
                    }));
                    setTimer(0);
                    setIsResendDisabled(false);
                }
            } else {
                // Timer was already expired, don't restart it
                setTimer(0);
                setIsResendDisabled(false);
            }
        } else {
            // First time visiting the page, start a new timer
            startNewTimer();
        }
    }, []);

    useEffect(() => {
        // Start countdown if timer is greater than 0
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(intervalId);
                        setIsResendDisabled(false);

                        // Update timer status in localStorage
                        localStorage.setItem("otpTimerStatus", JSON.stringify({
                            isActive: false,
                            expiryTime: 0
                        }));

                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);

            // Cleanup interval on component unmount or when timer reaches 0
            return () => clearInterval(intervalId);
        }
    }, [timer]);

    const startNewTimer = () => {
        const durationInSeconds = 5 * 60; // 5 minutes
        const expiryTime = Date.now() + (durationInSeconds * 1000);

        // Store timer status in localStorage
        localStorage.setItem("otpTimerStatus", JSON.stringify({
            isActive: true,
            expiryTime: expiryTime.toString()
        }));

        // Update state
        setTimer(durationInSeconds);
        setIsResendDisabled(true);
    };


    // Function to format the email
    const formatEmail = (email) => {
        if (!email) return "";
        const [username, domain] = email.split("@");
        if (!domain) return email;
        return `${username.substring(0, 3)}${"*".repeat(username.length - 3)}@${domain}`;
    };

    // Function to format timer in MM:SS format
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
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
        const pastedData = e.clipboardData.getData('text').trim();
        if (!/^\d{1,6}$/.test(pastedData)) return; // Only allow numbers

        const newOtp = [...otp];
        for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        // Move focus to the last filled input
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs[nextIndex]?.current.focus();
    };


    const handleResendOTP = async () => {
        try {
            console.log("Resending OTP...");

            // Make an API call to resend OTP
            const response = await PublicAxiosInstance.post("/users/resend-otp/", {
                email: email,  // Replace with the actual email from state/context
            });

            // Show success message
            console.log(response.data.message);

            showToast("OTP has been resent to your entered email.", "success");

            // Reset OTP fields
            setOtp(['', '', '', '', '', '']);

            // Focus the first input
            inputRefs[0].current.focus();

            // Start a new timer
            startNewTimer();

        } catch (error) {
            console.error("Error resending OTP:", error.response?.data || error.message);
            showToast(error.response?.data?.message || "Failed to resend OTP", "error");
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        const buttonId = "forgotPasswordOTP"
        dispatch(showButtonLoader(buttonId)) //showloader

        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            showToast("Please enter a complete 6-digit OTP", "warn");
            return;
        }

        try {
            // Verify OTP
            const response = await PublicAxiosInstance.post("/users/forgot-password-otp-verification/", {
                email: email,
                otp: otpValue,
            });

            // Remove OTP timer status from local storage
            localStorage.removeItem("otpTimerStatus");

            showToast("OTP verified successfully", "success");

            // Navigate to reset password page with email and OTP
            navigate('/forgot-password-new', { state: { email } });
        } catch (error) {
            console.error("OTP verification failed:", error.response?.data || error.message);
            showToast(error.response?.data?.message || "Invalid OTP. Please try again", "error");
        }
        finally {
            dispatch(hideButtonLoader(buttonId)); //Hide loader after process
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            {/* OTP verification panel */}
            <div className="bg-white w-full lg:w-1/2 lg:ml-auto overflow-y-auto h-screen scrollbar-hide">
                <div className="flex justify-center items-center p-6 h-screen">
                    <div className="sm:bg-white p-8 rounded-xl sm:shadow-2xl px-4 sm:px-8 w-full max-w-md">
                        {/*  Mobile logo (visible only on small screens) */}
                        <div className="lg:hidden flex justify-center mb-2">
                            <img src={agriFlowLogo} alt="AgriFlow logo" className="w-20 " />
                        </div>

                        <h2 className="text-2xl font-bold text-center text-green-700 mb-2">Verify Your Email</h2>
                        <p className="text-gray-600 text-center mb-8">
                            We've sent a verification code to <br />{formatEmail(email)}
                        </p>
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
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
                                            className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
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
                                        {isResendDisabled ? `Resend in ${formatTime(timer)}` : 'Resend OTP'}
                                    </button>
                                </p>
                            </div>

                            <ButtonLoader
                                buttonId="forgotPasswordOTP"
                                type="submit"
                                className="w-3/4 mx-auto block bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-lg"
                            >

                                Verify & Continue
                            </ButtonLoader>

                            <div className="text-center">
                                <p className="text-gray-600">
                                    <Link to="/forgot-password" className="text-green-600 font-medium hover:underline">
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

export default ForgotPasswordOTP;