import React, { useState,useEffect } from "react";
import { BsThreeDotsVertical, BsEmojiSmile, BsPaperclip, BsMic } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import { useParams } from "react-router-dom";
//import images 
import CommunityDefaultImage from '../../assets/images/user-group-default.png'
import GardenImage from '../../assets/images/farmer-garden-image.jpg'
import UserDefaultImage from '../../assets/images/user-default.png'

const FarmerCommunityChat = () => {
    const [newMessage, setNewMessage] = useState("");
    const { communityId } = useParams();

    useEffect(() => {
        //fetch data here with axios 
    },[communityId])
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    // Message sending logic would go here
    setNewMessage("");
  };

  return (
    <div className="flex flex-col w-full border border-gray-200 bg-gray-100 rounded-lg shadow-lg overflow-hidden h-[80vh]">
      {/* Chat Header */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={CommunityDefaultImage} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-800">Organic Farming Group</h3>
            <p className="text-xs text-gray-500">128 members, 45 online</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <FiSearch className="text-gray-600 text-xl cursor-pointer" />
          <BsThreeDotsVertical className="text-gray-600 text-xl cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-green-50 bg-opacity-30">
        {/* Date Separator */}
        <div className="flex justify-center mb-4">
          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">Today</span>
        </div>

        {/* Received Message */}
        <div className="flex mb-4">
          <img src={UserDefaultImage} alt="Profile" className="w-9 h-9 rounded-full self-end" />
          <div className="ml-2 max-w-xs md:max-w-md">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
              <p className="text-gray-700">Good morning everyone! Any suggestions for natural fertilizers for tomato plants?</p>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500">John Farmer • 10:30 AM</span>
            </div>
          </div>
        </div>

        {/* Sent Message */}
        <div className="flex justify-end mb-4">
          <div className="max-w-xs md:max-w-md">
            <div className="bg-green-100 p-3 rounded-lg rounded-tr-none shadow-sm">
              <p className="text-gray-700">I've had great results with composted manure and fish emulsion for my tomatoes. Very cost effective!</p>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">10:35 AM ✓✓</span>
            </div>
          </div>
        </div>

        {/* Received Message with Image */}
        <div className="flex mb-4">
          <img src={UserDefaultImage} alt="Profile" className="w-9 h-9 rounded-full self-end" />
          <div className="ml-2 max-w-xs md:max-w-md">
            <div className="bg-white rounded-lg rounded-tl-none shadow-sm overflow-hidden">
              <img src={GardenImage} alt="Garden image" className="w-full h-auto" />
              <div className="p-3">
                <p className="text-gray-700">Here's my garden using those techniques!</p>
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500">Sarah Fields • 10:40 AM</span>
            </div>
          </div>
        </div>

        {/* System Message */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
            James joined the group
          </div>
        </div>

        {/* Sent Message */}
        <div className="flex justify-end mb-4">
          <div className="max-w-xs md:max-w-md">
            <div className="bg-green-100 p-3 rounded-lg rounded-tr-none shadow-sm">
              <p className="text-gray-700">Welcome James! We were just discussing organic fertilizers for tomatoes.</p>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">10:42 AM ✓</span>
            </div>
          </div>
        </div>
        
        {/* Another Received Message */}
        <div className="flex mb-4">
          <img src={UserDefaultImage} alt="Profile" className="w-9 h-9 rounded-full self-end" />
          <div className="ml-2 max-w-xs md:max-w-md">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
              <p className="text-gray-700">Thanks everyone! I'm new to organic farming. Could someone recommend good companion plants for tomatoes?</p>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500">James • 10:45 AM</span>
            </div>
          </div>
        </div>
        
        {/* Typing Indicator */}
        <div className="flex mb-4">
          <img src={UserDefaultImage} alt="Profile" className="w-9 h-9 rounded-full self-end" />
          <div className="ml-2 text-black bg-white p-3 rounded-lg rounded-tl-none shadow-sm inline-flex">
            <span className="animate-bounce mx-0.5">•</span>
            <span className="animate-bounce mx-0.5 animation-delay-200">•</span>
            <span className="animate-bounce mx-0.5 animation-delay-400">•</span>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <button type="button" className="text-gray-500 hover:text-green-500 focus:outline-none mx-2">
            <BsEmojiSmile className="text-xl" />
          </button>
          <button type="button" className="text-gray-500 hover:text-green-500 focus:outline-none mx-2">
            <BsPaperclip className="text-xl" />
          </button>
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button type="button" className="text-gray-500 hover:text-green-500 focus:outline-none mx-2">
            <BsMic className="text-xl" />
          </button>
          <button 
            type="submit" 
            className={`p-2 rounded-full focus:outline-none ${newMessage ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}
            disabled={!newMessage}
          >
            <IoMdSend className="text-xl" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerCommunityChat;