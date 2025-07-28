import React, { useEffect, useState, useRef } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import UserDefaultImage from "../../assets/images/user-default.png";
import TwemojiText from "../../components/Community/community-message/TwemojiText";
import DateBadge from "../../components/Community/community-message/MessageDateBadge";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { RxCross2 } from "react-icons/rx";
import CommunityChatShimmer from "../../components/shimmer-ui-component/CommunityChatShimmer";

const FarmerSingleChat = () => {
    const navigate = useNavigate();
    // to scroll to bottom managing ref
    const messagesEndRef = useRef(null);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null)
    const [loading, setLoading] = useState(false);

    // handle imoji
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);

    const location = useLocation();

    //user id from redux
    const userId = useSelector((state) => state.user.user?.id)

    // get the access token of the loggen in user/sender
    const token = useSelector((state) => state.auth.token)

    // receiver id from previous page 
    const { receiverId, username, profile_picture } = location.state || {};

    //  Websocket Mesaging set up
    const minId = Math.min(userId, receiverId)
    const maxId = Math.max(userId, receiverId)
    const roomName = `private_${minId}_${maxId}`;

    useEffect(() => {

        // create websocket connection  
        socketRef.current = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}/ws/private-chat/${roomName}/?token=${token}`);

        //recieve message from backend 
        socketRef.current.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);

                if (data.type === "online_status") {
                    // data.online_users is an array of user IDs currently online
                    const isReceiverOnline = data.online_users.includes(String(receiverId));

                } else {
                    // it's a chat message
                    setMessages((prev) => [...prev, data]);
                }
            } catch (error) {
                // console.error("Invalid JSON from socket", error);
            }
        };

        // Check conection open  
        socketRef.current.onopen = () => {
            // console.log("Websocket Connected")
        };

        // Check error 
        socketRef.current.onerror = (error) => {
            // console.error("Websocket error", error)
        }

        // Close socket connection 
        socketRef.current.onclose = () => {
            // console.log("WebSocket closed")
        }

        //Clean Up on unmount 
        return () => {
            socketRef.current.close();
        }
    }, [roomName])

    // Send message set up 
    const sendMessage = () => {
        if (socketRef.current && newMessage.trim()) {
            socketRef.current.send(JSON.stringify({ message: newMessage, receiver_id: receiverId }));
            setNewMessage("");
            setShowEmojiPicker(false);
        }
    }

    //Get saved message from the Db
    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await AuthenticatedAxiosInstance.get(`/users/get-private-chat-messages/${receiverId}`);
                setMessages(response.data);
            } catch (error) {
                // console.log("Error fetching messages from Db:::", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMessages();
    }, [receiverId])

    // send the imoji 
    const handleEmojiClick = (emojiData, event) => {
        setNewMessage((prevMessage) => prevMessage + emojiData.emoji);
    };

    // scroll to bottm 
    const scrollToBottom = () => {
        const messagesContainer = messagesEndRef.current?.parentElement;
        if (!messagesContainer) return;

        const startPosition = messagesContainer.scrollTop;
        const targetPosition = messagesContainer.scrollHeight - messagesContainer.clientHeight;
        const distance = targetPosition - startPosition;

        if (distance === 0) return;

        const duration = Math.min(1000, Math.max(500, Math.abs(distance) / 2));
        const startTime = performance.now();

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animateScroll = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = easeOutCubic(progress);

            messagesContainer.scrollTop = startPosition + (distance * easeProgress);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    //apply scorll to bottom whenever send message 
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // handle message input box height 
    useEffect(() => {
        const textarea = document.getElementById('messageInput');
        if (!textarea) return;

        const resize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };

        textarea.addEventListener('input', resize);
        return () => textarea.removeEventListener('input', resize);
    }, []);

    return (
        <>
            {loading ? (
                <CommunityChatShimmer />
            ) : (
                <div className="flex mt-4  flex-col w-full border border-gray-200 dark:border-zinc-700 bg-gray-300 dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden lg:h-[80vh] h-[77vh]">
                    {/* header */}
                    <header className="bg-gradient-to-r from-green-700 to-green-400 border-b dark:border-zinc-700 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img
                                src={profile_picture || UserDefaultImage}
                                alt="profile"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-white dark:text-zinc-100">{username || "no data found"}</h3>

                            </div>
                        </div>

                        <button
                            onClick={() => navigate(-1)}
                            className="border-white hover:border-transparent text-white hover:bg-green-700  rounded-full p-1 transition-colors duration-300"
                        >
                            <RxCross2 className='text-2xl' />
                        </button>
                    </header>

                    {/*Messages List */}
                    <div className="relative flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        {/* Background */}
                        {/* Fixed Doodle Background - Light Mode */}
                        <div
                            className="absolute inset-0 pointer-events-none z-0 dark:hidden"
                            style={{
                                backgroundImage: "url('/images/message_doodle.png')",
                                backgroundRepeat: "repeat",
                                backgroundPosition: "center",
                                backgroundAttachment: "local",
                                opacity: 5, // light mode opacity
                            }}
                        />

                        {/* Fixed Doodle Background - Dark Mode */}
                        <div
                            className="absolute inset-0 pointer-events-none z-0 hidden dark:block"
                            style={{
                                backgroundImage: "url('/images/message_doodle.png')",
                                backgroundRepeat: "repeat",
                                backgroundPosition: "center",
                                backgroundAttachment: "local",
                                opacity: 0.08, // dark mode opacity
                            }}
                        />

                        <div className="relative z-10 h-full overflow-y-auto p-4 space-y-4">

                            {/* message showing area  */}
                            {messages.map((msg, idx) => {
                                const isOwnMessage = msg.sender_id === userId;

                                //set up the date stamp
                                const dateObj = new Date(msg.timestamp);

                                // Get date part only for comparison
                                const msgDateOnly = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

                                // Get previous message date only
                                let prevDateOnly = null;
                                if (idx > 0) {
                                    const prevDateObj = new Date(messages[idx - 1].timestamp);
                                    prevDateOnly = new Date(prevDateObj.getFullYear(), prevDateObj.getMonth(), prevDateObj.getDate());
                                }

                                // Show date badge only if first message or date changed
                                const showDateBadge = idx === 0 || (prevDateOnly && msgDateOnly.getTime() !== prevDateOnly.getTime());
                                return (

                                    <>
                                        {showDateBadge && <DateBadge date={msgDateOnly} />}

                                        <div key={idx} className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
                                            <div className="chat-image avatar">
                                                <div className="w-10 rounded-full">
                                                    <img src={msg.sender_image || UserDefaultImage} alt="avatar" />
                                                </div>
                                            </div>
                                            <div className="chat-header dark:text-zinc-300">
                                                {isOwnMessage ? "You" : msg.sender_name}
                                            </div>

                                            <div
                                                className={`p-1 chat-bubble whitespace-pre-wrap rounded-xl break-words max-w-[80%]
                    ${isOwnMessage ? "gradient-bubble-green" : "gradient-bubble-gray"} text-white
                    ${msg.message && !msg.media_url ? "px-3 py-2" : ""}
                `}
                                            >
                                                <TwemojiText text={msg.message} />
                                            </div>

                                            <div className="chat-footer opacity-50">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    </>
                                );
                            })}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Footer Composer */}
                    <footer className="bg-white dark:bg-zinc-900 pt-3 pb-1 border-t dark:border-zinc-700">
                        <form className="flex items-end gap-2 w-full">

                            <div className="relative">
                                <button
                                    type="button"
                                    className="p-2 mb-2 ml-2 text-gray-500 dark:text-zinc-400 hover:text-green-500"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <BsEmojiSmile className="text-2xl" />
                                </button>

                                {showEmojiPicker && (
                                    <div
                                        ref={emojiPickerRef}
                                        className="absolute bottom-full mb-2 left-0 z-50"
                                        style={{ width: "280px" }} // optional, set width for better control
                                    >
                                        <EmojiPicker
                                            onEmojiClick={handleEmojiClick}
                                            theme={document.documentElement.classList.contains("dark") ? "dark" : "light"}
                                            emojiStyle={EmojiStyle.TWITTER}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 relative">
                                <textarea
                                    id="messageInput"
                                    rows="1"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="w-full resize-none rounded-2xl px-4 py-3 text-base border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-600"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={sendMessage}
                                disabled={newMessage.trim() === ""}
                                className={`p-2 mr-4 ml-2 mb-2 rounded-full text-white transition-colors ${newMessage.trim() === ""
                                    ? 'bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500'
                                    : 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                                    }`}
                            >
                                <IoMdSend className="text-2xl " />
                            </button>
                        </form>
                    </footer>
                </div>
            )}
        </>
    );
};

export default FarmerSingleChat;
