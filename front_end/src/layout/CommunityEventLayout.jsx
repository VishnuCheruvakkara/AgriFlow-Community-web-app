import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import { IoMdAddCircle } from "react-icons/io";

function EventLayout() {
    return (
        <div className="container mx-auto py-4 max-w-full">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white rounded-t-lg">
                <h1 className="text-2xl font-bold">Event Management</h1>
            </div>

            {/* Card Container */}
            <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow-sm p-6 mb-8">
                <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6  shadow-sm dark:bg-yellow-950 dark:border-yellow-600">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaInfoCircle className="text-yellow-700 dark:text-yellow-400" />
                        </div>
                        <div className="ml-3 space-y-2">
                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                                Let's build your community, a space to connect, share, and grow together. Start by entering the details below.
                            </p>
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                Events help farmers come together, share thoughts, and learn from each other. You can join events online or offline. These gatherings build strong connections in the farming community. To create a new event, you need to be a community admin—but anyone can join and take part!
                            </p>
                        </div>
                    </div>
                </div>


                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-600 mt-4 overflow-x-auto">
                    <NavLink
                        to="all-events"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        All Events
                    </NavLink>

                    <NavLink
                        to="enrolled-events"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        Enrolled events
                    </NavLink>

                    <NavLink
                        to="created-events"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        Created Events
                    </NavLink>

                    <NavLink
                        to="create-event"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        Create Event
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

export default EventLayout;
