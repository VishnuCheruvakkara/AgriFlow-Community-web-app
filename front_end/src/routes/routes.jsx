import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from '../pages/landing-page/LandingPage'
//authentication section 
import SignUpPage from '../pages/authentication/SignUpPage'
import LoginPage from '../pages/authentication/LoginPage'
import OtpPage from '../pages/authentication/SignUpOtpPage'
//User dash board section 
import UserDashBoard from '../pages/user-dash-board/UserDashBoard'
//lay out section 
import AuthLayout from '../components/layout/AuthLayout'



const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing Page Route */}
                <Route path='/' element={<LandingPage />} />

                {/* Authentication Routes inside AuthLayout */}
                <Route element={<AuthLayout />}>
                    <Route path="/sign-up" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/otp-page" element={<OtpPage />} />
                </Route>
                {/* user dash board routes  */}
                <Route path="/user-dash-board" element={<UserDashBoard/>} />

            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes