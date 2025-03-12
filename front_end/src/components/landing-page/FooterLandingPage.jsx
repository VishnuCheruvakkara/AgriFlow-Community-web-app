import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

function FooterLandingPage() {
    return (
        <div>
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">AgriFlow</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Connecting farmers directly, create community and conduct events both online and offline for fair trade and efficient growth.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-green-500">Home</a></li>
                            <li><a href="#features" className="hover:text-green-500">Features</a></li>
                            <li><a href="#how-it-works" className="hover:text-green-500">How It Works</a></li>
                            <li><a href="#contact" className="hover:text-green-500">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
                        <p className="text-gray-400 text-sm">Email: support@agriflow.com</p>
                        <p className="text-gray-400 text-sm">Phone: +1 (123) 456-7890</p>
                        <p className="text-gray-400 text-sm">Address: 123 Agri Street, Greenfield, USA</p>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-6 text-gray-400 text-lg">
                            <a href="#" className="hover:text-green-500 transition duration-500 ease-in-out"><FaFacebook className='text-2xl' /></a>
                            <a href="#" className="hover:text-green-500 transition duration-500 ease-in-out"><FaTwitter className='text-2xl' /></a>
                            <a href="#" className="hover:text-green-500 transition duration-500 ease-in-out"><FaInstagram className='text-2xl' /></a>
                            <a href="#" className="hover:text-green-500 transition duration-500 ease-in-out"><FaLinkedin className='text-2xl' /></a>
                            <a href="#" className="hover:text-green-500 transition duration-500 ease-in-out"><FaYoutube className='text-2xl' /></a>
                        </div>
                    </div>
                </div>

                <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-5">
                    &copy; {new Date().getFullYear()} AgriFlow. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

export default FooterLandingPage