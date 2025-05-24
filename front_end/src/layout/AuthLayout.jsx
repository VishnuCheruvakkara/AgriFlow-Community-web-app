
import { Outlet } from "react-router-dom";
import LeftSidebar from "../components/Authentication/SignUpLeftSideSection";

const AuthLayout = () => {
    return (
        <div >
            {/* left side bar  */}
            <LeftSidebar />
            {/* main content */}
            <Outlet /> {/* Will be replaced by SignUpPage, LoginPage, or OtpPage */}
        </div>
    )
}

export default AuthLayout