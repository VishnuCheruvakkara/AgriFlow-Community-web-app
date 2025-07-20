import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaUsers } from 'react-icons/fa';
import DefaultCommunityIcon from "../../../assets/images/user-group-default.png";
import DefaultUserIcon from "../../../assets/images/user-default.png";
import AuthenticatedAxiosInstance from '../../../axios-center/AuthenticatedAxiosInstance';
import { showConfirmationAlert } from '../../SweetAlert/showConfirmationAlert';
import { showToast } from '../../toast-notification/CustomToast';
import { Link } from 'react-router-dom';

function CommunityInvitationsSection({ expanded, toggleSection }) {

    const [invitations, setInvitations] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get('community/pending-community-invites/');
                setInvitations(response.data);
                setIsLoaded(true);
            } catch (error) {
                // console.error("Error fetching invitations :", error);
            }
        };
        fetchInvites();
    }, []);

    // Handle accept action
    const handleAccept = async (inviteId, communityId, communityName) => {
        const result = await showConfirmationAlert({
            title: 'Accept Invitation?',
            text: 'Are you sure you want to accept this invitation?',
            confirmButtonText: 'Yes, Accept',
            cancelButtonText: 'No, Cancel',
        });
        if (result) {
            try {
                const response = await AuthenticatedAxiosInstance.post('community/respond/', {
                    community_id: communityId,
                    action: 'accept'
                });
                showToast(`You have successfully joined to community "${communityName}"`, 'success')
                // Update state to reflect the change
                setInvitations(invitations.filter(invite => invite.id !== inviteId)); // Remove accepted invite
            } catch (error) {
                // console.error("Error accepting invite:", error);
                showToast("Erro happened, try again", "error")
            }
        }
    };

    // Handle ignore action
    const handleIgnore = async (inviteId, communityId, communityName) => {
        const result = await showConfirmationAlert({
            title: 'Ignore Invitation?',
            text: 'Are you sure you want to ignore this invitation?',
            confirmButtonText: 'Yes, Ignore',
            cancelButtonText: 'No, Go Back',
        });
        if (result) {
            try {
                const response = await AuthenticatedAxiosInstance.post('community/respond/', {
                    community_id: communityId,
                    action: 'ignore'
                });
                showToast(`Invitation ignored for the community "${communityName}"`, "success")
                // Update state to reflect the change
                setInvitations(invitations.filter(invite => invite.id !== inviteId)); // Remove ignored invite
            } catch (error) {
                // console.error("Error ignoring invite:", error);
            }
        }

    };

    const handleToggle = () => {
        toggleSection("adminInvites");
    };

    return (
       <div className="mb-6 rounded-lg shadow-lg">
            <div
                className={`ripple-parent ripple-white bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${expanded ? 'rounded-t-lg' : 'rounded-lg'}`}
                onClick={handleToggle}
            >
                <div className="flex items-center">
                    <div className="bg-white  rounded-full mr-3 flex items-center justify-center w-10 h-10">
                        <FaUsers className="text-green-600 text-xl" />
                    </div>
                    <h2 className="text-md font-semibold text-white">Community Invitations for You</h2>
                    <span className="ml-3 px-2 py-1 border border-green-600 bg-white  text-green-600  font-semibold text-xs rounded-full">{invitations.length || "0"}</span>

                </div>
                <div className="transition-transform duration-300 ease-in-out">
                    {expanded ?
                        <FaChevronUp className="text-white" /> :
                        <FaChevronDown className="text-white" />
                    }
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-3 border-t-0 border rounded-b-lg border-gray-300 dark:border-zinc-700 dark:bg-zinc-900">
                    <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-hide">

                        {/* Invitation area wiht map*/}

                        {invitations.length > 0 ? (
                            invitations.map((invite, index) => (
                                <div key={invite.id || index} className="flex items-center justify-between border border-gray-300 dark:border-zinc-700 p-3 bg-white dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 border border-gray-200 dark:border-zinc-600">
                                            <img src={invite?.community_logo || DefaultCommunityIcon} alt="Organic Farming Practices" className="h-full w-full object-cover" />
                                        </div>
                                        <div >
                                            <h3 className="font-medium  text-gray-800 dark:text-zinc-200">{invite.community_name || "No data found"}</h3>
                                            <div className="flex items-center text-xs text-gray-500 dark:text-zinc-400 mt-1 ">
                                                <span>Invited by : </span>
                                                <Link to={`/user-dash-board/user-profile-view/${invite.invited_by?.id}`}>
                                                    <div className="h-5 w-5 rounded-full overflow-hidden mx-1 border border-gray-400 dark:border-zinc-600">
                                                        <img src={invite?.invited_by?.profile_picture || DefaultUserIcon} alt="Admin" className="h-full w-full object-cover" />
                                                    </div>
                                                </Link>
                                                <span>
                                                    {invite.invited_by?.name} • {new Date(invite.invited_on).toLocaleString('en-US', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="px-3 py-1.5 bg-green-600  text-white dark:text-zinc-100 rounded-md text-sm hover:bg-green-700 dark:hover:bg-green-700 transition"
                                            onClick={() => handleAccept(invite.id, invite.community, invite.community_name)}
                                        >
                                            Join
                                        </button>
                                        <button
                                            className="px-3 py-1.5 bg-gray-300 dark:bg-zinc-500 text-gray-700 dark:text-zinc-300 rounded-md text-sm hover:bg-gray-500  hover:text-white dark:hover:bg-zinc-600 transition"
                                            onClick={() => handleIgnore(invite.id, invite.community, invite.community_name)}
                                        >
                                            Ignore
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center border-2 border-dashed border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 py-5 px-4 bg-gray-100 dark:bg-zinc-800 rounded-md">
                                <p className="text-md font-semibold ">No community invitations found</p>
                                <p className="text-xs text-gray-500 dark:text-zinc-500">Check after sometime...</p>
                            </div>
                        )}



                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommunityInvitationsSection;

