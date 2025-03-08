import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/slices/AuthSlice"
import { showToast } from "../toast-notification/CustomToast"


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleAuthButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse; // Get the Google token
            const response = await axios.post("http://127.0.0.1:8000/users/auth/callback/", {
                token: credential,
            });


            console.log("Backend Response:", response.data); // Debugging

            const { user, access_token } = response.data; // Extract user & token
            console.log(user)
            // Store token in local storage
            localStorage.setItem("access", access_token);

            // Dispatch Redux action to store user data
            dispatch(loginSuccess({ user, token: access_token }));
            showToast(`Welcome ${user.first_name} ! Login successful`,"success")
            
            // Navigate to the user dashboard
            navigate("/user-dash-board");
          

        } catch (error) {
            console.error("Google Auth Failed", error);
            showToast("Google login failed. Please try again.", "error");
        }
    };

    const handleFailure = () => {
        console.error("Google Login Failed");
        showToast("Google Login Failed!", "warn");
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleFailure}
                theme="fill"   // or "filled_black"
                size="large"      // or "medium", "small"
                text="continue_with" // or "continue_with", "signup_with"
                logo_alignment="center"
                  
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleAuthButton;
