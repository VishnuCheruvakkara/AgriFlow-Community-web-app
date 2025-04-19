import React, { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/user-dash-board/NavBar";
import MobileNavBar from "../components/user-dash-board/MobileNavBar";
import SideBar from "../components/user-dash-board/SideBar";
import Footer from "../components/user-dash-board/Footer";
import { useSelector, useDispatch } from "react-redux";
//imports for to save the user deatils in redux with useEffect
import AuthenticatedAxiosInstance from "../axios-center/AuthenticatedAxiosInstance";
import { setUserDetails } from "../redux/slices/userSlice";
import { logout } from "../redux/slices/AuthSlice";
import { showToast } from "../components/toast-notification/CustomToast";
import { persistor } from '../redux/Store';
import PublicAxiosInstance from '../axios-center/PublicAxiosInstance'
import { loginSuccess } from "../redux/slices/AuthSlice";


const UserLayout = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const AadharVerified = user?.aadhar_verification;
    const dispatch = useDispatch();

    // Hand-shaking for websocket notification connection

    

    useEffect(() => {
        if (!token) {
            console.warn("🔒 No token found, skipping WebSocket connection.");
            return;
        }

        const socket = new WebSocket(
            `ws://localhost:8000/ws/notification/user/`,
            token  // Pass token via subprotocol
        );

        socket.onopen = () => {
            console.log("✅ WebSocket connection opened");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📩 Notification received:", data);
            // You can show a toast or update notification state here
        };

        socket.onerror = (error) => {
            console.error("❌ WebSocket error:", error);
        };

        socket.onclose = (event) => {
            console.log("🛑 WebSocket closed:", event.code, event.reason);
        };

        // Cleanup on component unmount
        return () => {
            socket.close();
        };
    }, [token]);


   

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get("/users/get-user-data/", {
                });

                console.log(response.data)
                dispatch(setUserDetails(response.data)); // Store in Redux
                console.log("My debugger :::::", response.data)
                dispatch(loginSuccess({
                    aadhar_verification: response?.data?.is_aadhar_verified// Updates only profile_completed
                }));

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

            {AadharVerified ? (
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
            {AadharVerified && <MobileNavBar />}
        </div>
    );
};

export default UserLayout;