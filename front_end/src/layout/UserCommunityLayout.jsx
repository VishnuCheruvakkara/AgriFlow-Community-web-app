import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

function CommunityLayout() {
    const location = useLocation();

    return (
        <div className="container mx-auto py-4 max-w-full">
            <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white rounded-t-lg">
                <h1 className="text-2xl font-bold ">Communities</h1>
            </div>

            <div className="bg-white rounded-b-lg shadow-sm p-6 mb-8 dark:bg-zinc-800">
                <p className="text-gray-600 dark:text-zinc-200">
                    Connect with fellow farmers, share knowledge, and grow together
                </p>

                {/* Tab navigation using NavLink for routing */}
                <div className="flex border-b dark:border-zinc-700 mt-4 overflow-x-auto">
                    <NavLink
                        to="discover-communities"
                        className={({ isActive }) =>
                            `py-3 px-6 ripple-parent ripple-green  ${
                                isActive
                                    ? 'border-b-2 border-green-600 text-green-600 font-medium dark:text-green-500 dark:border-green-500'
                                    : 'text-gray-500 dark:text-zinc-400'
                            }`
                        }
                    >
                        Discover Communities
                    </NavLink>

                    <NavLink
                        to="my-communities"
                        className={({ isActive }) =>
                            `py-3 px-6 ripple-parent ripple-green  ${
                                isActive
                                    ? 'border-b-2 border-green-600 text-green-600 font-medium dark:text-green-500 dark:border-green-500'
                                    : 'text-gray-600 dark:text-zinc-400'
                            }`
                        }
                    >
                        My Communities
                    </NavLink>

                    <NavLink
                        to="create-communities"
                        className={({ isActive }) =>
                            `py-3 px-6 ripple-parent ripple-green ${
                                isActive
                                    ? 'border-b-2 border-green-600 text-green-600 font-medium dark:text-green-500 dark:border-green-500'
                                    : 'text-gray-600 dark:text-zinc-400'
                            }`
                        }
                    >
                        Create Community
                    </NavLink>

                    <NavLink
                        to="pending-request"
                        className={({ isActive }) =>
                            `py-3 px-6 ripple-parent ripple-green  ${
                                isActive
                                    ? 'border-b-2 border-green-600 text-green-600 font-medium dark:text-green-500 dark:border-green-500'
                                    : 'text-gray-600 dark:text-zinc-400'
                            }`
                        }
                    >
                        Pending Requests
                    </NavLink>
                </div>

                {/* Animated Outlet */}
                <div className="mt-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default CommunityLayout;
