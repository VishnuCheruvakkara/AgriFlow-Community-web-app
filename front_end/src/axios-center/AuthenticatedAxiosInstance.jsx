import axios from "axios";
import store from "../redux/Store";
import { loginSuccess, logout } from "../redux/slices/AuthSlice";
import { showToast } from "../components/toast-notification/CustomToast";

const BASE_URL = "http://localhost:8000";

const AuthenticatedAxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Required for sending cookies (refresh token)
});

const getAccessToken = () => store.getState().auth.token;

// Flag to track logout status
let isLoggedOut = false;

// Request Interceptor
AuthenticatedAxiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor for Token Refresh
AuthenticatedAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
    
        console.log("Checking if user is inactive...");
        if (error.response?.data?.code === "user_inactive") {
            if (!isLoggedOut) {
                store.dispatch(logout());
                showToast("Your account has been blocked. Please contact support for assistance.", "error");
                isLoggedOut = true;
            }
            return Promise.reject(error);
        } 
        else if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("🔄 Access token expired. Attempting to refresh...");

            originalRequest._retry = true; // Prevent infinite loops

            try {
                const { data } = await axios.post(
                    `${BASE_URL}/users/token/refresh/`,
                    {},
                    { withCredentials: true } // Ensure cookies are sent
                );

                if (data.access) {
                    console.log("✅ New access token received:", data.access);

                    // Store the new token in Redux
                    store.dispatch(loginSuccess({ token: data.access }));

                    // Update the failed request with the new token
                    originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

                    // Retry the original request with the new token
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                console.error("❌ Failed to refresh token:", refreshError.response?.data);

                if (!isLoggedOut) {
                    store.dispatch(logout());
                    showToast("Session expired. Please log in again.", "error");
                    window.location.href = "/login";
                    isLoggedOut = true;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default AuthenticatedAxiosInstance;
