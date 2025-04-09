import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

function CommunityLayout() {
    const location = useLocation();

    return (
        <div className="container mx-auto py-4 max-w-full">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Communities</h1>
                <p className="text-gray-600">Connect with fellow farmers, share knowledge, and grow together</p>

                {/* Tab navigation using NavLink for routing */}
                <div className="flex border-b mt-4 overflow-x-auto">
                    <NavLink
                        to="discover-communities"
                        className={({ isActive }) =>
                            `py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600'}`
                        }
                    >
                        Discover Communities
                    </NavLink>

                    <NavLink
                        to="my-communities"
                        className={({ isActive }) =>
                            `py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600'}`
                        }
                    >
                        My Communities
                    </NavLink>

                    <NavLink
                        to="create-communities"
                        className={({ isActive }) =>
                            `py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600'}`
                        }
                    >
                        Create Community
                    </NavLink>

                    <NavLink
                        to="pending-request"
                        className={({ isActive }) =>
                            `py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600'}`
                        }
                    >
                        Pending Requests
                    </NavLink>
                </div>

                {/* Animated Outlet */}
                <div className="mt-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default CommunityLayout;
