import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';

function UserConnectionLayout() {
    return (
        <div className="container mx-auto py-4 max-w-full">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white rounded-t-lg">
                <h1 className="text-xl font-bold">Connection Management</h1>
            </div>

            {/* Card Container */}
            <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow-sm p-6 mb-8">
                <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6 shadow-sm dark:bg-yellow-950 dark:border-yellow-600">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaInfoCircle className="text-yellow-700 dark:text-yellow-400" />
                        </div>
                        <div className="ml-3 space-y-2">
                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                                Build meaningful connections with others in the community.
                            </p>
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                You can send connection requests, view received invites, block users, and manage your entire network. Start by choosing an action below.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-600 mt-4 overflow-x-auto text-xs sm:text-sm ">
                    <NavLink
                        to="suggested-farmers"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 hover:bg-green-200 dark:hover:bg-green-900 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        Suggested Farmers
                    </NavLink>

                    <NavLink
                        to="pending-requests"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 hover:bg-green-200 dark:hover:bg-green-900 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        Pending Requests
                    </NavLink>

                    <NavLink
                        to="my-connections"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 hover:bg-green-200 dark:hover:bg-green-900 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        My Connections
                    </NavLink>

                    <NavLink
                        to="blocked-users"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 hover:bg-green-200 dark:hover:bg-green-900 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        Blocked Farmers
                    </NavLink>
                </div>

                {/* Page Content */}
                <div className="mt-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default UserConnectionLayout;
