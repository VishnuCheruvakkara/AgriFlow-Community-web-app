import axios from "axios";
import store from "../redux/Store";
import { loginSuccess, logout } from "../redux/slices/AuthSlice";

const BASE_URL = "http://127.0.0.1:8000";


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

// Response Interceptor
AuthenticatedAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const { data } = await axios.post(`${BASE_URL}/users/token/refresh/`, {}, { withCredentials: true });
                // Store the new access token in Redux
                store.dispatch(loginSuccess({ token: data.access }));

                // Update the failed request with the new token
                error.config.headers["Authorization"] = `Bearer ${data.access}`;

                // Retry the original request with the new token
                return axios(error.config);
            } catch {
                store.dispatch(logout());
                //Try to redirect, to the login page if refresh token not found!
                
                // Redirect to login page
                window.location.href = "/login"; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default AuthenticatedAxiosInstance;
