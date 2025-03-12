
import BaseAxiosInstance from './BaseAxiosInstance';
import store from '../redux/Store';

// Request Interceptor
BaseAxiosInstance.interceptors.request.use(
    (config) => {
        console.log("Interceptor Running - Request");
        // Attach token if available
        const state = store.getState(); //Get all the redux state 
        const token = state.auth.token; //from the state , extracted the required {access token}
        console.log("here controlll L ",token)
        if (token) {
            config.headers["Authorization"] = `Bearer ${token.replace(/"/g,'')}`; //Removeing extra quote if presnt in the token 
        }
        console.log("Request Headers: ", config.headers); // Debugging
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
