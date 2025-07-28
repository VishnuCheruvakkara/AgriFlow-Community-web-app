import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicAxiosInstance from "../../axios-center/PublicAxiosInstance";
//import google auth button 
import GoogleLoginButton from '../../components/Authentication/GoogleAuthButton';
//icont added 
import { FaWhatsapp } from "react-icons/fa";
// import TestToast from '../../components/toast-notification/TestToast'
import { showToast } from "../../components/toast-notification/CustomToast"
//import logo 
import agriFlowLogo from '../../assets/images/agriflowlogo.png'
//import the common button loader and redux reducers
import ButtonLoader from '../../components/LoaderSpinner/ButtonLoader';
import { showButtonLoader, hideButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';
import { useDispatch } from 'react-redux';
import ThemeToggle from '../../components/ThemeController/ThemeToggle';
// for front end validation
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
    username: Yup.string()
        .min(4, 'Name must be at least 4 characters')
        .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
        .max(50, 'Name too long')
        .required('Name is required'),

    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),

    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),

    password2: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const SignUp = () => {
    const dispatch = useDispatch();


    const navigate = useNavigate(); //React Router's navigation function
    // For show paassword
    const [showPassword, setShowPassword] = useState(false);

    // For show confirmpassword 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            password2: ''
        },
        validationSchema: SignupSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            const buttonId = "signUpButton";
            dispatch(showButtonLoader(buttonId));
            try {
                const response = await PublicAxiosInstance.post("/users/register/", values);
                showToast("An OTP has been sent to your email for verification.", "success");
                navigate("/otp-page", { state: { email: values.email } });

            } catch (error) {
                if (error.response && error.response.data) {
                    const serverErrors = error.response.data;

                    // Flatten nested error responses like password: { password: "message" }
                    const flatErrors = {};
                    for (const key in serverErrors) {
                        const value = serverErrors[key];
                        flatErrors[key] = typeof value === "string" ? value : Object.values(value)[0];
                    }

                    setErrors(flatErrors); // Set backend errors
                    showToast("Registration failed. Please check your input.", "error");
                }
            } finally {
                setSubmitting(false);
                dispatch(hideButtonLoader(buttonId));
            }
        }
    });


    return (
        <div className="h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-zinc-900">

            {/* Common theme toggler   */}
            <div className="bg-green-500 absolute top-8 right-11 rounded-lg p-[1px]">
                <ThemeToggle />
            </div>
            {/* Right side form panel - scrollable */}
            <div className="w-full lg:w-1/2 lg:ml-auto overflow-y-auto h-screen scrollbar-hide">
                <div className="bg-white dark:bg-zinc-950 flex justify-center items-center p-6 lg:p-12">
                    <div className="sm:bg-white dark:sm:bg-zinc-800 p-8 rounded-xl sm:shadow-2xl dark:sm:shadow-zinc-900/20 w-full max-w-md">

                        {/* Mobile logo (visible only on small screens) */}
                        <Link to="/" className="lg:hidden flex justify-center mb-2">
                            <img src={agriFlowLogo} alt="AgriFlow logo" className="w-20" />
                        </Link>

                        <h2 className="text-2xl font-bold text-center text-green-700 dark:text-green-400 mb-2">Welcome to AgriFlow</h2>
                        <p className="text-gray-600 dark:text-zinc-400 text-center mb-8">Create your account to get started</p>

                        <div className="flex items-center justify-center">
                            <div className="space-y-4 mb-6">
                                {/* Google auth button */}
                                <GoogleLoginButton />
                                {/* <TestToast /> */}
                            </div>
                        </div>


                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-zinc-600"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-3 bg-white dark:sm:bg-zinc-800 dark:bg-zinc-950 text-gray-500 dark:text-zinc-400 text-sm">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-gray-700 dark:text-zinc-300 font-medium mb-1">Full Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formik.values.username}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        className={`bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 w-full pl-10 px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 ${formik.errors.username ? " focus:ring-red-500" : "focus:ring-green-500 dark:focus:ring-green-400"
                                            } transition duration-500 ease-in-out`}
                                        placeholder="Enter you name"
                                        required
                                    />
                                </div>
                                {formik.errors.username && formik.touched.username && (<p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>)}
                            </div>

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
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 w-full pl-10 px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 ${formik.errors.email ? " focus:ring-red-500" : "focus:ring-green-500 dark:focus:ring-green-400"
                                            } transition duration-500 ease-in-out`}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                                {formik.errors.email && formik.touched.email && (<p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>)}
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
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 w-full pl-10 px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 ${formik.errors.password ? " focus:ring-red-500" : "focus:ring-green-500 dark:focus:ring-green-400"
                                            } transition duration-500 ease-in-out`}
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
                                {formik.errors.password && formik.touched.password && (
                                    <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
                                )}


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
                                        name="password2"
                                        value={formik.values.password2}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 w-full pl-10 px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 ${formik.errors.password ? " focus:ring-red-500" : "focus:ring-green-500 dark:focus:ring-green-400"
                                            } transition duration-500 ease-in-out`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <span
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
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
                                    </span>
                                </div>
                                {formik.touched.password2 && formik.errors.password2 && (
                                    <p className="text-sm text-red-500 mt-1">{formik.errors.password2}</p>
                                )}

                            </div>

                            <div className="flex items-center space-x-2">
                                <label htmlFor="ripple-on" className="relative flex cursor-pointer items-center rounded-full p-2">
                                    <input
                                        id="ripple-on"
                                        type="checkbox"
                                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-green-600 dark:border-green-500 shadow-sm transition-all before:absolute before:top-2/4 before:left-2/4 before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-green-400 before:opacity-0 before:transition-opacity checked:border-green-600 dark:checked:border-green-500 checked:bg-green-600 dark:checked:bg-green-500 checked:before:bg-green-400 hover:before:opacity-10"
                                        required
                                    />
                                    <span className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3.5 w-3.5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                </label>

                                <label htmlFor="ripple-on" className="cursor-pointer text-sm text-gray-600 dark:text-zinc-400">
                                    I agree to the
                                    <a href="#" className="text-green-600 dark:text-green-400 hover:underline"> Terms of Service </a>
                                    and
                                    <a href="#" className="text-green-600 dark:text-green-400 hover:underline"> Privacy Policy</a>
                                </label>
                            </div>

                            <ButtonLoader
                                buttonId="signUpButton"
                                type="submit"
                                className="mt-5 w-full bg-green-600 dark:bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition font-medium text-lg"
                            >
                                Create Account
                            </ButtonLoader>

                        </form>
                        <p className="mt-6 text-center text-gray-600 dark:text-zinc-400">
                            Already have an account? <Link to="/login" className="text-green-600 dark:text-green-400 font-medium hover:underline">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;