import React, { useState, useRef, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { RiVideoOnAiLine } from "react-icons/ri";

const JoinMeetingButton = ({ roomId, userId, userName }) => {
    const [showCallUI, setShowCallUI] = useState(false);
    const containerRef = useRef(null);
    const zpRef = useRef(null);           // store the zp instance
    const hasJoinedRef = useRef(false);

    useEffect(() => {
        if (showCallUI && containerRef.current && !hasJoinedRef.current) {
            hasJoinedRef.current = true;

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                parseInt(import.meta.env.VITE_ZEGO_APP_ID),
                import.meta.env.VITE_ZEGO_SERVER_SECRET,
                String(roomId),
                String(userId),
                userName
            );

            const zp = ZegoUIKitPrebuilt.create(kitToken);
            zpRef.current = zp;   // store for cleanup

            zp.joinRoom({
                container: containerRef.current,
                sharedLinks: [],
                scenario: {
                    mode: ZegoUIKitPrebuilt.GroupCall,
                },
                userID: String(userId),
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

        // This cleanup runs automatically when the component unmounts or the dependencies change
        return () => {
            if (zpRef.current) {
                zpRef.current.destroy();
                zpRef.current = null;
                hasJoinedRef.current = false; // reset so you can join again next time
            }
        };
    }, [showCallUI, roomId, userId, userName]);

    if (showCallUI) {
        return (
            <>
                <div
                    ref={containerRef}
                    className="w-screen h-screen fixed inset-0 z-[9999] bg-black"
                />
                <button
                    onClick={() => setShowCallUI(false)}
                    className="fixed top-4 right-4 z-[10000] bg-white text-black px-3 py-1 rounded shadow"
                >
                    ← Back to Page
                </button>
            </>
        );
    }


    return (
        <button
            onClick={() => setShowCallUI(true)}
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
