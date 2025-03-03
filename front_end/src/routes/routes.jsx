import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from '../pages/landing-page/LandingPage'
import SignUpPage from '../pages/authentication/SignUpPage'
import LoginPage from '../pages/authentication/LoginPage'
import OtpPage from '../pages/authentication/SignUpOtpPage' 

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/sign-up' element={<SignUpPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/otp-page' element={ <OtpPage/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes