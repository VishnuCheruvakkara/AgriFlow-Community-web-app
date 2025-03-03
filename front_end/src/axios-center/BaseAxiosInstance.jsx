
import axios from "axios";

// Creating base axios instance
const BaseAxiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000", //change in production to domain name or IP address.
    timeout: 10000, //10 second timeout for waiting backend to ready
    headers: {
        "Content-Type":"application/json",
    }
})

export default BaseAxiosInstance;