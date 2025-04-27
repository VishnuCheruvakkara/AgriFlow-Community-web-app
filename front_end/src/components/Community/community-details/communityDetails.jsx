import React from 'react';
import { motion } from "framer-motion";
import { FaUsers, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import DefaultCommunityImage from '../../../assets/images/user-group-default.png'
import { MdGroupAdd } from "react-icons/md";

const CommunityDrawer = ({ isOpen, closeDrawer, communityData }) => {
    if (!isOpen) return null; // safety check

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: isOpen ? 0 : '100%' }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col w-full h-full bg-gray-100 shadow-lg overflow-y-auto no-scrollbar"

        >
            {/* Header */}
            <div className=" text-white bg-gradient-to-r from-green-700 to-green-400 px-4 py-3 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white ">Community Details</h2>
                <button
                    onClick={closeDrawer}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                    &times;
                </button>
            </div>

            {/* Community Image */}
            <div className="bg-white py-6 flex flex-col items-center border-b">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <img src={communityData?.community_logo || DefaultCommunityImage} alt="Community Logo" className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{communityData?.name || "Not found"}</h3>
                <p className="text-sm text-gray-500 mt-1">{communityData?.members?.length || "0"} members</p>
            </div>

            {/* Content */}
            <div className="flex flex-col">
                {/* About Section */}
                <div className="bg-white mt-2 p-4 border-b">
                    <div className="flex items-start">
                        <FaInfoCircle className="text-gray-500 mt-1 mr-3" size={18} />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">About</h3>
                            <p className="text-gray-700 mt-1">
                                {communityData?.description || "About this community not provided."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Members Section */}
                <div className="bg-white mt-2 p-4 border-b">
                    <div className="flex items-center mb-3">
                        <FaUsers className="text-gray-500 mr-3" size={18} />
                        <h3 className="text-gray-700 font-medium">Members</h3>
                    </div>
                    <ul className="mt-2 text-gray-600 space-y-3">

                        {/* Add Member Button */}
                        <li
                            className="flex gap-5 items-center border-2 border-green-400 rounded-md py-3 hover:bg-green-50 cursor-pointer transition-colors duration-300"
                            onClick={() => console.log('Open add member modal')}  // <-- You can change this to open a modal or navigate
                        >
                            <div className="ml-4 w-10 h-10 rounded-full overflow-hidden bg-green-100 mr-3 flex items-center justify-center">
                                <span className="text-green-600 font-bold text-xl">  <MdGroupAdd /> </span>
                            </div>
                            <span className="text-green-600 font-semibold">Add Members</span>
                        </li>

                        {communityData?.members?.map((member, index) => (
                            <li key={index} className="flex gap-5 items-center border cursor-pointer border-gray-300 rounded-md py-3 hover:bg-gray-100 transition-colors duration-300 ">
                                <div className="ml-4 w-10 h-10 rounded-full overflow-hidden bg-green-100 mr-3 flex items-center justify-center">
                                    <img
                                        src={member.profile_image}
                                        alt={member.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <span>
                                    {member?.username || "No data found"}
                                    {member?.is_admin && (
                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded ml-2">
                                            Admin
                                        </span>
                                    )}
                                </span>


                            </li>
                        ))}
                    </ul>
                </div>



                {/* Exit Community Section */}
                <div className=" mt-2 p-4 border-b  bg-red-500 hover:bg-red-700 transition-colors ">
                    <p className="text-center text-white font-bold ">Exit community</p>
                </div>
            </div>
        </motion.div>
    );
};

export default CommunityDrawer; 