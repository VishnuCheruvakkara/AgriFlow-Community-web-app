import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaUsers, FaStore, FaCloudSun, FaUser } from 'react-icons/fa';

function MobileNavBar() {
    const location = useLocation();

    return (
        <div className="lg:hidden fixed bottom-0 w-full bg-white dark:bg-zinc-900 shadow-lg border-t border-gray-200 dark:border-green-400 z-50">
            <div className="flex justify-around py-3">

                <Link
                    to="/user-dash-board/"
                    className={`flex flex-col items-center focus:outline-none transition-colors duration-200
                        ${location.pathname === "/user-dash-board/"
                            ? "text-green-700 dark:text-green-400"
                            : "text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-300"}`}
                >
                    <FaHome className="text-xl" />
                    <span className="text-xs mt-1">Home</span>
                </Link>

                <Link
                    to="/user-dash-board/farmer-community/"
                    className={`flex flex-col items-center focus:outline-none transition-colors duration-200
                        ${location.pathname.startsWith("/user-dash-board/farmer-community")
                            ? "text-green-700 dark:text-green-400"
                            : "text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-300"}`}
                >
                    <FaUsers className="text-xl" />
                    <span className="text-xs mt-1">Community</span>
                </Link>

                <Link
                    to="/user-dash-board/connection-management"
                    className={`flex flex-col items-center focus:outline-none transition-colors duration-200
                        ${location.pathname.startsWith("/user-dash-board/connection-management")
                            ? "text-green-700 dark:text-green-400"
                            : "text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-300"}`}
                >
                    <FaUser className="text-xl" />
                    <span className="text-xs mt-1">Connections</span>
                </Link>

                <Link
                    to="/user-dash-board/event-management"
                    className={`flex flex-col items-center focus:outline-none transition-colors duration-200
                        ${location.pathname.startsWith("/user-dash-board/event-management")
                            ? "text-green-700 dark:text-green-400"
                            : "text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-300"}`}
                >
                    <FaCalendarAlt className="text-xl" />
                    <span className="text-xs mt-1">Events</span>
                </Link>


                <Link
                    to="/user-dash-board/products/available-products"
                    className={`flex flex-col items-center focus:outline-none transition-colors duration-200
                        ${location.pathname.startsWith("/user-dash-board/products")
                            ? "text-green-700 dark:text-green-400"
                            : "text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-300"}`}
                >
                    <FaStore className="text-xl" />
                    <span className="text-xs mt-1">Products</span>
                </Link>




            </div>
        </div>
    );
}

export default MobileNavBar;
