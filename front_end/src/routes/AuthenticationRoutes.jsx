import { Routes, Route } from "react-router-dom"
import LandingPage from '../pages/landing-page/LandingPage'
//authentication section 
import SignUpPage from '../pages/authentication/SignUpPage'
import LoginPage from '../pages/authentication/LoginPage'
import OtpPage from '../pages/authentication/SignUpOtpPage'
import ForgotPassword from "../pages/authentication/ForgotPassword"
import ForgotPasswordOTP from "../pages/authentication/ForgotPasswordOTP"
import ForgotPasswordNew from "../pages/authentication/ForgotPasswordNew"
import AdminLogin from "../pages/authentication/AdminLogin"
//lay out section 
import AuthLayout from '../layout/AuthLayout'

// Import PublicRoute to prevent logged-in users from accessing auth pages
import PublicProtectedRoute from "./RoutesProtection/PublicProtectedRoute"

import PageNotFound from '../components/StatusPages/PageNotFound';

const AuthenticationRoutes = () => {
    return (

        <Routes>
            <Route element={<PublicProtectedRoute />}>
                {/* Landing Page Route */}
                <Route path='/' element={<LandingPage />} />
                {/* admin login page here */}
                <Route path='/admin-login' element={<AdminLogin />} />
                {/* Authentication Routes inside AuthLayout */}
                <Route element={<AuthLayout />}>
                    <Route path="/sign-up" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/otp-page" element={<OtpPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
                    <Route path="/forgot-password-new" element={<ForgotPasswordNew />} />
                </Route>
            </Route>
            {/* Catch-all Route for 404 Page in Authentication section */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default AuthenticationRoutes