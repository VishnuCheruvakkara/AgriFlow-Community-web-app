
import React from 'react'
import { FaHome, FaUser, FaUsers, FaStore, FaCloudSun } from 'react-icons/fa';


function MobileNavBar() {
    return (
        <div className="lg:hidden fixed bottom-0 w-full bg-white shadow-lg border-t z-20">
            <div className="flex justify-around py-2">
                <a href="#" className="flex flex-col items-center text-green-700">
                    <FaHome className="text-xl" />
                    <span className="text-xs mt-1">Home</span>
                </a>
                <a href="#" className="flex flex-col items-center text-gray-600">
                    <FaUsers className="text-xl" />
                    <span className="text-xs mt-1">Community</span>
                </a>
                <a href="#" className="flex flex-col items-center text-gray-600">
                    <FaStore className="text-xl" />
                    <span className="text-xs mt-1">Products</span>
                </a>
                <a href="#" className="flex flex-col items-center text-gray-600">
                    <FaCloudSun className="text-xl" />
                    <span className="text-xs mt-1">Weather</span>
                </a>
                <a href="#" className="flex flex-col items-center text-gray-600">
                    <FaUser className="text-xl" />
                    <span className="text-xs mt-1">Profile</span>
                </a>
            </div>
        </div>
    )
}

export default MobileNavBar
