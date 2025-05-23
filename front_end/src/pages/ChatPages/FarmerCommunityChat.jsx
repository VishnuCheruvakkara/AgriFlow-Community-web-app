import React, { useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical, BsEmojiSmile, BsPaperclip, BsMic } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import { useParams } from "react-router-dom";
//import images 
import CommunityDefaultImage from '../../assets/images/user-group-default.png'
import GardenImage from '../../assets/images/farmer-garden-image.jpg'
import UserDefaultImage from '../../assets/images/user-default.png'
import { useSelector } from "react-redux"
import CommunityDrawer from "../../components/Community/community-details/communityDetails";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";

const FarmerCommunityChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // input box useref 
  const textareaRef = useRef(null);
  // Add ref for messages container to enable auto-scroll
  const messagesEndRef = useRef(null);
  // state for the online user count
  const [onlineCount, setOnlineCount] = useState(0);

  const { communityId } = useParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [communityData, setCommunityData] = useState(null);

  // get the access token of the JWT from the redux store 
  const token = useSelector((state) => state.auth.token)
  const userId = useSelector((state) => state.user.user?.id)

  console.log("userId chat:", userId)

  //useRef for proper socket connection nor re-renders
  const socketRef = useRef(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (!messagesContainer) return;

    const startPosition = messagesContainer.scrollTop;
    const targetPosition = messagesContainer.scrollHeight - messagesContainer.clientHeight;
    const distance = targetPosition - startPosition;

    if (distance === 0) return; // Already at bottom

    const duration = Math.min(1000, Math.max(500, Math.abs(distance) / 2));
    const startTime = performance.now();

    // Custom easing function for smoother animation (easeOutCubic)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    // Animate scroll
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
  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {

        const response = await AuthenticatedAxiosInstance.get(`community/get-communities/${communityId}`)
        console.log("CommunityData is ???:::::", response.data)
        setCommunityData(response.data);

      } catch (error) {
        console.error("Error fetching community :", error);
      }
    }
    fetchCommunities();
  }, [communityId])

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  //hand-shaking for the conenction in websocket from the front-end
  useEffect(() => {
    if (!token) return;

    const wsUrl = `ws://localhost:8000/ws/community-chat/${communityId}/?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket handshake successful");
    };
    // handle message from the backend to show that here in the front end
    //handled the online user count with the reddis cache mechanism
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received from WebSocket:", data);

      if (data.type === "user_count") {
        console.log("Online Users:", data.count);
        // Optionally store in state:
        setOnlineCount(data.count);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    socketRef.current.onclose = (event) => {
      console.log(" WebSocket closed:", event.code, event.reason);
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    // clean up to avoid the extra load 
    return () => {
      socketRef.current.close();
    };
  }, [communityId, token]);

  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent form reload

    if (newMessage.trim() === "" || !socketRef.current) return;

    const messageData = { message: newMessage };
    socketRef.current.send(JSON.stringify(messageData));
    setNewMessage(""); // Clear input after sending
    // Reset the height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // update height dynamically for the message input
  const handleInput = (e) => {
    setNewMessage(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col w-full border border-gray-200 dark:border-zinc-700 bg-gray-300 dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden h-[80vh]">
      {/* Chat Header */}
      {isDrawerOpen ? (
        <CommunityDrawer isOpen={isDrawerOpen} closeDrawer={closeDrawer} communityData={communityData} />
      ) : (
        <>
          <div className="bg-white dark:bg-zinc-900 border-b dark:border-zinc-700 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <img onClick={openDrawer} src={communityData?.community_logo || CommunityDefaultImage} alt="Profile" className="w-12 h-12 rounded-full object-cover cursor-pointer" />
              <div className="ml-3 cursor-pointer" onClick={openDrawer}>
                <h3 className="font-semibold text-gray-800 dark:text-zinc-100">{communityData?.name || "Group Name not found "}</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400"> {communityData?.members?.length} members,  {onlineCount} online</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FiSearch className="text-gray-600 dark:text-zinc-300 text-xl cursor-pointer" />
              <BsThreeDotsVertical className="text-gray-600 dark:text-zinc-300 text-xl cursor-pointer" />
            </div>
          </div>

          {/* Messages Area */}
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

            {/* Scrollable Content */}
            <div className="relative z-10 h-full overflow-y-auto p-4 text-zinc-900 dark:text-zinc-100">

              {/*  Date Separator */}
              <div className="flex justify-center mb-4">
                <span className="bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200 text-xs px-3 py-1 rounded-full">
                  Today
                </span>
              </div>

              <ul className="text-zinc-900 dark:text-zinc-100 space-y-4">
                {messages.map((msg, idx) => {
                  const isOwnMessage = msg.user_id === userId; // Replace `currentUsername` with your logic
                  console.log("isOwnMessage::", isOwnMessage)
                  return (
                    <li key={idx} className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
                      <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                          <img alt="User avatar" src={msg?.user_image || UserDefaultImage} />
                        </div>
                      </div>
                      <div className="chat-header dark:text-zinc-300">
                        {isOwnMessage ? "You" : msg.username}
                      </div>
                      <div
                        className={`chat-bubble whitespace-pre-wrap break-words max-w-[80%] ${isOwnMessage ? "gradient-bubble-green" : "gradient-bubble-gray"} text-white`}
                      >
                        {msg.message}
                      </div>
                      <div className="chat-footer opacity-50 mt-1">Sent at • {msg.timestamp || "just now"}</div>
                    </li>
                  );
                })}
              </ul>

              {/*  System Message */}
              <div className="flex justify-center my-4">
                <div className="bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100 text-xs px-3 py-1 rounded-full">
                  James joined the group
                </div>
              </div>

              {/* Typing Indicator */}
              <div className="flex mb-4">
                <img src={UserDefaultImage} alt="Profile" className="w-9 h-9 rounded-full self-end" />
                <div className="ml-2 bg-white dark:bg-zinc-800 text-black dark:text-white p-3 rounded-lg rounded-tl-none shadow-sm inline-flex">
                  <span className="animate-bounce mx-0.5">•</span>
                  <span className="animate-bounce mx-0.5 animation-delay-200">•</span>
                  <span className="animate-bounce mx-0.5 animation-delay-400">•</span>
                </div>
              </div>

              {/* Invisible div to scroll to - placed at the bottom */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white dark:bg-zinc-900 p-3 border-t dark:border-zinc-700">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <button type="button" className="text-gray-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 focus:outline-none mx-2">
                <BsEmojiSmile className="text-xl" />
              </button>
              <button type="button" className="text-gray-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 focus:outline-none mx-2">
                <BsPaperclip className="text-xl" />
              </button>
              <textarea
                ref={textareaRef}
                rows={1}
                value={newMessage}
                onChange={handleInput}
                placeholder="Type a message"
                className="flex-1 py-2 px-4 resize-none bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 overflow-y-auto max-h-32"
              />
              <button type="button" className="text-gray-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 focus:outline-none mx-2">
                <BsMic className="text-xl" />
              </button>
              <button
                type="submit"
                className={`p-2 rounded-full focus:outline-none ${newMessage ? 'bg-green-500 text-white dark:bg-green-600 dark:text-white' : 'bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500'}`}
                disabled={!newMessage}
              >
                <IoMdSend className="text-xl" />
              </button>
            </form>
          </div>

        </>
      )}
    </div>
  );
};

export default FarmerCommunityChat;