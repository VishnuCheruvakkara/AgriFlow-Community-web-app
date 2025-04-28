import React, { useState } from 'react';
import { motion } from "framer-motion";
import { FaUsers, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import DefaultCommunityImage from '../../../assets/images/user-group-default.png'
import { MdGroupAdd } from "react-icons/md";
import SelectMembersModal from '../CommunityModal/SelectMembersModal';
import { useSelector } from 'react-redux';
import AuthenticatedAxiosInstance from '../../../axios-center/AuthenticatedAxiosInstance';
import { showToast } from '../../toast-notification/CustomToast';
import { RxCross2 } from "react-icons/rx";
import { MdExitToApp } from "react-icons/md";

const CommunityDrawer = ({ isOpen, closeDrawer, communityData }) => {
    if (!isOpen) return null; // safety check
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentUser = useSelector((state) => state.user.user);

    // handle after submit by selecting members from teh resuable modal 
    const handleModalSubmit = async (selectedMembers) => {
        console.log("The selected members ::::::: ", selectedMembers)
        if (selectedMembers.length === 0) {
            showToast("Please select at least one member", "error");
            return;
        }
        try {
            const response = await AuthenticatedAxiosInstance.post('/community/add-members/', {
                community_id: communityData?.id,
                member_ids: selectedMembers,
            });

            console.log('Members added successfully:', response.data);
            showToast("Request send to the selected users...", "success")
            setIsModalOpen(false); // close modal after successful submission
            // Optionally, you can refresh or update the members list here if you want
        } catch (error) {
            console.error('Error adding members:', error.response?.data || error.message);
            showToast("Error happened while adding members,please try again...", "error")
        }
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: isOpen ? 0 : '100%' }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col w-full h-full bg-gray-100 shadow-lg overflow-y-auto no-scrollbar"

        >
            {/* Header */}
            <div className=" text-white bg-gradient-to-r from-green-700 to-green-400 px-4 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white ">Community Details</h2>
                <button
                    onClick={closeDrawer}
                    className="border-white hover:border-transparent text-white hover:bg-green-700 rounded-full p-1 transition-colors duration-300"
                >
                    <RxCross2 className='text-2xl' />
                </button>
            </div>

            {/* Community Image */}
            <div className="bg-white py-6 flex flex-col items-center border-b">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <img src={communityData?.community_logo || DefaultCommunityImage} alt="Community Logo" className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{communityData?.name || "Not found"}</h3>
                <p className="text-sm text-gray-500 mt-1">
                    {communityData?.members?.length || 0} {communityData?.members?.length === 1 ? 'member' : 'members'}
                </p>
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
                        <h3 className="text-gray-700 font-medium">{communityData?.members?.length || 0} {communityData?.members?.length === 1 ? 'member' : 'members'}</h3>
                    </div>

                    <ul className="mt-2 text-gray-600 space-y-3">

                        {/* Add Member Button */}
                        {communityData?.members?.some(member => member.id === currentUser?.id && member.is_admin) && (
                            <li
                                className="bg-gradient-to-r bg-green-500 flex gap-5 items-center rounded-md py-3 cursor-pointer 
                    transition-colors duration-300 hover:bg-green-600"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <div className="ml-4 w-10 h-10 rounded-full overflow-hidden bg-white mr-3 flex items-center justify-center">
                                    <span className="text-green-600 font-bold text-xl">
                                        <MdGroupAdd />
                                    </span>
                                </div>
                                <span className="text-white font-semibold">Add Members</span>
                            </li>
                        )}

                        {/* Members list (Admin first) */}
                        {communityData?.members
                            ?.slice() // make a shallow copy before sorting
                            ?.sort((a, b) => (b.is_admin ? 1 : 0) - (a.is_admin ? 1 : 0)) // admins first
                            ?.map((member, index) => (
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

                {/* Modal */}
                <SelectMembersModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)} // <-- close modal
                    onSubmit={handleModalSubmit}
                    modalTitle="Add New Members"  // Custom title for adding members
                    submitButtonText="Add Members"  // Custom submit button text
                    actionType="add-new-members"
                    communityId={communityData?.id}
                />

                {/* Exit Community Section */}
                <button
                    className="flex items-center justify-center gap-2 w-full mt-2 p-4 border-b bg-white hover:bg-red-100 transition-colors duration-300"
                >
                    <MdExitToApp className="text-red-600 text-xl" />
                    <span className="text-red-600 font-bold">Exit Community</span>
                </button>
            </div>
        </motion.div>
    );
};

export default CommunityDrawer; 