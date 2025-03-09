
import axios from "axios";

// Creating base axios instance
const BaseAxiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000", //change in production to domain name or IP address.
    timeout: 60000, //10 second timeout for waiting backend to ready
    withCredentials: true,  // To ensure that cookies are sent and received
    headers: {
        "Content-Type":"application/json",
    }
})

export default BaseAxiosInstance;
