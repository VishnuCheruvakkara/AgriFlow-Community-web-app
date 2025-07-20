import React, { useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical, BsEmojiSmile, BsPaperclip, BsMic } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import { useParams } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
//import images 
import CommunityDefaultImage from '../../assets/images/user-group-default.png'
import GardenImage from '../../assets/images/farmer-garden-image.jpg'
import UserDefaultImage from '../../assets/images/user-default.png'
import { useSelector } from "react-redux"
import CommunityDrawer from "../../components/Community/community-details/communityDetails";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
//import message date badge here 
import DateBadge from "../../components/Community/community-message/MessageDateBadge";
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import TwemojiText from "../../components/Community/community-message/TwemojiText";
import { showToast } from "../../components/toast-notification/CustomToast";
import ChatLoadingSampleImage from "../../assets/images/chat_image_loading_banner.png"
import { Link } from "react-router-dom";

const FarmerCommunityChat = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // input box useref 
  const textareaRef = useRef(null);
  // Add ref for messages container to enable auto-scroll
  const messagesEndRef = useRef(null);
  // state for the online user count
  const [onlineCount, setOnlineCount] = useState(0);

  // Track typing user set up 
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);


  const { communityId } = useParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [communityData, setCommunityData] = useState(null);

  // Imogie picker to send in message 
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // Handle media load and animation when get media from database table
  const [mediaLoading, setMediaLoading] = useState(true);
  const handleMediaLoad = () => setMediaLoading(false);

  // Show the preview of the media file 
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewURL, setFilePreviewURL] = useState(null);

  //get url after upload the image th
  const [uploadedURL, setUploadedURL] = useState(null);

  // get the access token of the JWT from the redux store 
  const token = useSelector((state) => state.auth.token)
  const userId = useSelector((state) => state.user.user?.id)

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
        setCommunityData(response.data);

      } catch (error) {
        // console.error("Error fetching community :", error);
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
      // console.log("WebSocket handshake successful");
    };
    // handle message from the backend to show that here in the front end
    // handled the online user count with the reddis cache mechanism
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "user_count") {
        // Optionally store in state:
        setOnlineCount(data.count);
      } else if (data.type === "typing") {
        setTypingUser({
          userId: data.user_id,
          username: data.username,
          userImage: data.user_image,
        });
        // Clear typing indicator after timeout
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUser(null);
        }, 2000); // Clear after 2 seconds
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    socketRef.current.onclose = (event) => {
      // console.log(" WebSocket closed:", event.code, event.reason);
    };

    socketRef.current.onerror = (error) => {
      // console.error("WebSocket error:", error);
    };
    // clean up to avoid the extra load 
    return () => {
      socketRef.current.close();
    };
  }, [communityId, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent page reload
    setShowEmojiPicker(false)
    if (!newMessage.trim() && !selectedFile) return;

    let fileURL = null;

    // === FRONTEND VALIDATION START ===
    if (selectedFile) {
      const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const allowedVideoTypes = ["video/mp4", "video/webm"];
      const isImage = allowedImageTypes.includes(selectedFile.type);
      const isVideo = allowedVideoTypes.includes(selectedFile.type);

      const maxImageSize = 2 * 1024 * 1024; // 2 MB
      const maxVideoSize = 20 * 1024 * 1024; // 20 MB

      if (!isImage && !isVideo) {
        showToast("Only JPG, PNG, GIF, MP4, and WEBM files are allowed.", "error");
        return;
      }

      if (isImage && selectedFile.size > maxImageSize) {
        showToast("Image size must be less than 2 MB.", "error");
        return;
      }

      if (isVideo && selectedFile.size > maxVideoSize) {
        showToast("Video size must be less than 20 MB.", "error");
        return;
      }
    }
    // === FRONTEND VALIDATION END ===

    // Upload the file if selected
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", "user_community_chat_uploads");

      setIsUploading(true);

      try {
        const response = await AuthenticatedAxiosInstance.post("/community/community-chat-media-upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        fileURL = response.data.url;
        setUploadedURL(fileURL);
        setSelectedFile(null); // clear the file after upload
        setShowEmojiPicker(false)
      } catch (error) {
        // console.error("Upload failed:", error);
        showToast("File upload failed, Try again", "error");
        setIsUploading(false);
        setShowEmojiPicker(false)
        return;
      } finally {
        setIsUploading(false);
        setShowEmojiPicker(false)
      }
    }

    // Compose the message payload
    const messagePayload = {
      message: newMessage.trim(),
      file: fileURL, // this will be null if no file uploaded
    };

    // Send the message over WebSocket
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(messagePayload));
    }

    // Reset input
    setNewMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };


  // update height dynamically for the message input
  const handleInput = (e) => {
    setNewMessage(e.target.value);
    handleTyping(); // To send the typing evet to backend websocket to broadcast to the group 
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  //get messages saved in the table 
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await AuthenticatedAxiosInstance.get(`/community/get-community-messages/${communityId}/`);
        setMessages(response.data);
      } catch (error) {
        // console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [communityId]); ''

  const handleEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    textareaRef.current.focus();  // Optional: keep focus on input
  };

  // typing indicator set up  
  const handleTyping = () => {
    if (socketRef.current && newMessage.length > 0) {
      socketRef.current.send(JSON.stringify({ type: "typing", username: userId }));
    }
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
                {typingUser && typingUser.userId !== userId && (
                  <p className="text-xs text-green-500 ">{typingUser.username} is typing ...</p>
                )}
              </div>
            </div>

            <Link 
              to="/user-dash-board/farmer-community/my-communities"
              className="border-white hover:border-transparent text-zinc-500  hover:bg-gray-200  rounded-full p-1 transition-colors duration-300 tooltip tooltip-left" data-tip="Go back"
            >
              <RxCross2 className='text-2xl' />
            </Link>

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

              <ul className="text-zinc-900 dark:text-zinc-100 space-y-4">
                {messages.map((msg, idx) => {
                  const isOwnMessage = msg.user_id === userId;

                  //setup the date stamp
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

                  // Format time with AM/PM
                  const formattedTime = dateObj.toLocaleTimeString('en-IN', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });

                  return (
                    <React.Fragment key={idx}>
                      {/* Date Separator */}
                      {showDateBadge && <DateBadge date={msgDateOnly} />}

                      <li className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img alt="User avatar" src={msg?.user_image || UserDefaultImage} />
                          </div>
                        </div>

                        <div className="chat-header dark:text-zinc-300">
                          {isOwnMessage ? "You" : msg.username}
                        </div>

                        <div
                          className={`chat-bubble whitespace-pre-wrap rounded-xl break-words max-w-[300px] 
          ${isOwnMessage ? "gradient-bubble-green" : "gradient-bubble-gray"} text-white 
          ${msg.message && !msg.media_url ? "px-3 py-2" : "p-1"}`}
                        >
                          {/* Media Block */}
                          {msg.media_url && (
                            <div className="relative max-w-full mb-2 overflow-hidden rounded-lg">
                              {/* Loading Spinner */}
                              {mediaLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg z-10">
                                  <span className="loading loading-spinner loading-lg text-white"></span>
                                </div>
                              )}

                              {/* Image */}
                              {msg.media_url?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img
                                  src={msg.media_url || ChatLoadingSampleImage}
                                  alt="uploaded"
                                  onLoad={handleMediaLoad}
                                  className={`w-full h-auto max-h-[300px] rounded-lg border object-cover border-gray-300 dark:border-zinc-700 
                  ${msg.media_url ? '' : 'aspect-square blur-md'}`}
                                />
                              ) : msg.media_url?.match(/\.(mp4|webm)$/i) ? (
                                /* Video */
                                <video
                                  controls
                                  onLoadedData={handleMediaLoad}
                                  className="w-full h-auto max-h-[300px] rounded-lg border border-gray-300 dark:border-zinc-700"
                                >
                                  <source src={msg.media_url} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              ) : null}
                            </div>
                          )}

                          {/* Text Block */}
                          {msg.message && (
                            <div className={`${msg.media_url ? "px-2 py-1" : ""} break-words whitespace-pre-wrap w-full overflow-hidden`}>
                              <TwemojiText text={msg.message} />
                            </div>
                          )}
                        </div>

                        <div className="chat-footer opacity-50 mt-1 text-xs">
                          Sent at • {formattedTime || "just now"}
                        </div>
                      </li>
                    </React.Fragment>
                  );







                })}
              </ul>

              {/*  System Message */}
              {/* <div className="flex justify-center my-4">
                <div className="bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100 text-xs px-3 py-1 rounded-full">
                  James joined the group
                </div>
              </div> */}

              {/* Typing Indicator */}
              {typingUser && typingUser.userId !== userId && (
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Typing user avatar"
                        src={typingUser.userImage || UserDefaultImage} // Replace with dynamic image if available
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {typingUser.username}
                  </div>
                  <div className="chat-bubble rounded-xl gradient-bubble-gray text-black dark:text-white">
                    <span className="inline-flex space-x-1">
                      <span className="animate-bounce mx-0.5">•</span>
                      <span className="animate-bounce mx-0.5 animation-delay-200">•</span>
                      <span className="animate-bounce mx-0.5 animation-delay-400">•</span>
                    </span>
                  </div>
                  <div className="chat-footer opacity-50">Typing...</div>
                </div>
              )}


              {/* Invisible div to scroll to - placed at the bottom */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white dark:bg-zinc-900 p-3 border-t dark:border-zinc-700">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">

              {/* Emoji Button & Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(val => !val)}
                  className="py-2 mb-1 ml-2 text-gray-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 focus:outline-none"
                >
                  <BsEmojiSmile className="text-2xl" />
                </button>

                {/* Emoji Picker Panel */}
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute  bottom-12 left-0 z-50"
                  >
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      theme={document.documentElement.classList.contains("dark") ? "dark" : "light"}
                      emojiStyle={EmojiStyle.TWITTER}
                    />
                  </div>
                )}
              </div>

              {/* Attachment Button */}
              <label className="cursor-pointer p-2 mb-1 text-gray-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 focus:outline-none">
                <BsPaperclip className="text-2xl" />
                <input
                  type="file"
                  accept="image/*,video/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedFile(file);
                      setFilePreviewURL(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>

              {/* Textarea and Media Preview Inside Input Box */}
              <div className="flex-1 mr-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500 dark:focus-within:ring-green-400 transition duration-500 ease-in-out">

                {filePreviewURL && selectedFile && (
                  <div className="p-3 pb-2 border-b border-gray-200 dark:border-zinc-600">
                    <div className="relative inline-block">
                      {selectedFile.type.startsWith("image/") ? (
                        <img src={filePreviewURL} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
                      ) : selectedFile.type.startsWith("video/") ? (
                        <video className="w-16 h-16 rounded-lg object-cover" muted>
                          <source src={filePreviewURL} type={selectedFile.type} />
                        </video>
                      ) : selectedFile.type === "application/pdf" ? (
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-red-600 dark:text-red-400 font-semibold">PDF</span>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-600 dark:text-gray-400">File</span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setFilePreviewURL(null);
                        }}
                        type="button"
                        className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition-colors"
                      >
                        <RxCross2 className="text-xs" />
                      </button>
                    </div>
                    {selectedFile?.name && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate max-w-20">
                        {selectedFile.name}
                      </p>
                    )}
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={newMessage}
                  onChange={handleInput}

                  placeholder="Type a message"
                  className="emoji-text w-full  mt-1 py-2 px-4 resize-none bg-transparent text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400 focus:outline-none overflow-y-auto max-h-20"
                />

              </div>


              {/* Send Button */}
              <button
                type="submit"
                className={`p-2 mb-1 mr-2 rounded-full focus:outline-none transition-colors ${newMessage || selectedFile
                  ? 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                  : 'bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500'
                  }`}
                disabled={!newMessage && !selectedFile || isUploading}
              >
                {isUploading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <IoMdSend className="text-2xl" />
                )}
              </button>


            </form>
          </div>

        </>
      )}
    </div>
  );
};

export default FarmerCommunityChat;