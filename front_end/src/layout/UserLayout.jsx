import React, { useEffect, useRef } from "react"
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
import { addNotification } from "../redux/slices/notificationSlice";
// import useWebSocketNotification from "../websocket-center/useWebSocketNotification";

const UserLayout = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const userId = useSelector((state) => state.user?.user?.id)
    const token = useSelector((state) => state.auth.token);
    const AadharVerified = user?.aadhar_verification;
    const dispatch = useDispatch();
    const socketRef = useRef(null)

    console.log("userId::",userId)

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


    // websocket set-up under progress
    useEffect(() => {
        if (!userId || !token) return;

        socketRef.current = new WebSocket(`ws://localhost:8000/ws/notification/${userId}/?token=${token}`);

        socketRef.current.onopen = () => {
            console.log("WebSocket notification connection established");
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log("Notification received:", data);

            dispatch(addNotification(data.data));
        }

        socketRef.current.onclose = (event) => {
            console.log("Websocket closed:", event.code, event.reason);
        }

        socketRef.current.onerror = (error) => {
            console.log("Websocket error:", error);
        }

        //Clean up set up or unmount or userId/tocken change 
        return () => {
            socketRef.current?.close();
        };

    }, [userId, token]);




    return (
        <div className="bg-gray-100 min-h-screen dark:bg-zinc-950">
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