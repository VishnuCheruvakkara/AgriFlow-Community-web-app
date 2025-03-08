// src/pages/ToastTestPage.js
import React from 'react';
import { showToast } from "./CustomToast";

const ToastTestPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
            <h1 className="text-xl font-bold">Toast Notification Test</h1>

            <button 
                onClick={() => showToast("Success Message", "success")} 
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
            >
                Show Success Toast
            </button>

            <button 
                onClick={() => showToast(" Error Message", "error")} 
                className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
            >
                Show Error Toast
            </button>

            <button 
                onClick={() => showToast(" Info Message", "info")} 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
                Show Info Toast
            </button>

            <button 
                onClick={() => showToast(" Warning Message", "warn")} 
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg shadow-md hover:bg-yellow-600 transition"
            >
                Show Warning Toast
            </button>
        </div>
    );
};

export default ToastTestPage;
