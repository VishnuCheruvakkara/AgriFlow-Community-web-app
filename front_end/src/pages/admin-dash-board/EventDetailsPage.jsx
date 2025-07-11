import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdLocationOn, MdPerson, MdEmail, MdPhone, MdAccessTime, MdUpdate, MdDelete, MdVerified, MdGroup, MdEvent, MdCalendarMonth } from 'react-icons/md';
import { FaCheckCircle, FaTimesCircle, FaUsers, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { RiCalendarEventFill, RiCommunityFill } from 'react-icons/ri';
import { GrMapLocation } from 'react-icons/gr';
import { ImCheckmark2 } from 'react-icons/im';
import { BiTime } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AdminAuthenticatedAxiosInstance from '../../axios-center/AdminAuthenticatedAxiosInstance';
import { useParams } from 'react-router-dom';
import MapModal from '../../components/MapLocation/MapModal';
import { FiGlobe } from "react-icons/fi";
import FormattedDateTime from '../../components/common-date-time/FormattedDateTime';
import { RiSearchLine } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";
import { showConfirmationAlert } from '../../components/SweetAlert/showConfirmationAlert';
import { showToast } from "../../components/toast-notification/CustomToast";
import { PulseLoader } from 'react-spinners';


const EventDetailsPage = () => {

  const [searchTerm, setSearchTerm] = useState("");

  const { eventId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [event, setEvent] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // Get the latitude and longitude 
  const lat = event?.event_location?.latitude;
  const lng = event?.event_location?.longitude;

  useEffect(() => {
    const getEventDetails = async () => {
      setLoading(true);
      try {
        const response = await AdminAuthenticatedAxiosInstance.get(
          `/events/admin/get-event-details/${eventId}`
        );
        console.log("Arrived event details :::", response.data);
        setEvent(response.data);
      } catch (error) {
        console.log("Error fetching events :", error);
      }finally{
        setLoading(false);
      }
    };

    getEventDetails();
  }, [eventId]);

 


  // toggle delete event status 
  const toggleDeleteStatus = async (eventId, currentStatus) => {
    const newStatus = !currentStatus;
    const actionText = newStatus ? "mark as deleted" : "mark as available";

    // Show confirmation alert before proceeding
    const result = await showConfirmationAlert({
      title: `Confirm Action`,
      text: `Are you sure you want to ${actionText} this event?\n\n(Current status: ${currentStatus ? "Deleted" : "Available"})`,
      confirmButtonText: `Yes, ${newStatus ? "Delete" : "Make Available"}`,
    });
    if (result) {
      try {
        const response = await AdminAuthenticatedAxiosInstance.patch(
          `/events/admin/toggle-delete-status/${eventId}/`,
          { is_deleted: !currentStatus }
        );

        console.log("Delete Status updated", response.data);

        // Update local state immediately
        setEvent((prev) => ({
          ...prev,
          is_deleted: !currentStatus,
        }));

        // Proper message depending on new status
        const newStatus = !currentStatus;
        const message = newStatus
          ? "Event status marked as deleted."
          : "Event status marked as available.";

        showToast(message, "success");
      } catch (error) {
        console.error("Failed to toggle delete status", error);
        showToast("Failed to update event status.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen w-full mb-4">
      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link to="/admin/event-management" className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
              Event Management
            </Link>
          </li>
          <li>
            <span className="text-gray-500 dark:text-zinc-400 cursor-default">
              Event Details
            </span>
          </li>
        </ul>
      </div>

      {/* Main Container */}
      <div className="w-full mx-auto bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
          <h1 className="text-xl font-bold">Event Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-300"
            aria-label="Close"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>



        {loading  || !event ? (
          <div className="flex flex-col items-center justify-center h-[510px] space-y-3">
            <PulseLoader color="#16a34a" speedMultiplier={1} />
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Loading event details...
            </p>
          </div>
        ) : (

          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Banner Section */}
              <div className="lg:col-span-1">
                <div className="space-y-3">
                  {/* Main Banner */}
                  <div
                    className="relative bg-gray-100 dark:bg-zinc-700 rounded-lg overflow-hidden shadow-md cursor-pointer"
                    onClick={() => setSelectedImage(event.banner_url)}
                  >
                    <img
                      src={event.banner_url}
                      alt={event.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                      Event Banner
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="border-b border-gray-200 dark:border-zinc-600 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
                      {event.title}
                    </h2>
                    <p className="text-gray-600 dark:text-zinc-200 mb-3">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        className={`flex items-center justify-between p-3 border rounded-lg
    ${event.event_status === 'upcoming' ? 'border-green-400' :
                            event.event_status === 'active' ? 'border-blue-400' :
                              event.event_status === 'completed' ? 'border-gray-400' :
                                'border-red-400'
                          }`}
                      >
                        <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                          About Event:
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap px-2 py-2
      ${event.event_status === 'upcoming'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : event.event_status === 'active'
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                : event.event_status === 'completed'
                                  ? 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}
                        >
                          {event.event_status === 'upcoming' && (
                            <FaCheckCircle className="text-green-600 dark:text-green-400 w-4 h-3" />
                          )}
                          {event.event_status === 'active' && (
                            <FaCheckCircle className="text-blue-600 dark:text-blue-400 w-4 h-3" />
                          )}
                          {event.event_status === 'completed' && (
                            <FaCheckCircle className="text-gray-600 dark:text-gray-400 w-4 h-3" />
                          )}
                          {event.event_status === 'cancelled' && (
                            <FaTimesCircle className="text-red-600 dark:text-red-400 w-4 h-3" />
                          )}
                          {event.event_status.charAt(0).toUpperCase() +
                            event.event_status.slice(1)}
                        </span>
                      </div>

                      <div
                        className={`flex items-center justify-between p-3 border rounded-lg
    ${event.event_type === 'offline'
                            ? 'border-blue-400'
                            : 'border-green-400'
                          }`}
                      >
                        <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                          Type:
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap px-2 py-2
                            ${event.event_type === 'offline'
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                              : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            }`}
                        >
                          {event.event_type === 'offline' ? (
                            <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 w-4 h-3" />
                          ) : (
                            <FaGlobe className="text-green-600 dark:text-green-400 w-4 h-3" />
                          )}
                          {event.event_type.charAt(0).toUpperCase() +
                            event.event_type.slice(1)}
                        </span>
                      </div>


                      <div
                        className={`flex items-center justify-between p-3 border rounded-lg
                       ${event.is_deleted ? 'border-red-400' : 'border-green-400'}`}
                      >
                        <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                          Status:
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap px-2 py-2
                         ${event.is_deleted
                              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                              : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`}
                        >
                          {event.is_deleted ? (
                            <FaTimesCircle className="text-red-600 dark:text-red-400 w-4 h-3" />
                          ) : (
                            <FaCheckCircle className="text-green-600 dark:text-green-400 w-4 h-3" />
                          )}
                          {event.is_deleted ? 'Deleted' : 'Available'}
                        </span>
                      </div>


                      <div className="flex items-center justify-between p-3 border border-orange-400 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                          Capacity:
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-2">
                          <FaUsers className="text-orange-600 dark:text-orange-400 w-4 h-3" />
                          {event.participations.length}/{event.max_participants}
                        </span>
                      </div>


                    </div>
                  </div>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date & Time */}
                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                      <div className="flex items-center p-3 border-b border-green-400">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                          <RiCalendarEventFill className="text-green-500 w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                          Date & Time
                        </h3>
                      </div>
                      <div className="p-3">
                        <p className="text-gray-600 dark:text-zinc-100 text-lg font-medium">
                          {new Date(event.start_datetime).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-zinc-100 mb-2">
                          {new Date(event.start_datetime).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                      <div className="flex items-center p-3 border-b border-green-400">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                          <MdLocationOn className="text-green-600 dark:text-green-400 w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                          Location Details
                        </h3>
                      </div>




                      {event?.event_location ? (
                        // Show location info
                        <div className="p-3 space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-zinc-200 text-sm">
                              {event?.event_location?.location_name}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-zinc-200">
                              {event?.event_location?.full_location}
                            </p>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-zinc-100">
                            <strong>Address:</strong> {event?.address}
                          </p>

                          <div className="space-y-4">
                            {/* Button */}
                            <button
                              onClick={() => setShowMapModal(true)}
                              className="bg-green-500 rounded-full text-white p-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-md"
                            >
                              <div className="bg-white rounded-full p-2">
                                <GrMapLocation className="text-green-500 text-md" />
                              </div>
                              <span className="text-xs pr-6 pl-2">View on Map</span>
                            </button>

                            {/* Lat/Lng Info */}
                            <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-300 space-x-4">
                              <span>
                                <strong>Lat:</strong> {lat}
                              </span>
                              <span>
                                <strong>Lng:</strong> {lng}
                              </span>
                            </div>

                            {/* Map Modal */}
                            {showMapModal && (
                              <MapModal
                                lat={lat}
                                lng={lng}
                                onClose={() => setShowMapModal(false)}
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        // Show fallback card
                        <div className="p-4 w-full  bg-gray-50  dark:bg-zinc-700     flex items-center justify-center space-x-2">
                          <div className="bg-white dark:bg-zinc-800 p-2 rounded-full shadow">
                            <FiGlobe className="text-green-600 dark:text-green-400 w-5 h-5" />
                          </div>
                          <p className="text-sm text-gray-700 dark:text-zinc-200">
                            This is an online event conducted remotely.
                          </p>
                        </div>
                      )}


                    </div>
                  </div>

                  {/* Community & Creator Information */}
                  <div className="bg-zinc-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                    <div className="flex items-center p-3 border-b border-green-400">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                        <RiCommunityFill className="text-green-600 dark:text-green-400 w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                        Community & Creator
                      </h3>
                    </div>

                    <div className="p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Community Info */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-zinc-200 mb-2">
                            Host Community
                          </h4>


                          <Link to={`/admin/community-management/community-details/${event.community.id}`} className="flex items-center space-x-5 ">


                            <img
                              src={event?.community?.community_logo_url}
                              alt={event.created_by.full_name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                            />


                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                                {event.community.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-zinc-200">
                                Community ID: #{event.community.id}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-zinc-200">
                                {event.community.description}
                              </p>
                            </div>
                          </Link>


                        </div>

                        {/* Creator Info */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-zinc-200 mb-2">
                            Event Creator
                          </h4>

                          <Link to={`/admin/users-management/user-details/${event.created_by.id}`} className="flex items-center space-x-3 mb-3">
                            <img
                              src={event.created_by.profile_picture_url}
                              alt={event.created_by.full_name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                            />
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                                {event.created_by.full_name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-zinc-200">
                                Creator ID: #{event.created_by.id}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-zinc-200">
                                @{event.created_by.username}
                              </p>
                              {event.created_by.is_verified && (
                                <div className="flex items-center mt-1">
                                  <MdVerified className="w-3 h-3 text-green-500 mr-1" />
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    Verified
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <MdEmail className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-xs text-gray-700 dark:text-zinc-300">
                                {event.created_by.email}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MdPhone className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-xs text-gray-700 dark:text-zinc-300">
                                {event.created_by.phone_number}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>





                  {/* Participants Section */}
                  <div className="bg-zinc-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                    {/* Header */}
                    <div className="flex items-center p-3 border-b border-green-400">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                        <FaUsers className="text-green-600 dark:text-green-400 w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                        Participants ({event.participations.length}/{event.max_participants})
                      </h3>
                    </div>

                    {/* Search Bar */}
                    <div className="px-3 mt-3 flex">
                      <div className="flex items-center flex-1 border border-zinc-300 focus-within:border-green-500 dark:focus-within:border-green-500 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg shadow-sm px-3 py-1 transition duration-300 ease-in-out">
                        <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />

                        <input
                          type="text"
                          placeholder="Search participants..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1 outline-none px-2 py-1 text-gray-700 dark:text-zinc-200 bg-transparent placeholder-gray-500 dark:placeholder-zinc-400"
                        />

                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                            aria-label="Clear search"
                          >
                            <ImCancelCircle size={18} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Participants Grid */}
                    <div className="p-3">
                      {event.participations.filter((participant) =>
                        participant.full_name.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {event.participations
                            .filter((participant) =>
                              participant.full_name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            )
                            .map((participant, index) => (
                              <Link
                                to={`/admin/users-management/user-details/${participant.user_id}`}
                                key={index}
                                className="flex items-center space-x-2 p-3 bg-white dark:bg-zinc-600 rounded-lg border"
                              >
                                <img
                                  src={participant.profile_picture_url}
                                  alt={participant.username}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                  <p className="text-xs font-medium text-gray-800 dark:text-zinc-200">
                                    {participant.username}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-zinc-300">
                                    Joined <FormattedDateTime date={participant.joined_at} />
                                  </p>
                                </div>
                              </Link>
                            ))}
                        </div>
                      ) : (
                        <div className=" text-center border border-dashed border-gray-300 text-gray-600 py-8 px-4 bg-gray-100 rounded-md dark:bg-zinc-800 dark:border-zinc-700">
                          <p className="text-sm font-semibold dark:text-zinc-300 mb-1">
                            No Members Found
                          </p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-3">
                            Try adjusting your search criteria.
                          </p>
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-2 px-3 py-1.5 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 text-xs font-medium"
                          >
                            Clear all filters
                          </button>
                        </div>
                      )}
                    </div>
                  </div>





                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 py-4 border-t border-gray-200 dark:border-zinc-600">
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                {/* Toggle Delete / Restore */}
                {event?.is_deleted ? (
                  <button
                    onClick={() => toggleDeleteStatus(event.id, event.is_deleted)}
                    className="bg-green-500 hover:bg-green-600 rounded-full text-white p-1 flex items-center space-x-2 transition-colors duration-200 shadow-md"
                  >
                    <div className="bg-green-100 rounded-full p-2">
                      <ImCheckmark2 className="text-green-500 text-lg " />
                    </div>
                    <span className="text-sm pr-4 pl-2">Mark as Available</span>
                  </button>
                ) : (
                  <button
                    onClick={() => toggleDeleteStatus(event.id, event.is_deleted)}
                    className="bg-red-500 hover:bg-red-600 rounded-full text-white p-1 flex items-center space-x-2 transition-colors duration-200 shadow-md"
                  >
                    <div className="bg-red-100 rounded-full p-2">
                      <MdDelete className="text-red-500 text-lg" />
                    </div>
                    <span className="text-sm pr-4 pl-2">Mark as Deleted</span>
                  </button>
                )}
              </div>
            </div>


            {/* Footer Timestamps */}
            <div className="pt-4 border-t border-gray-200 dark:border-zinc-600">
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 dark:text-zinc-100">
                <div className="flex items-center mb-1 sm:mb-0">
                  <MdAccessTime className="w-4 h-4 mr-1" />
                  <span>
                    <strong>Created:</strong>
                    <FormattedDateTime date={event.created_at} />
                  </span>
                </div>
                <div className="flex items-center">
                  <MdUpdate className="w-4 h-4 mr-1" />
                  <span>
                    <strong>Last Updated:</strong>
                    <FormattedDateTime date={event.updated_at} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsPage;