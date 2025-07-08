import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRegCalendarAlt, FaEye } from 'react-icons/fa';
import { MdOutlineZoomOutMap } from "react-icons/md";
import Pagination from '../../components/Common-Pagination/UserSidePagination';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import DeafultBannerImage from '../../assets/images/banner_default_user_profile.png';
import { Search } from 'lucide-react';
import { ImCancelCircle } from "react-icons/im";
import { FaRegEdit } from "react-icons/fa";
import { PulseLoader } from 'react-spinners';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import EventDetailsPage from '../../components/event-management-user-side/EventDetailsPage';
import { motion, AnimatePresence } from 'framer-motion';
import EventPageShimmer from '../../components/shimmer-ui-component/EventPageShimmer';
import SearchNotFound from "../../assets/images/no_result_search.png"


function CreatedEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // state for the view Event set up  
    const [viewedEvent, setViewedEvent] = useState(null);

    const openModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleEventSave = async (updatedEvent) => {
        try {
            await AuthenticatedAxiosInstance.put(`/events/update/${updatedEvent.id}/`, updatedEvent);
            setEvents((prev) =>
                prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
            );
            closeModal();
        } catch (error) {
            console.error('Failed to update event:', error);
        }
    };

    const fetchUserEvents = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const response = await AuthenticatedAxiosInstance.get('/events/created-events-by-user/', {
                params: {
                    page: page,
                    search: search
                }
            });
            setEvents(response.data.results);
            console.log("Data of the events ::::", response.data.results)
            setTotalPages(Math.ceil(response.data.count / 6)); // 6 is your page_size
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce for fetchUserEvents
    const debouncedFetchUserEvents = useCallback(
        debounce((page, search) => {
            fetchUserEvents(page, search);
        }, 500),
        []
    );

    useEffect(() => {
        debouncedFetchUserEvents(currentPage, searchTerm);
        return () => {
            debouncedFetchUserEvents.cancel(); // cancel previous debounce on unmount or change
        };
    }, [currentPage, searchTerm, debouncedFetchUserEvents]);


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div >
            <AnimatePresence>
                {viewedEvent ? (

                    <motion.div
                        key="event-details"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <EventDetailsPage
                            event={viewedEvent}
                            onClose={() => setViewedEvent(null)}
                            onDelete={(deletedId) => {
                                setEvents((prevEvents) => prevEvents.filter((e) => e.id !== deletedId));
                                setViewedEvent(null); // Close the detail view
                            }} />
                    </motion.div>
                ) : (
                    <>
                        {/* Search Bar */}
                        <h2 className="text-lg font-medium text-gray-800 mb-3 dark:text-zinc-200 ">Created Events</h2>

                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search events, Online, Offline, location..."
                                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg 
                                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                           transition duration-500 ease-in-out
                                           bg-white text-gray-800 placeholder-gray-400 
                                           dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:border-zinc-700"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-400" size={20} />
                            {searchTerm && (
                                <button onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-300 dark:text-zinc-400">
                                    <ImCancelCircle size={20} />
                                </button>
                            )}
                        </div>

                        {/* Events Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ?
                                Array.from({ length: 6 }).map((_, index) => < EventPageShimmer key={index} />)
                                : events.length === 0 ? (
                                    <div className="col-span-3 text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">
                                        <img
                                            src={SearchNotFound}
                                            alt="No Events"
                                            className="mx-auto w-64 object-contain"
                                        />
                                        <p className="text-lg font-semibold">No Events Found!</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                                            {searchTerm ? "Try using a different search keyword." : "There are currently no events available."}
                                        </p>
                                    </div>
                                ) : (
                                    events.map((event) => (
                                        <div key={event.id} className=" relative z-20 bg-white p-4 rounded-lg border border-gray-300 hover:shadow-xl transition duration-500 ease-in-out flex flex-col h-full dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:shadow-zinc-700/50">

                                            <div
                                                className={`ribbon absolute h-40 w-40 -top-2 -left-2 overflow-hidden
                                                    before:absolute before:top-0 before:right-[2px] before:border-4 before:-z-[1] before:border-zinc-600 dark:before:border-zinc-100
                                                    after:absolute after:left-0 after:bottom-[2px] after:border-4 after:-z-[1] after:border-zinc-600 dark:after:border-zinc-100
                                                `}
                                            >
                                                <div
                                                    className={`
                                                            absolute -left-14 top-10 w-60 py-2.5 text-center text-white shadow-md -rotate-45
                                                            ${event.event_status === 'upcoming'
                                                            ? 'bg-gradient-to-br from-blue-600 via-blue-400 to-blue-500'
                                                            : event.event_status === 'completed'
                                                                ? 'bg-gradient-to-br from-green-600 via-green-400 to-green-500'
                                                                : 'bg-gradient-to-br from-red-600 via-red-400 to-red-500'
                                                        }
                                                    `}
                                                >
                                                    {event.event_status.charAt(0).toUpperCase() + event.event_status.slice(1)}
                                                </div>
                                            </div>


                                            <div className="flex-1">
                                                <div className=" group">
                                                    <img
                                                        src={event.banner_url || DeafultBannerImage}
                                                        alt="Event Banner"
                                                        className="w-full h-40 object-cover rounded-md mb-3"
                                                    />
                                                    <div className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${event.event_type === 'online' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                                        {event.event_type === 'online' ? 'Online' : 'Offline'}
                                                    </div>
                                                </div>

                                                <h3 className="text-md font-bold text-green-700 border-t border-green-500 pt-2 dark:text-green-400 dark:border-green-600">{event.title}</h3>
                                                <p className="text-gray-500 text-xs mb-1 dark:text-zinc-400">Hosted by: {event.community_name}</p>
                                                <p className="mt-1 text-gray-700 text-xs line-clamp-3 dark:text-zinc-300">{event.description}</p>

                                                <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-zinc-400">
                                                    <FaRegCalendarAlt className="mr-1 text-green-500 dark:text-green-400" />
                                                    <span>Starts at: {new Date(event.start_datetime).toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center mt-1 text-xs text-gray-600 dark:text-zinc-400">
                                                    <FaMapMarkerAlt className="mr-1 text-green-500 dark:text-green-400" />
                                                    <span>{event.event_type === 'online' ? 'Online Event' : event.location_name}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <button onClick={() => setViewedEvent(event)} className="w-full mt-2 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2 dark:bg-green-600 dark:hover:bg-green-700">
                                                    <FaEye className="text-white" size={21} /> View Event
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                        </div>

                        {/* Pagination Component */}
                        {events.length > 0 && totalPages > 1 && (
                            <div className="dark:bg-zinc-900 dark:text-zinc-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    hasPrev={currentPage > 1}
                                    hasNext={currentPage < totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default CreatedEvents;