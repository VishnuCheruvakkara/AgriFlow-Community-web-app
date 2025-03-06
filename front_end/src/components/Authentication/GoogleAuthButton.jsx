import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
    const navigate = useNavigate();

    // Function to redirect to Google OAuth 2.0 Login
    const handleGoogleLogin = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI); // Encode URI
        const scope = encodeURIComponent("openid email profile"); // Encode scope

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth
            ?client_id=${clientId}
            &redirect_uri=${redirectUri}
            &response_type=code
            &scope=${scope}
            &access_type=offline
            &prompt=consent`.replace(/\s+/g, ''); // Remove spaces

        window.location.href = googleAuthUrl; // Redirect user to Google Login
    };

    return (
        <button
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
            onClick={handleGoogleLogin} // Redirect on click
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-red-500">
                <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                />
            </svg>
            <span>Sign up with Google</span>
        </button>
    );
};

export default GoogleLoginButton;
