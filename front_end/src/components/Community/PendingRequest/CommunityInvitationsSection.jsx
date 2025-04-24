import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaUsers } from 'react-icons/fa';
import DefaultCommunityIcon from "../../../assets/images/user-group-default.png";
import DefaultUserIcon from "../../../assets/images/user-default.png";
import AuthenticatedAxiosInstance from '../../../axios-center/AuthenticatedAxiosInstance';
import { showConfirmationAlert } from '../../SweetAlert/showConfirmationAlert';
import { showToast } from '../../toast-notification/CustomToast';

function CommunityInvitationsSection({ expanded, toggleSection }) {

    const [invitations, setInvitations] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const response = await AuthenticatedAxiosInstance.get('community/pending-community-invites/');
                console.log("Invitation datas :::: ", response.data);
                setInvitations(response.data);
                setIsLoaded(true);
            } catch (error) {
                console.log("Error fetching invitations :", error);
            }
        };
        fetchInvites();
    }, []);

    // Handle accept action
    const handleAccept = async (inviteId, communityId) => {
        const result = await showConfirmationAlert({
            title: 'Accept Invitation?',
            text: 'Are you sure you want to accept this invitation?',
            confirmButtonText: 'Yes, Accept',
            cancelButtonText: 'No, Cancel',
        });
        if (result) {
            try {
                console.log("Sending POST to respond:", {
                    community_id: communityId,
                    action: 'accept'
                });
                const response = await AuthenticatedAxiosInstance.post('community/respond/', {
                    community_id: communityId,
                    action: 'accept'
                });
                console.log("Invitation accepted:", response.data);
                showToast("You have successfully joined",'success')
                // Update state to reflect the change
                setInvitations(invitations.filter(invite => invite.id !== inviteId)); // Remove accepted invite
            } catch (error) {
                console.error("Error accepting invite:", error);
                showToast("Erro happened, try again","error")
            }
        }
    };

    // Handle ignore action
    const handleIgnore = async (inviteId, communityId) => {
        const result = await showConfirmationAlert({
            title: 'Ignore Invitation?',
            text: 'Are you sure you want to ignore this invitation?',
            confirmButtonText: 'Yes, Ignore',
            cancelButtonText: 'No, Go Back',
        });
        if (result) {
            try {
                console.log("Sending POST to respond:", {
                    community_id: communityId,
                    action: 'accept'
                });
                const response = await AuthenticatedAxiosInstance.post('community/respond/', {
                    community_id: communityId,
                    action: 'ignore'
                });
                console.log("Invitation ignored:", response.data);
                showToast("Invitation ingored successfully","success")
                // Update state to reflect the change
                setInvitations(invitations.filter(invite => invite.id !== inviteId)); // Remove ignored invite
            } catch (error) {
                console.error("Error ignoring invite:", error);
            }
        }

    };

    const handleToggle = () => {
        toggleSection("adminInvites");
    };

    return (
        <div className="mb-6 rounded-lg shadow-lg">
            <div
                className={`bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${expanded ? 'rounded-t-lg' : 'rounded-lg'}`}
                onClick={handleToggle}
            >
                <div className="flex items-center">
                    <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
                        <FaUsers className="text-green-600 text-xl" />
                    </div>
                    <h2 className="text-md font-semibold text-white">Community Invitations for You</h2>
                    <span className="ml-3 px-2 py-1 border border-green-600 bg-white text-green-600 font-semibold text-xs rounded-full">{ invitations.length || "0"}</span>
                    
                </div>
                <div className="transition-transform duration-300 ease-in-out">
                    {expanded ?
                        <FaChevronUp className="text-white" /> :
                        <FaChevronDown className="text-white" />
                    }
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-3 border-t-0 border rounded-b-lg border-gray-300">
                    <div className="space-y-3">

                        {/* Invitation area wiht map*/}

                        {invitations.length > 0 ? (
                            invitations.map((invite, index) => (
                                <div key={invite.id || index} className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 border border-gray-200">
                                            <img src={invite?.community_logo || DefaultCommunityIcon} alt="Organic Farming Practices" className="h-full w-full object-cover" />
                                        </div>
                                        <div >
                                            <h3 className="font-medium  text-gray-800">{invite.community_name || "No data found"}</h3>
                                            <div className="flex items-center text-xs text-gray-500 mt-1 ">
                                                <span>Invited by : </span>
                                                <div className="h-5 w-5 rounded-full overflow-hidden mx-1 border border-gray-400">
                                                    <img src={invite?.invited_by?.profile_picture || DefaultUserIcon} alt="Admin" className="h-full w-full object-cover" />
                                                </div>
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
                                            className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
                                            onClick={() => handleAccept(invite.id, invite.community)}
                                        >
                                            Join
                                        </button>
                                        <button
                                            className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-500 hover:text-white transition"
                                            onClick={() => handleIgnore(invite.id, invite.community)}
                                        >
                                            Ignore
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md">
                                <p className="text-md font-semibold ">No community invitations found</p>
                                <p className="text-xs text-gray-500">Check after sometime...</p>
                            </div>
                        )}



                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommunityInvitationsSection;

