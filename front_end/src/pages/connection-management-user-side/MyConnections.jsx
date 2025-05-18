import React from 'react';

function MyConnections() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">My Connections</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border dark:border-zinc-700 shadow-sm">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-300 dark:bg-zinc-700 rounded-full"></div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">User {i + 1}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Connected</p>
                            </div>
                        </div>
                        <button className="mt-4 text-sm text-red-500 hover:underline">Remove Connection</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyConnections;
