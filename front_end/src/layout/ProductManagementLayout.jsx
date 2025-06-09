import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';

function ProductManagementLayout() {
    return (
        <div className="container mx-auto py-4 max-w-full">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white rounded-t-lg">
                <h1 className="text-2xl font-bold">Product Marketplace</h1>
            </div>

            {/* Card Container */}
            <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow-sm p-6 mb-8">
                <div className="bg-blue-100 border-l-4 border-blue-400 p-4 mb-6 shadow-sm dark:bg-blue-950 dark:border-blue-600">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaInfoCircle className="text-blue-700 dark:text-blue-400" />
                        </div>
                        <div className="ml-3 space-y-2">
                            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                                Sell or find products from other farmers in your community.
                            </p>
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                You can browse products, create listings, manage your listings, and wishlist items you're interested in.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-600 mt-4 overflow-x-auto">
                    <NavLink
                        to="available-products"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        Available Products
                    </NavLink>

                    <NavLink
                        to="create-product"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        Create Product
                    </NavLink>

                    <NavLink
                        to="my-products"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        My Products
                    </NavLink>

                    <NavLink
                        to="wishlist"
                        className={({ isActive }) =>
                            `ripple-parent ripple-green py-3 px-6 ${isActive
                                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                                : 'text-gray-600 dark:text-gray-300'}`
                        }
                    >
                        Wishlist
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

export default ProductManagementLayout;
