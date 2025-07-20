
import axios from "axios";

// Creating base axios instance
const BaseAxiosInstance = axios.create({
    baseURL: "http://localhost:8000", //change in production to domain name or IP address.
    withCredentials: true,
    headers: {
        "Content-Type":"application/json",//To ensure the request body in JSON format.
    },
})

export default BaseAxiosInstance;
