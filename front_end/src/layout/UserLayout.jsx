
import { Outlet } from "react-router-dom";

import NavBar from "../components/user-dash-board/NavBar";
import MobileNavBar from "../components/user-dash-board/MobileNavBar";
import SideBar from "../components/user-dash-board/SideBar";
import Footer from "../components/user-dash-board/Footer";


const UserLayout = () => {
    return (
        <div >
            <div className="bg-gray-100 min-h-screen">
                {/* NAVBAR HERE  */}
                <NavBar />

                <div className="pt-16 pb-8 container mx-auto px-4 ">
                    <div className="flex flex-col lg:flex-row gap-4">

                        {/* inlcuding the side bar here  */}
                        <SideBar />
                        {/* outlet section  | all the side bar section will dynamically added through this */}
                        <Outlet/>
                    </div>
                </div>

                {/* Footer section  */}
                <Footer />
                {/* Mobile Bottom Navigation - Visible on small screens only */}
                <MobileNavBar />

            </div>
        </div>
    )
}

export default UserLayout