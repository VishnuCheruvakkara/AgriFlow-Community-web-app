import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaInfoCircle, FaShieldAlt, FaRegEdit } from 'react-icons/fa';
import DefaultCommunityImage from '../../../assets/images/user-group-default.png'
import { MdGroupAdd } from "react-icons/md";
import SelectMembersModal from '../CommunityModal/SelectMembersModal';
import { useSelector } from 'react-redux';
import AuthenticatedAxiosInstance from '../../../axios-center/AuthenticatedAxiosInstance';
import { showToast } from '../../toast-notification/CustomToast';
import { RxCross2 } from "react-icons/rx";
import { MdExitToApp } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { showConfirmationAlert } from '../../SweetAlert/showConfirmationAlert';
import { useNavigate } from 'react-router-dom';
import EditCommunityModal from '../CommunityModal/EditCommunityModal'
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const CommunityDrawer = ({ isOpen, closeDrawer, communityData }) => {

    if (!isOpen) return null; // safety check
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [members, setMembers] = useState(communityData?.members || []);
    const currentUser = useSelector((state) => state.user.user);
    //state for handle menu bar for make users as admin and delete or remove user from a group
    const [openMemberId, setOpenMemberId] = useState(null);  // not just true/false
    const menuRef = useRef(null);

    //Set default current data before edit (Set to the edit modal )
    const [community, setCommunity] = useState({
        id: communityData?.id,
        name: communityData?.name,
        description: communityData?.description,
        image: communityData?.community_logo // Example image
    });

    const [isEditCommunityModalOpen, setIsEditCommunityModalOpen] = useState(false);
    const openEditCommunityModal = () => {
        setIsEditCommunityModalOpen(true); // Open Edit Community Modal
    };

    const closeEditCommunityModal = () => {
        setIsEditCommunityModalOpen(false); // Close Edit Community Modal
    };

    const handleSaveChanges = (updatedFields) => {
        // Update the community state with the new values returned from the modal
        setCommunity(prev => ({
            ...prev,
            ...updatedFields,
        }));

        closeEditCommunityModal();  // Close modal after update
    };

    // useEffect for set the local state community with the upcomming communityData 
    useEffect(() => {
        if (communityData) {
            setCommunity({
                id: communityData.id,
                name: communityData.name,
                description: communityData.description,
                image: communityData.community_logo,
            });
        }
    }, [communityData]);


    // Find the member object that matches the current user
    const currentMember = members?.find((m) => m.id === currentUser?.id);
    // set member while pageload 
    useEffect(() => {
        setMembers(communityData?.members || []);
    }, [communityData]);


    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMemberId(null); // Close menu
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    // handle after submit by selecting members from teh resuable modal 
    const handleModalSubmit = async (selectedMembers) => {
        if (selectedMembers.length === 0) {
            showToast("Please select at least one member", "error");
            return;
        }
        try {
            const response = await AuthenticatedAxiosInstance.post('/community/add-members/', {
                community_id: communityData?.id,
                member_ids: selectedMembers,
            });

            showToast("Request send to the selected users...", "success")
            setIsModalOpen(false); // close modal after successful submission
            // Optionally, you can refresh or update the members list here if you want
        } catch (error) {
            // console.error('Error adding members:', error.response?.data || error.message);
            showToast("Error happened while adding members,please try again...", "error")
        }
    };
    // Remove the farmer who are the member of the community but not an admin  
    const handleRemoveUser = async (member) => {
        const result = await showConfirmationAlert({
            title: 'Remove Member?',
            text: `Are you sure you want to remove "${member.username}" from the community?`,
            confirmButtonText: 'Yes, Remove',
            cancelButtonText: 'No, Cancel',
        });
        if (result) {
            try {
                const response = await AuthenticatedAxiosInstance.patch('/community/remove-member/', {
                    community_id: communityData?.id,
                    user_id: member.id,
                });
                showToast(`${member.username} has been removed successfully`, "success");
                // remove from frontend list
                setMembers(prev => prev.filter(m => m.id !== member.id));
            } catch (error) {
                // console.error('Remove member error:', error);
                showToast(`Failed to remove ${member.username}. Please try again.`, "error");
            }
        }
    };

    // Make the user as admin by another admin 
    const handleMakeAdmin = async (member) => {
        const result = await showConfirmationAlert({
            title: 'Promote to Admin?',
            text: `Are you sure you want to make "${member.username}" an admin of the community?`,
            confirmButtonText: 'Yes, Promote',
            cancelButtonText: 'No, Cancel',
        });

        if (result) {
            try {
                const response = await AuthenticatedAxiosInstance.patch('/community/make-admin/', {
                    community_id: communityData?.id,
                    user_id: member.id,
                });

                showToast(`${member.username} is now an admin`, "success");

                // Update is_admin status in local state
                setMembers(prev =>
                    prev.map(m =>
                        m.id === member.id ? { ...m, is_admin: true } : m
                    )
                );
            } catch (error) {
                // console.error('Make admin error:', error);
                showToast(`Failed to promote ${member.username} as admin. Please try again.`, "error");
            }
        }
    };

    // Revok the admin previlage of a user by another amdin 
    const handleRevokeAdminPrivileges = async (member) => {
        const result = await showConfirmationAlert({
            title: 'Revoke Admin Privileges?',
            text: `Are you sure you want to revoke admin privileges from "${member.username}"?`,
            confirmButtonText: 'Yes, Revoke',
            cancelButtonText: 'No, Cancel',
        });

        if (result) {
            try {
                const response = await AuthenticatedAxiosInstance.patch('/community/revoke-admin-privileges/', {
                    community_id: communityData?.id,
                    user_id: member.id,
                });
                console.log("privilage not revoked :",response.data)

                showToast(`${member.username}'s admin privileges were revoked successfully.`, "success");

                // Update the is_admin status in the local state
                setMembers(prev =>
                    prev.map(m =>
                        m.id === member.id ? { ...m, is_admin: false } : m
                    )
                );
            } catch (error) {
                console.error('Revoke admin error:', error);
                showToast(`Failed to revoke admin privileges from ${member.username}. Please try again.`, "error");
            }
        }
    };

    // Delete/Remove community logic by admin
    const handleRemoveCommunity = async () => {
        const result = await showConfirmationAlert({
            title: 'Delete Community?',
            text: 'Are you sure you want to remove this community? All members will be notified.',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'No, Cancel',
        });

        if (result) {
            try {
                await AuthenticatedAxiosInstance.patch('/community/soft-delete-community/', {
                    community_id: communityData?.id,
                });

                showToast('Community has been removed and users notified.', "success");

                // Optional: Redirect or update UI
                navigate('/user-dash-board/farmer-community/my-communities');

            } catch (error) {
                // console.error('Soft delete error:', error);
                showToast('Failed to delete community. Please try again.', "error");
            }
        }
    };

    // User can exit the community whenever they want 
    const handleExitCommunity = async () => {
        const result = await showConfirmationAlert({
            title: 'Leave Community?',
            text: 'Are you sure you want to leave this community? You will lose access to chats and updates.',
            confirmButtonText: 'Yes, Leave',
            cancelButtonText: 'No, Stay',
        });

        if (result) {
            try {
                const res = await AuthenticatedAxiosInstance.patch('/community/user-leave-community/', {
                    community_id: communityData?.id,
                });

                showToast(`You have left the community '${communityData?.name}' successfully.`, 'success');
                navigate('/user-dash-board/farmer-community/my-communities');
            } catch (error) {
                // console.error('Error while leaving the community:', error);
                showToast('Something went wrong', 'error');
            }
        }
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: isOpen ? 0 : '100%' }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col w-full h-full bg-gray-100 dark:bg-zinc-800 shadow-lg overflow-y-auto no-scrollbar"

        >
            {/* Header */}
            <div className=" text-white bg-gradient-to-r from-green-700 to-green-400  px-4 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white ">Community Details</h2>
                <button
                    onClick={closeDrawer}
                    className="border-white hover:border-transparent text-white hover:bg-green-700  rounded-full p-1 transition-colors duration-300"
                >
                    <RxCross2 className='text-2xl' />
                </button>
            </div>

            {/* Community Image */}
            <div className="bg-white dark:bg-zinc-900 py-6 flex flex-col items-center border-b dark:border-zinc-700">
                <div className="w-24 h-24 bg-green-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mb-3">
                    <img src={community?.image || DefaultCommunityImage} alt="Community Logo" className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-200">{community?.name || "Not found"}</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                    {communityData?.members?.length || 0} {communityData?.members?.length === 1 ? 'member' : 'members'}
                </p>

                {currentMember?.is_admin && (
                    <button
                        onClick={openEditCommunityModal}
                        className="bg-green-500 mt-4 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600  transition-colors duration-200 shadow-lg shadow-gray-300 dark:shadow-zinc-900"
                    >
                        <div className="bg-white dark:bg-zinc-200 rounded-full p-2">
                            <FaRegEdit className="text-green-500 " />
                        </div>
                        <span className="text-sm pr-4">Edit Community</span>
                    </button>
                )}


            </div>

            {/* Content */}
            <div className="flex flex-col">

                {/* About Section */}
                <div className="bg-white dark:bg-zinc-900 mt-2 p-4 border-b dark:border-zinc-700">
                    <div className="flex items-start">
                        <FaInfoCircle className="text-gray-500 dark:text-zinc-400 mt-1 mr-3" size={18} />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">About</h3>
                            <p className="text-gray-700 dark:text-zinc-300 mt-1 break-all whitespace-pre-wrap pr-5">
                                {community?.description || "About this community not provided."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Members Section */}
                <div className="bg-white dark:bg-zinc-900 mt-2 p-4 border-b dark:border-zinc-700">
                    <div className="flex items-center mb-3">
                        <FaUsers className="text-gray-500 dark:text-zinc-400 mr-3" size={18} />
                        <h3 className="text-gray-700 dark:text-zinc-300 font-medium">{communityData?.members?.length || 0} {communityData?.members?.length === 1 ? 'member' : 'members'}</h3>
                    </div>

                    <ul className="mt-2 text-gray-600 dark:text-zinc-400 space-y-3">

                        {/* Add Member Button */}
                        {communityData?.members?.some(member => member.id === currentUser?.id && member.is_admin) && (
                            <li
                                className="bg-gradient-to-r bg-green-500  flex gap-5 items-center rounded-md py-3 cursor-pointer 
                    transition-colors duration-300 hover:bg-green-600  hover:shadow-lg shadow-gray-300 dark:shadow-zinc-900"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <div className="ml-4 w-10 h-10 rounded-full overflow-hidden bg-white dark:bg-zinc-200 mr-3 flex items-center justify-center">
                                    <span className="text-green-600  font-bold text-xl">
                                        <MdGroupAdd />
                                    </span>
                                </div>
                                <span className="text-white font-semibold">Add Members</span>
                            </li>
                        )}


                        {/* Members list (Admin first) */}
                        {members
                            ?.slice()
                            ?.sort((a, b) => {
                                if (a.id === currentUser.id) return -1;  // Always put the current user at the top
                                if (b.id === currentUser.id) return 1;   // If b is the current user, move it to the top

                                // Then sort the rest by is_admin
                                return (b.is_admin ? 1 : 0) - (a.is_admin ? 1 : 0);
                            })
                            ?.map((member, index) => (
                                <li
                                    key={index}
                                    ref={openMemberId === member.id ? menuRef : null}
                                    onClick={() => setOpenMemberId(openMemberId === member.id ? null : member.id)}


                                    className="relative flex justify-between items-center border cursor-pointer border-gray-300 dark:border-zinc-600 rounded-md py-3 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-300 px-4 hover:shadow-lg shadow-gray-300 dark:shadow-zinc-900"
                                >
                                    {/* Left part: image and username */}
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 dark:bg-zinc-700 flex items-center justify-center">
                                            <img
                                                src={member.profile_image}
                                                alt={member.username}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <span className="flex items-center">
                                            <span className="text-gray-800 dark:text-zinc-200">{member?.username || "No data found"}</span>
                                            {member?.is_admin && (
                                                <span className="text-xs bg-gray-200 dark:bg-zinc-600 text-gray-600 dark:text-zinc-300 px-2 py-0.5 rounded ml-2">
                                                    Admin
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    {/* Right part: 3 dots icon */}
                                    <div className="text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 mr-2">
                                        <BsThreeDotsVertical size={18} />
                                    </div>

                                    <AnimatePresence>
                                        {openMemberId === member.id && currentUser.id !== member.id && (!member?.is_blocker || currentMember?.is_admin) && (
                                            <motion.ul
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.2 }}
                                                className="menu right-16 bg-white shadow-lg shadow-gray-400 dark:shadow-zinc-700 border dark:border-zinc-600 bg-base-200 dark:bg-zinc-800 rounded-md absolute transform -translate-x-1/2 z-20 p-1 with-pointer"
                                            >
                                                {/* View user option */}
                                                {!member?.is_blocker && (
                                                    <Link
                                                        to={`/user-dash-board/user-profile-view/${member.id}`}
                                                        className="hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 transition-colors rounded-t-sm p-2"
                                                    >
                                                        View {member.username}
                                                    </Link>
                                                )}

                                                {currentMember?.is_admin && (
                                                    <>
                                                        {!member?.is_admin && <li onClick={() => handleRemoveUser(member)} className="hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 transition-colors  rounded-t-sm border-gray-400 dark:border-zinc-600 p-2 ">Remove {member.username}</li>}

                                                        {!member?.is_admin && <li onClick={() => handleMakeAdmin(member)} className="hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 transition-colors rounded-b-sm p-2">Make {member.username} as admin</li>}
                                                        {/* Revoke admin privileges option if the user is already an admin */}
                                                        {member?.is_admin && member.id !== communityData.created_by && (
                                                            <li onClick={() => handleRevokeAdminPrivileges(member)} className="hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 transition-colors rounded-b-sm p-2">
                                                                Revoke admin privileges from {member.username}
                                                            </li>
                                                        )}
                                                    </>
                                                )}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>

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


                {/* Edit Community Modal */}
                <EditCommunityModal
                    isOpen={isEditCommunityModalOpen}
                    onClose={closeEditCommunityModal}
                    community={community}
                    onSave={handleSaveChanges}
                />



                {/* Exit Community Section */}
                {/* Admins see "Remove Community", others see "Exit Community" */}
                {currentMember?.is_admin && currentUser?.id === communityData?.created_by ? (
                    <button
                        onClick={handleRemoveCommunity}
                        className="flex items-center justify-center gap-2 w-full mt-2 p-4 border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-red-100 dark:hover:bg-red-700  dark:hover:bg-red-900/20 transition-colors duration-300 group"
                    >
                        <RiDeleteBin5Fill className="text-red-600  text-xl dark:group-hover:text-red-300" />
                        <span className="text-red-600  font-bold dark:group-hover:text-red-300">Delete Community</span>
                    </button>
                ) : (
                    <button
                        onClick={handleExitCommunity}
                        className="flex items-center justify-center gap-2 w-full mt-2 p-4 border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-red-100 dark:hover:bg-red-700  dark:hover:bg-red-900/20 transition-colors duration-300 group"
                    >
                        <MdExitToApp className="text-red-600  text-xl dark:group-first:hover:text-red-300" />
                        <span className="text-red-600 font-bold dark:group-hover:text-red-300">Exit Community</span>
                    </button>
                )}

            </div>
        </motion.div>
    );
};

export default CommunityDrawer; 