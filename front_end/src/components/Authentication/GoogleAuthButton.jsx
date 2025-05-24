import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/slices/AuthSlice"
import { showToast } from "../toast-notification/CustomToast"

import PublicAxiosInstance from "../../axios-center/PublicAxiosInstance";


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleAuthButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse; // Get the Google token
            const response = await PublicAxiosInstance.post("/users/auth/callback/", {
                token: credential,
            });

            console.log("Backend Response:", response.data); // Debugging

            const { user, access_token } = response.data; // Extract user & token
            console.log(user)

            // Dispatch Redux action to store user data
            dispatch(loginSuccess({ user, token: access_token }));
            showToast(`Welcome ${user.first_name} ! Login successful`, "success")

            // Check if the profile is completed and navigate accordingly
            if (user.aadhar_verification) {
                navigate("/user-dash-board"); // Redirect to dashboard
            } else {
                navigate("/user-dash-board/farmer-profile"); // Redirect to home page if profile is incomplete
            }
            

        }catch (error) {
            console.error("Google Auth Failed", error);
    
            if (error.response && error.response.status === 403) {
                // If the user is blocked
                showToast("Your account has been blocked. Please contact support for assistance.", "error");
            } else {
                showToast("Google login failed. Please try again.", "error");
            }
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
                theme="fill"
                size="large"
                text="continue_with"
                logo_alignment="center"

            />
        </GoogleOAuthProvider>
    );
};

export default GoogleAuthButton;
