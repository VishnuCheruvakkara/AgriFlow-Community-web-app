import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle, FaUsers, FaRegEdit, FaEye } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import DefaultBannerImage from "../../assets/images/banner_default_user_profile.png";
import { RxCross2 } from "react-icons/rx";
import { FaChartArea } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdLocationCity } from "react-icons/md";
import { LiaUsersSolid } from "react-icons/lia";
import EditEventModal from "./EditEventModal";
import { MdExitToApp } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
import { showConfirmationAlert } from "../SweetAlert/showConfirmationAlert";
import { showToast } from "../toast-notification/CustomToast";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import DefaultUserImage from "../../assets/images/user-default.png"
import { Link } from "react-router-dom";
import JoinMeetingButton from "../zego-cloud-video-call/JoinMeetingButton";
import { useSelector } from "react-redux";
import SearchNotFound from "../../assets/images/no-weather-data-found.png"
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";

const EventDetailsPage = ({ event, onClose, onDelete, onEventStatusUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(event);

  // get the user data for the video call meet with zego cloude
  const user = useSelector((state) => state.user.user)

  // Format the date and time in a more readable way
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleSave = async (updatedEvent) => {
    try {
      setCurrentEvent(updatedEvent);
      setIsEditModalOpen(false);
    } catch (error) {
      // console.error("Error saving event:", error);
    }
  };

  const { date, time } = formatDateTime(currentEvent.start_datetime);

  useEffect(() => {
    const scrollToTopByScreenSize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        // Mobile
        window.scrollTo({ top: 360, behavior: 'smooth' });
      } else if (width < 1024) {
        // Tablet
        window.scrollTo({ top: 270, behavior: 'smooth' });
      } else {
        // Desktop
        window.scrollTo({ top: 210, behavior: 'smooth' });
      }
    };

    scrollToTopByScreenSize();
  }, []);

  //Using a local state to handle the event data 
  useEffect(() => {
    setCurrentEvent(event);
  }, [event]);

  const handleDelete = async () => {
    const result = await showConfirmationAlert({
      title: 'Delete Event?',
      text: 'Are you sure you want to delete this event? This action cannot be undone.',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel',
    });

    if (result) {
      try {
        const response = await AuthenticatedAxiosInstance.patch(`/events/delete-event/${currentEvent.id}/`);
        showToast("Event deleted successfully", "success")
        onDelete(currentEvent.id);
        onClose(); // Close the page
      } catch (error) {
        // console.error("Error deleting event:", error);
        showToast("Failed to delete the event.", "error")
      }
    }
  };


  // mark as completed    
  const handleMarkAsCompleted = async () => {
    const result = await showConfirmationAlert({
      title: 'Mark as Completed?',
      text: 'Are you sure you want to mark this event as completed?',
      confirmButtonText: 'Yes, Mark Completed',
      cancelButtonText: 'No, Cancel',
    });

    if (result) {
      try {
        const response = await AuthenticatedAxiosInstance.patch(
          `/events/mark-as-completed/${currentEvent.id}/`
        );
        showToast("Event marked as completed.", "success");
        const updatedEvent = {
          ...currentEvent,
          event_status: "completed",
        };

        setCurrentEvent(updatedEvent);
        //changes in parent event status
        if (onEventStatusUpdate) onEventStatusUpdate(updatedEvent);
      } catch (error) {
        // console.error("Error marking event as completed:", error);
        const errorMessage =
          error?.response?.data?.detail ||
          "Failed to mark the event as completed.";
        showToast(errorMessage, "error");
      }
    }
  };

  // mark as removed/cancelled 
  const handleMarkAsCancelled = async () => {
    const result = await showConfirmationAlert({
      title: "Cancel Event?",
      text: "Are you sure you want to cancel this event?",
      confirmButtonText: "Yes, Cancel Event",
      cancelButtonText: "No, Keep Event",
    });
    if (result) {
      try {
        const response = await AuthenticatedAxiosInstance.patch(`/events/mark-as-cancelled/${currentEvent.id}/`);
        showToast("Event has been cancelled.", "success");
        const updatedEvent = {
          ...currentEvent,
          event_status: "cancelled",
        };

        setCurrentEvent(updatedEvent);

        //changes in parent event status
        if (onEventStatusUpdate) onEventStatusUpdate(updatedEvent);
      } catch (error) {
        // console.error("Error cancelling event:", error);
        const errorMessage = error?.response?.data?.detail || "Failed to cancel the event.";
        showToast(errorMessage, "error");
      }
    }
  };

  return (
    <div className="flex flex-col w-full rounded-md bg-gray-100 shadow-lg overflow-y-auto no-scrollbar dark:bg-zinc-950 dark:text-zinc-200">
      {/* Header */}
      <div className="text-white bg-gradient-to-r from-green-700 to-green-400 px-4 py-4 flex justify-between items-center dark:from-green-800 dark:to-green-600">
        <h2 className="text-xl font-semibold text-white">Event Details</h2>
        <button
          onClick={onClose}
          className="border-white hover:border-transparent text-white hover:bg-green-700 rounded-full p-1 transition-colors duration-300 dark:hover:bg-green-800"
        >
          <RxCross2 className='text-2xl' />
        </button>
      </div>

      {/* Event Banner */}
      <div className="flex justify-center m-3">
        <img
          src={currentEvent.banner_url || DefaultBannerImage}
          alt="Event Banner"
          className="object-cover rounded-md sm:w-1/2 border border-gray-400 dark:border-zinc-700"
        />
      </div>

      {/* Community Name */}
      <div className="bg-white py-4 flex flex-col items-center border-b-2 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="border-b-2 text-center w-full pb-3 dark:border-zinc-800">
          <h3 className="text-md font-semibold text-green-700 dark:text-green-400">Event Name "{currentEvent.title || "Not found"}" </h3>
        </div>

        {/* Edit event  */}
        <div className="mt-4">
          <JoinMeetingButton
            roomId={currentEvent?.id}
            userId={user?.id}
            userName={user?.username}
            startTime={currentEvent?.start_datetime}
          />
        </div>

        {/* join to the event  */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="bg-green-500 mt-5 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg shadow-gray-300 dark:bg-green-600 dark:hover:bg-green-700 dark:shadow-zinc-900"
        >
          <div className="bg-white rounded-full p-2 dark:bg-zinc-100">
            <FaRegEdit className="text-green-500" />
          </div>
          <span className="text-sm pr-10 pl-4">Edit Event</span>
        </button>


        <h3 className="text-md mt-3 font-medium text-gray-800 dark:text-zinc-200">Event created for the community "{currentEvent.community_name}"</h3>
        <p className="text-sm text-gray-600 mt-3 border bg-green-200 border-green-400 px-2 py-1 rounded-full dark:bg-green-900 dark:border-green-700 dark:text-green-100">
          {currentEvent.event_type} event
        </p>
      </div>

      {/* Inserted New Event Info Section */}
      <div className="bg-white p-2 space-y-2 border-b dark:bg-zinc-900 dark:border-zinc-800">
        {currentEvent.event_type == "offline" && (
          <>
            <div className="flex text-sm text-gray-700 border border-green-400 bg-green-200 px-2 py-4 rounded-sm dark:bg-green-900 dark:border-green-700 dark:text-green-100">
              <span className="w-48 font-medium flex item-center gap-4"> <FaChartArea className="text-gray-600 text-xl dark:text-zinc-400" />Country</span>
              <span className="mr-5">:</span>
              <span className="flex-1">{currentEvent.country}</span>
            </div>

            <div className="flex text-sm text-gray-700 border border-green-400 bg-green-200 px-2 py-3 rounded-sm dark:bg-green-900 dark:border-green-700 dark:text-green-100">
              <span className="w-48 font-medium flex item-center gap-4"><FaMapLocationDot className="text-gray-600 text-xl dark:text-zinc-400" /> Location Address</span>
              <span className="mr-5">:</span>
              <span className="flex-1 break-words">{currentEvent.full_location}</span>
            </div>

            <div className="flex text-sm text-gray-700 border border-green-400 bg-green-200 px-2 py-3 rounded-sm dark:bg-green-900 dark:border-green-700 dark:text-green-100">
              <span className="w-48 font-medium flex item-center gap-4"><MdLocationCity className="text-gray-600 text-xl dark:text-zinc-400" />Venue Address</span>
              <span className="mr-5">:</span>
              <span className="flex-1 break-words">{currentEvent.address}</span>
            </div>
          </>
        )}

        {/* Max Participants */}
        <div className="flex text-sm text-gray-700 border border-green-400 bg-green-200 px-2 py-3 rounded-sm dark:bg-green-900 dark:border-green-700 dark:text-green-100">
          <span className="w-48 font-medium flex item-center gap-4"> <LiaUsersSolid className="text-gray-600 text-xl dark:text-zinc-400" />Max Participants</span>
          <span className="mr-5">:</span>
          <span className="flex-1">{currentEvent.max_participants}</span>
        </div>
      </div>

      {/* Content Sections */}
      <div className="flex flex-col">
        {/* Location Section */}
        <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-gray-500 mt-1 mr-3 dark:text-zinc-400" size={18} />
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">Location</h3>
              <p className="text-gray-700 mt-1 dark:text-zinc-300">{currentEvent.location_name || 'Online Event'}</p>
            </div>
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-start">
            <FaCalendarAlt className="text-gray-500 mt-1 mr-3 dark:text-zinc-400" size={18} />
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">Date</h3>
              <p className="text-gray-700 mt-1 dark:text-zinc-300">{date}</p>
            </div>
          </div>

          <div className="flex items-start mt-3">
            <BsClock className="text-gray-500 mt-1 mr-3 dark:text-zinc-400" size={18} />
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">Time</h3>
              <p className="text-gray-700 mt-1 dark:text-zinc-300">{time}</p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-start">
            <FaInfoCircle className="text-gray-500 mt-1 mr-3 dark:text-zinc-400" size={18} />
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">About this Event</h3>
              <p className="text-gray-700 mt-1 break-all whitespace-pre-wrap pr-5 dark:text-zinc-300">
                {currentEvent.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Participants Section */}
        {currentEvent.participants && currentEvent.participants.length > 0 ? (
          <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaUsers className="text-gray-500 mt-1 mr-2 dark:text-zinc-400" size={18} />
                <h3 className="text-sm font-medium text-gray-500 mt-1 dark:text-zinc-400">Participants</h3>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mt-1 mr-2 dark:text-zinc-400">
                Total members joined: {currentEvent.participants.length}
              </h3>
            </div>

            <div className="mx-2 overflow-hidden rounded-lg">
              {currentEvent.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center p-3 mb-2 border border-gray-300 hover:bg-gray-50 cursor-pointer rounded-lg gap-4 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 mr-3 flex-shrink-0 dark:bg-green-900">
                    <img
                      src={participant.profile_picture_url || DefaultUserImage}
                      alt="User Avatar"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900 truncate dark:text-zinc-200">{participant.username}</h3>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">
                        Participant
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 dark:text-zinc-400">{participant.email}</p>
                  </div>

                  <Link
                    to={`/user-dash-board/user-profile-view/${participant.id}`}
                    className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-2 hover:bg-green-300 border border-green-400 cursor-pointer tooltip tooltip-left dark:bg-green-900 dark:border-green-700 dark:hover:bg-green-800"
                    data-tip="View"
                  >
                    <FaEye className="text-green-600 text-xl hover:text-green-800 dark:text-green-400 dark:hover:text-green-200" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="col-span-3 mx-2 text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 mt-2">
            <img
              src={SearchNotFound}
              alt="No Participants"
              className="mx-auto w-64 object-contain"
            />
            <p className="text-lg font-semibold dark:text-zinc-100">No Participants Found!</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              When users join this event, their details will appear here.
            </p>
          </div>
        )}
      </div>

      {currentEvent.event_status !== 'completed' &&
        currentEvent.event_status !== 'cancelled' && (
          <>
            <button
              onClick={handleMarkAsCompleted}
              className="flex items-center justify-center gap-2 w-full mt-2 p-4 border-b bg-white hover:bg-green-100 transition-colors duration-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-green-900"
            >
              <IoMdCheckmarkCircle className="text-green-600 text-xl dark:text-green-400" />
              <span className="text-green-600 font-bold dark:text-green-400">
                Mark as Completed
              </span>
            </button>

            <button
              onClick={handleMarkAsCancelled}
              className="flex items-center justify-center gap-2 w-full mt-2 p-4 border-b bg-white hover:bg-yellow-100 transition-colors duration-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-yellow-900"
            >
              <MdCancel className="text-yellow-600 text-xl dark:text-yellow-400" />
              <span className="text-yellow-600 font-bold dark:text-yellow-400">Cancel Event</span>
            </button>

          </>
        )}

      <button
        onClick={handleDelete}
        className="flex items-center justify-center gap-2 w-full mt-2 p-4 border-b bg-white hover:bg-red-100 transition-colors duration-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-red-900"
      >
        <RiDeleteBin5Fill className="text-red-600 text-xl dark:text-red-400" />
        <span className="text-red-600 font-bold dark:text-red-400">Delete Event</span>
      </button>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditEventModal
            key="edit-event-modal"
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            eventData={currentEvent}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetailsPage;