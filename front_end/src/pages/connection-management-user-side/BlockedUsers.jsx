import React from 'react';

function BlockedUsers() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Blocked Users</h2>
            <ul className="space-y-4">
                {[...Array(2)].map((_, i) => (
                    <li key={i} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-zinc-900 dark:border-zinc-700">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-zinc-700 rounded-full"></div>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white">Blocked User {i + 1}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Blocked for spamming</p>
                            </div>
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">Unblock</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BlockedUsers;
