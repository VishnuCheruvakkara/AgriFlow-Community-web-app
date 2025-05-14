import React, { useEffect, useState } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { Search } from 'lucide-react';
import { FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';
import { MdOutlineLibraryAdd } from 'react-icons/md';
import DeafultBannerImage from '../../assets/images/banner_default_user_profile.png';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import { GrMapLocation } from "react-icons/gr";
import { MdOutlineVideoCall } from "react-icons/md";
import { RiVideoOnAiLine } from "react-icons/ri";
import JoinEventModal from '../../components/event-management-user-side/JoinEventModal';
import EventPageShimmer from '../../components/shimmer-ui-component/EventPageShimmer';


function EnrolledEvents() {

  const [events, setEvents] = useState([]);
  const [showMapModal, setShowMapModal] = React.useState(false);
  // to shwo the event details 
  const [modalEvent, setModalEvent] = useState(null);
  //shimmer UI loading
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchEnrolledEvents = async () => {
      try {
        const response = await AuthenticatedAxiosInstance.get('/events/get-enrolled-events/'); // Update this URL if different
        console.log("Enrolled events ::: ", response.data)
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching enrolled events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledEvents();
  }, []);



  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search enrolled events..."
          className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-500 ease-in-out"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-300">
          <ImCancelCircle size={20} />
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dummy Card 1 */}


        {/* Dynamic Event Cards */}
        {loading
          ? Array.from({ length: 6 }).map((_, index) => < EventPageShimmer key={index} />)
          : events.map((event, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-300 hover:shadow-xl transition duration-500 ease-in-out flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="relative">
                  <img
                    src={event.banner_url || DeafultBannerImage}
                    alt="Event Banner"
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <div className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${event.event_type === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                    } text-white`}>
                    {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                  </div>
                </div>

                <h3 className="text-sm font-bold mb-2
               text-green-700 border-t border-green-500 pt-2">
                  {event.title}
                </h3>
                <p className="text-gray-500 text-xs mb-1">Hosted by : {event.community_name}</p>
                <p className="mt-1 text-gray-700 text-xs">{event.description}</p>

                <div className="flex items-center mt-2 text-xs text-gray-600">
                  <FaRegCalendarAlt className="mr-1 text-green-500" />
                  <span>
                    Starts at: {new Date(event.start_datetime).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="flex items-center mt-1 text-xs text-gray-600">
                  <FaMapMarkerAlt className="mr-1 text-green-500" />
                  <span>
                    {event.event_type === 'online'
                      ? 'Online Event'
                      : event.location_name || 'Venue details coming soon'}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                {event.event_type == "online" ?
                  <button onClick={() => setModalEvent(event)} className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2">
                    <RiVideoOnAiLine className="text-white text-2xl" />
                    Join the Meet
                  </button>
                  :
                  <button onClick={() => setModalEvent(event)} className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2">
                    <GrMapLocation className="text-white text-xl" />
                    View Location
                  </button>
                }


              </div>
              {/* Modal */}
              {modalEvent && (
                <JoinEventModal
                  event={modalEvent}
                  onClose={() => setModalEvent(null)}
                  title="Event Details"
                  hideConfirmBtn={true}
                  cancelBtnLabel="Close"
                />
              )}


            </div>
          ))}
      </div>

    </div>
  );
}

export default EnrolledEvents;
