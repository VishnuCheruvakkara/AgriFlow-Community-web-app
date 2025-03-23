import axios from "axios";
import store from "../redux/Store";
import { loginSuccess, logout } from "../redux/slices/AuthSlice";

const BASE_URL = "http://localhost:8000";

const AuthenticatedAxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Required for sending cookies (refresh token)
});

const getAccessToken = () => store.getState().auth.token;

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

        if (error.response?.status === 401 && !originalRequest._retry) {

            originalRequest._retry = true; // Prevent infinite loops

            try {
                const { data } = await axios.post(
                    `${BASE_URL}/users/token/refresh/`,
                    {},
                    { withCredentials: true } // Ensure cookies are sent
                );

                if (data.access) {
                   

                    // Store the new token in Redux
                store.dispatch(loginSuccess({ token: data.access }));

                // Update the failed request with the new token
                    originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

                // Retry the original request with the new token
                    return axios(originalRequest);
                }
            } catch (refreshError) {

                // Handle refresh failure (Logout user)
                store.dispatch(logout());
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default AuthenticatedAxiosInstance;
