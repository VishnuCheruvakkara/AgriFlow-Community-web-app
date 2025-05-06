import React, { useState, useEffect } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { Search, X } from 'lucide-react';
import DeafultBannerImage from '../../assets/images/banner_default_user_profile.png';
import { PulseLoader } from 'react-spinners';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { FaMapMarkerAlt, FaRegCalendarAlt, FaEye, FaSearchPlus } from 'react-icons/fa';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import ShowEventBannerModal from '../../components/event-management-user-side/ShowEventBannerModal';
import { MdOutlineZoomOutMap } from "react-icons/md";


function AllEvents() {
  const [loading, setLoading] = useState();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  //Event banner image show modal...
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  // Handle modal to show event banner image 
  const handleOpenModal = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the selected image URL here
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null); // Clear selected image on close
  };
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await AuthenticatedAxiosInstance.get(`/events/get-all-events/`);
      setEvents(response.data)
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search events..."
          className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-500 ease-in-out"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-300"
          >
            <ImCancelCircle size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 flex flex-col justify-center items-center h-60">
            <PulseLoader color="#16a34a" speedMultiplier={1} />
            <p className="mt-4 text-sm text-gray-500 text-center">Loading Communities, please wait...</p>
          </div>

        ) : (
          events.map((event) => {
            const startDate = parseISO(event.start_datetime);
            const timeLeft = formatDistanceToNow(startDate, { addSuffix: true });

            return (
              <div key={event.id} className="bg-white p-4 rounded-lg border border-gray-300 hover:shadow-xl transition duration-500 ease-in-out flex flex-col h-full">
                {/* Content area - will take available space but not grow */}




                <div className="flex-1">
                  {/* Image and Badge */}



                  {/* Image and Badge */}
                  <div className="relative group"> {/* Make this a group */}
                    <img
                      src={event.banner_url || DeafultBannerImage}
                      alt="Event Banner"
                      className="w-full h-40 object-cover rounded-md mb-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DeafultBannerImage;
                      }}
                    />

                    {/* Hover effect to show the icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(event.banner_url)}
                        className="p-3 bg-white rounded-full shadow-lg hover:bg-green-500 group transition-colors duration-300 ">
                        <MdOutlineZoomOutMap className="text-green-600 group-hover:text-green-600 text-2xl" />
                      </button>
                    </div>

                   

                    {/* Badge (Online / Offline) */}
                    <div className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full 
      ${event.event_type === 'online' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                      {event.event_type === 'online' ? 'Online' : 'Offline'}
                    </div>
                  </div>

                  <h3 className="text-md font-bold text-green-700 border-t border-green-500 pt-2">{event.title}</h3>
                  <p className="text-gray-500 text-xs mb-1">Hosted by Community: {event.community_name}</p>

                  {/* Description */}
                  <p className="mt-1 text-gray-700 text-xs">
                    About : {event.description?.length > 50 ? event.description.slice(0, 50) + '...' : event.description}
                  </p>

                  {/* Date & Time */}
                  <div className="flex items-center mt-2 text-xs text-gray-600">
                    <FaRegCalendarAlt className="mr-1 text-green-500" />
                    <span>{timeLeft}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center mt-1 text-xs text-gray-600">
                    <FaMapMarkerAlt className="mr-1 text-green-500" />
                    <span>{event.event_type === 'online' ? 'Online Event' : event.address || 'Offline Event'}</span>
                  </div>
                </div>

                {/* Button area - will always be at the bottom */}
                <div className="mt-4">
                  <button className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2">
                    <FaEye className="text-white" />
                    View Event
                  </button>
                </div>
              </div>
            );
          })
        )}
        {selectedImage && (
          <ShowEventBannerModal
            imageUrl={selectedImage}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default AllEvents;