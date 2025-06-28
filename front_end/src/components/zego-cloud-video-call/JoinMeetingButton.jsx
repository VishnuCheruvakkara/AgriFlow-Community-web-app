import React, { useState, useRef, useEffect } from "react";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { RiVideoOnAiLine } from "react-icons/ri";
import { showToast } from "../toast-notification/CustomToast";

const JoinMeetingButton = ({ roomId, userId, userName }) => {
    const [showCallUI, setShowCallUI] = useState(false);
    const [zegoConfig, setZegoConfig] = useState(null);
    const containerRef = useRef(null);

    const handleJoin = async () => {
        try {
            const response = await AuthenticatedAxiosInstance.post(
                "/zego/generate-zego-token/",
                { user_id: userId, room_id: roomId }

            );
            console.log("Recieved response :", response.data)

            setZegoConfig({
                token: response.data.token,
                appID: response.data.app_id,
                roomID: response.data.room_id,
            });

            setShowCallUI(true);
        } catch (error) {
            console.error("Error generating Zego token:", error);
            showToast("Failed to join the meeting. Please try again.", "error");
        }
    };

    useEffect(() => {
        if (showCallUI && zegoConfig && containerRef.current) {
            const zp = ZegoUIKitPrebuilt.create(zegoConfig.token);

            zp.joinRoom({
                container: containerRef.current,
                sharedLinks: [],
                scenario: {
                    mode: ZegoUIKitPrebuilt.GroupCall,
                },
                userID: userId,
                userName: userName,
                turnOnMicrophoneWhenJoining: false,
                turnOnCameraWhenJoining: false,
                showMyCameraToggleButton: true,
                showMyMicrophoneToggleButton: true,
                showAudioVideoSettingsButton: true,
                showScreenSharingButton: true,
                showTextChat: true,
                showUserList: true,
                maxUsers: 50,
                layout: "Grid",
                showLayoutButton: true,
            });
        }
    }, [showCallUI, zegoConfig, userId, userName]);

    if (showCallUI) {
        return (
            <div
                ref={containerRef}
                className="w-screen h-screen fixed inset-0 z-[9999] bg-black"
            />
        );
    }

    return (
        <button
            onClick={handleJoin}
            className="bg-green-500 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg shadow-gray-300 dark:shadow-zinc-800"
        >
            <div className="bg-white rounded-full p-2">
                <RiVideoOnAiLine className="text-green-500 text-lg" />
            </div>
            <span className="text-sm pr-10 pl-4">Join the Video Call Now</span>
        </button>
    );
};

export default JoinMeetingButton;
