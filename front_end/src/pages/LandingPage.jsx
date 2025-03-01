import React from 'react'
import { FaUserCheck } from "react-icons/fa6";
import { LuCarrot } from "react-icons/lu";
import { IoChatboxEllipses } from "react-icons/io5";
import { RiCalendarEventLine } from "react-icons/ri";
import { IoMdLogIn } from "react-icons/io";
import FooterLandingPage from '../components/Footer/FooterLandingPage'
import { Link } from 'react-router-dom';
import AgriFlowLogoPng from '../assets/images/agriflowlogo.png'

function LandingPage() {
    return (
        <div className="font-sans bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <img src={AgriFlowLogoPng} alt="AgriFlow Logo" className="w-16 h-16" />
                            <span className="text-lime-700 text-2xl font-bold">Agri<span className="text-green-800">Flow</span></span>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <a
                                href="signup.html"
                                className="flex border-2 border-green-700  items-center space-x-2  hover:text-white text-green-700 px-6 py-3 text-bold rounded-md hover:bg-green-700 transition duration-700 font-bold"
                            >
                                <IoMdLogIn className="text-2xl" />
                                <span>Sign In</span>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Hero Section */}
            <div className="relative bg-green-600 text-white h-screen flex items-center">
                {/* Background Image */}
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/farmer.png')", filter: "brightness(80%)" }}></div>

                {/* Overlay Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Empowering Farmers, Connect and Grow Together with AgriFlow!
                    </h1>
                    <p className="text-lg mb-6 max-w-2xl">
                        A community platform for farmers to connect, trade, and build lasting partnerships without intermediaries.
                    </p>
                    <div className=" ">
                        <Link to='/sign-up' className="bg-white border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:border-white transition duration-700 ease-in-out px-6 py-3 rounded-md text-lg font-bold">
                            Join in the community
                        </Link>
                    </div>
                </div>
            </div>


            {/* Features Section */}
            <div id="features" className="py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-gray-900">Platform Features</h2>
                        <p className="mt-2 text-gray-600">Everything you need to connect, sell, and grow</p>
                    </div>

                    <div className="md:grid md:grid-cols-3 gap-6">
                        {/* Feature 1 - For Farmers */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 md:mb-0">
                            <div className="bg-green-600 text-white p-3">
                                <h3 className="text-lg font-semibold text-center">Community</h3>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Sell vegetables and bio-fertilizers</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Market eggs and milk products</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>By product from others</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Join community chat groups</span>
                                    </li>
                                </ul>

                            </div>
                        </div>

                        {/* Feature 2 - For Vendors */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 md:mb-0">
                            <div className="bg-green-700 text-white p-3">
                                <h3 className="text-lg font-semibold text-center">Chat & Events</h3>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Secure Chat with farmers</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Create your own community</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Conduct events online & offline</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Location tracking</span>
                                    </li>
                                </ul>

                            </div>
                        </div>

                        {/* Feature 3 - Platform Benefits */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 md:mb-0">
                            <div className="bg-green-800 text-white p-3">
                                <h3 className="text-lg font-semibold text-center">Platform Benefits</h3>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Post and build conections</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Safe chat and video call</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Upto date with government schemes</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Real time weather updates</span>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div id="how-it-works" className="py-12 bg-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-gray-900">How AgriFlow Works</h2>
                        <p className="mt-2 text-gray-600">Connect farmers together by creating communities and post related to their farming experience.</p>
                    </div>

                    <div className="md:grid md:grid-cols-4 gap-4 text-center">
                        {/* Step 1 */}
                        <div className="mb-8 md:mb-0">
                            <div className="bg-green-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                <div className="h-8 w-8 flex items-center justify-center text-green-600">
                                    <FaUserCheck className="text-2xl" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign Up</h3>
                            <p className="text-gray-600">Register with google and wattsapp</p>
                        </div>

                        {/* Step 2 */}
                        <div className="mb-8 md:mb-0">
                            <div className="bg-green-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                <div className="h-8 w-8 flex items-center justify-center text-green-600">
                                    <LuCarrot className="text-2xl" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">List Products</h3>
                            <p className="text-gray-600">List or browse available products</p>
                        </div>

                        {/* Step 3 */}
                        <div className="mb-8 md:mb-0">
                            <div className="bg-green-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                <div className="h-8 w-8 flex items-center justify-center text-green-600">
                                    <IoChatboxEllipses className="text-2xl" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chat</h3>
                            <p className="text-gray-600">Chat with farmer and in the community</p>
                        </div>

                        {/* Step 4 */}
                        <div className="mb-8 md:mb-0">
                            <div className="bg-green-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                <div className="h-8 w-8 flex items-center justify-center text-green-600">
                                    <RiCalendarEventLine className="text-2xl" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Event</h3>
                            <p className="text-gray-600">Reliable events in online and offline</p>
                        </div>
                    </div>

                    <div className="mt-12 bg-white rounded-lg shadow-md p-6">
                        <div className="md:flex md:items-center">
                            {/* Community Engagement Section */}
                            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Join Our Community & Sell Your Products</h3>
                                <p className="text-gray-700 mb-4">
                                    Be part of a thriving network of farmers and vendors! Participate in community events, showcase your
                                    produce, and reach new customers without intermediaries.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Exclusive farmer-vendor networking events</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>List & sell your farm produce easily</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Attend workshops & training sessions</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Sell Products CTA Section */}
                            <div className="md:w-1/3 text-center">
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-600 mb-2">Start Selling Today</div>
                                    <p className="text-gray-600 mb-4">Connect directly with vendors & buyers</p>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* footer section */}
            <FooterLandingPage />

        </div>
    )
}

export default LandingPage