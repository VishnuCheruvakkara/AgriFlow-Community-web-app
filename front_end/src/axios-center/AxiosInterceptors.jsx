
import BaseAxiosInstance from './BaseAxiosInstance';


// Request Interceptor
BaseAxiosInstance.interceptors.request.use(
    (config) => {
        // Attach token if available
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
BaseAxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.warn("Unauthorized! Redirecting to login...");
                localStorage.removeItem("authToken"); // Clear invalid token
                window.location.href = "/login"; // Redirect user to login page
            }
        }
        return Promise.reject(error);
    }
);

export default BaseAxiosInstance;
