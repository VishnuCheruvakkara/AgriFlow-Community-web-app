import React, { useState, useRef, useEffect } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { ChevronDown } from "lucide-react";

const FarmerSingleChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How are you doing?", isOwn: false, timestamp: "10:30 AM", username: "John" },
    { id: 2, text: "I'm doing great! Just working on some new projects 😊", isOwn: true, timestamp: "10:32 AM", username: "You" },
    { id: 3, text: "That sounds awesome! What kind of projects?", isOwn: false, timestamp: "10:33 AM", username: "John" },
    { id: 4, text: "Building some React components and exploring new design patterns", isOwn: true, timestamp: "10:35 AM", username: "You" },
    { id: 5, text: "Nice! I'd love to see them when you're done 🚀", isOwn: false, timestamp: "10:36 AM", username: "John" },
  ]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Common emojis for quick access
  const commonEmojis = ["😀", "😂", "😍", "🥰", "😎", "🤔", "👍", "❤️", "🔥", "🎉", "😢", "😡"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      text: newMessage.trim(),
      isOwn: true,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      username: "You"
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
    setShowEmojiPicker(false);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setTimeout(scrollToBottom, 100);
  };

  const handleInput = (e) => {
    setNewMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden h-[600px]">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
          J
        </div>
        <div className="ml-3 text-white">
          <h3 className="font-semibold">John Doe</h3>
          <p className="text-xs opacity-90">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="relative flex-1 overflow-hidden bg-gray-50 dark:bg-zinc-900">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Messages Container */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="relative z-10 h-full overflow-y-auto p-4 space-y-4"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                msg.isOwn 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-white dark:bg-zinc-700 text-gray-800 dark:text-white shadow-md'
              }`}>
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 z-20"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-zinc-800 p-4 border-t dark:border-zinc-700">
        <div className="flex items-end gap-3">
          {/* Emoji Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <BsEmojiSmile className="text-xl" />
            </button>

            {/* Simple Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 bg-white dark:bg-zinc-700 rounded-lg shadow-lg p-3 grid grid-cols-6 gap-2 z-50">
                {commonEmojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-xl hover:bg-gray-100 dark:hover:bg-zinc-600 p-1 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex-1 bg-gray-100 dark:bg-zinc-700 rounded-2xl overflow-hidden">
            <textarea
              ref={textareaRef}
              rows={1}
              value={newMessage}
              onChange={handleInput}
              placeholder="Type a message..."
              className="w-full py-3 px-4 resize-none bg-transparent text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400 focus:outline-none max-h-20"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              newMessage.trim()
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                : 'bg-gray-200 dark:bg-zinc-600 text-gray-400 dark:text-zinc-500'
            }`}
          >
            <IoMdSend className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerSingleChat;