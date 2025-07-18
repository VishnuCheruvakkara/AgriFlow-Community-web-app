import React from 'react';
import { MdClose } from 'react-icons/md';
import { FaInfoCircle, FaCalendarAlt, FaMapMarkerAlt, FaLaptop } from 'react-icons/fa';
import { HiOutlineTag } from 'react-icons/hi';
import MapModal from '../MapLocation/MapModal';
import { GrMapLocation } from "react-icons/gr";
import { showToast } from '../toast-notification/CustomToast';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import { showConfirmationAlert } from '../SweetAlert/showConfirmationAlert';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdOutlineLocationCity } from "react-icons/md";
import { RiVideoOnAiLine } from 'react-icons/ri';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import JoinMeetingButton from '../zego-cloud-video-call/JoinMeetingButton';

function JoinEventModal({ event, onClose, title = "Enroll to the Event", hideConfirmBtn = false, cancelBtnLabel = "Cancel" }) {
    const [showMapModal, setShowMapModal] = React.useState(false);
    //set up the navigate 
    const navigate = useNavigate();
    if (!event) return null;

    // get the user data for the video call meet with zego cloude
    const user = useSelector((state) => state.user.user)
    
    const openInGoogleMaps = (lat, lng) => {
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        window.open(googleMapsUrl, '_blank');
    };

    const handleJoinEvent = async () => {
        const result = await showConfirmationAlert({
            title: 'Enroll in the Event?',
            text: 'Once enrolled, you must participate. Skipping can result in restrictions. After enrollment, you cannot edit or leave the event.',
            confirmButtonText: 'Yes, Enroll',
            cancelButtonText: 'No, Cancel',
            iconComponent: (
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-2 border-red-600">
                    <FaExclamationTriangle className="text-red-600 text-3xl" />
                </div>
            )

        });

        if (result) {
            try {
                const response = await AuthenticatedAxiosInstance.post('/events/join-to-event/', {
                    event_id: event.id, // adjust this field as per your backend
                });
                showToast("Enrolled to the event successfully!", "success")
                navigate('/user-dash-board/event-management/enrolled-events');
            } catch (error) {
                console.error('Error while enrolling:', error);
                showToast(error?.response?.data?.event_id[0] || "Failed to enroll the event, try agian!", "error")
            }
        }
    };


    return (
        <div className="fixed inset-0 z-[999]">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-90" onClick={onClose} />

            {/* Modal content */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.85, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="bg-white dark:bg-zinc-700 w-full max-w-md rounded-lg shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-700 to-green-400 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-green-600 rounded-full p-1"
                            aria-label="Close modal"
                        >
                            <MdClose size={20} />
                        </button>
                    </div>

                    {/* Event content */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                        {!hideConfirmBtn && (
                            <div className="bg-red-100 border-l-4 border-red-400 p-4 mb-6 shadow-sm dark:bg-red-950 dark:border-red-600">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <FaInfoCircle className="text-red-700 dark:text-red-400" />
                                    </div>
                                    <div className="ml-3 space-y-2">
                                        <p className="text-sm text-red-800 dark:text-red-300">
                                            If you’re enrolled but don’t attend the event, you might not be able to join future events.
                                            So please enroll only if you’re sure you can attend.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        )}
                        {hideConfirmBtn && (
                            <div className="bg-red-100 border-l-4 border-red-400 p-4 mb-6  shadow-sm dark:bg-red-950 dark:border-red-600">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <FaInfoCircle className="text-red-700 dark:text-red-400" />
                                    </div>
                                    <div className="ml-3 space-y-2">
                                        <p className="text-sm text-red-800 dark:text-red-300">
                                            Kindly ensure you join on time. Missing the session may lead to disciplinary measures.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        )}

                        <p className="text-sm text-gray-500 dark:text-zinc-300 mb-2">
                            <HiOutlineTag className="inline text-green-700 mr-1 text-lg dark:text-green-500" /> <strong>Hosted by community : </strong> <span className="font-medium">{event.community_name}</span>
                        </p>

                        <img
                            src={event.banner_url || '/default_banner.png'}
                            onError={(e) => (e.target.src = '/default_banner.png')}
                            alt="Event Banner"
                            className="w-full object-cover rounded-md mb-4"
                        />

                        <p className="border-t border-green-600 dark:border-green-400 pt-3 text-sm font-semibold text-green-700 mb-2 dark:text-green-400">
                            Event Name : {event.title}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-zinc-300 mb-4"><strong>Description :</strong> {event.description}</p>

                        <div className="text-sm text-gray-600 dark:text-zinc-300 space-y-3 border-t border-b border-green-600 dark:border-green-400 py-4 mb-5">
                            <p>
                                <FaCalendarAlt className="inline mr-2 text-green-700 dark:text-green-400 " />
                                <strong>Starts at:</strong> {new Date(event.start_datetime).toLocaleString()}
                            </p>
                            <p>
                                <FaLaptop className="inline mr-2 text-green-700 dark:text-green-400 " />
                                <strong>Type:</strong> {event.event_type === 'online' ? 'Online' : 'Offline'}
                            </p>
                            <p>
                                <FaMapMarkerAlt className="inline mr-2 text-green-700 dark:text-green-400 " />
                                <strong>Location:</strong> {event.event_type === 'online' ? 'Online Event' : event.location_name}
                            </p>

                            {event.event_type === 'offline' &&
                                <p>
                                    <MdOutlineLocationCity className="inline mr-2 text-green-700 text-lg dark:text-green-400 " />
                                    <strong>Venue Address : </strong>{event.address}
                                </p>
                            }
                        </div>

                        {event.event_type === "offline" ? (
                            <button
                                onClick={() => setShowMapModal(true)}
                                className="bg-green-500 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg shadow-gray-300 dark:shadow-zinc-800"
                            >
                                <div className="bg-white rounded-full p-2">
                                    <GrMapLocation className="text-green-500 text-lg" />
                                </div>
                                <span className="text-sm pr-10 pl-4">View Location on Map</span>
                            </button>
                        ) : (
                            hideConfirmBtn && (
                              

                                <JoinMeetingButton
                                    roomId={event?.id}
                                    userId={user?.id}
                                    userName={user?.username}
                                    startTime={event?.start_datetime}
                                />


                            )
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-100 dark:bg-zinc-800 px-6 py-3 flex justify-end gap-3 border-t border-gray-200 dark:border-zinc-700">
                        <button
                            type="button"
                            className="px-4 py-3 bg-gray-400 hover:bg-gray-500 text-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200 rounded-md transition-colors font-medium"
                            onClick={onClose}
                        >
                            {cancelBtnLabel}
                        </button>
                        {!hideConfirmBtn && (
                            <button
                                type="button"
                                onClick={handleJoinEvent}
                                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium"
                            >
                                Confirm Enrollment
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showMapModal && (
                    <MapModal
                        lat={event.latitude}
                        lng={event.longitude}
                        onClose={() => setShowMapModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>

    );
}

export default JoinEventModal;
