import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import DefaultUserImage from "../../assets/images/user-default.png"
import DefaultProductImage from "../../assets/images/banner_default_user_profile.png"
import TwemojiText from '../../components/Community/community-message/TwemojiText'
import DateBadge from "../../components/Community/community-message/MessageDateBadge";
import { FaEye } from "react-icons/fa6";
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs'
import { IoMdSend } from "react-icons/io";
import { Link } from 'react-router-dom'
import CommunityChatShimmer from '../../components/shimmer-ui-component/CommunityChatShimmer'

function FarmerProductChat() {
    const navigate = useNavigate()
    const location = useLocation()
    const socketRef = useRef(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(false);

    // handle imoji
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);

    // to scroll to bottom managing ref
    const messagesEndRef = useRef(null);

    // get the access token of the loggen in user/sender
    const token = useSelector((state) => state.auth.token)
    const userId = useSelector((state) => state.user.user?.id)

    const {
        receiverId,
        username,
        profilePicture,
        productId,
        productName,
        productImage,
    } = location.state || {};

    const minId = Math.min(userId, receiverId);
    const maxId = Math.max(userId, receiverId);
    const roomName = `productchat_${minId}_${maxId}_${productId}`;

    useEffect(() => {
        if (!productId || !token || !userId || !receiverId) return;

        // Setup WebSocket connection
        socketRef.current = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}/ws/product-chat/${roomName}/?token=${token}`);

        socketRef.current.onopen = () => {
            // console.log(" WebSocket connected for product chat");
        };

        socketRef.current.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);

                if (data.type === "online_status") {


                } else {
                    setMessages(prev => [...prev, data]);
                }
            } catch (error) {
                // console.error("WebSocket JSON parse error", error);
            }
        };

        socketRef.current.onerror = (e) => {
            // console.error("WebSocket error", e);
        };

        socketRef.current.onclose = () => {
            // console.log("WebSocket closed");
        };

        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, [productId, token, userId, receiverId]);

    const sendMessage = () => {
        if (socketRef.current && newMessage.trim() !== "") {
            socketRef.current.send(
                JSON.stringify({
                    message: newMessage,
                    receiver_id: receiverId,
                })
            );
            setNewMessage("");
            setShowEmojiPicker(false);
        }
    };

    //Get saved product deal messages from the Db
    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await AuthenticatedAxiosInstance.get(`/products/get-product-deal-messages`, {
                    params: {
                        product_id: productId,
                        receiver_id: receiverId,
                    },
                });
                setMessages(response.data);
            } catch (error) {
                // console.log("Error fetching messages from Db:::", error);
            } finally {
                setLoading(false);
            }
        };
        if (productId && receiverId) {
            fetchMessages();
        }
    }, [productId, receiverId]);

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

    // Scroll to bottom every time messages change
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

    const handleOpenProductDetails = (productId) => {
        navigate(`/user-dash-board/products/product-details-page/${productId}`)
    }

    return (
        <div>
            {loading ? (
                <CommunityChatShimmer />
            ) : (
                <div className="flex mt-4 flex-col w-full border border-gray-200 dark:border-zinc-700 bg-gray-300 dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden h-[80vh]">

                    {/* Header */}
                    <header className="bg-gradient-to-r from-green-700 to-green-400 border-b dark:border-zinc-700 p-4 flex justify-between items-center">
                        <Link to={`/user-dash-board/user-profile-view/${receiverId}`} className="flex items-center gap-3">
                            <img
                                src={profilePicture || DefaultUserImage}
                                alt="profile"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-white dark:text-zinc-100">{username || "Not Found"}</h3>



                            </div>

                        </Link>

                        <button onClick={() => navigate(-1)} className="border-white hover:border-transparent text-white hover:bg-green-700 rounded-full p-1 transition-colors duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </header>

                    {/* Messages List */}
                    <div className="relative flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-900">

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

                        {/* Floating Product Info Card */}
                        <div className="absolute left-3 right-3 z-20 mt-3">
                            <div className="flex items-center justify-between bg-white dark:bg-zinc-950 border-l-[3px] border-r-[3px] border-green-500 shadow-md p-3">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={productImage || DefaultProductImage}
                                        alt="Product"
                                        className="w-12 h-12 rounded-md object-cover border border-gray-300 shadow-lg"
                                    />
                                    <div className="text-sm text-gray-800 dark:text-gray-200">
                                        <p className="font-semibold">{productName || "Product Name"}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Active Deal</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleOpenProductDetails(productId)}
                                    className="bg-green-500 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600  transition-colors duration-200 shadow-lg shadow-gray-300 dark:shadow-zinc-900"
                                >
                                    <div className="bg-white dark:bg-white rounded-full p-2">
                                        < FaEye className="text-green-500 " />
                                    </div>
                                    <span className="text-sm pr-4">View Product</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative h-full z-10 overflow-y-auto pt-28 px-4 space-y-4">

                            {messages.map((msg, idx) => {
                                const isOwnMessage = msg.sender_id === userId;

                                // Format timestamp for date badge
                                const currentDate = new Date(msg.timestamp);
                                const msgDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

                                let prevDateOnly = null;
                                if (idx > 0) {
                                    const prevDate = new Date(messages[idx - 1].timestamp);
                                    prevDateOnly = new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate());
                                }

                                const showDateBadge = idx === 0 || msgDateOnly.getTime() !== prevDateOnly?.getTime();

                                return (
                                    <React.Fragment key={idx}>
                                        {/* Show Date Badge when date changes */}
                                        {showDateBadge && <DateBadge date={msgDateOnly} />}

                                        {/* Chat Message */}
                                        <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
                                            <div className="chat-image avatar">
                                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                                    <img
                                                        src={msg.sender_image || DefaultUserImage}
                                                        alt="avatar"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            <div className="chat-header  text-xs dark:text-zinc-300 ">
                                                {isOwnMessage ? "You" : msg.sender_name || "Unknown"}
                                            </div>

                                            <div
                                                className={`chat-bubble whitespace-pre-wrap rounded-xl break-words max-w-[80%]
                                            ${isOwnMessage ? "gradient-bubble-green" : "gradient-bubble-gray"}
                                            text-white px-3 py-2`}
                                            >
                                                <TwemojiText text={msg.message} />
                                            </div>

                                            <div className="chat-footer opacity-50 text-xs mt-1">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                    </React.Fragment>
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
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    type="button"
                                    className="p-2 mb-3 ml-2 text-gray-500 dark:text-zinc-400 hover:text-green-500"
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

                            <div className="flex-1  relative">
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
                                className={`p-2 mr-4 ml-2 mb-3 rounded-full text-white transition-colors ${newMessage.trim() === ""
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
        </div>
    );
}

export default FarmerProductChat
