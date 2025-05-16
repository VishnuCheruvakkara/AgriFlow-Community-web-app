import React, { useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import ShowEventBannerModal from '../../components/event-management-user-side/ShowEventBannerModal';
import Pagination from '../../components/Common-Pagination/UserSidePagination';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { FaMapMarkerAlt, FaRegCalendarAlt, FaEye } from 'react-icons/fa';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import DeafultBannerImage from '../../assets/images/banner_default_user_profile.png';
import { MdOutlineZoomOutMap } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import { MdOutlineLibraryAdd } from 'react-icons/md';
import JoinEventModal from '../../components/event-management-user-side/JoinEventModal';
import EventPageShimmer from '../../components/shimmer-ui-component/EventPageShimmer';
import SearchNotFound from "../../assets/images/no_result_search.png"
import { AnimatePresence } from "framer-motion";


function AllEvents() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // to zoom the event 
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, hasNext: false, hasPrev: false });
  // to shwo the event details 
  const [modalEvent, setModalEvent] = useState(null);



  // Fetch events with pagination
  const fetchEvents = async (page = 1, searchTerm = '') => {
    try {
      setLoading(true);
      const response = await AuthenticatedAxiosInstance.get(`/events/get-all-events/?page=${page}&search=${searchTerm}`);

      setEvents(response.data.results);  // 'results' holds the events list
      setPagination({
        totalPages: Math.ceil(response.data.count / 6),
        hasNext: response.data.next !== null,
        hasPrev: response.data.previous !== null,
      });
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetchEvents wrapped in useCallback
  const debouncedFetch = useCallback(
    debounce((term, page) => {
      fetchEvents(page, term);
    }, 500),
    []
  );

  useEffect(() => {
    if (searchTerm === '' && currentPage === 1) {
      // Initial fetch: trigger immediately
      fetchEvents();
    } else {
      // Debounced fetch for user interactions
      debouncedFetch(searchTerm, currentPage);
    }
  }, [searchTerm, currentPage, debouncedFetch]);


  // Open modal to show event banner image
  const handleOpenModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

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
          onChange={(e) => setSearchTerm(e.target.value)}  // Set search term when user types
          placeholder="Search events, Online, Offline, location..."
          className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
               transition duration-500 ease-in-out
               bg-white text-gray-800 placeholder-gray-400 
               dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:border-zinc-700"
        />

        {/* Search icon */}
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-400"
          size={20}
        />

        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                 text-gray-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 
                 transition-colors duration-300"
          >
            <ImCancelCircle size={20} />
          </button>
        )}
      </div>



      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? Array.from({ length: 6 }).map((_, index) => < EventPageShimmer key={index} />)
          : events.length === 0 ? (
            <div className="col-span-3 text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md 
                dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300">
              <img
                src={SearchNotFound}
                alt="No Events"
                className="mx-auto w-64 object-contain"
              />
              <p className="text-lg font-semibold dark:text-zinc-100">No Events Found!</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {searchTerm ? "Try using a different search keyword." : "There are currently no events available."}
              </p>
            </div>

          ) : (
            events.map((event) => {
              const startDate = parseISO(event.start_datetime);
              const timeLeft = formatDistanceToNow(startDate, { addSuffix: true });

              return (
                <div key={event.id} className="bg-white p-4 rounded-lg border border-gray-300 hover:shadow-xl transition duration-500 ease-in-out flex flex-col h-full dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:shadow-zinc-700/50">
                  <div className="flex-1 ">
                    <div className="relative group">
                      <img
                        src={event.banner_url || DeafultBannerImage}
                        alt="Event Banner"
                        className="w-full h-40 object-cover rounded-md mb-3"
                        onError={(e) => e.target.src = DeafultBannerImage}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ">
                        <button
                          onClick={() => handleOpenModal(event.banner_url)}
                          className="p-3 bg-white border border-green-500 rounded-full shadow-lg  hover:bg-green-100 group transition-colors duration-300"
                        >
                          <MdOutlineZoomOutMap className="text-green-600 text-2xl " />
                        </button>
                      </div>
                      <div className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${event.event_type === 'online' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                        {event.event_type === 'online' ? 'Online' : 'Offline'}
                      </div>
                    </div>

                    <h3 className="text-md font-bold text-green-700 border-t border-green-500 pt-2 dark:text-green-400 dark:border-green-600">{event.title}</h3>
                    <p className="text-gray-500 text-xs mb-1 dark:text-zinc-400">Hosted by: {event.community_name}</p>
                    <p className="mt-1 text-gray-700 text-xs dark:text-zinc-300">{event.description?.slice(0, 50) + '...'}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-zinc-400">
                      <FaRegCalendarAlt className="mr-1 text-green-500" />
                      <span>Starts at : {new Date(event.start_datetime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-600 dark:text-zinc-400">
                      <FaMapMarkerAlt className="mr-1 text-green-500 dark:text-green-400" />
                      <span>{event.event_type === 'online' ? 'Online Event' : event.location_name}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button onClick={() => setModalEvent(event)} className=" w-full ripple py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2 dark:bg-green-600 dark:hover:bg-green-700">
                      <MdOutlineLibraryAdd className="text-white text-xl" />
                      Enroll to the Event
                    </button>

                  </div>
                </div>
              );
            })
          )}
      </div>
      < AnimatePresence>
        {modalEvent && (
          <JoinEventModal
            event={modalEvent}
            onClose={() => setModalEvent(null)}
          />
        )}
      </ AnimatePresence>
      {/* Modal */}


      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination className="dark:bg-zinc-900 dark:text-zinc-200"
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          hasPrev={pagination.hasPrev}
          hasNext={pagination.hasNext}
        />
      )}
      {selectedImage && (
        <ShowEventBannerModal imageUrl={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default AllEvents;
