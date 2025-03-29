import React,{useEffect} from "react"
import { Outlet } from "react-router-dom";
import NavBar from "../components/user-dash-board/NavBar";
import MobileNavBar from "../components/user-dash-board/MobileNavBar";
import SideBar from "../components/user-dash-board/SideBar";
import Footer from "../components/user-dash-board/Footer";
import { useSelector,useDispatch } from "react-redux";
//imports for to save the user deatils in redux with useEffect
import AuthenticatedAxiosInstance from "../axios-center/AuthenticatedAxiosInstance";
import { setUserDetails } from "../redux/slices/userSlice";

const UserLayout = () => {
    const user = useSelector((state) => state.auth.user);
    const profileCompleted = user?.profile_completed;
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get("/users/get-user-data/", {
                });

                console.log(response.data)
                dispatch(setUserDetails(response.data)); // Store in Redux
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();

    }, []);

    return (
        <div className="bg-gray-100 min-h-screen ">
            {/* NAVBAR HERE */}
            <NavBar />

            {profileCompleted ? (
                <div className="pt-16 pb-8 container mx-auto px-4 ">
                    <div className="flex flex-col lg:flex-row gap-4">

                        {/* inlcuding the side bar here  */}
                        <SideBar />
                        {/* outlet section  | all the side bar section will dynamically added through this */}
                        <Outlet />
                    </div>
                </div>
            ) : (
                <div className="flex-grow pt-16 pb-8">
                    <div className="container mx-auto px-4">

                        <div className="flex justify-center">
                            <div className=" w-full max-w-7xl">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>

            )}

            {/* Footer section */}
            <Footer />

            {/* Mobile Bottom Navigation */}
            {profileCompleted && <MobileNavBar />}
        </div>
    );
};

export default UserLayout;