import React from 'react';
import { ToastContainer, toast,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotifications = () => {
    return (
        <>
            <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnHover
                transition={Slide}
                closeButton={false}
                toastClassName="border border-gray-300 "
                style={{ zIndex: 99999 }}
              
            />
        </>
    );
};

// Utility function to trigger toast
export const showToast = (message, type = 'success') => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'info':
            toast.info(message);
            break;
        case 'warn':
            toast.warn(message);
            break;
        default:
            toast(message);
    }
};

export default ToastNotifications;
