import axios from "axios";
import store from "../redux/Store";
import { adminLoginSuccess, adminLogout } from "../redux/slices/AdminAuthSlice";

const BASE_URL = "http://localhost:8000";

const AdminAuthenticatedAxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Required for sending cookies (refresh token)
});

const getAdminAccessToken = () => store.getState().adminAuth.token;

// Request Interceptor
AdminAuthenticatedAxiosInstance.interceptors.request.use(
    (config) => {
        const token = getAdminAccessToken();
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor for Token Refresh
AdminAuthenticatedAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          

            originalRequest._retry = true; // Prevent infinite loops

            try {
                const { data } = await axios.post(
                    `${BASE_URL}/users/admin/token-refresh/`,  // Admin-specific refresh endpoint
                    {},
                    { withCredentials: true } // Ensure cookies are sent
                );

                if (data.access) {

                    // Store the new token in Redux
                    store.dispatch(adminLoginSuccess({ token: data.access }));

                    // Update the failed request with the new token
                    originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

                    // Retry the original request
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                // console.error("Admin token refresh failed:", refreshError.response?.data);

                // Logout admin if token refresh fails
                store.dispatch(adminLogout());
                window.location.href = "/admin-login";
            }
        }
        return Promise.reject(error);
    }
);

export default AdminAuthenticatedAxiosInstance;
