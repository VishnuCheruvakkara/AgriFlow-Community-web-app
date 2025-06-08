// src/components/RealTimeNotificationToast.js
import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { IoNotifications } from 'react-icons/io5'; // Using react-icons for notification icon

const RealTimeNotificationToast = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8} // Space between toasts
            containerStyle={{
                top: '80px', // Adjust this value to move toast down from top
                right: '16px',
            }}
            toastOptions={{
                duration: 4000,
                className: `
                    px-6 py-4 border rounded-lg shadow-lg
                    text-sm font-medium
                    bg-white text-zinc-800 border-zinc-300
                    dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700
                    flex items-center gap-3
                `,
                style: {
                    zIndex: 99999,
                    minWidth: '300px',
                    maxWidth: '400px',
                },
            }}
        />
    );
};

// Function to show real-time toast with react-icons
export const showRealTimeToast = (message, type = 'default') => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <IoNotifications className="text-green-500 text-lg flex-shrink-0" />;
            case 'error':
                return <IoNotifications className="text-red-500 text-lg flex-shrink-0" />;
            case 'warning':
                return <IoNotifications className="text-yellow-500 text-lg flex-shrink-0" />;
            default:
                return <IoNotifications className="text-blue-500 text-lg flex-shrink-0" />;
        }
    };

    toast.custom((t) => (
        <div
            className={`
                ${t.visible ? 'animate-enter' : 'animate-leave'}
                max-w-md w-full bg-white dark:bg-zinc-800 shadow-lg rounded-lg 
                pointer-events-auto flex ring-1 ring-black ring-opacity-5 
                border border-zinc-200 dark:border-zinc-700
            `}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-zinc-200 dark:border-zinc-700">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    ×
                </button>
            </div>
        </div>
    ));
};

// Alternative simpler version if you prefer the original approach
export const showSimpleRealTimeToast = (message, type = 'default') => {
    const iconMap = {
        success: <IoNotifications className="text-green-500" />,
        error: <IoNotifications className="text-red-500" />,
        warning: <IoNotifications className="text-yellow-500" />,
        default: <IoNotifications className="text-blue-500" />
    };

    toast(message, {
        icon: iconMap[type] || iconMap.default,
    });
};

export default RealTimeNotificationToast;