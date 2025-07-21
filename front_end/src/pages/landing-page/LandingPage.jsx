import React from 'react'
import { motion } from 'framer-motion'
import { FaUserCheck } from "react-icons/fa6";
import { LuCarrot } from "react-icons/lu";
import { IoChatboxEllipses } from "react-icons/io5";
import { RiCalendarEventLine } from "react-icons/ri";
import FooterLandingPage from '../../components/landing-page/FooterLandingPage'
import { Link } from 'react-router-dom';
import AgriFlowLogoPng from '../../assets/images/agriflowwhite.png'
import CustomScrollToTop from '../../components/CustomScrollBottomToTop/CustomScrollToTop';
import HeroCarousel from '../../components/landing-page/HeroCarousal';
import ThemeToggle from '../../components/ThemeController/ThemeToggle';
import { FaUserCircle } from "react-icons/fa";
import CropImageEnd from "../../assets/images/crop-landing-page.jpg"

// Essential animation variants - only for initial page load
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const slideInFromTop = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

function LandingPage() {
    return (
        <>
            <CustomScrollToTop />
            <div className="font-sans bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                {/* Navbar */}
                <motion.nav
                    className="bg-green-600 dark:bg-green-700 shadow-md mb-1"
                    initial="hidden"
                    animate="visible"
                    variants={slideInFromTop}
                >
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex justify-between items-center h-16">
                            {/* Left side - Logo and Title */}
                            <div className="flex items-center space-x-2">
                                <Link to="/">
                                    <img
                                        src={AgriFlowLogoPng}
                                        alt="AgriFlow Logo"
                                        className="w-16 h-16"
                                    />
                                </Link>
                                <motion.span
                                    className="text-lime-700 text-2xl font-bold"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <span className="text-white">Agri Flow</span>
                                </motion.span>
                            </div>

                            {/* Right side - Icons (Message + Theme Toggle) */}
                            <div className="flex items-center space-x-4 ml-auto gap-4">
                                {/* Message icons part */}
                                <div className="relative">
                                    {/* Message badge outside of ripple-parent */}
                                    <div className="relative inline-block">
                                        {/* Ping Animation Circle */}
                                        <Link to="/login">
                                            <span className="absolute -top-[24px] -left-8 flex h-8 w-8 tooltip tooltip-bottom" data-tip="Sign in">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                {/* Static Bubble with Count */}
                                                <span className="status shadow-none relative inline-flex rounded-full h-8 w-8 bg-green-500 text-white text-xs items-center justify-center z-10">
                                                    <FaUserCircle className="text-2xl" />
                                                </span>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                {/* Theme Toggle */}
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </motion.nav>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <HeroCarousel />
                </motion.div>

                {/* Features Section */}
                <motion.div
                    id="features"
                    className="py-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerContainer}
                >
                    <div className="max-w-6xl mx-auto px-4">
                        <motion.div
                            className="text-center mb-12"
                            variants={fadeInUp}
                        >
                            <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">Platform Features</h2>
                            <p className="mt-2 font-bold text-gray-500 dark:text-gray-400">Everything you need to connect, sell, and grow</p>
                        </motion.div>

                        <motion.div
                            className="md:grid md:grid-cols-3 gap-6"
                            variants={staggerContainer}
                        >
                            {/* Feature 1 - For Farmers */}
                            <motion.div
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20 overflow-hidden mb-6 md:mb-0 border dark:border-gray-700"
                                variants={fadeInLeft}
                            >
                                <div className="bg-green-600 dark:bg-green-700 text-white p-3">
                                    <h3 className="text-lg font-semibold text-center text-white">Community</h3>
                                </div>
                                <div className="p-4 text-gray-600 dark:text-gray-300">
                                    <ul className="space-y-2">
                                        {[
                                            "Sell vegetables and bio-fertilizers",
                                            "Market eggs and milk products",
                                            "By product from others",
                                            "Join community chat groups"
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Feature 2 - For Vendors */}
                            <motion.div
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20 overflow-hidden mb-6 md:mb-0 border dark:border-gray-700"
                                variants={fadeInUp}
                            >
                                <div className="bg-green-700 dark:bg-green-800 text-white p-3">
                                    <h3 className="text-lg font-semibold text-center text-white">Chat & Events</h3>
                                </div>
                                <div className="p-4 text-gray-600 dark:text-gray-300">
                                    <ul className="space-y-2">
                                        {[
                                            "Secure Chat with farmers",
                                            "Create your own community",
                                            "Conduct events online & offline",
                                            "Location tracking"
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Feature 3 - Platform Benefits */}
                            <motion.div
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20 overflow-hidden mb-6 md:mb-0 border dark:border-gray-700"
                                variants={fadeInRight}
                            >
                                <div className="bg-green-800 dark:bg-green-900 text-white p-3">
                                    <h3 className="text-lg font-semibold text-center text-white">Platform Benefits</h3>
                                </div>
                                <div className="p-4 text-gray-600 dark:text-gray-300">
                                    <ul className="space-y-2">
                                        {[
                                            "Post and build conections",
                                            "Safe chat and video call",
                                            "Upto date with government schemes",
                                            "Real time weather updates"
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* How It Works Section */}
                <motion.div
                    id="how-it-works"
                    className="pt-12 bg-gradient-to-r from-green-100 to-green-400 dark:from-green-800 dark:to-green-950 transition-colors duration-300"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    <div className="max-w-6xl mx-auto px-4">
                        <motion.div
                            className="text-center mb-12"
                            variants={fadeInUp}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">How AgriFlow Works</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Connect farmers together by creating communities and post related to their farming experience.</p>
                        </motion.div>

                        <motion.div
                            className="md:grid md:grid-cols-4 gap-4 text-center"
                            variants={staggerContainer}
                        >
                            {/* Step 1 */}
                            <motion.div
                                className="mb-8 md:mb-0"
                                variants={fadeInUp}
                            >
                                <div className="border border-green-600 dark:border-green-500 bg-green-100 dark:bg-green-900/30 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                    <div className="h-8 w-8 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <FaUserCheck className="text-2xl" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Sign Up</h3>
                                <p className="text-gray-600 dark:text-gray-400">Register with google and wattsapp</p>
                            </motion.div>

                            {/* Step 2 */}
                            <motion.div
                                className="mb-8 md:mb-0"
                                variants={fadeInUp}
                            >
                                <div className="border border-green-600 dark:border-green-500 bg-green-100 dark:bg-green-900/30 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                    <div className="h-8 w-8 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <LuCarrot className="text-2xl" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">List Products</h3>
                                <p className="text-gray-600 dark:text-gray-400">List or browse available products</p>
                            </motion.div>

                            {/* Step 3 */}
                            <motion.div
                                className="mb-8 md:mb-0"
                                variants={fadeInUp}
                            >
                                <div className="border border-green-600 dark:border-green-500 bg-green-100 dark:bg-green-900/30 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                    <div className="h-8 w-8 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <IoChatboxEllipses className="text-2xl" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Chat</h3>
                                <p className="text-gray-600 dark:text-gray-400">Chat with farmer and in the community</p>
                            </motion.div>

                            {/* Step 4 */}
                            <motion.div
                                className="mb-8 md:mb-0"
                                variants={fadeInUp}
                            >
                                <div className="border border-green-600 dark:border-green-500 bg-green-100 dark:bg-green-900/30 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                    <div className="h-8 w-8 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <RiCalendarEventLine className="text-2xl" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Event</h3>
                                <p className="text-gray-600 dark:text-gray-400">Reliable events in online and offline</p>
                            </motion.div>
                        </motion.div>


                    </div>
                    <motion.div
                        className="mt-12 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700/20  dark:border-gray-700 p-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                    >
                        <div className="md:flex md:items-center">
                            {/* Community Engagement Section */}
                            <motion.div
                                className="w-full mb-6 md:mb-0 md:pr-8"
                                variants={fadeInLeft}
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Join Our Community & Sell Your Products</h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Be part of a thriving network of farmers and vendors! Participate in community events, showcase your
                                    produce, and reach new customers without intermediaries.
                                </p>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                    {[
                                        "Exclusive farmer-vendor networking events",
                                        "List & sell your farm produce easily",
                                        "Attend workshops & training sessions"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                        </div>
                    </motion.div>
                </motion.div>

                {/* footer section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fadeInUp}
                >
                    <FooterLandingPage />
                </motion.div>
            </div>
        </>
    )
}

export default LandingPage