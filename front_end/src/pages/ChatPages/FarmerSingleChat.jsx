import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical, BsEmojiSmile, BsPaperclip, BsMic } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

// static assets – replace with your own paths
import UserDefaultImage from "../../assets/images/user-default.png";
import ChatLoadingBanner from "../../assets/images/chat_image_loading_banner.png";
import DateBadge from "../../components/Community/community-message/MessageDateBadge";
import TwemojiText from "../../components/Community/community-message/TwemojiText";

const DUMMY_MESSAGES = [
    {
        id: 1,
        userId: 2,
        username: "John",
        avatar: UserDefaultImage,
        text: "Hey! How are you doing?",
        media: null,
        timestamp: "2025-06-01T10:30:00",
    },
    {
        id: 2,
        userId: 1,
        username: "You",
        avatar: UserDefaultImage,
        text: "I'm good – working on that 🌱 project!",
        media: null,
        timestamp: "2025-06-01T10:32:00",
    },
    {
        id: 3,
        userId: 2,
        username: "John",
        avatar: UserDefaultImage,
        text: "Awesome! Send pics 🚀",
        media: null,
        timestamp: "2025-06-01T10:34:00",
    },
    {
        id: 4,
        userId: 1,
        username: "You",
        avatar: UserDefaultImage,
        text: "",
        media: ChatLoadingBanner,           // example image preview
        timestamp: "2025-06-01T10:35:00",
    },
];






const FarmerSingleChat = () => {

    const [message, setMessage] = useState("");

    const loggedUserId = 1; // static “you” for this mock


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
        <div className="flex mt-4 flex-col w-full border border-gray-200 dark:border-zinc-700 bg-gray-300 dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden h-[80vh]">
            {/* header */}
            <header className="bg-gradient-to-r from-green-700 to-green-400 border-b dark:border-zinc-700 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img
                        src={UserDefaultImage}                // partner avatar
                        alt="profile"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-white dark:text-zinc-100">John Doe</h3>
                        <p className="text-xs text-gray-200">online</p>
                    </div>
                </div>

            </header>

            {/*Messages List */}
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



                <div className="relative z-10 h-full overflow-y-auto p-4 space-y-4">
                    {DUMMY_MESSAGES.map((msg, idx) => {
                        const isOwn = msg.userId === loggedUserId;
                        const now = new Date(msg.timestamp);

                        const showDateBadge =
                            idx === 0 ||
                            new Date(DUMMY_MESSAGES[idx - 1].timestamp).toDateString() !== now.toDateString();

                        return (
                            <React.Fragment key={msg.id}>
                                {showDateBadge && <DateBadge date={now} />}

                                <div className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
                                    {/* avatar */}
                                    <div className="chat-image avatar">
                                        <div className="w-10 rounded-full">
                                            <img src={msg.avatar} alt="avatar" />
                                        </div>
                                    </div>

                                    {/* name */}
                                    <div className="chat-header dark:text-zinc-300">
                                        {isOwn ? "You" : msg.username}
                                    </div>

                                    {/* bubble */}
                                    <div
                                        className={`chat-bubble whitespace-pre-wrap rounded-xl break-words max-w-[80%]
                      ${isOwn ? "gradient-bubble-green text-white" : "gradient-bubble-gray text-white"}`}
                                    >
                                        {/* media preview */}
                                        {msg.media && (
                                            <img
                                                src={msg.media}
                                                alt="media"
                                                className="max-w-xs rounded-lg border border-gray-300 dark:border-zinc-700 mb-2"
                                            />
                                        )}

                                        {/* text */}
                                        {msg.text && <TwemojiText text={msg.text} />}
                                    </div>

                                    {/* time */}
                                    <div className="chat-footer opacity-50">
                                        {now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}

                    {/* typing indicator sample */}
                    <div className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img src={UserDefaultImage} alt="typing avatar" />
                            </div>
                        </div>
                        <div className="chat-header">John</div>
                        <div className="chat-bubble rounded-xl gradient-bubble-gray text-white">
                            <span className="inline-flex space-x-1">
                                <span className="animate-bounce">•</span>
                                <span className="animate-bounce" style={{ animationDelay: "120ms" }}>•</span>
                                <span className="animate-bounce" style={{ animationDelay: "240ms" }}>•</span>
                            </span>
                        </div>
                        <div className="chat-footer opacity-50">typing…</div>
                    </div>
                </div>
            </div>

            {/* <Composer></Composer> */}
            <footer className="bg-white dark:bg-zinc-900 pt-3 pb-1 border-t dark:border-zinc-700">
                <form className="flex items-end gap-2 w-full">
                    {/* Emoji Button */}
                    <button
                        type="button"
                        className="p-2 mb-2 ml-2 text-gray-500 dark:text-zinc-400 hover:text-green-500"
                    >
                        <BsEmojiSmile className="text-2xl" />
                    </button>

                    {/* Textarea Input */}
                    <div className="flex-1 relative">
                        <textarea
                            id="messageInput"
                            rows="1"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full resize-none rounded-2xl px-4 py-3 text-base border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-600"
                        />
                    </div>

                    {/* Send Button */}
                    <button
                        type="button"
                        id="sendBtn"
                        disabled={message.trim() === ""}
                        className={`p-2 mr-4 ml-2 mb-2 rounded-full text-white transition-colors ${message.trim() === ""
                            ? 'bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500'
                            : 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                            }`}
                    >
                        <IoMdSend className="text-2xl " />
                    </button>
                </form>
            </footer>

        </div>
    );
};

export default FarmerSingleChat;
